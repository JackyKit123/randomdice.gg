import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '../../../../Components/Dashboard/dashboard';
import LoadingScreen from '../../../../Components/Loading/loading';
import PopUp from '../../../../Components/PopUp Overlay/popup';
import {
    OPEN_POPUP,
    CLOSE_POPUP,
} from '../../../../Misc/Redux Storage/PopUp Overlay/types';
import { WikiContent } from '../../../../Misc/Redux Storage/Fetch Firebase/Wiki/types';

export default function editPatchNote(): JSX.Element {
    const dispatch = useDispatch();
    const database = firebase.database();
    const dbRef = database.ref('/wiki/patch_note');
    const [content, setContent] = useState<WikiContent['patch_note']>();

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
        <Dashboard className='intro'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>Are you sure to want to submit the Patch Note?</p>
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        database
                            .ref('/last_updated/wiki')
                            .set(new Date().toISOString());
                        dbRef.set(content);
                        dispatch({ type: CLOSE_POPUP });
                    }}
                >
                    Yes
                </button>
            </PopUp>
            <h3>Update Patch Note</h3>
            <CKEditor
                editor={ClassicEditor}
                data={content}
                config={{
                    heading: {
                        options: [
                            {
                                model: 'paragraph',
                                title: 'Paragraph',
                                class: 'content p',
                            },
                            {
                                model: 'heading3',
                                view: 'h3',
                                title: 'Heading 3',
                                class: 'content h3',
                            },
                            {
                                model: 'heading4',
                                view: 'h4',
                                title: 'Heading 4',
                                class: 'content h4',
                            },
                        ],
                    },
                    toolbar: [
                        'heading',
                        '|',
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
