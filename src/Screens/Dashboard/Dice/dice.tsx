import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import Dashboard from '../../../Components/Dashboard/dashboard';
import LoadingScreen from '../../../Components/Loading/loading';
import PopUp from '../../../Components/PopUp Overlay/popup';
import {
    CLOSE_POPUP,
    OPEN_POPUP,
} from '../../../Misc/Redux Storage/PopUp Overlay/types';
import {
    Dice,
    Dices,
} from '../../../Misc/Redux Storage/Fetch Firebase/Dices/types';
import './dice.less';

export default function editDice(): JSX.Element {
    const dispatch = useDispatch();
    const selectRef = useRef(null as null | HTMLSelectElement);
    const database = firebase.database();
    const storage = firebase.storage();
    const dbRef = database.ref('/dice');
    const [dices, setDices] = useState<Dices>([]);
    const initialState = {
        id: -1,
        name: '',
        type: 'Physical' as Dice['type'],
        desc: '',
        detail: '',
        img: '',
        target: '-' as Dice['target'],
        rarity: 'Common' as Dice['rarity'],
        atk: 0,
        spd: 0,
        eff1: 0,
        eff2: 0,
        nameEff1: '-',
        nameEff2: '-',
        unitEff1: '',
        unitEff2: '',
        cupAtk: 0,
        cupSpd: 0,
        cupEff1: 0,
        cupEff2: 0,
        pupAtk: 0,
        pupSpd: 0,
        pupEff1: 0,
        pupEff2: 0,
        arenaValue: {
            type: 'Main Dps' as Dice['arenaValue']['type'],
            assist: 0,
            dps: 0,
            slow: 0,
            value: 0,
        },
    };
    const [activeEdit, setActiveEdit] = useState<Dice>(initialState);

    useEffect(() => {
        dbRef.once('value').then(snapshot => setDices(snapshot.val()));
    }, []);

    if (!dices.length) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }

    const invalidName = !/^\w+( \w+){0,}$/.test(activeEdit.name);
    const invalidImg = activeEdit.img.length <= 0;
    const invalidDescription = activeEdit.desc.length <= 0;
    const invalidArenaDps =
        activeEdit.arenaValue.dps < 0 || activeEdit.arenaValue.dps > 10;
    const invalidArenaSlow =
        activeEdit.arenaValue.slow < 0 || activeEdit.arenaValue.slow > 10;
    const invalidArenaAssist =
        activeEdit.arenaValue.assist < 0 || activeEdit.arenaValue.assist > 10;
    const invalidArenaValue =
        activeEdit.arenaValue.value < 0 || activeEdit.arenaValue.value > 10;
    const invalidInput =
        invalidImg ||
        invalidName ||
        invalidDescription ||
        invalidArenaDps ||
        invalidArenaSlow ||
        invalidArenaAssist ||
        invalidArenaValue;

    const handleSubmit = async (): Promise<void> => {
        if (activeEdit) {
            const originalDice = dices.find(dice => dice.id === activeEdit.id);
            if (/^data:image\/([a-zA-Z]*);base64,/.test(activeEdit.img)) {
                if (originalDice) {
                    await storage
                        .ref(`Dice Images/${originalDice.name}.png`)
                        .delete();
                }
                await storage
                    .ref(`Dice Images/${activeEdit.name}`)
                    .putString(activeEdit.img, 'data_url', {
                        cacheControl: 'public,max-age=31536000',
                    });
                const newUrl = await storage
                    .ref(`Dice Images/${activeEdit.name}`)
                    .getDownloadURL();
                activeEdit.img = newUrl;
            } else if (originalDice && originalDice.name !== activeEdit.name) {
                const reader = new FileReader();
                const img = (
                    await axios.get(originalDice.img, {
                        responseType: 'blob',
                    })
                ).data;
                await storage.ref(`Dice Images/${originalDice.name}`).delete();
                reader.readAsDataURL(img);
                reader.onloadend = async (): Promise<void> => {
                    const base64 = reader.result as string;
                    await storage
                        .ref(`Dice Images/${activeEdit.name}`)
                        .putString(base64, 'data_url', {
                            cacheControl: 'public,max-age=31536000',
                        });
                    const newUrl = await storage
                        .ref(`Dice Images/${activeEdit.name}`)
                        .getDownloadURL();
                    activeEdit.img = newUrl;
                    const result = dices.map(dice => {
                        if (dice.id === activeEdit.id) {
                            return activeEdit;
                        }
                        return dice;
                    });
                    result.sort((a, b) => {
                        const rarityVal = {
                            Common: 0,
                            Rare: 1,
                            Unique: 2,
                            Legendary: 3,
                        };
                        if (rarityVal[a.rarity] < rarityVal[b.rarity]) {
                            return -1;
                        }
                        if (rarityVal[a.rarity] > rarityVal[b.rarity]) {
                            return 1;
                        }
                        return 0;
                    });
                    database
                        .ref('/last_updated/dice')
                        .set(new Date().toISOString());
                    dbRef.set(result);
                    setDices(result);
                    setActiveEdit({ ...initialState });
                    if (selectRef.current) {
                        selectRef.current.value = '?';
                    }
                };
            }
            let updateDice = false;
            const result = dices.map(dice => {
                if (dice.id === activeEdit.id) {
                    updateDice = true;
                    return activeEdit;
                }
                return dice;
            });
            if (!updateDice) {
                result.push(activeEdit);
            }
            result.sort((a, b) => {
                const rarityVal = {
                    Common: 0,
                    Rare: 1,
                    Unique: 2,
                    Legendary: 3,
                };
                if (rarityVal[a.rarity] < rarityVal[b.rarity]) {
                    return -1;
                }
                if (rarityVal[a.rarity] > rarityVal[b.rarity]) {
                    return 1;
                }
                return 0;
            });
            database.ref('/last_updated/dice').set(new Date().toISOString());
            dbRef.set(result);
            setDices(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    const handleDelete = async (): Promise<void> => {
        const originalDice = dices.find(dice => dice.id === activeEdit.id);
        if (originalDice) {
            await storage.ref(`Dice Images/${originalDice.name}`).delete();
            const result = dices.filter(dice => dice.id !== activeEdit.id);
            dbRef.set(result);
            setDices(result);
            setActiveEdit({ ...initialState });
            if (selectRef.current) {
                selectRef.current.value = '?';
            }
        }
        dispatch({ type: CLOSE_POPUP });
    };

    return (
        <Dashboard className='dice'>
            <PopUp popUpTarget='confirm-submit'>
                <h3>Please Confirm</h3>
                <p>
                    Are you sure to want to update the information for this
                    dice?
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
                <p>
                    Are you sure to want to delete this dice, the action is
                    irreversible, it may break the the deck list and other
                    tools. Make sure you have deleted those related content
                    before deleting the dice.
                </p>
                <button
                    type='button'
                    className='confirm'
                    onClick={handleDelete}
                >
                    Yes
                </button>
            </PopUp>
            <label htmlFor='select-dice'>
                Select A Dice:
                <select
                    ref={selectRef}
                    name='select-dice'
                    onChange={(evt): void => {
                        if (evt.target.value === '?') {
                            setActiveEdit({ ...initialState });
                        } else {
                            const foundDice = dices.find(
                                dice => dice.id === Number(evt.target.value)
                            );
                            if (foundDice) {
                                setActiveEdit({ ...foundDice });
                            } else {
                                dices.sort((a, b) => (a.id < b.id ? -1 : 1));
                                let newId = dices.findIndex(
                                    (dice, i) => dice.id !== i
                                );
                                if (newId === -1) {
                                    newId = dices.length;
                                }
                                const clone = { ...initialState };
                                clone.id = newId;
                                setActiveEdit(clone);
                            }
                        }
                    }}
                >
                    <option>?</option>
                    {dices.map(dice => (
                        <option
                            key={dice.id}
                            value={dice.id}
                            id={dice.id.toString()}
                        >
                            {dice.name}
                        </option>
                    ))}
                    <option>Add a New Dice</option>
                </select>
            </label>
            <hr className='divisor' />
            {activeEdit.id === -1 ? null : (
                <>
                    <form onSubmit={(evt): void => evt.preventDefault()}>
                        <h3>Dice Stat</h3>
                        <label htmlFor='dice-image'>
                            Image:
                            <figure className='dice'>
                                <img
                                    src={activeEdit.img}
                                    alt='dice'
                                    data-dice-rarity={activeEdit.rarity}
                                />
                            </figure>
                            <input
                                key={`dice${activeEdit.id}-img`}
                                type='file'
                                alt='dice'
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
                                Please upload a dice image in format.
                            </div>
                        ) : null}
                        <label htmlFor='dice-name'>
                            Name:
                            <input
                                key={`dice${activeEdit.id}-name`}
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
                                Do not include the word &apos;dice&apos; in the
                                name, trim the space before and after the word.
                            </div>
                        ) : null}
                        <label htmlFor='dice-type'>
                            Type:
                            <select
                                key={`dice${activeEdit.id}-type`}
                                defaultValue={activeEdit.type}
                                onChange={(evt): void => {
                                    activeEdit.type = evt.target
                                        .value as Dice['type'];
                                    setActiveEdit({ ...activeEdit });
                                }}
                            >
                                <option>Physical</option>
                                <option>Magic</option>
                                <option>Buff</option>
                                <option>Merge</option>
                                <option>Transform</option>
                            </select>
                        </label>
                        <label htmlFor='dice-desc'>
                            Description:
                            <input
                                key={`dice${activeEdit.id}-desc`}
                                defaultValue={activeEdit.desc}
                                className={invalidDescription ? 'invalid' : ''}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.desc = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        {invalidDescription ? (
                            <div className='invalid-warning'>
                                Dice Description should be not empty.
                            </div>
                        ) : null}
                        <label htmlFor='dice-target'>
                            Target:
                            <select
                                key={`dice${activeEdit.id}-target`}
                                defaultValue={activeEdit.target}
                                onChange={(evt): void => {
                                    activeEdit.target = evt.target
                                        .value as Dice['target'];
                                    setActiveEdit({ ...activeEdit });
                                }}
                            >
                                <option>-</option>
                                <option>Front</option>
                                <option>Strongest</option>
                                <option>Random</option>
                                <option>Weakest</option>
                            </select>
                        </label>
                        <label htmlFor='dice-rarity'>
                            Rarity:
                            <select
                                key={`dice${activeEdit.id}-rarity`}
                                defaultValue={activeEdit.rarity}
                                onChange={(evt): void => {
                                    activeEdit.rarity = evt.target
                                        .value as Dice['rarity'];
                                    setActiveEdit({ ...activeEdit });
                                }}
                            >
                                <option>Common</option>
                                <option>Rare</option>
                                <option>Unique</option>
                                <option>Legendary</option>
                            </select>
                        </label>
                        <label htmlFor='dice-atk'>
                            Base Attack:
                            <input
                                key={`dice${activeEdit.id}-atk`}
                                defaultValue={activeEdit.atk}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.atk = Number(evt.target.value);
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-cupAtk'>
                            Class Up Attack:
                            <input
                                key={`dice${activeEdit.id}-cupAtk`}
                                defaultValue={activeEdit.cupAtk}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.cupAtk = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-pupAtk'>
                            Level Up Attack:
                            <input
                                key={`dice${activeEdit.id}-pupAtk`}
                                defaultValue={activeEdit.pupAtk}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.pupAtk = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-spd'>
                            Base Attack Speed:
                            <input
                                key={`dice${activeEdit.id}-spd`}
                                defaultValue={activeEdit.spd}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.spd = Number(evt.target.value);
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-cupSpd'>
                            Class Up Attack Speed:
                            <input
                                key={`dice${activeEdit.id}-cupSpd`}
                                defaultValue={activeEdit.cupSpd}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.cupSpd = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-pupSpd'>
                            Level Up Attack Speed:
                            <input
                                key={`dice${activeEdit.id}-pupSpd`}
                                defaultValue={activeEdit.pupSpd}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.pupSpd = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-nameEff1'>
                            Effect 1 Name:
                            <input
                                key={`dice${activeEdit.id}-nameEff1`}
                                defaultValue={activeEdit.nameEff1}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.nameEff1 = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-unitEff1'>
                            Effect 1 Unit:
                            <input
                                key={`dice${activeEdit.id}-unitEff1`}
                                defaultValue={activeEdit.unitEff1}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.unitEff1 = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-eff1'>
                            Base Effect 1 Value:
                            <input
                                key={`dice${activeEdit.id}-eff1`}
                                defaultValue={activeEdit.eff1}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.eff1 = Number(evt.target.value);
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-cupEff1'>
                            Class Up Effect 1 Value:
                            <input
                                key={`dice${activeEdit.id}-cupEff1`}
                                defaultValue={activeEdit.cupEff1}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.cupEff1 = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-pupEff1'>
                            Level Up Effect 1 Value:
                            <input
                                key={`dice${activeEdit.id}-pupEff1`}
                                defaultValue={activeEdit.pupEff1}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.pupEff1 = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-nameEff2'>
                            Effect 2 Name:
                            <input
                                key={`dice${activeEdit.id}-nameEff2`}
                                defaultValue={activeEdit.nameEff2}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.nameEff2 = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-unitEff2'>
                            Effect 2 Unit:
                            <input
                                key={`dice${activeEdit.id}-unitEff2`}
                                defaultValue={activeEdit.unitEff2}
                                type='textbox'
                                onChange={(evt): void => {
                                    activeEdit.unitEff2 = evt.target.value;
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-eff2'>
                            Base Effect 2 Value:
                            <input
                                key={`dice${activeEdit.id}-eff2`}
                                defaultValue={activeEdit.eff2}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.eff2 = Number(evt.target.value);
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-cupEff2'>
                            Class Up Effect 2 Value:
                            <input
                                key={`dice${activeEdit.id}-cupEff2`}
                                defaultValue={activeEdit.cupEff2}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.cupEff2 = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        <label htmlFor='dice-pupEff2'>
                            Level Up Effect 2 Value:
                            <input
                                key={`dice${activeEdit.id}-pupEff2`}
                                defaultValue={activeEdit.pupEff2}
                                type='number'
                                onChange={(evt): void => {
                                    activeEdit.pupEff2 = Number(
                                        evt.target.value
                                    );
                                    setActiveEdit({ ...activeEdit });
                                }}
                            />
                        </label>
                        {activeEdit.name === 'Growth' ? null : (
                            <>
                                <hr className='divisor' />
                                <h3>Arena</h3>
                                <label htmlFor='dice-arena-type'>
                                    Type:
                                    <select
                                        key={`dice${activeEdit.id}-arena-type`}
                                        defaultValue={
                                            activeEdit.arenaValue.type
                                        }
                                        onChange={(evt): void => {
                                            activeEdit.arenaValue.type = evt
                                                .target
                                                .value as Dice['arenaValue']['type'];
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    >
                                        <option>Main Dps</option>
                                        <option>Assist Dps</option>
                                        <option>Slow</option>
                                        <option>Value</option>
                                    </select>
                                </label>
                                <label htmlFor='dice-arena-dps'>
                                    DPS Value:
                                    <input
                                        key={`dice${activeEdit.id}-arena-dps`}
                                        className={
                                            invalidArenaDps ? 'invalid' : ''
                                        }
                                        defaultValue={activeEdit.arenaValue.dps}
                                        type='number'
                                        onChange={(evt): void => {
                                            activeEdit.arenaValue.dps = Number(
                                                evt.target.value
                                            );
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    />
                                </label>
                                <label htmlFor='dice-arena-slow'>
                                    Slow Value:
                                    <input
                                        key={`dice${activeEdit.id}-arena-slow`}
                                        className={
                                            invalidArenaSlow ? 'invalid' : ''
                                        }
                                        defaultValue={
                                            activeEdit.arenaValue.slow
                                        }
                                        type='number'
                                        onChange={(evt): void => {
                                            activeEdit.arenaValue.slow = Number(
                                                evt.target.value
                                            );
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    />
                                </label>
                                <label htmlFor='dice-arena-assist'>
                                    Assist DPS Value:
                                    <input
                                        key={`dice${activeEdit.id}-arena-assist`}
                                        className={
                                            invalidArenaAssist ? 'invalid' : ''
                                        }
                                        defaultValue={
                                            activeEdit.arenaValue.assist
                                        }
                                        type='number'
                                        onChange={(evt): void => {
                                            activeEdit.arenaValue.assist = Number(
                                                evt.target.value
                                            );
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    />
                                </label>
                                <label htmlFor='dice-arena-value'>
                                    Value / Buff Value:
                                    <input
                                        key={`dice${activeEdit.id}-arena-value`}
                                        className={
                                            invalidArenaValue ? 'invalid' : ''
                                        }
                                        defaultValue={
                                            activeEdit.arenaValue.value
                                        }
                                        type='number'
                                        onChange={(evt): void => {
                                            activeEdit.arenaValue.value = Number(
                                                evt.target.value
                                            );
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    />
                                </label>
                                {invalidArenaDps ||
                                invalidArenaSlow ||
                                invalidArenaAssist ||
                                invalidArenaValue ? (
                                    <div className='invalid-warning'>
                                        Arena Value must be between 0-10.
                                    </div>
                                ) : null}
                            </>
                        )}
                        {activeEdit.rarity === 'Legendary' ? (
                            <>
                                <hr className='divisor' />
                                <h3>Legendary Alternatives</h3>
                                <label htmlFor='dice-alt-desc'>
                                    Strength Description:
                                    <input
                                        key={`dice${activeEdit.id}-alt-desc`}
                                        defaultValue={
                                            activeEdit.alternatives?.desc
                                        }
                                        type='textbox'
                                        onChange={(evt): void => {
                                            activeEdit.alternatives = activeEdit.alternatives || {
                                                desc: '',
                                                list: [],
                                            };
                                            activeEdit.alternatives.desc =
                                                evt.target.value;
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    />
                                </label>
                                <label htmlFor='dice-alt-1'>
                                    Alternative 1:
                                    <select
                                        key={`dice${activeEdit.id}-alt-1`}
                                        defaultValue={
                                            activeEdit.alternatives?.list[0] ||
                                            '?'
                                        }
                                        onChange={(evt): void => {
                                            activeEdit.alternatives = activeEdit.alternatives || {
                                                desc: '',
                                                list: [],
                                            };
                                            activeEdit.alternatives.list[0] =
                                                Number(evt.target.value) ||
                                                null;
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    >
                                        <option>?</option>
                                        {dices.map(dice => (
                                            <option
                                                key={dice.id}
                                                value={dice.id}
                                            >
                                                {dice.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label htmlFor='dice-alt-2'>
                                    Alternative 2:
                                    <select
                                        key={`dice${activeEdit.id}-alt-2`}
                                        defaultValue={
                                            activeEdit.alternatives?.list[1] ||
                                            '?'
                                        }
                                        onChange={(evt): void => {
                                            activeEdit.alternatives = activeEdit.alternatives || {
                                                desc: '',
                                                list: [],
                                            };
                                            activeEdit.alternatives.list[1] =
                                                Number(evt.target.value) ||
                                                null;
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    >
                                        <option>?</option>
                                        {dices.map(dice => (
                                            <option
                                                key={dice.name}
                                                value={dice.id}
                                            >
                                                {dice.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label htmlFor='dice-alt-3'>
                                    Alternative 3:
                                    <select
                                        key={`dice${activeEdit.id}-alt-3`}
                                        defaultValue={
                                            activeEdit.alternatives?.list[2] ||
                                            '?'
                                        }
                                        onChange={(evt): void => {
                                            activeEdit.alternatives = activeEdit.alternatives || {
                                                desc: '',
                                                list: [],
                                            };
                                            activeEdit.alternatives.list[2] =
                                                Number(evt.target.value) ||
                                                null;
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    >
                                        <option>?</option>
                                        {dices.map(dice => (
                                            <option
                                                key={dice.name}
                                                value={dice.id}
                                            >
                                                {dice.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label htmlFor='dice-alt-4'>
                                    Alternative 4:
                                    <select
                                        key={`dice${activeEdit.id}-alt-4`}
                                        defaultValue={
                                            activeEdit.alternatives?.list[3] ||
                                            '?'
                                        }
                                        onChange={(evt): void => {
                                            activeEdit.alternatives = activeEdit.alternatives || {
                                                desc: '',
                                                list: [],
                                            };
                                            activeEdit.alternatives.list[3] =
                                                Number(evt.target.value) ||
                                                null;
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    >
                                        <option>?</option>
                                        {dices.map(dice => (
                                            <option
                                                key={dice.name}
                                                value={dice.id}
                                            >
                                                {dice.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label htmlFor='dice-alt-5'>
                                    Alternative 5:
                                    <select
                                        key={`dice${activeEdit.id}-alt-5`}
                                        defaultValue={
                                            activeEdit.alternatives?.list[4] ||
                                            '?'
                                        }
                                        onChange={(evt): void => {
                                            activeEdit.alternatives = activeEdit.alternatives || {
                                                desc: '',
                                                list: [],
                                            };
                                            activeEdit.alternatives.list[4] =
                                                Number(evt.target.value) ||
                                                null;
                                            setActiveEdit({ ...activeEdit });
                                        }}
                                    >
                                        <option>?</option>
                                        {dices.map(dice => (
                                            <option
                                                key={dice.name}
                                                value={dice.id}
                                            >
                                                {dice.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </>
                        ) : null}
                        <hr className='divisor' />
                        <h3>Detail Dice Mechanic</h3>
                        <CKEditor
                            key={`dice${activeEdit.id}-mechanic`}
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
