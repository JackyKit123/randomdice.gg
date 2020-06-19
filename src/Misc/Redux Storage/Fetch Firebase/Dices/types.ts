import { AxiosError } from 'axios';

export const SUCCESS = 'FETCH_DICES_SUCCESS';
export const FAIL = 'FETCH_DICES_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';
export type ActionType = typeof SUCCESS | typeof FAIL | typeof CLEAR_ERRORS;

interface Alternatives {
    desc: string;
    list: string[];
}

interface ArenaValue {
    type: 'Main Dps' | 'Assist Dps' | 'Slow' | 'Value';
    assist: number;
    dps: number;
    slow: number;
    value: number;
}

export interface Dice {
    id: number;
    name: string;
    type: string;
    desc: string;
    target: string;
    rarity: 'Common' | 'Rare' | 'Unique' | 'Legendary';
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
    alternatives?: Alternatives;
    arenaValue: ArenaValue;
}

export type Dices = Dice[];

export interface FetchState {
    dices: Dices | undefined;
    error: AxiosError | undefined;
}

interface SuccessAction {
    type: typeof SUCCESS;
    payload: Dices;
}

interface FailureAction {
    type: typeof FAIL;
    payload: AxiosError;
}

interface ClearErrorAction {
    type: typeof CLEAR_ERRORS;
}

export type Action = SuccessAction | FailureAction | ClearErrorAction;
