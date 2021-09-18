import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/app';
import Masonry from 'react-masonry-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import Linkify from 'linkifyjs/react';
import Main from 'Components/Main';
import Error from 'Components/Error';
import LoadingScreen from 'Components/Loading';
import { fetchYouTube } from 'Redux/Google API/fetchData';
import { CLEAR_ERRORS } from 'Redux/Google API/types';
import { RootState } from 'Redux/store';
import './yt.less';
import { Info, Patreon } from 'Redux/Fetch Firebase/Patreon List/types';
import { OPEN_POPUP } from 'Redux/PopUp Overlay/types';
import PopUp from 'Components/PopUp Overlay';

export default function YoutubeList(): JSX.Element {
    const dispatch = useDispatch();
    const selector = useSelector((state: RootState) => state);
    const [isT3Patreon, setIsT3Patreon] = useState<Info & Patreon>();
    const [channelID, setChannelID] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { client } = selector.initGAPIReducer;
    const ytList = selector.fetchGAPIyoutubeChannelsReducer.list;
    const patreonList = selector.fetchPatreonListReducer.list;
    const error =
        selector.fetchGAPIyoutubeChannelsReducer.error ||
        selector.fetchPatreonListReducer.error ||
        selector.initGAPIReducer.error;
    const user = firebase.auth().currentUser;
    useEffect(() => {
        if (patreonList && user) {
            const patreon = patreonList.find(
                patron => patron.id === user.uid && patron.tier >= 3
            );
            setIsT3Patreon(patreon);
        }
    }, [user, patreonList]);

    useEffect(() => {
        if (!client) {
            return;
        }
        fetchYouTube(dispatch, client);
    }, [patreonList, client]);

    let jsx;
    if (ytList.length && patreonList?.length) {
        jsx = (
            <>
                <p>
                    You will find links to some Random Dice Youtubers in this
                    page. We have 3000 daily visitors on this website, if you
                    are a Random Dice Youtuber and want to advertise your
                    Youtube channel, you can become a tier 3 patreon on our{' '}
                    <a
                        href='https://www.patreon.com/RandomDiceCommunityWebsite'
                        target='_blank'
                        rel='noreferrer noopener'
                    >
                        Patreon Page
                    </a>{' '}
                    then add your YouTube channel here.
                </p>

                {isT3Patreon && user ? (
                    <>
                        <PopUp popUpTarget='add-yt'>
                            <p>
                                Enter your Youtube Channel ID here:{' '}
                                <a
                                    href={`https://support.google.com/youtube/answer/3250431?hl=en#:~:text=Find%20your%20channel's%20user%20ID,Sign%20in%20to%20YouTube.&text=From%20the%20left%20Menu%2C%20select,channel's%20user%20and%20channel%20IDs.`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Where&apos;s my Channel ID?
                                </a>
                            </p>
                            <input
                                type='textbox'
                                placeholder='Channel ID'
                                defaultValue={
                                    isT3Patreon[isT3Patreon?.id].youtubeId
                                }
                                onChange={(evt): void =>
                                    setChannelID(evt.target.value)
                                }
                            />
                            {loading ? <LoadingScreen /> : null}
                            <button
                                type='button'
                                onClick={async (): Promise<void> => {
                                    setLoading(true);
                                    const i = patreonList.findIndex(
                                        (patron: Patreon) =>
                                            patron.id === user.uid
                                    );
                                    await firebase
                                        .database()
                                        .ref(
                                            `/patreon_list/${i}/${user.uid}/youtubeId`
                                        )
                                        .set(channelID);
                                    await firebase
                                        .database()
                                        .ref('/last_updated/patreon_list')
                                        .set(new Date().toISOString());
                                    if (client) {
                                        await fetchYouTube(dispatch, client);
                                    }
                                    setLoading(false);
                                }}
                            >
                                Submit
                            </button>
                        </PopUp>
                        <p>
                            Add your YouTube Channel to this page :{' '}
                            <button
                                type='button'
                                onClick={(): void => {
                                    dispatch({
                                        type: OPEN_POPUP,
                                        payload: 'add-yt',
                                    });
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </p>
                    </>
                ) : null}
                <hr className='divisor' />
                <Masonry className='masonry'>
                    {ytList.map(info => (
                        <a
                            className='card'
                            key={info.id}
                            href={`https://www.youtube.com/channel/${info.id}`}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <div className='profile'>
                                <span>{info.title}</span>
                                <figure>
                                    <img
                                        src={info.thumbnails}
                                        alt='thumbnails'
                                    />
                                </figure>
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Views</td>
                                        <td>
                                            <FontAwesomeIcon icon={faEye} />
                                        </td>
                                        <td>{info.viewCount}</td>
                                    </tr>
                                    <tr>
                                        <td>Subscribers</td>
                                        <td>
                                            <FontAwesomeIcon icon={faUsers} />
                                        </td>
                                        <td>{info.subscriberCount}</td>
                                    </tr>
                                    <tr>
                                        <td>Videos</td>
                                        <td>
                                            <FontAwesomeIcon icon={faVideo} />
                                        </td>
                                        <td>{info.videoCount}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr className='divisor' />
                            <Linkify
                                tagName='p'
                                options={{
                                    nl2br: true,
                                    attributes: {
                                        rel: 'nofollow noreferrer noopener',
                                    },
                                    target: {
                                        url: '_blank',
                                    },
                                }}
                            >
                                {info.description}
                            </Linkify>
                        </a>
                    ))}
                </Masonry>
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    window.location.reload();
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title='Youtubers' className='youtube'>
            <Helmet>
                <title>Random Dice Youtubers</title>
            </Helmet>
            {jsx}
        </Main>
    );
}
