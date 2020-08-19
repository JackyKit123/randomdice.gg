import { useDispatch } from 'react-redux';
import { fetchPatreon } from '../../Firebase/fetchData';
import { PatreonList } from '../Fetch Firebase/Patreon List/types';
import {
    FETCH_GAPI_RESPONSE_FORM_FAIL,
    FETCH_GAPI_RESPONSE_FORM_SUCCESS,
} from './Google Form/types';
import {
    FETCH_GAPI_YOUTUBE_CHANNEL_FAIL,
    FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS,
    YouTubeInfo,
} from './Youtube Channels/types';

function corruptedStorage(item: string): boolean {
    try {
        JSON.parse(item);
        return false;
    } catch (err) {
        return true;
    }
}

export async function fetchResponseForm(
    dispatch: ReturnType<typeof useDispatch>
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

export async function fetchYouTube(
    dispatch: ReturnType<typeof useDispatch>
): Promise<void> {
    const localCache = localStorage.getItem('YoutubeChannels');
    if (localCache) {
        if (corruptedStorage(localCache)) {
            localStorage.removeItem('YoutubeChannels');
        } else {
            dispatch({
                type: FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS,
                payload: JSON.parse(localCache),
            });
        }
    }
    try {
        await fetchPatreon(dispatch);
        const patreonList: PatreonList = JSON.parse(
            localStorage.getItem('patreon_list') as string
        );
        const YoutubeList = await Promise.all(
            patreonList
                .map(patreon => patreon[patreon.id].youtubeId)
                .filter(id => id)
                .concat(['UCLQeDAF-7CvewgiGnm7FqBQ']) // custom hard coded editor channels
                .map(async id => {
                    const res = await window.gapi.client.youtube.channels.list({
                        part: 'brandingSettings, snippet',
                        id,
                    });

                    return {
                        id,
                        bannerImg: {
                            default:
                                res.result.items[0].brandingSettings.image
                                    .bannerImageUrl,
                            mobile:
                                res.result.items[0].brandingSettings.image
                                    .bannerMobileImageUrl,
                        },
                        title: res.result.items[0].snippet.title,
                        description: res.result.items[0].snippet.description,
                        thumbnails:
                            res.result.items[0].snippet.thumbnails.default.url,
                    } as YouTubeInfo;
                })
        );
        dispatch({
            type: FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS,
            payload: YoutubeList,
        });
        localStorage.setItem('YoutubeChannels', JSON.stringify(YoutubeList));
    } catch (err) {
        dispatch({
            type: FETCH_GAPI_YOUTUBE_CHANNEL_FAIL,
            payload: err.error,
        });
    }
}
