export const FETCH_GOOGLE_API_FAIL = 'FETCH_GOOGLE_API_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export interface FetchGoogleApiFailureAction {
  type: typeof FETCH_GOOGLE_API_FAIL;
  payload: Error;
}

export interface ClearErrorAction {
  type: typeof CLEAR_ERRORS;
}
