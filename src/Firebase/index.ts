import firebase from 'firebase/app';
import { useDispatch } from 'react-redux';
import { AuthActions } from 'Redux/authReducer';
import initApp from './init';
import validateLocalstorage from './validateLocalstorage';

const database = firebase.apps.length
  ? firebase.database()
  : firebase.database(initApp());

async function fetch(
  dispatch: ReturnType<typeof useDispatch>,
  key: string
): Promise<void> {
  // apply local storage cache before fetching database
  const localCache = validateLocalstorage(key);
  if (localCache) {
    dispatch({
      type: key,
      payload: localCache,
    });
  }

  try {
    // check database path last updated time
    const localVersionJson = localStorage.getItem('last_updated');
    let localVersion;

    try {
      localVersion = JSON.parse(localVersionJson as string);
    } catch (err) {
      localStorage.removeItem('last_updated');
    }

    const remoteKeyVersion = (
      await database.ref(`/last_updated/${key}`).once('value')
    ).val();
    // localVersion match database version, no need to refetch
    if (
      localCache &&
      remoteKeyVersion &&
      remoteKeyVersion === localVersion?.[key]
    ) {
      return;
    }

    // localVersion doesn't match database version, proceed to fetch database
    const remoteVersion = (
      await database.ref(`/last_updated`).once('value')
    ).val();
    const data = await database.ref(`/${key}`).once('value');
    dispatch({ type: key, payload: data.val() });
    localStorage.setItem('last_updated', JSON.stringify(remoteVersion));
    localStorage.setItem(key, JSON.stringify(data.val()));
  } catch (err) {
    dispatch({ type: 'firebaseError', payload: err });
  }
}

export function fetchDecks(dispatch: ReturnType<typeof useDispatch>): void {
  fetch(dispatch, 'decks');
}

export function fetchDices(dispatch: ReturnType<typeof useDispatch>): void {
  fetch(dispatch, 'dice');
}

export function fetchWiki(dispatch: ReturnType<typeof useDispatch>): void {
  fetch(dispatch, 'wiki');
}

export function fetchDecksGuide(
  dispatch: ReturnType<typeof useDispatch>
): void {
  fetch(dispatch, 'decks_guide');
}

export function fetchCredit(dispatch: ReturnType<typeof useDispatch>): void {
  fetch(dispatch, 'credit');
}

export function fetchNews(dispatch: ReturnType<typeof useDispatch>): void {
  fetch(dispatch, 'news');
}

export function fetchPatreon(dispatch: ReturnType<typeof useDispatch>): void {
  fetch(dispatch, 'patreon_list');
}

export function fetchCrit(dispatch: ReturnType<typeof useDispatch>): void {
  fetch(dispatch, 'critData');
}

export function fetchDiscordCommands(
  dispatch: ReturnType<typeof useDispatch>
): void {
  fetch(dispatch, 'discord_bot/help');
}

export default function fetchAll(
  dispatch: ReturnType<typeof useDispatch>
): void {
  fetchDecks(dispatch);
  fetchDecksGuide(dispatch);
  fetchDices(dispatch);
  fetchWiki(dispatch);
  fetchNews(dispatch);
  fetchCredit(dispatch);
  fetchPatreon(dispatch);
  fetchCrit(dispatch);
  fetchDiscordCommands(dispatch);
}

export function fetchUser(
  dispatch: ReturnType<typeof useDispatch>,
  uid: string
): void {
  const path = `users/${uid}`;
  Object.keys(localStorage)
    .filter(keyName => keyName.match(/^users\/.*/) && keyName !== path)
    .forEach(userCache => localStorage.removeItem(userCache));
  const localCache = validateLocalstorage(path);
  if (localCache) {
    dispatch({
      type: AuthActions.AuthSuccessAction,
      payload: {
        userData: localCache,
      },
    });
  }
  database
    .ref(`/${path}`)
    .once('value')
    .then(data => {
      dispatch({
        type: AuthActions.AuthSuccessAction,
        payload: {
          userData: data.val(),
        },
      });
      localStorage.setItem(path, JSON.stringify(data.val()));
    });
}
