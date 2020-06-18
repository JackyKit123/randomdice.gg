import { SUCCESS, FAIL, Action, FetchState, CLEAR_ERRORS } from './types';

const initialState: FetchState = { decks: [], error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                decks: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                decks: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                decks: state.decks,
                error: undefined,
            };
        default:
            return state;
    }
}
