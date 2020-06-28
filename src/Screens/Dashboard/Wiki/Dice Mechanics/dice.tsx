import React, { useEffect, useState, useRef } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase/app';
import Dashboard from '../../../../Components/Dashboard/dashboard';
import LoadingScreen from '../../../../Components/Loading/loading';
import Dice from '../../../../Components/Dice/dice';
import PopUp from '../../../../Components/PopUp Overlay/popup';
import {
    Dice as DiceType,
    Dices,
} from '../../../../Misc/Redux Storage/Fetch Firebase/Dices/types';
import {
    CLOSE_POPUP,
    OPEN_POPUP,
} from '../../../../Misc/Redux Storage/PopUp Overlay/types';
import './dice.less';

export default function UpdateDiceMechanics(): JSX.Element {
    const dispatch = useDispatch();
    const selectRef = useRef(null as null | HTMLSelectElement);
    const database = firebase.database();
    const dbRef = database.ref('/dice');
    const [dices, setDices] = useState([] as Dices);
    const [activeEdit, setActiveEdit] = useState<DiceType>();

    if (!dices) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    useEffect(() => {
        dbRef.once('value').then(snapshot => setDices(snapshot.val()));
    }, []);

    return (
        <Dashboard className='dice-mechanics'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to submit the dice mechanics for{' '}
                    {activeEdit?.name} Dice?
                </p>
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        if (activeEdit) {
                            const result = dices.map(dice => {
                                if (dice.name === activeEdit.name) {
                                    return activeEdit;
                                }
                                return dice;
                            });
                            dbRef.set(result);
                            setDices(result);
                            setActiveEdit(undefined);
                            if (selectRef.current) {
                                selectRef.current.value = '?';
                            }
                        }
                        dispatch({ type: CLOSE_POPUP });
                    }}
                >
                    Yes
                </button>
            </PopUp>
            <form
                className='filter'
                onSubmit={(evt): void => evt.preventDefault()}
            >
                <label htmlFor='select-dice'>
                    <span>Select Dice:</span>
                    <select
                        ref={selectRef}
                        data-value={activeEdit?.name || '?'}
                        onChange={(evt): void => {
                            const dice = dices.find(
                                d => d.name === evt.target.value
                            );
                            setActiveEdit(dice);
                        }}
                    >
                        <option>?</option>
                        {dices.map(dice => (
                            <option key={dice.name}>{dice.name}</option>
                        ))}
                    </select>
                    <Dice dice={activeEdit?.name || '?'} />
                </label>
            </form>
            <div
                className={`ckeditor-container ${!activeEdit ? 'empty' : null}`}
            >
                {activeEdit ? (
                    <CKEditor
                        editor={ClassicEditor}
                        data={activeEdit.detail}
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
                            activeEdit.detail = editor.getData();
                            setActiveEdit({
                                ...activeEdit,
                            });
                        }}
                    />
                ) : null}
                {activeEdit ? (
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
                ) : null}
            </div>
        </Dashboard>
    );
}
