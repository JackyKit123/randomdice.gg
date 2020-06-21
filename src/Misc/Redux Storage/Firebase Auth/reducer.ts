import { AUTH, Action, AuthState, ERROR } from './types';

const initialState: AuthState = { user: null, error: undefined };

export default function(state = initialState, action: Action): AuthState {
    switch (action.type) {
        case AUTH:
            return {
                user: action.payload,
                error: undefined,
            };
        case ERROR:
            return {
                user: state.user,
                error: action.payload,
            };
        default:
            return state;
    }
}
