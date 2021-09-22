/* eslint-disable @typescript-eslint/camelcase */
import firebase from 'firebase';
import { UserData } from 'types/database';

export interface AuthState {
    auth: firebase.User | null | 'awaiting auth state';
    userData: UserData | null;
    error: unknown | null;
}

export enum AuthActions {
    AuthSuccessAction = 'AuthSuccessAction',
    AuthFailAction = 'AuthFailAction',
    AuthError = 'AuthError',
}

interface Dispatch<TAction extends keyof typeof AuthActions> {
    type: TAction;
    payload: AuthState;
}

const initialState: AuthState = {
    auth: 'awaiting auth state',
    userData: null,
    error: null,
};

export default function authReducer<T extends keyof typeof AuthActions>(
    state = initialState,
    { type, payload }: Dispatch<T>
): AuthState {
    switch (type) {
        case 'AuthSuccessAction':
            return {
                ...state,
                ...payload,
                error: null,
            };
        case 'AuthFailAction':
            return {
                auth: null,
                userData: null,
                error: null,
            };
        case 'AuthError':
            return {
                ...state,
                error: payload.error,
            };
        default:
            return state;
    }
}
