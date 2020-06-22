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

                const authToken = await auth
                    .createCustomToken(userData.id);

                res.send({
                    userData,
                    authToken,
                });

                const {
                    email_verified,
                    uid,
                } = await auth.verifyIdToken(authToken);

                if (!email_verified && userData.verified) {
                    await auth.updateUser(uid, {
                        emailVerified: true,
                    });
                }
            } catch (err) {
                res.status(500);
            }
        } else {
            res.status(400).send('Invalid Token');
        }
    });
});

export const fetchPatreon = functions.pubsub.schedule('0 * * * *').onRun(async () => {
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
        const getData = await axios.get(
            `${url}/api/oauth2/v2/campaigns/4696297/members?include=currently_entitled_tiers,user`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const patreonList = getData.data.data.map((member: any) => {
            const tierArr = member.relationships.currently_entitled_tiers.data.map(
                (t: { id : string}) => t.id
            );
            let tier;
            switch (true) {
                case tierArr.includes('5289233'):
                    tier = 3;
                    break;
                case tierArr.includes('5289232'):
                    tier = 2;
                    break;
                case tierArr.includes('5289231'):
                    tier = 1;
                    break;
                default:
                    tier = 0;
            }
            return {
                id: member.id,
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
