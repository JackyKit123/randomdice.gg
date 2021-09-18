import { INIT_GAPI_SUCCESS, Action, FetchState } from './types';
import { FETCH_GOOGLE_API_FAIL, CLEAR_ERRORS } from '../types';

const initialState: FetchState = {
    client: undefined,
    error: undefined,
};

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case INIT_GAPI_SUCCESS:
            return {
                client: action.payload,
                error: state.error,
            };
        case FETCH_GOOGLE_API_FAIL:
            return {
                client: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                client: state.client,
                error: undefined,
            };
        default:
            return state;
    }
}
