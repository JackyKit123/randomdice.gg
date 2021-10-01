import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Loading from '@components/Loading';
import { fetchPatreon } from 'misc/firebase';
import { popupContext } from '@components/PopUp';
import PageWrapper from '@components/PageWrapper';
import useRootStateSelector from '@redux';
import { Patreon } from 'types/database';

interface SubmittedNotificationProps {
  content: string;
  setEditing: Dispatch<SetStateAction<boolean>>;
}

function SubmittedNotification({
  content,
  setEditing,
}: SubmittedNotificationProps): JSX.Element {
  const dispatch = useDispatch();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { closePopup } = useContext(popupContext);

  return (
    <>
      <h3>Please Confirm</h3>
      <p>Are you sure to want to submit your message?</p>
      {submitLoading ? <Loading /> : null}
      <button
        type='button'
        className='confirm'
        onClick={async (): Promise<void> => {
          const uid = firebase.auth().currentUser?.uid;
          if (!uid) {
            closePopup();
          }
          setSubmitLoading(true);
          const listArr = (
            await firebase
              .database()
              .ref(`/patreon_list`)
              .once('value')
          ).val();
          const i = listArr.findIndex((patron: Patreon) => patron.id === uid);
          await firebase
            .database()
            .ref(`/patreon_list/${i}/${uid}/message`)
            .set(content);
          await firebase
            .database()
            .ref('/last_updated/patreon_list')
            .set(new Date().toISOString());
          fetchPatreon(dispatch);
          setEditing(false);
          setSubmitLoading(false);
          closePopup();
        }}
      >
        Yes
      </button>
    </>
  );
}

export default function PatreonProfile(): JSX.Element {
  const history = useHistory();
  const { name } = useParams<{ name: string }>();
  const { openPopup } = useContext(popupContext);
  const { patreon_list: list, firebaseError: error } = useRootStateSelector(
    'fetchFirebaseReducer'
  );
  const [isPatreonPageOwner, setIsPatreonPageOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState('');
  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (list && user) {
      const patreon = list.find(
        patron =>
          patron.id === user.uid && patron.name === name && patron.tier >= 2
      );
      setIsPatreonPageOwner(Boolean(patreon));
    }
  }, [list, user]);
  const patreon = list?.find(
    patron => patron.name === name && patron.tier >= 2
  );
  if (!patreon) {
    history.push('/about/patreon');
    return <></>;
  }

  return (
    <PageWrapper
      isContentReady={!!list.length}
      error={error}
      retryFn={fetchPatreon}
      title={`Patreon Supporter ${name}`}
      className='patreon-profile'
    >
      {isPatreonPageOwner ? (
        <button
          aria-label='edit paragraph'
          type='button'
          className='edit'
          onClick={(): void => setEditing(!editing)}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      ) : null}
      <h3>Message from {patreon.name}</h3>
      <figure className={patreon.img ? '' : 'no-icon'}>
        <img src={patreon.img} alt={`Icon of ${patreon.name}`} />
      </figure>
      {editing ? (
        <div className='editor-container'>
          <CKEditor
            editor={ClassicEditor}
            data={
              content ||
              patreon[patreon.id]?.message ||
              `<p>
                                    ${patreon.name} does not have a message to share yet.
                                </p>`
            }
            config={{
              toolbar: [
                'undo',
                'redo',
                '|',
                'bold',
                'italic',
                'numberedList',
                'bulletedList',
                '|',
                'link',
              ],
            }}
            onChange={(
              _: unknown,
              editor: {
                getData: () => string;
              }
            ): void => {
              setContent(editor.getData());
            }}
          />
          <button
            aria-label='submit'
            type='button'
            className='submit'
            onClick={(): void =>
              openPopup(
                <SubmittedNotification
                  content={content}
                  setEditing={setEditing}
                />
              )
            }
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      ) : (
        <div className='message'>
          {patreon[patreon.id]?.message ? (
            ReactHtmlParser(sanitize(patreon[patreon.id].message || ''))
          ) : (
            <p>{patreon.name} does not have a message to share yet.</p>
          )}
        </div>
      )}
      <button
        type='button'
        onClick={(): void => history.push('/about/patreon')}
      >
        Back to Patreon Page
      </button>
    </PageWrapper>
  );
}
