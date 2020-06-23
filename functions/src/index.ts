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
                const authToken = await auth.createCustomToken(uid);

                try {
                    console.log(uid, userData);
                    await auth.createUser({
                        uid,
                    });
                    await auth.updateUser(uid, {
                        email: userData.email,
                        displayName: userData.username,
                        photoURL: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
                    });
                    if (userData.verified) {
                        await auth.updateUser(uid, {
                            emailVerified: true,
                        });
                    } else {
                        throw {
                            code: 'auth/email-not-verified',
                        };
                    }
                } catch (error) {
                    switch (error.code) {
                        case 'auth/uid-already-exists':
                            if ((await auth.getUser(uid)).emailVerified) {
                                res.send({
                                    authToken,
                                });
                            } else {
                                res.send({
                                    authToken,
                                    error: {
                                        code: 'auth/email-not-verified',
                                    },
                                });
                            }
                            break;
                        case 'auth/email-not-verified':
                            res.send({
                                authToken,
                                error,
                            });
                            break;
                        case 'auth/email-already-exists':
                            await auth.deleteUser(uid);
                            res.send({
                                error,
                            });
                            break;
                        default:
                            res.send({
                                error,
                            });
                    }
                }
                res.send({
                    authToken,
                });
            } catch (err) {
                res.status(500).send(err);
            }
        } else {
            res.status(400).send('Invalid Token');
        }
    });
});

export const patreon_login = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        const code = req.query.code;
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
                const authToken = await auth.createCustomToken(uid);
                try {
                    await auth.createUser({
                        uid,
                    });
                    await auth.updateUser(uid, {
                        email: userData.data.attributes.email,
                        displayName: userData.data.attributes.full_name,
                        photoURL: userData.data.attributes.image_url,
                    });
                    if (userData.data.attributes.is_email_verified) {
                        await auth.updateUser(uid, {
                            emailVerified: true,
                        });
                    } else {
                        throw {
                            code: 'auth/email-not-verified',
                        };
                    }
                } catch (error) {
                    switch (error.code) {
                        case 'auth/uid-already-exists':
                            if ((await auth.getUser(uid)).emailVerified) {
                                res.send({
                                    authToken,
                                });
                            } else {
                                res.send({
                                    authToken,
                                    error: {
                                        code: 'auth/email-not-verified',
                                    },
                                });
                            }
                            break;
                        case 'auth/email-not-verified':
                            res.send({
                                authToken,
                                error,
                            });
                            break;
                        case 'auth/email-already-exists':
                            await auth.deleteUser(uid);
                            res.send({
                                error,
                            });
                            break;
                        default:
                            res.send({
                                error,
                            });
                    }
                }
                res.send({
                    authToken,
                });
            } catch (err) {
                res.status(500);
            }
        } else {
            res.status(400).send('Invalid Token');
        }
    });
});

export const fetchPatreon = functions.pubsub
    .schedule('0 * * * *')
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
            console.log(res.data.refresh_token);

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
            const patreonList = memberData.data.map((member: Member) => {
                const tierArr = member.relationships.currently_entitled_tiers.data.map(
                    t => t.id
                );
                let tier;
                for (let i = tierList.length; i > 0; i--) {
                    if (tierArr.includes(tierList[i])) {
                        tier = i + 1;
                    }
                }

                return {
                    id: member.relationships.user.data.id,
                    tier,
                };
            });
            await token_store.set(res.data.refresh_token);
            await database.ref('/patreon_list').set(patreonList);
        } catch (err) {
            console.log(err.message);
        }
        return null;
    });
