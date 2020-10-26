import * as FETCH_GOOGLE_API from '../types';

export const INIT_GAPI_SUCCESS = 'INIT_GAPI_SUCCESS';

export interface Client {
    youtube: {
        channels: {
            list: Function;
        };
    };
}

export interface FetchState {
    client: Client | undefined;
    error: Error | undefined;
}

interface InitGAPISuccessAction {
    type: typeof INIT_GAPI_SUCCESS;
    payload: Client;
}

export type Action =
    | InitGAPISuccessAction
    | FETCH_GOOGLE_API.FetchGoogleApiFailureAction
    | FETCH_GOOGLE_API.ClearErrorAction;
