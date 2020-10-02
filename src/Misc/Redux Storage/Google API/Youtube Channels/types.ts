import * as FETCH_GOOGLE_API from '../types';

export const FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS =
    'FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS';

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

export type Action =
    | FetchGAPISuccessAction
    | FETCH_GOOGLE_API.FetchGoogleApiFailureAction
    | FETCH_GOOGLE_API.ClearErrorAction;
