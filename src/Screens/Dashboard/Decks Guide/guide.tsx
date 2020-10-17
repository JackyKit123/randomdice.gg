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
    faArchive,
    faBoxOpen,
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
import { fetchDecksGuide } from '../../../Misc/Firebase/fetchData';

export default function updateDecksGuide(): JSX.Element {
    const dispatch = useDispatch();
    const database = firebase.database();
    const dbRef = database.ref('/decks_guide');
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const [guides, setGuides] = useState<DecksGuide>();
    const [activeEdit, setActiveEdit] = useState<DeckGuide>();
    const [guideToArchive, setGuideToArchive] = useState<number>();
    const [invalidGuideName, setInvalidGuideName] = useState(false);

    useEffect(() => {
        dbRef.once('value').then(snapshot => setGuides(snapshot.val()));
    }, []);

    if (!guides?.length || !dices?.length) {
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
                            fetchDecksGuide(dispatch);
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
            <PopUp popUpTarget='confirm-archive'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to{' '}
                    {guides.find(guide => guide.id === guideToArchive)?.archived
                        ? 'unarchive'
                        : 'archive'}{' '}
                    this guide?
                </p>
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        const archiveTarget = guides.find(
                            guide => guide.id === guideToArchive
                        );
                        if (archiveTarget) {
                            archiveTarget.archived = !archiveTarget.archived;
                            const newGuides = guides.map(guide =>
                                guide.id === guideToArchive
                                    ? archiveTarget
                                    : guide
                            );
                            setGuideToArchive(undefined);
                            setGuides(newGuides);
                            database
                                .ref('/last_updated/decks_guide')
                                .set(new Date().toISOString());
                            dbRef.set(newGuides);
                            fetchDecksGuide(dispatch);
                        }
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
            {activeEdit ? (
                <table>
                    <tbody>
                        {activeEdit.diceList.map((dicelist, i, arr) => (
                            <tr
                                className='dice-container'
                                /* eslint-disable-next-line react/no-array-index-key */
                                key={`dice-container-${i}`}
                            >
                                {i === 0 ? (
                                    <>
                                        <td rowSpan={arr.length}>
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
                                    </>
                                ) : null}
                                <td>
                                    {dicelist.map((dice, j) => (
                                        <select
                                            /* eslint-disable-next-line react/no-array-index-key */
                                            key={`${i}-${j}`}
                                            defaultValue={dice}
                                            onChange={(evt): void => {
                                                activeEdit.diceList[i][
                                                    j
                                                ] = Number(evt.target.value);
                                                setActiveEdit({
                                                    ...activeEdit,
                                                });
                                            }}
                                        >
                                            <option value={-1}>?</option>
                                            {dices.map(diceOption => (
                                                <option
                                                    key={diceOption.id}
                                                    value={diceOption.id}
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
                                        className='archive'
                                        onClick={(): void => {
                                            activeEdit.diceList.splice(i, 1);
                                            setActiveEdit({
                                                ...activeEdit,
                                            });
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <select
                                    defaultValue={activeEdit.type}
                                    onChange={(evt): void => {
                                        activeEdit.type = evt.target.value as
                                            | 'PvP'
                                            | 'Co-op'
                                            | 'Crew';
                                        setActiveEdit({
                                            ...activeEdit,
                                        });
                                    }}
                                >
                                    <option>PvP</option>
                                    <option>Co-op</option>
                                    <option>Crew</option>
                                </select>
                            </td>
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
                    </tbody>
                </table>
            ) : (
                <>
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
                                    type: 'PvP',
                                    name: '',
                                    diceList: [Array(5).fill('?')],
                                    guide: '',
                                    archived: false,
                                });
                            }}
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </button>
                    </label>
                    <table className='guide-menu'>
                        <tbody>
                            {guides.map((guide, i) => (
                                <tr
                                    key={guide.id}
                                    className={guide.archived ? 'archived' : ''}
                                >
                                    <td>{guide.type}</td>
                                    <td>
                                        {guide.name}
                                        {guide.archived ? (
                                            <>
                                                <br />
                                                (ARCHIVED)
                                            </>
                                        ) : null}
                                    </td>
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
                                                    type: guide.type,
                                                    name: guide.name,
                                                    diceList: guide.diceList,
                                                    guide: guide.guide,
                                                    archived: false,
                                                });
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faPencilAlt}
                                            />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            type='button'
                                            className='archive'
                                            onClick={(): void => {
                                                setGuideToArchive(guide.id);
                                                dispatch({
                                                    type: OPEN_POPUP,
                                                    payload: 'confirm-archive',
                                                });
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    guide.archived
                                                        ? faBoxOpen
                                                        : faArchive
                                                }
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </Dashboard>
    );
}
