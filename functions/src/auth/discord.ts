import * as functions from 'firebase-functions';
import cors from 'cors';
import axios from 'axios';
import init from '../init';

const app = init();
const auth = app.auth();
const database = app.database();
const corsHandler = cors({ origin: true });

export default functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        const { code, linkAccount } = req.query;
        if (typeof code === 'string') {
            try {
                const tokenExchange = await axios.post(
                    'https://discord.com/api/v6/oauth2/token',
                    `client_id=723917706641801316&client_secret=${
                        functions.config().discord.secret
                    }&grant_type=authorization_code&code=${code}&redirect_uri=${req.header(
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
                    } else if (userData.verified) {
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
