import { SUCCESS, FAIL, Action, FetchState } from './types';
import { CLEAR_ERRORS } from '../types';

const initialState: FetchState = { guide: undefined, error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                guide: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                guide: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                guide: state.guide,
                error: undefined,
            };
        default:
            return state;
    }
}
