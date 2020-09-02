export const FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS =
    'FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS';
export const FETCH_GAPI_YOUTUBE_CHANNEL_FAIL =
    'FETCH_GAPI_YOUTUBE_CHANNEL_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export interface YouTubeInfo {
    id: string;
    bannerImg: {
        default: string;
        mobile: string | false | undefined;
    };
    title: string;
    description: string;
    thumbnails: string;
}

export interface FetchState {
    list: YouTubeInfo[];
    error: Error | undefined;
}

interface FetchGAPISuccessAction {
    type: typeof FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS;
    payload: YouTubeInfo[];
}

interface FetchGAPIFailureAction {
    type: typeof FETCH_GAPI_YOUTUBE_CHANNEL_FAIL;
    payload: Error;
}

interface ClearErrorAction {
    type: typeof CLEAR_ERRORS;
}

export type Action =
    | FetchGAPISuccessAction
    | FetchGAPIFailureAction
    | ClearErrorAction;
