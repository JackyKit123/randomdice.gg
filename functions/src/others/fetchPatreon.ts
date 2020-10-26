/* eslint-disable @typescript-eslint/camelcase */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import init from '../init';

const app = init();
const auth = app.auth();
const database = app.database();

export default functions.pubsub.schedule('*/5 * * * *').onRun(async () => {
    const url = 'https://www.patreon.com';
    try {
        const token_store = database.ref('/token_storage/patreon');
        const refresh_token = (await token_store.once('value')).val();

        const res = await axios.post(
            `${url}/api/oauth2/token`,
            'grant_type=refresh_token' +
                `&refresh_token=${refresh_token}` +
                '&client_id=mcsy6u4brWts2SHqlVuV4jo_BVLO3Ynfa0HJsnYcozdqkOYv-lWhLz1x6BZzwQTq' +
                `&client_secret=${functions.config().patreon.secret}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const { access_token } = res.data;
        await token_store.set(res.data.refresh_token);
        const getMemberData = await axios.get(
            `${url}/api/oauth2/v2/campaigns/4696297/members?include=currently_entitled_tiers,user`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        const memberData = getMemberData.data;
        const getCampaignData = await axios.get(
            `${url}/api/oauth2/v2/campaigns/4696297?include=tiers`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        const campaignData = getCampaignData.data;

        interface Member {
            id: string;
            relationships: {
                currently_entitled_tiers: {
                    data: { id: string }[];
                };
                user: {
                    data: {
                        id: string;
                    };
                };
            };
        }

        const tierList = campaignData.included.map(
            (tier: { id: string }) => tier.id
        );

        type PatreonProfile = {
            id: string;
            name: string;
            img: string | undefined;
            tier: number;
        } & {
            [uid: string]: object;
        };

        const patreonList = await Promise.all(
            memberData.data.map(async (member: Member) => {
                const tierArr = member.relationships.currently_entitled_tiers.data.map(
                    t => t.id
                );
                let tier = 0;
                for (let i = tierList.length; i > 0; i -= 1) {
                    if (tierArr.includes(tierList[i - 1])) {
                        tier = i;
                    }
                }
                const userData = (
                    await axios.get(
                        `${url}/api/oauth2/v2/members/${member.id}?fields%5Bmember%5D=full_name`,
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'Content-Type':
                                    'application/x-www-form-urlencoded',
                            },
                        }
                    )
                ).data;

                return {
                    id: member.relationships.user.data.id,
                    name: userData.data.attributes.full_name,
                    tier,
                };
            }) as PatreonProfile[]
        );

        const users = (await database.ref('/users').once('value')).val() as {
            [key: string]: {
                'linked-account': { patreon?: string };
                'patreon-tier'?: number;
            };
        };
        const usersData = Object.entries(users);
        const existingProfiles = (
            await database.ref(`/patreon_list`).once('value')
        ).val() as PatreonProfile[];

        const getUserSuppressError = async (
            uid: string
        ): Promise<admin.auth.UserRecord | undefined> => {
            try {
                return auth.getUser(uid);
            } catch (err) {
                return undefined;
            }
        };

        let anyProfileUpdated = existingProfiles.length !== patreonList.length;
        await Promise.all(
            patreonList.map(async (newProfile, i) => {
                const uid = usersData.find(([, userData]) => {
                    return userData['linked-account'].patreon === newProfile.id;
                })?.[0];
                const existingProfile = existingProfiles.find(
                    profile =>
                        profile.id === uid || profile.id === newProfile.id
                );

                if (uid) {
                    const user = (await getUserSuppressError(
                        uid
                    )) as admin.auth.UserRecord;
                    if (
                        existingProfile &&
                        existingProfiles.findIndex(
                            profile => profile.id === uid
                        ) !== i
                    ) {
                        anyProfileUpdated = true;
                        await database.ref(`/patreon_list/${i}`).set(null);
                        await database.ref(`/patreon_list/${i}`).set({
                            id: uid,
                            tier: newProfile.tier,
                            name: user.displayName || newProfile.name,
                            img: user.photoURL || null,
                            [uid]: existingProfile[uid],
                        });
                        return;
                    }
                    if (existingProfile?.id !== uid) {
                        anyProfileUpdated = true;
                        await database.ref(`/patreon_list/${i}/id`).set(uid);
                    }
                    if (existingProfile?.tier !== newProfile.tier) {
                        anyProfileUpdated = true;
                        await Promise.all([
                            await database
                                .ref(`/patreon_list/${i}/tier`)
                                .set(newProfile.tier),
                            await database
                                .ref(`/users/${uid}/patreon-tier`)
                                .set(newProfile.tier),
                        ]);
                    }
                    if (
                        user.displayName &&
                        existingProfile?.name !== user.displayName
                    ) {
                        anyProfileUpdated = true;
                        await database
                            .ref(`/patreon_list/${i}/name`)
                            .set(user.displayName);
                    }
                    if (existingProfile?.img !== user.photoURL) {
                        anyProfileUpdated = true;
                        await database
                            .ref(`/patreon_list/${i}/img`)
                            .set(user.photoURL);
                    }
                } else {
                    anyProfileUpdated = true;
                    await database.ref(`/patreon_list/${i}/`).set({
                        id: newProfile.id,
                        name: newProfile.name,
                        tier: newProfile.tier,
                    });
                }
            })
        );
        if (anyProfileUpdated) {
            await database
                .ref('/last_updated/patreon_list')
                .set(new Date().toISOString());
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err.message);
    }
    return null;
});