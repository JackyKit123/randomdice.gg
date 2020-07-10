import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '../../../../Components/Dashboard/dashboard';
import LoadingScreen from '../../../../Components/Loading/loading';
import PopUp from '../../../../Components/PopUp Overlay/popup';
import {
    CLOSE_POPUP,
    OPEN_POPUP,
} from '../../../../Misc/Redux Storage/PopUp Overlay/types';
import { WikiContent } from '../../../../Misc/Redux Storage/Fetch Firebase/Wiki/types';
import './tips.less';

export default function editTips(): JSX.Element {
    const dispatch = useDispatch();
    const selectRef = useRef(null as null | HTMLSelectElement);
    const database = firebase.database();
    const dbRef = database.ref('/wiki/tips');
    const storage = firebase.storage();
    const [tips, setTips] = useState<WikiContent['tips']>();

    const initialState = {
        id: -1,
        img: '',
        desc: '',
    };
    const [activeEdit, setActiveEdit] = useState({ ...initialState });

    useEffect(() => {
        dbRef.once('value').then(snapshot => setTips(snapshot.val()));
    }, []);

    if (!tips) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    const invalidImg = activeEdit.img.length <= 0;
    const invalidInput = invalidImg;

    const handleSubmit = async (): Promise<void> => {
        if (activeEdit) {
            if (/^data:image\/png;base64,/.test(activeEdit.img)) {
                await storage
                    .ref(`Tip Images/${activeEdit.id}.png`)
                    .putString(activeEdit.img, 'data_url', {
                        cacheControl: 'public,max-age=4000',
                    });
                const newUrl = await storage
                    .ref(`Tip Images/${activeEdit.id}.png`)
                    .getDownloadURL();
                activeEdit.img = newUrl;
            }
            let updateTips = false;
            const result = tips.map(tip => {
                if (tip.id === activeEdit.id) {
                    updateTips = true;
                    return activeEdit;
                }
                return tip;
            });
            if (!updateTips) {
                result.push(activeEdit);
            }
            database.ref('/wiki').set(new Date().toISOString());
            dbRef.set(result);
            setTips(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    const handleDelete = async (): Promise<void> => {
        const originalTips = tips.find(tip => tip.id === activeEdit.id);
        if (originalTips) {
            await storage.ref(`Tip Images/${originalTips.id}.png`).delete();
            const result = tips.filter(tip => tip.id !== activeEdit.id);
            database.ref('/wiki').set(new Date().toISOString());
            dbRef.set(result);
            setTips(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    return (
        <Dashboard className='tips'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to update the information for this
                    tips?
                </p>
                <button
                    type='button'
                    className='confirm'
                    onClick={handleSubmit}
                >
                    Yes
                </button>
            </PopUp>
            <PopUp popUpTarget='confirm-delete'>
                <h3>Please Confirm</h3>
                <p>Are you sure to want to delete this tips?</p>
                <button
                    type='button'
                    className='confirm'
                    onClick={handleDelete}
                >
                    Yes
                </button>
            </PopUp>
            <h3>Update Tips Information</h3>
            <label htmlFor='select-tips'>
                Select A Tips:
                <select
                    ref={selectRef}
                    id='select-tips'
                    onChange={(evt): void => {
                        if (evt.target.value === '?') {
                            setActiveEdit({ ...initialState });
                        } else {
                            const foundTips = tips.find(
                                tip => tip.id === Number(evt.target.value)
                            );
                            if (foundTips) {
                                setActiveEdit({ ...foundTips });
                            } else {
                                tips.sort((a, b) => (a.id < b.id ? -1 : 1));
                                let newId = tips.findIndex(
                                    (tip, i) => tip.id !== i
                                );
                                if (newId === -1) {
                                    newId = tips.length;
                                }
                                const clone = { ...initialState };
                                clone.id = newId;
                                setActiveEdit(clone);
                            }
                        }
                    }}
                >
                    <option>?</option>
                    {tips.map(tip => (
                        <option key={tip.id} value={tip.id}>
                            Tip #{tip.id + 1}
                        </option>
                    ))}
                    <option>Add a New Tip</option>
                </select>
            </label>
            {activeEdit.id < 0 ? null : (
                <>
                    <form onSubmit={(evt): void => evt.preventDefault()}>
                        <label htmlFor='tips-image'>
                            Image:
                            <input
                                key={`tips${activeEdit.id}-img`}
                                type='file'
                                alt='tips'
                                accept='image/png'
                                className={invalidImg ? 'invalid' : ''}
                                onChange={(evt): void => {
                                    if (evt.target.files) {
                                        const reader = new FileReader();
                                        const file = evt.target.files[0];
                                        reader.readAsDataURL(file);
                                        reader.onloadend = (): void => {
                                            activeEdit.img = reader.result as string;
                                            setActiveEdit({ ...activeEdit });
                                        };
                                    }
                                }}
                            />
                        </label>
                        <figure className='preview'>
                            <img src={activeEdit.img} alt='tips' />
                        </figure>
                        {invalidImg ? (
                            <div className='invalid-warning'>
                                Please upload a tips image in .png format.
                            </div>
                        ) : null}
                        <CKEditor
                            editor={ClassicEditor}
                            data={activeEdit.desc}
                            config={{
                                removePlugins: ['Heading'],
                                toolbar: [
                                    'undo',
                                    'redo',
                                    '|',
                                    'bold',
                                    'italic',
                                    '|',
                                    'link',
                                ],
                            }}
                            onBlur={(
                                _: unknown,
                                editor: {
                                    getData: () => string;
                                }
                            ): void => {
                                activeEdit.desc = editor.getData();
                                setActiveEdit({
                                    ...activeEdit,
                                });
                            }}
                        />
                    </form>
                    <hr className='divisor' />
                    <button
                        disabled={invalidInput}
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
                    <button
                        disabled={invalidInput}
                        type='button'
                        className='submit'
                        onClick={(): void => {
                            dispatch({
                                type: OPEN_POPUP,
                                payload: 'confirm-delete',
                            });
                        }}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </>
            )}
        </Dashboard>
    );
}
