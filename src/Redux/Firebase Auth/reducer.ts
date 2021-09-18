import { AUTH, Action, AuthState, ERROR } from './types';

const initialState: AuthState = {
    user: 'awaiting auth state',
    error: undefined,
};

export default function(state = initialState, action: Action): AuthState {
    switch (action.type) {
        case AUTH:
            return action.payload
                ? {
                      user: action.payload,
                      error: undefined,
                  }
                : {
                      user: action.payload,
                      error: state.error,
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
