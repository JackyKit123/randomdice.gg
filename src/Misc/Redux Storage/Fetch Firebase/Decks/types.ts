import { CLEAR_ERRORS, ClearErrorAction } from '../types';
import { Dice } from '../Dices/types';
import { Battlefield } from '../Wiki/types';

export const SUCCESS = 'FETCH_DECKS_SUCCESS';
export const FAIL = 'FETCH_DECKS_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

export interface Deck {
    guide: number[];
    id: number;
    type: 'PvP' | 'Co-op' | 'Crew' | '-';
    rating: {
        default: number;
        c8?: number;
        c9?: number;
        c10?: number;
    };
    battlefield: Battlefield['id'];
    decks: Dice['id'][][];
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
