import { FILTER_ACTION, Action, FilterState } from './types';

const initialState: FilterState = {
    filter: {
        profile: 'default',
        legendary: [],
        customSearch: -1,
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
