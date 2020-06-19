import { CLEAR_ERRORS, ClearErrorAction } from '../types';

export const SUCCESS = 'FETCH_DECKS_SUCCESS';
export const FAIL = 'FETCH_DECKS_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

export type Decks = {
    id: number;
    type: 'PvP' | 'PvE' | '-';
    rating: number;
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
    slot5: number;
    added: string;
    updated: string | null;
}[];

export interface FetchState {
    decks: Decks | undefined;
    error: firebase.FirebaseError | undefined;
}

interface FetchDecksSuccessAction {
    type: typeof SUCCESS;
    payload: Decks;
}

interface FetchDecksFailureAction {
    type: typeof FAIL;
    payload: firebase.FirebaseError;
}

export type Action =
    | FetchDecksSuccessAction
    | FetchDecksFailureAction
    | ClearErrorAction;
