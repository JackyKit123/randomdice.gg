import {
    CLEAR_ERRORS,
    SuccessAction,
    FailureAction,
    ClearErrorAction,
} from '../types';

export const SUCCESS = 'FETCH_CREDIT_SUCCESS';
export const FAIL = 'FETCH_CREDIT_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

export interface People {
    id: number;
    name: string;
    img: string;
    role: string;
}

export interface Category {
    id: number;
    category: string;
    people: People[];
}

export type Credit = Category[];

export interface FetchState {
    credit: Credit | undefined;
    error: firebase.FirebaseError | undefined;
}

export type Action =
    | SuccessAction<typeof SUCCESS, Credit>
    | FailureAction<typeof FAIL>
    | ClearErrorAction;
