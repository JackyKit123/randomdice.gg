export const FILTER_ACTION = 'FILTER_ACTION';

interface Filter {
    legendary: {
        name: string;
        checked: boolean;
    }[];
    customSearch: string;
}

export interface FilterState {
    filter: Filter;
}

interface FilterAction {
    type: typeof FILTER_ACTION;
    payload: Filter;
}

export type Action = FilterAction;
