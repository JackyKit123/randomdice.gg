import {
    CLEAR_ERRORS,
    SuccessAction,
    FailureAction,
    ClearErrorAction,
} from '../types';

export const SUCCESS = 'FETCH_NEWS_SUCCESS';
export const FAIL = 'FETCH_NEWS_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

export interface FetchState {
    news: string | undefined;
    error: firebase.FirebaseError | undefined;
}

export type Action =
    | SuccessAction<typeof SUCCESS, string>
    | FailureAction<typeof FAIL>
    | ClearErrorAction;
