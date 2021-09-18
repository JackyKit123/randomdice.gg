import {
    CLEAR_ERRORS,
    SuccessAction,
    FailureAction,
    ClearErrorAction,
} from '../types';

export const SUCCESS = 'FETCH_DISCORD_BOT_COMMANDS_SUCCESS';
export const FAIL = 'FETCH_DISCORD_BOT_COMMANDS_FAIL';

export type ActionType = typeof SUCCESS | typeof FAIL | CLEAR_ERRORS;

export type Help = {
    category: string;
    commands: { command: string; description: string }[];
}[];

export interface FetchState {
    commands: Help | undefined;
    error: firebase.FirebaseError | undefined;
}

export type Action =
    | SuccessAction<typeof SUCCESS, Help>
    | FailureAction<typeof FAIL>
    | ClearErrorAction;
