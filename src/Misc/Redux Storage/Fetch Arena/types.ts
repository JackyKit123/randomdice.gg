import { AxiosError } from 'axios';

export const FETCH_ARENA_SUCCESS = 'FETCH_ARENA_SUCCESS';
export const FETCH_ARENA_FAIL = 'FETCH_ARENA_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export type DiceValue = {
    id: number;
    type: 'Main Dps' | 'Assist Dps' | 'Slow' | 'Value';
    dps: number;
    assists: number;
    slow: number;
    value: number;
};

export type DicesValue = DiceValue[];

export interface FetchState {
    dices: DicesValue | undefined;
    error: AxiosError | undefined;
}

interface FetchArenaSuccessAction {
    type: typeof FETCH_ARENA_SUCCESS;
    payload: DicesValue;
}

interface FetchArenaFailureAction {
    type: typeof FETCH_ARENA_FAIL;
    payload: AxiosError;
}

interface ClearErrorAction {
    type: typeof CLEAR_ERRORS;
}

export type Action =
    | FetchArenaSuccessAction
    | FetchArenaFailureAction
    | ClearErrorAction;
