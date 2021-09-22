import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase/app';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from 'Components/Dashboard';
import LoadingScreen from 'Components/Loading';
import PopUp from 'Components/PopUp';
import { CLOSE_POPUP, OPEN_POPUP } from 'Redux/PopUp Overlay/types';
import { WikiContent } from 'types/database';
import { fetchWiki } from 'Firebase';

export default function editBoss(): JSX.Element {
    const dispatch = useDispatch();
    const selectRef = useRef(null as null | HTMLSelectElement);
    const database = firebase.database();
    const dbRef = database.ref('/wiki/boss');
    const storage = firebase.storage();
    const [bossInfo, setBossInfo] = useState<WikiContent['boss']>();

    const initialState = {
        id: -1,
        name: '',
        img: '',
        desc: '',
    };
    const [activeEdit, setActiveEdit] = useState({ ...initialState });

    useEffect(() => {
        dbRef.once('value').then(snapshot => setBossInfo(snapshot.val()));
    }, []);

    if (!bossInfo) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    const invalidName = activeEdit.name.length <= 0;
    const invalidImg = activeEdit.img.length <= 0;
    const invalidInput = invalidName || invalidImg;

    const handleSubmit = async (): Promise<void> => {
        if (activeEdit) {
            const originalBoss = bossInfo.find(
                boss => boss.id === activeEdit.id
            );
            if (/^data:image\/([a-zA-Z]*);base64,/.test(activeEdit.img)) {
                if (originalBoss) {
                    await storage
                        .ref(`Boss Images/${originalBoss.name}`)
                        .delete();
                }
                await storage
                    .ref(`Boss Images/${activeEdit.name}`)
                    .putString(activeEdit.img, 'data_url', {
                        cacheControl: 'public,max-age=31536000',
                    });
                const newUrl = await storage
                    .ref(`Boss Images/${activeEdit.name}`)
                    .getDownloadURL();
                activeEdit.img = newUrl;
            } else if (originalBoss && originalBoss.name !== activeEdit.name) {
                const reader = new FileReader();
                const img = (
                    await axios.get(originalBoss.img, {
                        responseType: 'blob',
                    })
                ).data;
                await storage.ref(`Boss Images/${originalBoss.name}`).delete();
                reader.readAsDataURL(img);
                reader.onloadend = async (): Promise<void> => {
                    const base64 = reader.result as string;
                    await storage
                        .ref(`Boss Images/${activeEdit.name}`)
                        .putString(base64, 'data_url', {
                            cacheControl: 'public,max-age=31536000',
                        });
                    const newUrl = await storage
                        .ref(`Boss Images/${activeEdit.name}`)
                        .getDownloadURL();
                    activeEdit.img = newUrl;
                    const result = bossInfo.map(boss => {
                        if (boss.id === activeEdit.id) {
                            return activeEdit;
                        }
                        return boss;
                    });
                    dbRef.set(result);
                    fetchWiki(dispatch);
                    setBossInfo(result);
                    setActiveEdit({ ...initialState });
                    if (selectRef.current) {
                        selectRef.current.value = '?';
                    }
                };
            }
            let updateBoss = false;
            const result = bossInfo.map(boss => {
                if (boss.id === activeEdit.id) {
                    updateBoss = true;
                    return activeEdit;
                }
                return boss;
            });
            if (!updateBoss) {
                result.push(activeEdit);
            }
            database.ref('/last_updated/wiki').set(new Date().toISOString());
            dbRef.set(result);
            fetchWiki(dispatch);
            setBossInfo(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    const handleDelete = async (): Promise<void> => {
        const originalBoss = bossInfo.find(boss => boss.id === activeEdit.id);
        if (originalBoss) {
            await storage.ref(`Boss Images/${originalBoss.name}`).delete();
            const result = bossInfo.filter(boss => boss.id !== activeEdit.id);
            dbRef.set(result);
            fetchWiki(dispatch);
            setBossInfo(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    return (
        <Dashboard className='boss'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to update the information for this
                    boss?
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
                <p>Are you sure to want to delete this boss?</p>
                <button
                    type='button'
                    className='confirm'
                    onClick={handleDelete}
                >
                    Yes
                </button>
            </PopUp>
            <h3>Update Boss Information</h3>
            <label htmlFor='select-boss'>
                Select A Boss:
                <select
                    ref={selectRef}
                    name='select-boss'
                    onChange={(evt): void => {
                        if (evt.target.value === '?') {
                            setActiveEdit({ ...initialState });
                        } else {
                            const foundBoss = bossInfo.find(
                                boss => boss.name === evt.target.value
                            );
                            if (foundBoss) {
                                setActiveEdit({ ...foundBoss });
                            } else {
                                bossInfo.sort((a, b) => (a.id < b.id ? -1 : 1));
                                let newId = bossInfo.findIndex(
                                    (boss, i) => boss.id !== i
                                );
                                if (newId === -1) {
                                    newId = bossInfo.length;
                                }
                                const clone = { ...initialState };
                                clone.id = newId;
                                setActiveEdit(clone);
                            }
                        }
                    }}
                >
                    <option>?</option>
                    {bossInfo.map(boss => (
                        <option key={boss.name}>{boss.name}</option>
                    ))}
                    <option>Add a New Boss</option>
                </select>
            </label>
            {activeEdit.id < 0 ? null : (
                <>
                    <form onSubmit={(evt): void => evt.preventDefault()}>
                        <label htmlFor='boss-name'>
                            Name:
                            <input
                                key={`boss${activeEdit.id}-name`}
                                className={invalidName ? 'invalid' : ''}
                                defaultValue={activeEdit.name}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.name = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        {invalidName ? (
                            <div className='invalid-warning'>
                                Boss Name should not be empty.
                            </div>
                        ) : null}
                        <label htmlFor='boss-image'>
                            Image:
                            <img src={activeEdit.img} alt='boss' />
                            <input
                                key={`boss${activeEdit.id}-img`}
                                type='file'
                                alt='boss'
                                accept='image/*'
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
                        {invalidImg ? (
                            <div className='invalid-warning'>
                                Please upload a boss image in format.
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
