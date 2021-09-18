import {
    CLEAR_ERRORS,
    SuccessAction,
    FailureAction,
    ClearErrorAction,
} from '../types';

export const SUCCESS = 'FETCH_CRIT_SUCCESS';
export const FAIL = 'FETCH_CRIT_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

export interface CritData {
    [key: string]: {
        trophies: number;
        crit: number;
    };
}

export interface FetchState {
    critData: CritData | undefined;
    error: firebase.FirebaseError | undefined;
}

export type Action =
    | SuccessAction<typeof SUCCESS, CritData>
    | FailureAction<typeof FAIL>
    | ClearErrorAction;
