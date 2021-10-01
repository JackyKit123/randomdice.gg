import {
  FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS,
  Action,
  YouTubeInfo,
  FetchState,
} from './types';
import { FETCH_GOOGLE_API_FAIL, CLEAR_ERRORS } from '../types';

const initialState: FetchState = {
  list: [] as YouTubeInfo[],
  error: undefined,
};

export default function(state = initialState, action: Action): FetchState {
  switch (action.type) {
    case FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS:
      return {
        list: action.payload,
        error: state.error,
      };
    case FETCH_GOOGLE_API_FAIL:
      return {
        list: state.list,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        list: state.list,
        error: undefined,
      };
    default:
      return state;
  }
}
