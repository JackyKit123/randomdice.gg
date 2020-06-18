import { Dispatch } from 'react';
import {
    FETCH_GAPI_RESPONSE_FORM_FAIL,
    FETCH_GAPI_RESPONSE_FORM_SUCCESS,
} from './types';

function corruptedStorage(item: string): boolean {
    try {
        JSON.parse(item);
        return false;
    } catch (err) {
        return true;
    }
}

export default async function fetchResponseForm(
    dispatch: Dispatch<{}>,
    init?: boolean
): Promise<void> {
    const localCache = localStorage.getItem('critData');
    if (localCache) {
        if (corruptedStorage(localCache)) {
            localStorage.removeItem('critData');
        } else {
            dispatch({
                type: FETCH_GAPI_RESPONSE_FORM_SUCCESS,
                payload: JSON.parse(localCache),
            });
        }
    }
    if (init) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/client.js';
        script.onload = (): void => {
            window.gapi.load('client', async () => {
                try {
                    await window.gapi.client.init({
                        apiKey: process.env.REACT_APP_GAPI_KEY,
                        discoveryDocs: [
                            'https://sheets.googleapis.com/$discovery/rest?version=v4',
                        ],
                    });
                } finally {
                    fetchResponseForm(dispatch);
                }
            });
        };
        document.body.append(script);
    }
    try {
        const res = await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.REACT_APP_CRIT_RESPONSE_SPREADSHEET_ID,
            range: 'Responses!D2:E',
        });
        const rawData = res.result.values
            .map((row: string[]) => row.map((cell: string) => Number(cell)))
            .filter(
                (row: number[]) => row.some(data => data) && row.length === 2
            );
        const res2 = await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.REACT_APP_CRIT_RESPONSE_SPREADSHEET_ID,
            range: 'Results!C2:D21',
        });
        const summarizedData = res2.result.values.map((row: string[]) =>
            row.map((cell: string) => Number(cell))
        );
        const payload = {
            raw: rawData,
            summarized: summarizedData,
        };
        dispatch({
            type: FETCH_GAPI_RESPONSE_FORM_SUCCESS,
            payload,
        });
        localStorage.setItem('critData', JSON.stringify(payload));
    } catch (err) {
        dispatch({
            type: FETCH_GAPI_RESPONSE_FORM_FAIL,
            payload: err.error,
        });
    }
}
