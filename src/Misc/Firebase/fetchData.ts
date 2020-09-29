import firebase from 'firebase/app';
import { useDispatch } from 'react-redux';
import initApp from './init';
import * as FETCH_DICES from '../Redux Storage/Fetch Firebase/Dices/types';
import * as FETCH_DECKS from '../Redux Storage/Fetch Firebase/Decks/types';
import * as FETCH_WIKI from '../Redux Storage/Fetch Firebase/Wiki/types';
import * as FETCH_DECKS_GUIDE from '../Redux Storage/Fetch Firebase/Decks Guide/types';
import * as FETCH_CREDIT from '../Redux Storage/Fetch Firebase/Credit/types';
import * as FETCH_USER from '../Redux Storage/Fetch Firebase/User/types';
import * as FETCH_NEWS from '../Redux Storage/Fetch Firebase/News/types';
import * as FETCH_PATREON from '../Redux Storage/Fetch Firebase/Patreon List/types';
import * as FETCH_CRIT from '../Redux Storage/Fetch Firebase/Crit/types';

const database = firebase.apps.length
    ? firebase.database()
    : firebase.database(initApp());

async function fetch(
    dispatch: ReturnType<typeof useDispatch>,
    successAction: string,
    errorAction: string,
    key: string,
    forceFetch?: true
): Promise<void> {
    // apply local storage cache before fetching database
    const localCache = localStorage.getItem(key);
    if (localCache) {
        try {
            dispatch({
                type: successAction,
                payload: JSON.parse(localCache),
            });
        } catch (err) {
            // error at JSON.parse, prob corrupted JSON, removing item and proceed to fetch database
            localStorage.removeItem(key);
        }
    }

    try {
        if (forceFetch) {
            const data = await database.ref(`/${key}`).once('value');
            dispatch({ type: successAction, payload: data.val() });
            localStorage.setItem(key, JSON.stringify(data.val()));
            return;
        }

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
        if (remoteKeyVersion && remoteKeyVersion === localVersion?.[key]) {
            return;
        }

        // localVersion doesn't match database version, proceed to fetch database
        const remoteVersion = (
            await database.ref(`/last_updated`).once('value')
        ).val();
        const data = await database.ref(`/${key}`).once('value');
        dispatch({ type: successAction, payload: data.val() });
        localStorage.setItem('last_updated', JSON.stringify(remoteVersion));
        localStorage.setItem(key, JSON.stringify(data.val()));
    } catch (err) {
        dispatch({ type: errorAction, payload: err });
    }
}

export function fetchDecks(dispatch: ReturnType<typeof useDispatch>): void {
    fetch(dispatch, FETCH_DECKS.SUCCESS, FETCH_DECKS.FAIL, 'decks');
}

export function fetchDices(dispatch: ReturnType<typeof useDispatch>): void {
    fetch(dispatch, FETCH_DICES.SUCCESS, FETCH_DICES.FAIL, 'dice');
}

export function fetchWiki(dispatch: ReturnType<typeof useDispatch>): void {
    fetch(dispatch, FETCH_WIKI.SUCCESS, FETCH_WIKI.FAIL, 'wiki');
}

export function fetchDecksGuide(
    dispatch: ReturnType<typeof useDispatch>
): void {
    fetch(
        dispatch,
        FETCH_DECKS_GUIDE.SUCCESS,
        FETCH_DECKS_GUIDE.FAIL,
        'decks_guide'
    );
}

export function fetchCredit(dispatch: ReturnType<typeof useDispatch>): void {
    fetch(dispatch, FETCH_CREDIT.SUCCESS, FETCH_CREDIT.FAIL, 'credit');
}

export function fetchUser(
    dispatch: ReturnType<typeof useDispatch>,
    uid: string
): void {
    Object.keys(localStorage)
        .filter(
            keyName => keyName.match(/^users\/.*/) && keyName !== `users/${uid}`
        )
        .forEach(userCache => localStorage.removeItem(userCache));
    fetch(dispatch, FETCH_USER.SUCCESS, FETCH_USER.FAIL, `users/${uid}`, true);
}

export function fetchNews(dispatch: ReturnType<typeof useDispatch>): void {
    fetch(dispatch, FETCH_NEWS.SUCCESS, FETCH_NEWS.FAIL, 'news');
}

export function fetchPatreon(dispatch: ReturnType<typeof useDispatch>): void {
    fetch(dispatch, FETCH_PATREON.SUCCESS, FETCH_PATREON.FAIL, 'patreon_list');
}

export function fetchCrit(dispatch: ReturnType<typeof useDispatch>): void {
    fetch(dispatch, FETCH_CRIT.SUCCESS, FETCH_CRIT.FAIL, 'critData');
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
}
