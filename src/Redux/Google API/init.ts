import { useDispatch } from 'react-redux';
import { FETCH_GOOGLE_API_FAIL } from './types';
import { INIT_GAPI_SUCCESS } from './Client/types';

export default function init(dispatch: ReturnType<typeof useDispatch>): void {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/client.js';
    script.onload = (): void => {
        window.gapi.load('client', async () => {
            try {
                await window.gapi.client.init({
                    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
                    discoveryDocs: [
                        'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
                    ],
                });
                dispatch({
                    type: INIT_GAPI_SUCCESS,
                    payload: window.gapi.client,
                });
            } catch (err) {
                dispatch({
                    type: FETCH_GOOGLE_API_FAIL,
                    payload: (err as { error: Error }).error,
                });
            }
        });
    };
    document.body.append(script);
}
