import { FILTER_ACTION, Action, FilterState } from './types';

const initialState: FilterState = {
    filter: {
        legendary: [],
        customSearch: '?',
    },
};

export default function(state = initialState, action: Action): FilterState {
    switch (action.type) {
        case FILTER_ACTION:
            return {
                filter: action.payload,
            };
        default:
            return state;
    }
}
