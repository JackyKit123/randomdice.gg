import { SUCCESS, FAIL, Action, FetchState } from './types';
import { CLEAR_ERRORS } from '../types';

const initialState: FetchState = { wiki: undefined, error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                wiki: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                wiki: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                wiki: state.wiki,
                error: undefined,
            };
        default:
            return state;
    }
}
