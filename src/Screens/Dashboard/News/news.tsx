import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '../../../Components/Dashboard/dashboard';
import LoadingScreen from '../../../Components/Loading/loading';
import PopUp from '../../../Components/PopUp Overlay/popup';
import {
    OPEN_POPUP,
    CLOSE_POPUP,
} from '../../../Misc/Redux Storage/PopUp Overlay/types';
import './news.less';

export default function editPatchNote(): JSX.Element {
    const dispatch = useDispatch();
    const database = firebase.database();
    const dbRef = database.ref('/news');
    const [content, setContent] = useState<string>();

    useEffect(() => {
        dbRef.once('value').then(snapshot => setContent(snapshot.val()));
    }, []);

    if (!content) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    return (
        <Dashboard className='news'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>Are you sure to want to update the news?</p>
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        database
                            .ref('/last_updated/news')
                            .set(new Date().toISOString());
                        dbRef.set(content);
                        dispatch({ type: CLOSE_POPUP });
                    }}
                >
                    Yes
                </button>
            </PopUp>
            <h3>Update News</h3>
            <CKEditor
                editor={ClassicEditor}
                data={content}
                config={{
                    removePlugins: ['heading'],
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
                onBlur={(
                    _: unknown,
                    editor: {
                        getData: () => string;
                    }
                ): void => setContent(editor.getData())}
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
        </Dashboard>
    );
}
