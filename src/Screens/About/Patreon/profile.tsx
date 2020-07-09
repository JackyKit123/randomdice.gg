import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchPatreon } from '../../../Misc/Firebase/fetchData';
import './patreon.less';
import { RootState } from '../../../Misc/Redux Storage/store';
import {
    OPEN_POPUP,
    CLOSE_POPUP,
} from '../../../Misc/Redux Storage/PopUp Overlay/types';
import PopUp from '../../../Components/PopUp Overlay/popup';
import { Patreon } from '../../../Misc/Redux Storage/Fetch Firebase/Patreon List/types';

export default function PatreonProfile(): JSX.Element {
    const history = useHistory();
    const { name } = useParams();
    const dispatch = useDispatch();
    const { list, error } = useSelector(
        (state: RootState) => state.fetchPatreonListReducer
    );
    const [isPatreonPageOwner, setIsPatreonPageOwner] = useState(false);
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (list && user) {
            const patreon = list.find(
                patron => patron.id === user.uid && patron.tier >= 2
            );
            setIsPatreonPageOwner(Boolean(patreon));
        }
    }, [list]);

    let jsx;
    if (list) {
        const patreon = list.find(
            patron => patron.name === name && patron.tier >= 2
        );
        if (!patreon) {
            history.push('/about/patreon');
        } else {
            jsx = (
                <>
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
                            type='button'
                            className='edit'
                            onClick={(): void => setEditing(!editing)}
                        >
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                    ) : null}
                    <h3>Message from {patreon.name}</h3>
                    <figure className={patreon.img ? '' : 'no-icon'}>
                        <img
                            src={patreon.img}
                            alt={`Icon of ${patreon.name}`}
                        />
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
                                    sanitize(patreon[patreon.id].message)
                                )
                            ) : (
                                <p>
                                    {patreon.name} does not have a message to
                                    share yet.
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
                </>
            );
        }
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    fetchPatreon(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title={`Patreon Supporter ${name}`} className='patreon-profile'>
            {jsx}
        </Main>
    );
}
