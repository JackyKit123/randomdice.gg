import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from 'Components/Dashboard';
import LoadingScreen from 'Components/Loading';
import PopUp from 'Components/PopUp';
import { CLOSE_POPUP, OPEN_POPUP } from 'Redux/PopUp Overlay/types';
import { WikiContent } from 'types/database';
import { fetchWiki } from 'Firebase';

export default function editBox(): JSX.Element {
    const dispatch = useDispatch();
    const selectRef = useRef(null as null | HTMLSelectElement);
    const database = firebase.database();
    const dbRef = database.ref('/wiki/box');
    const storage = firebase.storage();
    const [boxInfo, setBoxInfo] = useState<WikiContent['box']>();

    const initialState = {
        id: -1,
        name: '',
        img: '',
        from: '',
        contain: '',
    };
    const [activeEdit, setActiveEdit] = useState({ ...initialState });

    useEffect(() => {
        dbRef.once('value').then(snapshot => setBoxInfo(snapshot.val()));
    }, []);

    if (!boxInfo) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    const invalidName = activeEdit.name.length <= 0;
    const invalidImg = activeEdit.img.length <= 0;
    const invalidFrom = activeEdit.from.length <= 0;
    const invalidContain = activeEdit.contain.length <= 0;
    const invalidInput =
        invalidName || invalidImg || invalidFrom || invalidContain;

    const handleSubmit = async (): Promise<void> => {
        if (activeEdit) {
            const originalBox = boxInfo.find(box => box.id === activeEdit.id);
            if (/^data:image\/([a-zA-Z]*);base64,/.test(activeEdit.img)) {
                if (originalBox) {
                    await storage
                        .ref(`Box Images/${originalBox.name}`)
                        .delete();
                }
                await storage
                    .ref(`Box Images/${activeEdit.name}`)
                    .putString(activeEdit.img, 'data_url', {
                        cacheControl: 'public,max-age=31536000',
                    });
                const newUrl = await storage
                    .ref(`Box Images/${activeEdit.name}`)
                    .getDownloadURL();
                activeEdit.img = newUrl;
            } else if (originalBox && originalBox.name !== activeEdit.name) {
                const reader = new FileReader();
                const img = (
                    await axios.get(originalBox.img, {
                        responseType: 'blob',
                    })
                ).data;
                await storage.ref(`Box Images/${originalBox.name}`).delete();
                reader.readAsDataURL(img);
                reader.onloadend = async (): Promise<void> => {
                    const base64 = reader.result as string;
                    await storage
                        .ref(`Box Images/${activeEdit.name}`)
                        .putString(base64, 'data_url', {
                            cacheControl: 'public,max-age=31536000',
                        });
                    const newUrl = await storage
                        .ref(`Box Images/${activeEdit.name}`)
                        .getDownloadURL();
                    activeEdit.img = newUrl;
                    const result = boxInfo.map(box => {
                        if (box.id === activeEdit.id) {
                            return activeEdit;
                        }
                        return box;
                    });
                    database
                        .ref('/last_updated/wiki')
                        .set(new Date().toISOString());
                    dbRef.set(result);
                    fetchWiki(dispatch);
                    setBoxInfo(result);
                    setActiveEdit({ ...initialState });
                    if (selectRef.current) {
                        selectRef.current.value = '?';
                    }
                };
            }
            let updateBox = false;
            const result = boxInfo.map(box => {
                if (box.id === activeEdit.id) {
                    updateBox = true;
                    return activeEdit;
                }
                return box;
            });
            if (!updateBox) {
                result.push(activeEdit);
            }
            database.ref('/last_updated/wiki').set(new Date().toISOString());
            dbRef.set(result);
            fetchWiki(dispatch);
            setBoxInfo(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    const handleDelete = async (): Promise<void> => {
        const originalBox = boxInfo.find(box => box.id === activeEdit.id);
        if (originalBox) {
            await storage.ref(`Box Images/${originalBox.name}`).delete();
            const result = boxInfo.filter(box => box.id !== activeEdit.id);
            database.ref('/last_updated/wiki').set(new Date().toISOString());
            dbRef.set(result);
            fetchWiki(dispatch);
            setBoxInfo(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    return (
        <Dashboard className='box'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to update the information for this box?
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
                <p>Are you sure to want to delete this box?</p>
                <button
                    type='button'
                    className='confirm'
                    onClick={handleDelete}
                >
                    Yes
                </button>
            </PopUp>
            <h3>Update Box Information</h3>
            <label htmlFor='select-box'>
                Select A Box:
                <select
                    ref={selectRef}
                    name='select-box'
                    onChange={(evt): void => {
                        if (evt.target.value === '?') {
                            setActiveEdit({ ...initialState });
                        } else {
                            const foundBox = boxInfo.find(
                                box => box.name === evt.target.value
                            );
                            if (foundBox) {
                                setActiveEdit({ ...foundBox });
                            } else {
                                boxInfo.sort((a, b) => (a.id < b.id ? -1 : 1));
                                let newId = boxInfo.findIndex(
                                    (box, i) => box.id !== i
                                );
                                if (newId === -1) {
                                    newId = boxInfo.length;
                                }
                                const clone = { ...initialState };
                                clone.id = newId;
                                setActiveEdit(clone);
                            }
                        }
                    }}
                >
                    <option>?</option>
                    {boxInfo.map(box => (
                        <option key={box.name}>{box.name}</option>
                    ))}
                    <option>Add a New Box</option>
                </select>
            </label>
            {activeEdit.id < 0 ? null : (
                <>
                    <form onSubmit={(evt): void => evt.preventDefault()}>
                        <label htmlFor='box-name'>
                            Name:
                            <input
                                key={`box${activeEdit.id}-name`}
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
                                Box Name should not be empty.
                            </div>
                        ) : null}
                        <label htmlFor='box-image'>
                            Image:
                            <img src={activeEdit.img} alt='box' />
                            <input
                                key={`box${activeEdit.id}-img`}
                                type='file'
                                alt='box'
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
                                Please upload a box image in format.
                            </div>
                        ) : null}
                        <label htmlFor='box-from'>
                            Obtained from:
                            <input
                                key={`box${activeEdit.id}-from`}
                                className={invalidFrom ? 'invalid' : ''}
                                defaultValue={activeEdit.from}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.from = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        {invalidFrom ? (
                            <div className='invalid-warning'>
                                Box origin should not be empty.
                            </div>
                        ) : null}
                        <label htmlFor='box-contain'>
                            Contains:
                            <input
                                key={`box${activeEdit.id}-contain`}
                                className={invalidContain ? 'invalid' : ''}
                                defaultValue={activeEdit.contain}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.contain = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <span>
                            You can use the following text and convert the text
                            to image.
                        </span>
                        <span>
                            {
                                '{Gold} {Diamond} {Common Dice} {Rare Dice} {Unique Dice} {Legendary Dice} {Dice:Dice Name}'
                            }
                        </span>
                        {invalidContain ? (
                            <div className='invalid-warning'>
                                Box Reward should not be empty.
                            </div>
                        ) : null}
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
