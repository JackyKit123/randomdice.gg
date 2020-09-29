import { Deck } from '../Fetch Firebase/Decks/types';
import { Dice } from '../Fetch Firebase/Dices/types';

export const FILTER_ACTION = 'FILTER_ACTION';

interface Filter {
    legendary: Dice['id'][];
    profile: keyof Deck['rating'];
    customSearch: Dice['id'];
}

export interface FilterState {
    filter: Filter;
}

interface FilterAction {
    type: typeof FILTER_ACTION;
    payload: Filter;
}

export type Action = FilterAction;
