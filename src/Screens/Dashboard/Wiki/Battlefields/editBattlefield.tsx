import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
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
import './battlefield.less';

export default function editBattlefield(): JSX.Element {
    const dispatch = useDispatch();
    const selectRef = useRef(null as null | HTMLSelectElement);
    const database = firebase.database();
    const dbRef = database.ref('/wiki/battlefield');
    const storage = firebase.storage();
    const [battlefieldInfo, setBattlefieldInfo] = useState<
        WikiContent['battlefield']
    >();

    const initialState = {
        id: -1,
        name: '',
        img: '',
        desc: '',
        buffName: '',
        buffValue: 0,
        buffUnit: '',
        buffCupValue: 0,
    };
    const [activeEdit, setActiveEdit] = useState({ ...initialState });

    useEffect(() => {
        dbRef
            .once('value')
            .then(snapshot => setBattlefieldInfo(snapshot.val() || []));
    }, []);

    if (!battlefieldInfo) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    const invalidName = activeEdit.name.length <= 0;
    const invalidImg = activeEdit.img.length <= 0;
    const invalidBuffName = activeEdit.buffName.length <= 0;
    const invalidInput = invalidName || invalidImg || invalidBuffName;

    const handleSubmit = async (): Promise<void> => {
        if (activeEdit) {
            const originalBattleField = battlefieldInfo.find(
                battlefield => battlefield.id === activeEdit.id
            );
            if (/^data:image\/([a-zA-Z]*);base64,/.test(activeEdit.img)) {
                if (originalBattleField) {
                    await storage
                        .ref(`Battlefield Images/${originalBattleField.name}`)
                        .delete();
                }
                await storage
                    .ref(`Battlefield Images/${activeEdit.name}`)
                    .putString(activeEdit.img, 'data_url', {
                        cacheControl: 'public,max-age=31536000',
                    });
                const newUrl = await storage
                    .ref(`Battlefield Images/${activeEdit.name}`)
                    .getDownloadURL();
                activeEdit.img = newUrl;
            } else if (
                originalBattleField &&
                originalBattleField.name !== activeEdit.name
            ) {
                const reader = new FileReader();
                const img = (
                    await axios.get(originalBattleField.img, {
                        responseType: 'blob',
                    })
                ).data;
                await storage
                    .ref(`Battlefield Images/${originalBattleField.name}`)
                    .delete();
                reader.readAsDataURL(img);
                reader.onloadend = async (): Promise<void> => {
                    const base64 = reader.result as string;
                    await storage
                        .ref(`Battlefield Images/${activeEdit.name}`)
                        .putString(base64, 'data_url', {
                            cacheControl: 'public,max-age=31536000',
                        });
                    const newUrl = await storage
                        .ref(`Battlefield Images/${activeEdit.name}`)
                        .getDownloadURL();
                    activeEdit.img = newUrl;
                    const result = battlefieldInfo.map(battlefield => {
                        if (battlefield.id === activeEdit.id) {
                            return activeEdit;
                        }
                        return battlefield;
                    });
                    dbRef.set(result);
                    setBattlefieldInfo(result);
                    setActiveEdit({ ...initialState });
                    if (selectRef.current) {
                        selectRef.current.value = '?';
                    }
                };
            }
            let updateBattlefield = false;
            const result = battlefieldInfo.map(battlefield => {
                if (battlefield.id === activeEdit.id) {
                    updateBattlefield = true;
                    return activeEdit;
                }
                return battlefield;
            });
            if (!updateBattlefield) {
                result.push(activeEdit);
            }
            database.ref('/last_updated/wiki').set(new Date().toISOString());
            dbRef.set(result);
            setBattlefieldInfo(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    const handleDelete = async (): Promise<void> => {
        const originalBattleField = battlefieldInfo.find(
            battlefield => battlefield.id === activeEdit.id
        );
        if (originalBattleField) {
            await storage
                .ref(`Battlefield Images/${originalBattleField.name}`)
                .delete();
            const result = battlefieldInfo.filter(
                battlefield => battlefield.id !== activeEdit.id
            );
            dbRef.set(result);
            setBattlefieldInfo(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    return (
        <Dashboard className='battlefield'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to update the information for this
                    battlefield?
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
                <p>Are you sure to want to delete this battlefield?</p>
                <button
                    type='button'
                    className='confirm'
                    onClick={handleDelete}
                >
                    Yes
                </button>
            </PopUp>
            <h3>Update Battlefield Information</h3>
            <label htmlFor='select-battlefield'>
                Select A Battlefield:
                <select
                    ref={selectRef}
                    name='select-battlefield'
                    onChange={(evt): void => {
                        if (evt.target.value === '?') {
                            setActiveEdit({ ...initialState });
                        } else {
                            const foundBattlefield = battlefieldInfo.find(
                                battlefield =>
                                    battlefield.name === evt.target.value
                            );
                            if (foundBattlefield) {
                                setActiveEdit({ ...foundBattlefield });
                            } else {
                                battlefieldInfo.sort((a, b) =>
                                    a.id < b.id ? -1 : 1
                                );
                                let newId = battlefieldInfo.findIndex(
                                    (battlefield, i) => battlefield.id !== i
                                );
                                if (newId === -1) {
                                    newId = battlefieldInfo.length;
                                }
                                const clone = { ...initialState };
                                clone.id = newId;
                                setActiveEdit(clone);
                            }
                        }
                    }}
                >
                    <option>?</option>
                    {battlefieldInfo.map(battlefield => (
                        <option key={battlefield.name}>
                            {battlefield.name}
                        </option>
                    ))}
                    <option>Add a New Battlefield</option>
                </select>
            </label>
            {activeEdit.id < 0 ? null : (
                <>
                    <form onSubmit={(evt): void => evt.preventDefault()}>
                        <label htmlFor='battlefield-name'>
                            Name:
                            <input
                                key={`battlefield${activeEdit.id}-name`}
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
                                Battlefield Name should not be empty.
                            </div>
                        ) : null}
                        <label htmlFor='battlefield-image'>
                            Image:
                            <img src={activeEdit.img} alt='battlefield' />
                            <input
                                key={`battlefield${activeEdit.id}-img`}
                                type='file'
                                alt='battlefield'
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
                                Please upload a battlefield image.
                            </div>
                        ) : null}
                        <label htmlFor='battlefield-buff-name'>
                            Buff Name:
                            <input
                                key={`battlefield${activeEdit.id}-buff-name`}
                                className={invalidBuffName ? 'invalid' : ''}
                                defaultValue={activeEdit.buffName}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.buffName = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        {invalidBuffName ? (
                            <div className='invalid-warning'>
                                Battlefield Buff Name should not be empty.
                            </div>
                        ) : null}
                        <label htmlFor='battlefield-buff-value'>
                            Buff Value:
                            <input
                                key={`battlefield${activeEdit.id}-buff-value`}
                                defaultValue={activeEdit.buffValue}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.buffValue = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='battlefield-buff-unit'>
                            Buff Unit:
                            <input
                                key={`battlefield${activeEdit.id}-buff-unit`}
                                defaultValue={activeEdit.buffUnit}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.buffUnit = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='battlefield-buff-value'>
                            Class Up Buff Value:
                            <input
                                key={`battlefield${activeEdit.id}-buff-classUp-value`}
                                defaultValue={activeEdit.buffCupValue}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.buffCupValue = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
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
