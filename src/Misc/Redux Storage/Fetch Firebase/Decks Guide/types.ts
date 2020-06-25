import {
    CLEAR_ERRORS,
    SuccessAction,
    FailureAction,
    ClearErrorAction,
} from '../types';

export const SUCCESS = 'FETCH_DECKS_GUIDE_SUCCESS';
export const FAIL = 'FETCH_DECKS_GUIDE_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

interface DecksGuide {
    [key: string]: {
        diceList: string[][];
        guide: string;
    };
}

export interface FetchState {
    guide: DecksGuide | undefined;
    error: firebase.FirebaseError | undefined;
}

export type Action =
    | SuccessAction<typeof SUCCESS, DecksGuide>
    | FailureAction<typeof FAIL>
    | ClearErrorAction;
