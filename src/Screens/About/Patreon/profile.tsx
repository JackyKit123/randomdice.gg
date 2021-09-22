import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoadingScreen from 'Components/Loading';

import { fetchPatreon } from 'Firebase';
import { OPEN_POPUP, CLOSE_POPUP } from 'Redux/PopUp Overlay/types';
import PopUp from 'Components/PopUp';
import PageWrapper from 'Components/PageWrapper';
import useRootStateSelector from 'Redux';
import { Patreon } from 'types/database';

export default function PatreonProfile(): JSX.Element {
    const history = useHistory();
    const { name } = useParams<{ name: string }>();
    const dispatch = useDispatch();
    const { patreon_list: list, firebaseError: error } = useRootStateSelector(
        'fetchFirebaseReducer'
    );
    const [isPatreonPageOwner, setIsPatreonPageOwner] = useState(false);
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const user = firebase.auth().currentUser;

    useEffect(() => {
        if (list && user) {
            const patreon = list.find(
                patron =>
                    patron.id === user.uid &&
                    patron.name === name &&
                    patron.tier >= 2
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
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>Are you sure to want to submit your message?</p>
                {submitLoading ? <LoadingScreen /> : null}
                <button
                    type='button'
                    className='confirm'
                    onClick={async (): Promise<void> => {
                        const uid = firebase.auth().currentUser?.uid;
                        if (!uid) {
                            dispatch({ type: CLOSE_POPUP });
                        }
                        setSubmitLoading(true);
                        const listArr = (
                            await firebase
                                .database()
                                .ref(`/patreon_list`)
                                .once('value')
                        ).val();
                        const i = listArr.findIndex(
                            (patron: Patreon) => patron.id === uid
                        );
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
                        dispatch({ type: CLOSE_POPUP });
                    }}
                >
                    Yes
                </button>
            </PopUp>
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
                        onClick={(): void => {
                            dispatch({
                                type: OPEN_POPUP,
                                payload: 'confirm-submit',
                            });
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </div>
            ) : (
                <div className='message'>
                    {patreon[patreon.id]?.message ? (
                        ReactHtmlParser(
                            sanitize(patreon[patreon.id].message || '')
                        )
                    ) : (
                        <p>
                            {patreon.name} does not have a message to share yet.
                        </p>
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
