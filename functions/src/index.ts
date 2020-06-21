import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import axios from 'axios';
const corsHandler = cors({ origin: true });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

admin.initializeApp({
    serviceAccountId: 'random-dice-web@appspot.gserviceaccount.com',
});

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

                const authToken = await admin
                    .auth()
                    .createCustomToken(userData.id);

                res.send({
                    userData,
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
