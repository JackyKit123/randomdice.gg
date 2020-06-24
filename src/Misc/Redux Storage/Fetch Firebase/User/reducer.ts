import { SUCCESS, FAIL, Action, FetchState } from './types';
import { CLEAR_ERRORS } from '../types';

const initialState: FetchState = { data: undefined, error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                data: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                data: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                data: state.data,
                error: undefined,
            };
        default:
            return state;
    }
}
