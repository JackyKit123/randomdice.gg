/* eslint-disable @typescript-eslint/camelcase */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import axios from 'axios';
import { Dispatch } from 'react';
import initApp from './init';
import { AUTH, Action, ERROR } from '../Redux Storage/Firebase Auth/types';
import * as ga from '../customGaEvent';

const auth = firebase.apps.length ? firebase.auth() : firebase.auth(initApp());
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export function logout(): void {
    auth.signOut();
}

export function authStateDispatch(dispatch: Dispatch<Action>): void {
    auth.onAuthStateChanged(userAuth => {
        if (userAuth && userAuth.emailVerified) {
            dispatch({ type: AUTH, payload: userAuth });
            ga.auth.login(userAuth.uid);
        } else {
            dispatch({ type: AUTH, payload: null });
        }
    });
}

async function oauth(
    authUrl: string,
    clientId: string,
    endPoint: string,
    scope: string[],
    callbackStorage: string,
    dispatch: Dispatch<Action>,
    provider: string,
    linkAccount: boolean
): Promise<void> {
    const LoginWindow = window.open(
        `${authUrl}?client_id=${clientId}&redirect_uri=${
            window.location.origin
        }/${endPoint}&response_type=code&scope=${encodeURI(scope.join(' '))}`,
        `${provider} Login`,
        'toolbar=no, menubar=no, width=600, height=700'
    );

    if (LoginWindow) {
        LoginWindow.focus();

        try {
            const code = (await new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    const storage = JSON.parse(
                        localStorage.getItem(callbackStorage) || '{}'
                    );
                    if (storage.code) {
                        clearInterval(interval);
                        localStorage.removeItem(callbackStorage);
                        resolve(storage.code);
                    }
                    if (storage.error) {
                        clearInterval(interval);
                        localStorage.removeItem(callbackStorage);
                        reject(new Error(storage.error));
                    }
                }, 1000);
            })) as { code: string | null; error: string | null };

            dispatch({
                type: ERROR,
                payload: 'Loading',
            });

            const res = await axios.post(
                `https://us-central1-random-dice-web.cloudfunctions.net/${endPoint}?code=${code}&linkAccount=${linkAccount}`
            );
            const { authToken, error, accountLinked } = res.data;

            if (accountLinked) {
                dispatch({ type: ERROR, payload: undefined });
                return;
            }

            if (error) {
                switch (error) {
                    case 'provider-email-not-verified':
                        dispatch({
                            type: ERROR,
                            payload: `The email address has been associated with an account and your email address is not verified by ${provider}, for security reason, you are not allowed to login with ${provider}. If you wish to login with ${provider}, you can enable it in setting after login or verify your account with ${provider}.`,
                        });
                        break;
                    case 'email-not-verified':
                        {
                            await auth.signInWithCustomToken(authToken);
                            const user = auth.currentUser as firebase.User;
                            user.sendEmailVerification();
                            logout();
                            dispatch({
                                type: ERROR,
                                payload: `This email address is not verified by ${provider}. We have sent you a verification email, please verify your email.`,
                            });
                        }
                        break;
                    case 'email-not-match':
                        dispatch({
                            type: ERROR,
                            payload: `The email address from your ${provider} does not match the current account.`,
                        });
                        break;
                    default:
                        dispatch({
                            type: ERROR,
                            payload: error.message,
                        });
                }
            } else {
                await auth.signInWithCustomToken(authToken);
            }
        } catch (err) {
            dispatch({ type: ERROR, payload: err.message });
        }
    }
}

export function discord(dispatch: Dispatch<Action>, linkAccount = false): void {
    oauth(
        'https://discord.com/api/oauth2/authorize',
        process.env.REACT_APP_DISCORD_CLIENT_ID as string,
        'discord_login',
        ['email', 'identify'],
        'discord_oauth',
        dispatch,
        'Discord',
        linkAccount
    );
}

export async function patreon(
    dispatch: Dispatch<Action>,
    linkAccount = false
): Promise<void> {
    oauth(
        'https://www.patreon.com/oauth2/authorize',
        process.env.REACT_APP_PATREON_CLIENT_ID as string,
        'patreon_login',
        ['identity[email]', 'identity'],
        'patreon_oauth',
        dispatch,
        'Patreon',
        linkAccount
    );
}
