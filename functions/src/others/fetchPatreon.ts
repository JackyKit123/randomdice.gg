/* eslint-disable @typescript-eslint/camelcase */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import init from '../init';

const app = init();
const auth = app.auth();
const database = app.database();

export default functions.pubsub.schedule('*/5 * * * *').onRun(async () => {
    const url = 'https://www.patreon.com/api/oauth2/v2';
    const { access_token } = functions.config().patreon;
    const headers = {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
        const [memberRes, campaignRes] = await Promise.all([
            await axios.get(
                `${url}/campaigns/4696297/members?include=currently_entitled_tiers,user`,
                {
                    headers,
                }
            ),
            await axios.get(`${url}/campaigns/4696297?include=tiers`, {
                headers,
            }),
        ]);
        const memberData = memberRes.data;
        const campaignData = campaignRes.data;

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

        const [patreonList, users, existingProfiles] = await Promise.all([
            await Promise.all(
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
                            `${url}/members/${member.id}?fields%5Bmember%5D=full_name`,
                            {
                                headers,
                            }
                        )
                    ).data;

                    return {
                        id: member.relationships.user.data.id,
                        name: userData.data.attributes.full_name,
                        tier,
                    };
                }) as PatreonProfile[]
            ),
            (await database.ref('/users').once('value')).val() as {
                [key: string]: {
                    'linked-account': { patreon?: string };
                    'patreon-tier'?: number;
                };
            },
            (
                await database.ref(`/patreon_list`).once('value')
            ).val() as PatreonProfile[],
        ]);

        const usersData = Object.entries(users);
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
                    if (!existingProfile) {
                        anyProfileUpdated = true;
                        await database
                            .ref(`/patreon_list/${i}/id`)
                            .set(newProfile.id);
                    }
                    if (existingProfile?.name !== newProfile.name) {
                        anyProfileUpdated = true;
                        await database
                            .ref(`/patreon_list/${i}/name`)
                            .set(newProfile.name);
                    }
                    if (existingProfile?.tier !== newProfile.tier) {
                        anyProfileUpdated = true;
                        await database
                            .ref(`/patreon_list/${i}/tier`)
                            .set(newProfile.tier);
                    }
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
