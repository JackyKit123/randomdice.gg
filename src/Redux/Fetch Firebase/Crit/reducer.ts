import { SUCCESS, FAIL, Action, FetchState } from './types';
import { CLEAR_ERRORS } from '../types';

const initialState: FetchState = { critData: undefined, error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                critData: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                critData: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                critData: state.critData,
                error: undefined,
            };
        default:
            return state;
    }
}
