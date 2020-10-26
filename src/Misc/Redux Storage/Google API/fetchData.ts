import { useDispatch } from 'react-redux';
import { fetchPatreon } from '../../Firebase/fetchData';
import { PatreonList } from '../Fetch Firebase/Patreon List/types';
import { FETCH_GOOGLE_API_FAIL } from './types';
import {
    FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS,
    YouTubeInfo,
} from './Youtube Channels/types';
import { Client } from './Client/types';

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
    dispatch: ReturnType<typeof useDispatch>,
    client: Client
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
        const patreonListRaw = localStorage.getItem('patreon_list');
        if (!patreonListRaw) {
            fetchPatreon(dispatch);
            return;
        }
        const patreonList: PatreonList = JSON.parse(patreonListRaw);
        const YoutubeList = await Promise.all(
            patreonList
                .map(patreon => patreon[patreon.id]?.youtubeId)
                .concat(
                    (
                        process.env.REACT_APP_YOUTUBERS_INCLUSIVE_OVERRIDE || ''
                    ).split(',')
                )
                .filter(id => typeof id === 'string' && id !== '')
                .map(async id => {
                    const res = await client.youtube.channels.list({
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
            payload: err.result?.error || err,
        });
    }
}
