import { Deck } from '../Fetch Firebase/Decks/types';
import { Dice } from '../Fetch Firebase/Dices/types';

export const FILTER_ACTION = 'FILTER_ACTION';

export interface Filter {
    legendary: Dice['id'][];
    profile: keyof Deck['rating'];
    customSearch: Dice['id'];
    deckType: 'pvp' | 'co-op' | 'crew';
}

interface FilterAction {
    type: typeof FILTER_ACTION;
    payload: Filter;
}

export type Action = FilterAction;
