import {
    CLEAR_ERRORS,
    SuccessAction,
    FailureAction,
    ClearErrorAction,
} from '../types';

export const SUCCESS = 'FETCH_WIKI_SUCCESS';
export const FAIL = 'FETCH_WIKI_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

export interface Battlefield {
    id: number;
    name: string;
    img: string;
    desc: string;
    source: string;
    buffName: string;
    buffValue: number;
    buffUnit: string;
    buffCupValue: number;
}

export interface Guide {
    id: number;
    level: 'Beginners' | 'Intermediate' | 'Advanced';
    title: string;
    content: string;
}

export interface WikiContent {
    box: {
        id: number;
        name: string;
        img: string;
        from: string;
        contain: string;
    }[];
    intro: {
        PvP: string;
        'Co-op': string;
        Crew: string;
        Arena: string;
        Store: string;
    };
    boss: {
        id: number;
        name: string;
        img: string;
        desc: string;
    }[];
    tips: Guide[];
    battlefield: Battlefield[];
}

export interface FetchState {
    wiki: WikiContent | undefined;
    error: firebase.FirebaseError | undefined;
}

export type Action =
    | SuccessAction<typeof SUCCESS, WikiContent>
    | FailureAction<typeof FAIL>
    | ClearErrorAction;
