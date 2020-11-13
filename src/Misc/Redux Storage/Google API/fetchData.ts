import { useDispatch } from 'react-redux';
import { fetchPatreon } from '../../Firebase/fetchData';
import { PatreonList } from '../Fetch Firebase/Patreon List/types';
import { FETCH_GOOGLE_API_FAIL } from './types';
import {
    FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS,
    YouTubeInfo,
} from './Youtube Channels/types';
import { Client } from './Client/types';
import validateLocalstorage from '../../Firebase/validateLocalstorage';

// eslint-disable-next-line import/prefer-default-export
export async function fetchYouTube(
    dispatch: ReturnType<typeof useDispatch>,
    client: Client
): Promise<void> {
    const localCache = validateLocalstorage('YoutubeChannels');
    if (localCache) {
        dispatch({
            type: FETCH_GAPI_YOUTUBE_CHANNEL_SUCCESS,
            payload: localCache,
        });
    }

    try {
        const patreonListRaw = localStorage.getItem('patreon_list');
        if (!patreonListRaw) {
            fetchPatreon(dispatch);
            return;
        }
        const patreonList: PatreonList = JSON.parse(patreonListRaw);
        const extraIds = (
            process.env.REACT_APP_YOUTUBERS_INCLUSIVE_OVERRIDE || ''
        ).split(',');
        const ids = await Promise.all(
            patreonList
                .map(patreon => patreon[patreon.id]?.youtubeId)
                .concat(extraIds)
                .filter(id => typeof id === 'string' && id !== '')
        );
        const res = await client.youtube.channels.list({
            part: 'statistics, snippet',
            id: ids,
        });
        const YoutubeList = (res.result.items.map(
            (channel: {
                id: string;
                statistics: {
                    viewCount: bigint;
                    subscriberCount: bigint;
                    hiddenSubscriberCount: boolean;
                    videoCount: bigint;
                };
                snippet: {
                    title: string;
                    description: string;
                    thumbnails: {
                        default: {
                            url: string;
                        };
                    };
                };
            }) => {
                return {
                    id: channel.id,
                    videoCount: channel.statistics.videoCount,
                    subscriberCount: channel.statistics.subscriberCount,
                    viewCount: channel.statistics.viewCount,
                    title: channel.snippet.title,
                    description: channel.snippet.description,
                    thumbnails: channel.snippet.thumbnails.default.url,
                };
            }
        ) as YouTubeInfo[]).sort(
            (a, b) =>
                Number(extraIds.includes(a.id)) -
                Number(extraIds.includes(b.id))
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
