import { Die, Deck } from 'types/database';

export const FILTER_ACTION = 'FILTER_ACTION';

export interface Filter {
    legendary: Die['id'][];
    profile: keyof Deck['rating'];
    customSearch: Die['id'];
    deckType: 'pvp' | 'co-op' | 'crew';
}

interface FilterAction {
    type: typeof FILTER_ACTION;
    payload: Filter;
}

export type Action = FilterAction;
