import React, { useState, useEffect, Fragment } from 'react';
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
import MyUploadAdapter from '../../../Misc/ckeditorUploadAdapter';

export default function editPatchNote(): JSX.Element {
    const dispatch = useDispatch();
    const database = firebase.database();
    const dbRef = database.ref('/news');
    const [content, setContent] = useState<{ game: string; website: string }>();

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
            {['Game', 'Website'].map(type => (
                <Fragment key={type}>
                    <h3>Update {type} News</h3>
                    <CKEditor
                        editor={ClassicEditor}
                        onInit={(editor: {
                            plugins: {
                                get(
                                    arg: 'FileRepository'
                                ): {
                                    createUploadAdapter(loader: {
                                        file: Promise<File>;
                                    }): void;
                                };
                            };
                        }): void => {
                            // eslint-disable-next-line no-param-reassign
                            editor.plugins.get(
                                'FileRepository'
                            ).createUploadAdapter = (loader): MyUploadAdapter =>
                                new MyUploadAdapter(loader);
                        }}
                        data={content[type.toLowerCase() as 'game' | 'website']}
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
                                '|',
                                'imageUpload',
                                'imageTextAlternative',
                                'mediaembed',
                            ],
                        }}
                        onBlur={(
                            _: unknown,
                            editor: {
                                getData: () => string;
                            }
                        ): void => {
                            content[
                                type.toLowerCase() as 'game' | 'website'
                            ] = editor.getData();
                            setContent({ ...content });
                        }}
                    />
                </Fragment>
            ))}
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
