import { OPEN_POPUP, CLOSE_POPUP, PopUpState, Action } from './types';

const initialState = {
    name: null,
} as PopUpState;

export default function(state = initialState, action: Action): PopUpState {
    switch (action.type) {
        case OPEN_POPUP:
            return {
                name: action.payload,
            };
        case CLOSE_POPUP:
            return {
                name: null,
            };
        default:
            return state;
    }
}
