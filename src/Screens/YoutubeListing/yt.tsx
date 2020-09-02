import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import { fetchYouTube } from '../../Misc/Redux Storage/Google API/fetchData';
import { CLEAR_ERRORS } from '../../Misc/Redux Storage/Google API/Youtube Channels/types';
import { RootState } from '../../Misc/Redux Storage/store';
import './yt.less';
import {
    Info,
    Patreon,
} from '../../Misc/Redux Storage/Fetch Firebase/Patreon List/types';
import { OPEN_POPUP } from '../../Misc/Redux Storage/PopUp Overlay/types';
import PopUp from '../../Components/PopUp Overlay/popup';

export default function YoutubeList(): JSX.Element {
    const dispatch = useDispatch();
    const selector = useSelector((state: RootState) => state);
    const [isT3Patreon, setIsT3Patreon] = useState<Info & Patreon>();
    const [channelID, setChannelID] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const ytList = selector.fetchGAPIyoutubeChannelsReducer.list;
    const patreonList = selector.fetchPatreonListReducer.list;
    const error =
        selector.fetchGAPIyoutubeChannelsReducer.error ||
        selector.fetchPatreonListReducer.error;
    const user = firebase.auth().currentUser;
    useEffect(() => {
        if (patreonList && user) {
            const patreon = patreonList.find(
                patron => patron.id === user.uid && patron.tier >= 3
            );
            setIsT3Patreon(patreon);
        }
    }, [user, patreonList]);

    let jsx;
    if (ytList.length && patreonList?.length) {
        jsx = (
            <>
                <p>
                    You will find links to some Random Dice Youtubers in this
                    page. We have 3000 daily visitors on this website, if you
                    are a Random Dice Youtuber and want to advertise your
                    Youtube channel, you can become a tier 3 patreon on our{' '}
                    {/* <a
                        href='https://www.patreon.com/RandomDiceCommunityWebsite'
                        target='_blank'
                        rel='noreferrer noopener'
                    > */}
                    Patreon Page {/* </a>{' '} */}
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
                                            `/patreon_list/${i}/${user.uid}/message`
                                        )
                                        .set(channelID);
                                    await firebase
                                        .database()
                                        .ref('/last_updated/patreon_list')
                                        .set(new Date().toISOString());

                                    await fetchYouTube(dispatch);
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
                {ytList.map(info => (
                    <div className='block' key={info.id}>
                        <hr className='divisor' />
                        <div>
                            <a
                                href={`https://www.youtube.com/channel/${info.id}`}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {info.title}
                            </a>
                            <a
                                href={`https://www.youtube.com/channel/${info.id}`}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <figure>
                                    <img
                                        src={info.thumbnails}
                                        alt='thumbnails'
                                    />
                                </figure>
                            </a>
                        </div>

                        <p>{info.description}</p>
                        <a
                            href={`https://www.youtube.com/channel/${info.id}`}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <figure>
                                <img
                                    className='desktop'
                                    src={info.bannerImg.default}
                                    alt='banner'
                                />
                                <img
                                    className='mobile'
                                    src={
                                        info.bannerImg.mobile ||
                                        info.bannerImg.default
                                    }
                                    alt='banner'
                                />
                            </figure>
                        </a>
                    </div>
                ))}
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    fetchYouTube(dispatch);
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
