import {
    FETCH_ALTS_SUCCESS,
    FETCH_ALTS_FAIL,
    Action,
    FetchState,
    CLEAR_ERRORS,
} from './types';

const initialState: FetchState = { alts: [], error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case FETCH_ALTS_SUCCESS:
            return {
                alts: action.payload,
                error: undefined,
            };
        case FETCH_ALTS_FAIL:
            return {
                alts: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                alts: state.alts,
                error: undefined,
            };
        default:
            return state;
    }
}
