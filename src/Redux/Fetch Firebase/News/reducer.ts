import { SUCCESS, FAIL, Action, FetchState } from './types';
import { CLEAR_ERRORS } from '../types';

const initialState: FetchState = { news: undefined, error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                news: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                news: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                news: state.news,
                error: undefined,
            };
        default:
            return state;
    }
}
