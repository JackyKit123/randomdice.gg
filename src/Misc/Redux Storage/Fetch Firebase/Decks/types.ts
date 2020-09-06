import { CLEAR_ERRORS, ClearErrorAction } from '../types';
import { Dice } from '../Dices/types';

export const SUCCESS = 'FETCH_DECKS_SUCCESS';
export const FAIL = 'FETCH_DECKS_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

export interface Deck {
    id: number;
    type: 'PvP' | 'PvE' | 'Crew' | '-';
    rating: number;
    decks: Dice['id'][][];
    added: string;
    updated: string | null;
}

export type Decks = Deck[];

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
