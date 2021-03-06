import {
    CLEAR_ERRORS,
    SuccessAction,
    FailureAction,
    ClearErrorAction,
} from '../types';

export const SUCCESS = 'FETCH_PATREON_SUCCESS';
export const FAIL = 'FETCH_PATREON_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

export interface Info {
    [key: string]: {
        youtubeId: string | undefined;
        message: string | undefined;
    };
}

export interface Patreon {
    id: string;
    name: string;
    img: string | undefined;
    tier: number;
}

export type PatreonList = (Info & Patreon)[];

export interface FetchState {
    list: PatreonList | undefined;
    error: firebase.FirebaseError | undefined;
}

export type Action =
    | SuccessAction<typeof SUCCESS, PatreonList>
    | FailureAction<typeof FAIL>
    | ClearErrorAction;
