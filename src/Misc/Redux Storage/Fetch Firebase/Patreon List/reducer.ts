import { SUCCESS, FAIL, Action, FetchState } from './types';
import { CLEAR_ERRORS } from '../types';

const initialState: FetchState = { list: undefined, error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                list: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                list: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                list: state.list,
                error: undefined,
            };
        default:
            return state;
    }
}
