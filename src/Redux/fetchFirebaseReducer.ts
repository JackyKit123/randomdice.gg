/* eslint-disable @typescript-eslint/camelcase */
import { FirebaseError } from 'firebase';
import { Data } from 'types/database';

export interface FetchState extends Data {
    firebaseError: FirebaseError | null;
}

const initialState: FetchState = {
    credit: [],
    critData: {},
    decks: [],
    decks_guide: [],
    dice: [],
    'discord_bot/help': [],
    news: { game: '', website: '' },
    patreon_list: [],
    wiki: {
        battlefield: [],
        box: [],
        boss: [],
        intro: {
            PvP: '',
            'Co-op': '',
            Crew: '',
            Arena: '',
            Store: '',
        },
        tips: [],
    },
    firebaseError: null,
};

interface Action<T extends keyof FetchState> {
    type: T;
    payload: FetchState[T];
}

export default function fetchFirebaseReducer<T extends keyof FetchState>(
    state = initialState,
    { type, payload }: Action<T>
): FetchState {
    return type === 'firebaseError'
        ? {
              ...initialState,
              firebaseError: payload as FirebaseError,
          }
        : {
              ...state,
              ...{ [type]: payload },
              firebaseError: null,
          };
}
