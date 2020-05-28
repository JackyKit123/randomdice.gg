import { AxiosError } from 'axios';

export const FETCH_DICES_SUCCESS = 'FETCH_DICES_SUCCESS';
export const FETCH_DICES_FAIL = 'FETCH_DICES_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export type Dices = {
    id: number;
    name: string;
    type: string;
    desc: string;
    target: string;
    rarity: string;
    image: string;
    atk: number;
    spd: number;
    eff1: number;
    eff2: number;
    nameEff1: string;
    nameEff2: string;
    unitEff1: string;
    unitEff2: string;
    cupAtk: number;
    cupSpd: number;
    cupEff1: number;
    cupEff2: number;
    pupAtk: number;
    pupSpd: number;
    pupEff1: number;
    pupEff2: number;
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
