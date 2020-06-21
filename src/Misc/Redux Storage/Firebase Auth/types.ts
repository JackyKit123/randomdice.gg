export const AUTH = 'AUTH';
export const ERROR = 'AUTH_ERROR';

export interface AuthState {
    user: firebase.User | null;
    error: string | undefined;
}

interface AuthAction {
    type: typeof AUTH;
    payload: AuthState['user'];
}

interface ErrorAction {
    type: typeof ERROR;
    payload: AuthState['error'];
}

export type Action = AuthAction | ErrorAction;
