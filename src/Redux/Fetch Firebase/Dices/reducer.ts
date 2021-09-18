import { SUCCESS, FAIL, Action, FetchState } from './types';
import { CLEAR_ERRORS } from '../types';

const initialState: FetchState = { dices: [], error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                dices: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                dices: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                dices: state.dices,
                error: undefined,
            };
        default:
            return state;
    }
}
