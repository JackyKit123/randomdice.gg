import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import Masonry from 'react-masonry-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import Linkify from 'linkifyjs/react';
import LoadingScreen from 'components/Loading';
import { fetchYouTube } from '@redux/Google API/fetchData';
import useRootStateSelector from '@redux';
import { popupContext } from 'components/PopUp';
import PageWrapper from 'components/PageWrapper';
import { Info, Patreon } from 'types/database';
import { Client } from '@redux/Google API/Client/types';

interface PopupProps {
  user: firebase.User;
  youtubeId: string;
  client: Client;
}

function AddYouTubeChannelPopup({
  user,
  youtubeId,
  client,
}: PopupProps): JSX.Element {
  const dispatch = useDispatch();
  const [channelID, setChannelID] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { patreon_list: patreonList } = useRootStateSelector(
    'fetchFirebaseReducer'
  );

  return (
    <div className='youtube'>
      {' '}
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
        defaultValue={youtubeId}
        onChange={(evt): void => setChannelID(evt.target.value)}
      />
      {loading ? <LoadingScreen /> : null}
      <button
        type='button'
        onClick={async (): Promise<void> => {
          setLoading(true);
          const i = patreonList.findIndex(
            (patron: Patreon) => patron.id === user.uid
          );
          await firebase
            .database()
            .ref(`/patreon_list/${i}/${user.uid}/youtubeId`)
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
    </div>
  );
}

export default function YoutubeList(): JSX.Element {
  const dispatch = useDispatch();
  const { openPopup } = useContext(popupContext);
  const youtubeApiReucer = useRootStateSelector(
    'fetchGAPIyoutubeChannelsReducer'
  );
  const googleApiReducer = useRootStateSelector('initGAPIReducer');
  const firebaseDatabaseReducer = useRootStateSelector('fetchFirebaseReducer');
  const [isT3Patreon, setIsT3Patreon] = useState<Info & Patreon>();
  const { client } = googleApiReducer;
  const { list: ytList } = youtubeApiReucer;
  const { patreon_list: patreonList } = firebaseDatabaseReducer;
  const error = firebaseDatabaseReducer.firebaseError || googleApiReducer.error;
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

  const youtubeId = isT3Patreon?.[isT3Patreon?.id]?.youtubeId;

  return (
    <PageWrapper
      isContentReady={!!(ytList.length && patreonList.length)}
      error={error}
      title='Youtubers'
      className='youtube'
    >
      <p>
        You will find links to some Random Dice Youtubers in this page. We have
        3000 daily visitors on this website, if you are a Random Dice Youtuber
        and want to advertise your Youtube channel, you can become a tier 3
        patreon on our{' '}
        <a
          href='https://www.patreon.com/RandomDiceCommunityWebsite'
          target='_blank'
          rel='noreferrer noopener'
        >
          Patreon Page
        </a>{' '}
        then add your YouTube channel here.
      </p>

      {client && youtubeId && user && (
        <>
          <p>
            Add your YouTube Channel to this page :{' '}
            <button
              type='button'
              onClick={(): void =>
                openPopup(
                  <AddYouTubeChannelPopup
                    client={client}
                    youtubeId={youtubeId}
                    user={user}
                  />
                )
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </p>
        </>
      )}
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
                <img src={info.thumbnails} alt='thumbnails' />
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
    </PageWrapper>
  );
}
