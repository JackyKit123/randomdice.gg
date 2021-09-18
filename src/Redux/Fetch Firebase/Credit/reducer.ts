import { SUCCESS, FAIL, Action, FetchState } from './types';
import { CLEAR_ERRORS } from '../types';

const initialState: FetchState = { credit: undefined, error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                credit: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                credit: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                credit: state.credit,
                error: undefined,
            };
        default:
            return state;
    }
}
