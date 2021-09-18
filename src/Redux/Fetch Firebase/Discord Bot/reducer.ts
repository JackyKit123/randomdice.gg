import { SUCCESS, FAIL, Action, FetchState } from './types';
import { CLEAR_ERRORS } from '../types';

const initialState: FetchState = { commands: undefined, error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case SUCCESS:
            return {
                commands: action.payload,
                error: undefined,
            };
        case FAIL:
            return {
                commands: undefined,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                commands: state.commands,
                error: undefined,
            };
        default:
            return state;
    }
}
