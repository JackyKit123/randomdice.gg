export const FETCH_GAPI_RESPONSE_FORM_SUCCESS =
    'FETCH_GAPI_RESPONSE_FORM_SUCCESS';
export const FETCH_GAPI_RESPONSE_FORM_FAIL = 'FETCH_GAPI_RESPONSE_FORM_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export interface FormData {
    raw: number[][];
    summarized: number[][];
}

export interface FetchState {
    formData: FormData | undefined;
    error: Error | undefined;
}

interface FetchGAPISuccessAction {
    type: typeof FETCH_GAPI_RESPONSE_FORM_SUCCESS;
    payload: FormData;
}

interface FetchGAPIFailureAction {
    type: typeof FETCH_GAPI_RESPONSE_FORM_FAIL;
    payload: Error;
}

interface ClearErrorAction {
    type: typeof CLEAR_ERRORS;
}

export type Action =
    | FetchGAPISuccessAction
    | FetchGAPIFailureAction
    | ClearErrorAction;
