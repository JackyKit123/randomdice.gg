import { AxiosError } from 'axios';

export const FETCH_ALTS_SUCCESS = 'FETCH_ALTS_SUCCESS';
export const FETCH_ALTS_FAIL = 'FETCH_ALTS_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export type Alts = {
    id: number;
    list: number[];
    desc: string;
}[];

export interface FetchState {
    alts: Alts | undefined;
    error: AxiosError | undefined;
}

interface FetchAltsSuccessAction {
    type: typeof FETCH_ALTS_SUCCESS;
    payload: Alts;
}

interface FetchAltsFailureAction {
    type: typeof FETCH_ALTS_FAIL;
    payload: AxiosError;
}

interface ClearErrorAction {
    type: typeof CLEAR_ERRORS;
}

export type Action =
    | FetchAltsSuccessAction
    | FetchAltsFailureAction
    | ClearErrorAction;
