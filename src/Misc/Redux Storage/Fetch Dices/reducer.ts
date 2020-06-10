import {
    FETCH_DICES_SUCCESS,
    FETCH_DICES_FAIL,
    Action,
    FetchState,
} from './types';
import { CLEAR_ERRORS } from '../Fetch Decks/types';

const initialState: FetchState = { dices: [], error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case FETCH_DICES_SUCCESS:
            return {
                dices: action.payload,
                error: undefined,
            };
        case FETCH_DICES_FAIL:
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