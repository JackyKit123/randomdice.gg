export const CLEAR_ERRORS = 'CLEAR_ERRORS';
export type CLEAR_ERRORS = typeof CLEAR_ERRORS;

export interface SuccessAction<Success, Data> {
    type: Success;
    payload: Data;
}

export interface FailureAction<Fail> {
    type: Fail;
    payload: firebase.FirebaseError;
}

export interface ClearErrorAction {
    type: typeof CLEAR_ERRORS;
}
