import { useDispatch } from 'react-redux';
import { fetchYouTube } from './fetchData';

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
            } finally {
                fetchYouTube(dispatch);
            }
        });
    };
    document.body.append(script);
}
