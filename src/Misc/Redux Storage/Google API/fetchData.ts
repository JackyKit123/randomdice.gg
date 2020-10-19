import { useDispatch } from 'react-redux';
import { fetchPatreon } from '../../Firebase/fetchData';
import { PatreonList } from '../Fetch Firebase/Patreon List/types';
import { FETCH_GOOGLE_API_FAIL } from './types';
import {
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

// eslint-disable-next-line import/prefer-default-export
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
                .map(patreon => patreon[patreon.id]?.youtubeId)
                .filter(id => typeof id === 'string')
                .concat([
                    ...(
                        process.env.REACT_APP_YOUTUBERS_INCLUSIVE_OVERRIDE || ''
                    ).split(','),
                ])
                .map(async id => {
                    const res = await window.gapi.client.youtube.channels.list({
                        part: 'brandingSettings, snippet',
                        id,
                    });

                    return {
                        id,
                        bannerImg: {
                            default: res.result.items[0].brandingSettings.image.bannerImageUrl?.replace(
                                'http://',
                                'https://'
                            ),
                            mobile: res.result.items[0].brandingSettings.image.bannerMobileImageUrl?.replace(
                                'http://',
                                'https://'
                            ),
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
            type: FETCH_GOOGLE_API_FAIL,
            payload: err.result?.error,
        });
    }
}
