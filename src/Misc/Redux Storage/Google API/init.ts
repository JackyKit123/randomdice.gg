import { useDispatch } from 'react-redux';
import { fetchYouTube } from './fetchData';
import { FETCH_GOOGLE_API_FAIL } from './types';

export default function init(dispatch: ReturnType<typeof useDispatch>): void {
    window.gapi.load('client', async () => {
        try {
            await window.gapi.client.init({
                apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
                discoveryDocs: [
                    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
                ],
            });
            await fetchYouTube(dispatch);
        } catch (err) {
            dispatch({
                type: FETCH_GOOGLE_API_FAIL,
                payload: err.error,
            });
        }
    });
}
