import {
    FETCH_DECKS_SUCCESS,
    FETCH_DECKS_FAIL,
    Action,
    FetchState,
} from './types';

const initialState: FetchState = { decks: [], error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case FETCH_DECKS_SUCCESS:
            return {
                decks: action.payload,
                error: undefined,
            };
        case FETCH_DECKS_FAIL:
            return {
                decks: undefined,
                error: action.payload,
            };
        default:
            return state;
    }
}
