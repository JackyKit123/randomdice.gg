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

export function authStateDispatch(dispatch: Dispatch<Action>): void {
    auth.onAuthStateChanged(userAuth => {
        dispatch({ type: AUTH, payload: userAuth });
        if (userAuth) {
            ga.auth.login(userAuth.uid);
        }
    });
}

export function logout(): void {
    firebase.auth().signOut();
}

export function discord(dispatch: Dispatch<Action>): void {
    const authUrl = 'https://discord.com/api/oauth2/authorize';
    const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID;
    const redirectUri = `${window.location.origin}/discord_login`;
    const scope = ['email', 'identify'].join('%20');
    const LoginWindow = window.open(
        `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`,
        'Discord Login',
        'toolbar=no, menubar=no, width=600, height=700'
    );

    if (LoginWindow) {
        LoginWindow.focus();
        const callbackHandler = async (
            evt: CustomEvent<'discord_login_callback'>
        ): Promise<void> => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const detail = evt.detail as any;
            window.removeEventListener(
                'discord_login_callback',
                callbackHandler
            );

            if (detail.code) {
                try {
                    const res = await axios.post(
                        `https://us-central1-random-dice-web.cloudfunctions.net/discord_login?code=${detail.code}`
                    );

                    const loginRes = await auth.signInWithCustomToken(
                        res.data.authToken
                    );

                    const { userData } = res.data;
                    const user = auth.currentUser as firebase.User;

                    if (loginRes.additionalUserInfo?.isNewUser) {
                        ga.auth.signup.discord();
                        await user.updateProfile({
                            displayName: userData.username,
                        });
                        await user.updateEmail(userData.email);
                    }
                    await user.updateProfile({
                        photoURL: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
                    });
                } catch (err) {
                    dispatch({ type: ERROR, payload: err.message });
                }
            } else {
                dispatch({ type: ERROR, payload: detail.errorDesc });
            }
        };
        window.addEventListener('discord_login_callback', callbackHandler);
    }
}
