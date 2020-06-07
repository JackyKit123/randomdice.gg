import {
    FETCH_GAPI_RESPONSE_FORM_SUCCESS,
    FETCH_GAPI_RESPONSE_FORM_FAIL,
    Action,
    FormData,
    FetchState,
    CLEAR_ERRORS,
} from './types';

const initialState: FetchState = { formData: {} as FormData, error: undefined };

export default function(state = initialState, action: Action): FetchState {
    switch (action.type) {
        case FETCH_GAPI_RESPONSE_FORM_SUCCESS:
            return {
                formData: action.payload,
                error: state.error,
            };
        case FETCH_GAPI_RESPONSE_FORM_FAIL:
            return {
                formData: state.formData,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                formData: state.formData,
                error: undefined,
            };
        default:
            return state;
    }
}
