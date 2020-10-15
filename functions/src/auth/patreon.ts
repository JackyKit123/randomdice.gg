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
                    'https://www.patreon.com/api/oauth2/token',
                    `client_id=mcsy6u4brWts2SHqlVuV4jo_BVLO3Ynfa0HJsnYcozdqkOYv-lWhLz1x6BZzwQTq&client_secret=${
                        functions.config().patreon.secret
                    }&grant_type=authorization_code&code=${code}&scope=identity%20identity%5Bemail%5D&redirect_uri=${req.header(
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
                    } else if (userData.data.attributes.is_email_verified) {
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
