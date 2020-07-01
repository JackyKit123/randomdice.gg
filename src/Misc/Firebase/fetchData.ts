import firebase from 'firebase/app';
import { Dispatch } from 'redux';
import initApp from './init';
import * as FETCH_DICES from '../Redux Storage/Fetch Firebase/Dices/types';
import * as FETCH_DECKS from '../Redux Storage/Fetch Firebase/Decks/types';
import * as FETCH_WIKI from '../Redux Storage/Fetch Firebase/Wiki/types';
import * as FETCH_DECKS_GUIDE from '../Redux Storage/Fetch Firebase/Decks Guide/types';
import * as FETCH_USER from '../Redux Storage/Fetch Firebase/User/types';
import * as FETCH_NEWS from '../Redux Storage/Fetch Firebase/News/types';

const database = firebase.apps.length
    ? firebase.database()
    : firebase.database(initApp());
type ActionType =
    | FETCH_DICES.ActionType
    | FETCH_DECKS.ActionType
    | FETCH_WIKI.ActionType
    | FETCH_DECKS_GUIDE.ActionType
    | FETCH_USER.ActionType
    | FETCH_NEWS.ActionType;

async function fetch(
    dispatch: Dispatch,
    successAction: ActionType,
    errorAction: ActionType,
    dbPath: string,
    localStorageKey?: string
): Promise<void> {
    if (!localStorageKey) {
        const res = await database.ref(dbPath).once('value');
        dispatch({ type: successAction, payload: res.val() });
        return;
    }

    const localCache = localStorage.getItem(localStorageKey);
    if (localCache) {
        try {
            dispatch({
                type: successAction,
                payload: JSON.parse(localCache),
            });
        } catch (err) {
            localStorage.removeItem(localStorageKey);
        }
    }

    try {
        const res = await database.ref(dbPath).once('value');
        dispatch({ type: successAction, payload: res.val() });
        localStorage.setItem(localStorageKey, JSON.stringify(res.val()));
    } catch (err) {
        dispatch({ type: errorAction, payload: err });
    }
}

export function fetchDecks(dispatch: Dispatch<FETCH_DICES.Action>): void {
    fetch(dispatch, FETCH_DECKS.SUCCESS, FETCH_DECKS.FAIL, '/decks', 'decks');
}

export function fetchDices(dispatch: Dispatch<FETCH_DECKS.Action>): void {
    fetch(dispatch, FETCH_DICES.SUCCESS, FETCH_DICES.FAIL, '/dice', 'dices');
}

export function fetchWiki(dispatch: Dispatch<FETCH_WIKI.Action>): void {
    fetch(dispatch, FETCH_WIKI.SUCCESS, FETCH_WIKI.FAIL, '/wiki', 'wiki');
}

export function fetchDecksGuide(
    dispatch: Dispatch<FETCH_DECKS_GUIDE.Action>
): void {
    fetch(
        dispatch,
        FETCH_DECKS_GUIDE.SUCCESS,
        FETCH_DECKS_GUIDE.FAIL,
        '/decks_guide',
        'decks_guide'
    );
}

export function fetchUser(
    dispatch: Dispatch<FETCH_USER.Action>,
    uid: string
): void {
    fetch(dispatch, FETCH_USER.SUCCESS, FETCH_USER.FAIL, `/users/${uid}`);
}

export function fetchNews(dispatch: Dispatch<FETCH_NEWS.Action>): void {
    fetch(dispatch, FETCH_NEWS.SUCCESS, FETCH_NEWS.FAIL, '/news', 'news');
}

export default function fetchAll(dispatch: Dispatch): void {
    fetchDecks(dispatch);
    fetchDecksGuide(dispatch);
    fetchDices(dispatch);
    fetchWiki(dispatch);
    fetchNews(dispatch);
}
