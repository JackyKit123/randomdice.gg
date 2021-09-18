import {
    CLEAR_ERRORS,
    SuccessAction,
    FailureAction,
    ClearErrorAction,
} from '../types';

export const SUCCESS = 'FETCH_USER_SUCCESS';
export const FAIL = 'FETCH_USER_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

interface UserData {
    'linked-account': {
        discord?: string;
        patreon?: string;
    };
    'patreon-tier'?: number;
    editor?: true;
}

export interface FetchState {
    data: UserData | undefined;
    error: firebase.FirebaseError | undefined;
}

export type Action =
    | SuccessAction<typeof SUCCESS, UserData>
    | FailureAction<typeof FAIL>
    | ClearErrorAction;
