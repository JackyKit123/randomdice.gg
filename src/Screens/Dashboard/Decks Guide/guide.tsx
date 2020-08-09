import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPencilAlt,
    faTrashAlt,
    faCheck,
    faPlusCircle,
    faUndo,
} from '@fortawesome/free-solid-svg-icons';
import Dashboard from '../../../Components/Dashboard/dashboard';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import {
    DeckGuide,
    DecksGuide,
} from '../../../Misc/Redux Storage/Fetch Firebase/Decks Guide/types';
import { RootState } from '../../../Misc/Redux Storage/store';
import './guide.less';
import PopUp from '../../../Components/PopUp Overlay/popup';
import {
    OPEN_POPUP,
    CLOSE_POPUP,
} from '../../../Misc/Redux Storage/PopUp Overlay/types';

export default function updateDecksGuide(): JSX.Element {
    const dispatch = useDispatch();
    const database = firebase.database();
    const dbRef = database.ref('/decks_guide');
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const [guides, setGuides] = useState<DecksGuide>();
    const [activeEdit, setActiveEdit] = useState<DeckGuide>();
    const [guideToDelete, setGuideToDelete] = useState<number>();
    const [invalidGuideName, setInvalidGuideName] = useState(false);

    useEffect(() => {
        dbRef.once('value').then(snapshot => setGuides(snapshot.val()));
    }, []);

    if (!guides || !dices) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    return (
        <Dashboard className='decks-guide'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>Are you sure to want to submit this deck guide?</p>
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        if (activeEdit) {
                            const clone = [...guides];
                            clone.sort((a, b) => (a.id > b.id ? 1 : -1));
                            const i = clone.findIndex(
                                guide => guide.id === activeEdit?.id
                            );
                            if (i === -1) {
                                clone.push(activeEdit);
                            } else {
                                clone[i] = activeEdit;
                            }
                            setGuides(clone);
                            database
                                .ref('/last_updated/decks_guide')
                                .set(new Date().toISOString());
                            dbRef.set(clone);
                            setActiveEdit(undefined);
                            dispatch({ type: CLOSE_POPUP });
                        }
                    }}
                >
                    Yes
                </button>
            </PopUp>
            <PopUp popUpTarget='confirm-discard'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to discard the changes your made and go
                    back?
                </p>
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        if (activeEdit) {
                            setActiveEdit(undefined);
                            dispatch({ type: CLOSE_POPUP });
                        }
                    }}
                >
                    Yes
                </button>
            </PopUp>
            <PopUp popUpTarget='confirm-delete'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to delete this guide? The action is
                    irreversible!
                </p>
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        guides.splice(guideToDelete as number, 1);
                        setGuideToDelete(undefined);
                        setGuides([...guides]);
                        database
                            .ref('/last_updated/decks_guide')
                            .set(new Date().toISOString());
                        dbRef.set([...guides]);
                        dispatch({ type: CLOSE_POPUP });
                    }}
                >
                    Yes
                </button>
            </PopUp>
            <p>
                To update a written deck guide, press the pencil button to
                navigate into the editor screen, once the you can update the
                deck of the guide. Once you are done, hit save and the deck
                guide will immediately go live.
            </p>
            {activeEdit ? null : (
                <label htmlFor='add-guide'>
                    Add a Deck Guide :{' '}
                    <button
                        type='button'
                        onClick={(): void => {
                            const clone = [...guides];
                            clone.sort((a, b) => (a.id > b.id ? 1 : -1));
                            let newId = clone.findIndex(
                                (guide, i) => guide.id !== i
                            );
                            if (newId === -1) {
                                newId = clone.length;
                            }
                            setActiveEdit({
                                id: newId,
                                name: '',
                                diceList: [Array(5).fill('?')],
                                guide: '',
                            });
                        }}
                    >
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </button>
                </label>
            )}
            <table>
                <tbody>
                    {activeEdit ? (
                        <>
                            {activeEdit.diceList.map((dicelist, i, arr) => (
                                <tr
                                    className='dice-container'
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    key={`dice-container-${i}`}
                                >
                                    {i === 0 ? (
                                        <td rowSpan={arr.length + 1}>
                                            <input
                                                type='textbox'
                                                className={
                                                    invalidGuideName
                                                        ? 'invalid'
                                                        : ''
                                                }
                                                defaultValue={activeEdit.name}
                                                onChange={(evt): void => {
                                                    if (
                                                        /(;|\/|\?|:|@|=|&)/.test(
                                                            evt.target.value
                                                        )
                                                    ) {
                                                        setInvalidGuideName(
                                                            true
                                                        );
                                                    } else {
                                                        if (invalidGuideName) {
                                                            setInvalidGuideName(
                                                                false
                                                            );
                                                        }
                                                        activeEdit.name =
                                                            evt.target.value;

                                                        setActiveEdit({
                                                            ...activeEdit,
                                                        });
                                                    }
                                                }}
                                            />
                                            {invalidGuideName ? (
                                                <span className='invalid-warning'>
                                                    You entered an invalid
                                                    character,{' '}
                                                    <strong>
                                                        ; / ? : @ = & are
                                                    </strong>
                                                    forbidden characters
                                                </span>
                                            ) : null}
                                        </td>
                                    ) : null}
                                    <td>
                                        {dicelist.map((dice, j) => (
                                            <select
                                                /* eslint-disable-next-line react/no-array-index-key */
                                                key={`${i}-${j}`}
                                                defaultValue={dice}
                                                onChange={(evt): void => {
                                                    activeEdit.diceList[i][j] =
                                                        evt.target.value;
                                                    setActiveEdit({
                                                        ...activeEdit,
                                                    });
                                                }}
                                            >
                                                <option>?</option>
                                                {dices.map(diceOption => (
                                                    <option
                                                        key={diceOption.name}
                                                    >
                                                        {diceOption.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ))}
                                    </td>
                                    <td>
                                        <button
                                            disabled={
                                                activeEdit.diceList.length <= 1
                                            }
                                            type='button'
                                            className='delete'
                                            onClick={(): void => {
                                                activeEdit.diceList.splice(
                                                    i,
                                                    1
                                                );
                                                setActiveEdit({
                                                    ...activeEdit,
                                                });
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrashAlt}
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={2}>
                                    <button
                                        type='button'
                                        className='add'
                                        onClick={(): void => {
                                            activeEdit.diceList.push(
                                                Array(5).fill('?')
                                            );
                                            setActiveEdit({
                                                ...activeEdit,
                                            });
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <div className='ckeditor-container'>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={activeEdit.guide}
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
                                                    'mediaembed',
                                                ],
                                            }}
                                            onChange={(
                                                _: unknown,
                                                editor: {
                                                    getData: () => string;
                                                }
                                            ): void => {
                                                activeEdit.guide = editor.getData();
                                                setActiveEdit({
                                                    ...activeEdit,
                                                });
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <button
                                        type='button'
                                        className='submit'
                                        disabled={invalidGuideName}
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
                                        type='button'
                                        className='back'
                                        onClick={(): void => {
                                            dispatch({
                                                type: OPEN_POPUP,
                                                payload: 'confirm-discard',
                                            });
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faUndo} />
                                    </button>
                                </td>
                            </tr>
                        </>
                    ) : (
                        guides.map((guide, i) => (
                            <tr key={guide.name}>
                                <td>{guide.name}</td>
                                <td>
                                    {guide.diceList.map(dicelist => (
                                        <div
                                            className='dice-container'
                                            /* eslint-disable-next-line react/no-array-index-key */
                                            key={`${dicelist.join()}${i}`}
                                        >
                                            {dicelist.map((dice, j) => (
                                                <Dice
                                                    /* eslint-disable-next-line react/no-array-index-key */
                                                    key={`${dicelist.join()}-${dice}${j}`}
                                                    dice={dice}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <button
                                        type='button'
                                        className='edit'
                                        onClick={(): void => {
                                            setActiveEdit({
                                                id: guide.id,
                                                name: guide.name,
                                                diceList: guide.diceList,
                                                guide: guide.guide,
                                            });
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type='button'
                                        className='delete'
                                        onClick={(): void => {
                                            setGuideToDelete(i);
                                            dispatch({
                                                type: OPEN_POPUP,
                                                payload: 'confirm-delete',
                                            });
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </Dashboard>
    );
}
