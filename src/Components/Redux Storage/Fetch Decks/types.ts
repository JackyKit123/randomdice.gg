import { AxiosError } from 'axios';

export const FETCH_DECKS_SUCCESS = 'FETCH_DECKS_SUCCESS';
export const FETCH_DECKS_FAIL = 'FETCH_DECKS_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export type Decks = {
    id: number;
    type: string;
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
    error: AxiosError | undefined;
}

interface FetchDecksSuccessAction {
    type: typeof FETCH_DECKS_SUCCESS;
    payload: Decks;
}

interface FetchDecksFailureAction {
    type: typeof FETCH_DECKS_FAIL;
    payload: AxiosError;
}

interface ClearErrorAction {
    type: typeof CLEAR_ERRORS;
}

export type Action =
    | FetchDecksSuccessAction
    | FetchDecksFailureAction
    | ClearErrorAction;
