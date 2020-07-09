import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import axios from 'axios';
const corsHandler = cors({ origin: true });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

admin.initializeApp({
    serviceAccountId: 'random-dice-web@appspot.gserviceaccount.com',
    databaseURL: 'https://random-dice-web.firebaseio.com/',
    databaseAuthVariableOverride: {
        uid: 'my-service-worker',
    },
});

const auth = admin.auth();
const database = admin.database();

export const discord_login = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        const code = req.query.code;
        const linkAccount = req.query.linkAccount;
        if (typeof code === 'string') {
            try {
                const tokenExchange = await axios.post(
                    'https://discord.com/api/v6/oauth2/token',
                    `client_id=723917706641801316&client_secret=***REMOVED***&grant_type=authorization_code&code=${code}&redirect_uri=${req.header(
                        'Origin'
                    )}/discord_login&scope=identify%20email`,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );
                const token = tokenExchange.data.access_token;
                const getUserData = await axios.get(
                    `https://discordapp.com/api/v6/users/@me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );
                const userData = getUserData.data;
                const uid = `discord-${userData.id}`;
                const isEditor = (
                    await database.ref(`/users/${uid}/editor`).once('value')
                ).val();
                const authToken = await auth.createCustomToken(uid, {
                    isEditor,
                });

                try {
                    const userExist = await auth.getUserByEmail(userData.email);
                    if (linkAccount === 'true') {
                        await database
                            .ref(
                                `/users/${userExist.uid}/linked-account/discord`
                            )
                            .set(userData.data.id);
                        res.send({
                            accountLinked: true,
                        });
                        return;
                    }
                    if (userExist.emailVerified) {
                        if (userData.verified || uid === userExist.uid) {
                            res.send({
                                authToken: await auth.createCustomToken(
                                    userExist.uid,
                                    { isEditor }
                                ),
                            });
                            await database
                                .ref(
                                    `/users/${userExist.uid}/linked-account/discord`
                                )
                                .set(userData.id);
                        } else if (
                            (
                                await database
                                    .ref(
                                        `/users/${userExist.uid}/linked-account/`
                                    )
                                    .once('value')
                            ).val().discord
                        ) {
                            res.send({
                                authToken: await auth.createCustomToken(
                                    userExist.uid,
                                    { isEditor }
                                ),
                            });
                        } else {
                            res.send({ error: 'provider-email-not-verified' });
                        }
                    } else {
                        if (userData.verified) {
                            await auth.deleteUser(userExist.uid);
                            await auth.createUser({
                                uid,
                                email: userData.email,
                                displayName: userData.username,
                                photoURL: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
                                emailVerified: true,
                            });
                            res.send({ authToken });
                            await database
                                .ref(`/users/${uid}/linked-account/discord`)
                                .set(userData.id);
                        } else {
                            res.send({
                                authToken,
                                error: 'email-not-verified',
                            });
                        }
                    }
                } catch (err) {
                    if (linkAccount === 'true') {
                        res.send({
                            error: 'email-not-match',
                        });
                        return;
                    }
                    await auth.createUser({
                        uid,
                        email: userData.email,
                        displayName: userData.username,
                        photoURL: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
                    });
                    if (userData.verified) {
                        await auth.updateUser(uid, {
                            emailVerified: true,
                        });
                        res.send({
                            authToken,
                        });
                        await database
                            .ref(`/users/${uid}/linked-account/discord`)
                            .set(userData.id);
                    } else {
                        res.send({
                            authToken,
                            error: 'email-not-verified',
                        });
                    }
                }
            } catch (error) {
                res.send({
                    error,
                });
            }
        } else {
            res.status(400).send('Invalid Token');
        }
    });
});

export const patreon_login = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        const code = req.query.code;
        const linkAccount = req.query.linkAccount;
        if (typeof code === 'string') {
            try {
                const tokenExchange = await axios.post(
                    'https://www.patreon.com/api/oauth2/token',
                    `client_id=mcsy6u4brWts2SHqlVuV4jo_BVLO3Ynfa0HJsnYcozdqkOYv-lWhLz1x6BZzwQTq&client_secret=***REMOVED***&grant_type=authorization_code&code=${code}&scope=identity%20identity%5Bemail%5D&redirect_uri=${req.header(
                        'Origin'
                    )}/patreon_login`,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );
                const token = tokenExchange.data.access_token;

                const getUserData = await axios.get(
                    `https://www.patreon.com/api/oauth2/v2/identity?fields%5Buser%5D=email,image_url,full_name`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );

                const userData = getUserData.data;
                const uid = `patreon-${userData.data.id}`;
                const isEditor = (
                    await database.ref(`/users/${uid}/editor`).once('value')
                ).val();
                const authToken = await auth.createCustomToken(uid, {
                    isEditor,
                });

                try {
                    const userExist = await auth.getUserByEmail(
                        userData.data.attributes.email
                    );
                    if (linkAccount === 'true') {
                        await database
                            .ref(
                                `/users/${userExist.uid}/linked-account/patreon`
                            )
                            .set(userData.data.id);
                        res.send({
                            accountLinked: true,
                        });
                        return;
                    }
                    if (userExist.emailVerified) {
                        if (
                            userData.data.attributes.is_email_verified ||
                            uid === userExist.uid
                        ) {
                            res.send({
                                authToken: await auth.createCustomToken(
                                    userExist.uid,
                                    { isEditor }
                                ),
                            });
                            await database
                                .ref(
                                    `/users/${userExist.uid}/linked-account/patreon`
                                )
                                .set(userData.data.id);
                        } else if (
                            (
                                await database
                                    .ref(
                                        `/users/${userExist.uid}/linked-account/`
                                    )
                                    .once('value')
                            ).val().patreon
                        ) {
                            res.send({
                                authToken: await auth.createCustomToken(
                                    userExist.uid,
                                    { isEditor }
                                ),
                            });
                        } else {
                            res.send({ error: 'provider-email-not-verified' });
                        }
                    } else {
                        if (userData.data.attributes.is_email_verified) {
                            await auth.deleteUser(userExist.uid);
                            await auth.createUser({
                                uid,
                                email: userData.data.attributes.email,
                                displayName: userData.data.attributes.full_name,
                                photoURL: userData.data.attributes.image_url,
                                emailVerified: true,
                            });
                            res.send({ authToken });
                            await database
                                .ref(`/users/${uid}/linked-account/patreon`)
                                .set(userData.data.id);
                        } else {
                            res.send({
                                authToken,
                                error: 'email-not-verified',
                            });
                        }
                    }
                } catch (err) {
                    if (linkAccount === 'true') {
                        res.send({
                            error: 'email-not-match',
                        });
                        return;
                    }
                    await auth.createUser({
                        uid,
                        email: userData.data.attributes.email,
                        displayName: userData.data.attributes.full_name,
                        photoURL: userData.data.attributes.image_url,
                    });
                    if (userData.data.attributes.is_email_verified) {
                        await auth.updateUser(uid, {
                            emailVerified: true,
                        });
                        res.send({
                            authToken,
                        });
                        await database
                            .ref(`/users/${uid}/linked-account/patreon`)
                            .set(userData.data.id);
                    } else {
                        res.send({
                            authToken,
                            error: 'email-not-verified',
                        });
                    }
                }
            } catch (error) {
                res.send({
                    error,
                });
            }
        } else {
            res.status(400).send('Invalid Token');
        }
    });
});

export const fetchPatreon = functions.pubsub
    .schedule('*/5 * * * *')
    .onRun(async () => {
        const url = 'https://www.patreon.com';
        try {
            const token_store = database.ref('/token_storage/patreon');
            const refresh_token = (await token_store.once('value')).val();

            const res = await axios.post(
                `${url}/api/oauth2/token`,
                'grant_type=refresh_token' +
                    `&refresh_token=${refresh_token}` +
                    '&client_id=mcsy6u4brWts2SHqlVuV4jo_BVLO3Ynfa0HJsnYcozdqkOYv-lWhLz1x6BZzwQTq' +
                    '&client_secret=***REMOVED***',
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
                [key: string]: {
                    message: string;
                };
            };

            const patreonList = await Promise.all(
                memberData.data.map(async (member: Member) => {
                    const tierArr = member.relationships.currently_entitled_tiers.data.map(
                        t => t.id
                    );
                    let tier;
                    for (let i = tierList.length; i > 0; i--) {
                        if (tierArr.includes(tierList[i])) {
                            tier = i + 1;
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

            const users = (
                await database.ref('/users').once('value')
            ).val() as {
                [key: string]: {
                    'linked-account': { patreon: string | undefined };
                };
            };
            const usersData = Object.entries(users);
            await Promise.all(
                usersData.map(async ([uid, userData]) => {
                    const patreonId = userData['linked-account'].patreon;
                    const isPatreon = patreonList.find(
                        patreon => patreon.id === patreonId
                    );
                    if (isPatreon) {
                        try {
                            const i = patreonList.findIndex(
                                patreon => patreon.id === patreonId
                            );
                            const userProfile = await auth.getUser(uid);
                            patreonList[i].id = uid;
                            patreonList[i].name =
                                userProfile.displayName || patreonList[i].name;
                            patreonList[i].img = userProfile.photoURL;
                            patreonList[i][uid] = {
                                message:
                                    ((
                                        await database
                                            .ref(`/patreon_list`)
                                            .once('value')
                                    ).val() as PatreonProfile[]).find(
                                        patreon => patreon.id === uid
                                    )?.[uid].message || '',
                            };
                        } finally {
                            await database
                                .ref(`/users/${uid}/patreon-tier`)
                                .set(isPatreon.tier);
                        }
                    } else {
                        await database.ref(`/users/${uid}/patreon-tier`).set(0);
                    }
                })
            );
            await database.ref('/patreon_list').set(patreonList);
        } catch (err) {
            console.log(err.message);
        }
        return null;
    });
