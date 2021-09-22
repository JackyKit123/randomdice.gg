/* eslint-disable @typescript-eslint/camelcase */
import firebase from 'firebase/app';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AuthActions } from 'Redux/authReducer';
import * as ga from 'Misc/customGaEvent';
import initApp from './init';
import { fetchUser } from '.';

const auth = firebase.apps.length ? firebase.auth() : firebase.auth(initApp());
try {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
} catch {
  //
}

export const logout = (): Promise<void> => auth.signOut();

export function authStateDispatch(
  dispatch: ReturnType<typeof useDispatch>
): void {
  auth.onAuthStateChanged(userAuth => {
    if (userAuth && userAuth.emailVerified) {
      fetchUser(dispatch as never, userAuth.uid);
      dispatch({
        type: AuthActions.AuthSuccessAction,
        payload: {
          auth: userAuth,
        },
      });
      ga.auth.login(userAuth.uid);
    } else {
      dispatch({ type: AuthActions.AuthFailAction });
    }
  });
}

async function oauth(
  authUrl: string,
  clientId: string,
  endPoint: string,
  scope: string[],
  callbackStorage: string,
  dispatch: ReturnType<typeof useDispatch>,
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
        type: AuthActions.AuthSuccessAction,
        payload: {
          auth: 'awaiting auth state',
        },
      });

      const res = await axios.post(
        `https://us-central1-random-dice-web.cloudfunctions.net/${endPoint}?code=${code}&linkAccount=${linkAccount}`
      );
      const { authToken, error, accountLinked } = res.data;

      if (accountLinked) {
        dispatch({ type: AuthActions.AuthError, payload: undefined });
        return;
      }

      if (error) {
        switch (error) {
          case 'provider-email-not-verified':
            dispatch({
              type: AuthActions.AuthError,
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
                type: AuthActions.AuthError,
                payload: `This email address is not verified by ${provider}. We have sent you a verification email, please verify your email.`,
              });
            }
            break;
          case 'email-not-match':
            dispatch({
              type: AuthActions.AuthError,
              payload: `The email address from your ${provider} does not match the current account.`,
            });
            break;
          default:
            dispatch({
              type: AuthActions.AuthError,
              payload: error.message,
            });
        }
      } else {
        await auth.signInWithCustomToken(authToken);
      }
    } catch (err) {
      dispatch({
        type: AuthActions.AuthError,
        payload: (err as Error).message,
      });
    }
  }
}

export function loginDiscord(
  dispatch: ReturnType<typeof useDispatch>,
  linkAccount = false
): void {
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

export async function loginPatreon(
  dispatch: ReturnType<typeof useDispatch>,
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
