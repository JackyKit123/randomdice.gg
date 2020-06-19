import firebase from 'firebase/app';
import 'firebase/database';
import { Dispatch } from 'redux';
import initApp from './init';
import * as FETCH_DICES from '../Redux Storage/Fetch Firebase/Dices/types';
import * as FETCH_DECKS from '../Redux Storage/Fetch Firebase/Decks/types';

const app = initApp();
const database = firebase.database(app);
type ActionType = FETCH_DICES.ActionType | FETCH_DECKS.ActionType;

async function fetch(
    dispatch: Dispatch,
    successAction: ActionType,
    errorAction: ActionType,
    dbPath: string,
    localStorageKey: string
): Promise<void> {
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

export default function fetchAll(dispatch: Dispatch): void {
    fetchDecks(dispatch);
    fetchDices(dispatch);
}
