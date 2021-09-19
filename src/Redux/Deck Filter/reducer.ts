import { Action, Filter } from './types';

const initialState: Filter = {
    profile: 'default',
    legendary: [],
    customSearch: -1,
    deckType: 'pvp',
};

export default function reducer(
    state = initialState,
    { type, payload }: Action
): Filter {
    return type === 'FILTER_ACTION' ? payload : state;
}
