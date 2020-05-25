import { AxiosError } from 'axios';

export const FETCH_DICES_SUCCESS = 'FETCH_DICES_SUCCESS';
export const FETCH_DICES_FAIL = 'FETCH_DICES_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export type Dices = {
    id: string;
    name: string;
    type: string;
    desc: string;
    target: string;
    rarity: string;
    image: string;
    atk: string;
    spd: string;
    eff1: string;
    eff2: string;
    nameEff1: string;
    nameEff2: string;
    unitEff1: string;
    unitEff2: string;
    cupAtk: string;
    cupSpd: string;
    cupEff1: string;
    cupEff2: string;
    pupAtk: string;
    pupSpd: string;
    pupEff1: string;
    pupEff2: string;
}[];

export interface FetchState {
    dices: Dices | undefined;
    error: AxiosError | undefined;
}

interface FetchDicesSuccessAction {
    type: typeof FETCH_DICES_SUCCESS;
    payload: Dices;
}

interface FetchDicesFailureAction {
    type: typeof FETCH_DICES_FAIL;
    payload: AxiosError;
}

interface ClearErrorAction {
    type: typeof CLEAR_ERRORS;
}

export type Action =
    | FetchDicesSuccessAction
    | FetchDicesFailureAction
    | ClearErrorAction;
