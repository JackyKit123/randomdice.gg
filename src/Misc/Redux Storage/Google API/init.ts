import { useDispatch } from 'react-redux';
import { fetchResponseForm, fetchYouTube } from './fetchData';

export default function init(dispatch: ReturnType<typeof useDispatch>): void {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/client.js';
    script.onload = (): void => {
        window.gapi.load('client', async () => {
            try {
                await window.gapi.client.init({
                    apiKey: process.env.REACT_APP_GAPI_KEY,
                    discoveryDocs: [
                        'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
                        'https://sheets.googleapis.com/$discovery/rest?version=v4',
                    ],
                });
            } finally {
                fetchResponseForm(dispatch);
                fetchYouTube(dispatch);
            }
        });
    };
    document.body.append(script);
}
