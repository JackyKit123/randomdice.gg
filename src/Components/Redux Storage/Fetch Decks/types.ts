import { AxiosError } from 'axios';

export const FETCH_DECKS_SUCCESS = 'FETCH_DECKS_SUCCESS';
export const FETCH_DECKS_FAIL = 'FETCH_DECKS_FAIL';

type Decks = {
    id: string;
    name: string | null;
    type: string;
    rating: string;
    slot1: string;
    slot2: string;
    slot3: string;
    slot4: string;
    slot5: string;
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

export type Action = FetchDecksSuccessAction | FetchDecksFailureAction;
