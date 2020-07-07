import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPencilAlt,
    faTrashAlt,
    faCheck,
    faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import Dashboard from '../../../Components/Dashboard/dashboard';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import {
    Deck,
    Decks,
} from '../../../Misc/Redux Storage/Fetch Firebase/Decks/types';
import { RootState } from '../../../Misc/Redux Storage/store';
import './deck.less';
import PopUp from '../../../Components/PopUp Overlay/popup';
import {
    CLOSE_POPUP,
    OPEN_POPUP,
} from '../../../Misc/Redux Storage/PopUp Overlay/types';

function DeckRow({
    deck,
    setActiveEdit,
}: {
    deck: Deck;
    setActiveEdit: (deck: Deck) => void;
}): JSX.Element {
    return (
        <>
            <td>{deck.rating}</td>
            <td>{deck.type}</td>
            <td>
                <Dice dice={deck.slot1} />
            </td>
            <td>
                <Dice dice={deck.slot2} />
            </td>
            <td>
                <Dice dice={deck.slot3} />
            </td>
            <td>
                <Dice dice={deck.slot4} />
            </td>
            <td>
                <Dice dice={deck.slot5} />
            </td>
            <td>
                <button
                    type='button'
                    disabled={deck.id < 0}
                    onClick={(): void => setActiveEdit(deck)}
                >
                    <FontAwesomeIcon icon={faPencilAlt} />
                </button>
            </td>
        </>
    );
}

const MemoRow = React.memo(DeckRow);

export default function updateDeck(): JSX.Element {
    const dispatch = useDispatch();
    const database = firebase.database();
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const checkboxRef = dices?.map(() =>
        useRef(null as null | HTMLInputElement)
    );
    const [decks, setDecks] = useState<Decks>([]);
    const [currentGameVersion, setCurrentGameVersion] = useState('');
    const initialNewDeckState = {
        id: -1,
        rating: 0,
        type: 'PvP' as 'PvP' | 'PvE' | 'Crew',
        slot1: 'Fire',
        slot2: 'Electric',
        slot3: 'Poison',
        slot4: 'Ice',
        slot5: 'Wind',
        added: '',
        updated: null,
    };
    const [deckToAdd, setDeckToAdd] = useState({ ...initialNewDeckState });
    const [deckToDelete, setDeckToDelete] = useState({
        id: -1,
        dice: [] as string[],
    });
    const [filter, setFilter] = useState({
        type: '?' as '?' | 'PvP' | 'PvE' | 'Crew',
        dice: dices?.map(dice => dice.name) || [],
    });

    const initialEditState = {
        id: -1,
        rating: 0,
        type: '-' as '-' | 'PvP' | 'PvE' | 'Crew',
        slot1: '',
        slot2: '',
        slot3: '',
        slot4: '',
        slot5: '',
        added: '',
        updated: null as string | null,
    };
    const [activeEdit, setActiveEdit] = useState({ ...initialEditState });
    const diceList = dices?.map(dice => dice.name);
    const invalidVersion = currentGameVersion
        ? !/^[1-9][0-9]{0,}\.(0|[1-9][0-9]{0,})\.[0-9]{1,}$/.test(
              currentGameVersion
          )
        : false;
    const invalidVersionToAdd = deckToAdd.added
        ? !/^[1-9][0-9]{0,}\.(0|[1-9][0-9]{0,})\.[0-9]{1,}$/.test(
              deckToAdd.added
          )
        : false;
    const invalidRating = !(activeEdit.rating >= 0 && activeEdit.rating <= 10);
    const invalidRatingToAdd = !(
        deckToAdd.rating >= 0 && deckToAdd.rating <= 10
    );
    const missingVersion = activeEdit.id > 0 && currentGameVersion === '';

    useEffect(() => {
        const ref = database.ref('/decks');
        ref.once('value').then(snapshot => setDecks(snapshot.val()));
    }, []);

    const sortDecksAndUpdate = (deckList: Decks): void => {
        deckList.sort((a, b) => {
            if (a.rating > b.rating) {
                return -1;
            }
            if (a.rating < b.rating) {
                return 1;
            }
            if (a.rating === b.rating) {
                if (a.id > b.id) {
                    return 1;
                }
                return -1;
            }
            return 0;
        });
        database.ref('/decks').set([...deckList]);
        setDecks([...deckList]);
    };

    const updateDecks = (): void => {
        activeEdit.updated = currentGameVersion;
        const updated = decks.map(deck =>
            deck.id === activeEdit.id ? activeEdit : deck
        );
        sortDecksAndUpdate([...updated]);
        setActiveEdit({ ...initialEditState });
    };

    const deleteDeck = (): void => {
        const deleted = decks.filter(deck => deck.id !== deckToDelete.id);
        sortDecksAndUpdate([...deleted]);
        setDeckToDelete({ id: -1, dice: [] as string[] });
    };

    const addDeck = (): void => {
        const clone = {
            ...deckToAdd,
        };
        if (!clone.added.length) {
            clone.added = 'invalid';
            setDeckToAdd(clone);
            return;
        }
        if (invalidRatingToAdd) {
            return;
        }
        decks.sort((a, b) => (a.id > b.id ? 1 : -1));
        const newId = decks.findIndex((deck, i) => deck.id - 1 !== i);
        if (newId === -1) {
            clone.id = decks.length + 1;
        } else {
            clone.id = newId + 1;
        }
        sortDecksAndUpdate([...decks, clone]);
        dispatch({ type: CLOSE_POPUP });
    };

    if (!dices || !decks.length || !diceList) {
        return (
            <Dashboard>
                <LoadingScreen />
            </Dashboard>
        );
    }
    return (
        <Dashboard className='deck'>
            <PopUp popUpTarget='error'>
                <h3>Error</h3>
                <p>
                    You need to fix the following errors before you can save
                    your updated deck onto the database.
                </p>
                {invalidVersion ? (
                    <span className='invalid-warning'>
                        Current game version input is invalid.
                    </span>
                ) : null}
                {invalidRating ? (
                    <span className='invalid-warning'>
                        Invalid Rating Input.
                    </span>
                ) : null}
                {missingVersion ? (
                    <span className='invalid-warning'>
                        You need to input the current game version.
                    </span>
                ) : null}
            </PopUp>
            <PopUp popUpTarget='delete' className='delete'>
                <h3>Please confirm</h3>
                <p>Are you sure you want to delete this deck?</p>
                {deckToDelete.dice.map(dice => (
                    <Dice key={dice} dice={dice} />
                ))}
                <button
                    type='button'
                    className='confirm'
                    onClick={(): void => {
                        deleteDeck();
                        dispatch({ type: CLOSE_POPUP });
                    }}
                >
                    Yes
                </button>
            </PopUp>
            <PopUp popUpTarget='add-deck'>
                <h3>Add A Deck</h3>
                <form onSubmit={(evt): void => evt.preventDefault()}>
                    <label htmlFor='game-version'>
                        Current Game Version :{' '}
                        <input
                            className={invalidVersionToAdd ? 'invalid' : ''}
                            type='textbox'
                            placeholder='1.0.0'
                            onChange={(evt): void => {
                                const clone = {
                                    ...deckToAdd,
                                };
                                clone.added = evt.target.value;
                                setDeckToAdd(clone);
                            }}
                        />
                    </label>
                    <label htmlFor='rating'>
                        Rating :{' '}
                        <input
                            defaultValue={0}
                            type='number'
                            min={0}
                            max={10}
                            step={0.25}
                            className={invalidRatingToAdd ? 'invalid' : ''}
                            onChange={(evt): void => {
                                const clone = {
                                    ...deckToAdd,
                                };
                                clone.rating = Number(evt.target.value);
                                setDeckToAdd(clone);
                            }}
                        />
                    </label>
                    <select
                        defaultValue='PvP'
                        onChange={(evt): void => {
                            const clone = {
                                ...deckToAdd,
                            };
                            clone.type = evt.target.value as
                                | 'PvP'
                                | 'PvE'
                                | 'Crew';
                            setDeckToAdd(clone);
                        }}
                    >
                        <option>PvP</option>
                        <option>PvE</option>
                        <option>Crew</option>
                    </select>
                    <select
                        defaultValue='Fire'
                        onChange={(evt): void => {
                            const clone = {
                                ...deckToAdd,
                            };
                            clone.slot1 = evt.target.value;
                            setDeckToAdd(clone);
                        }}
                    >
                        {diceList
                            ?.filter(
                                dice =>
                                    !(
                                        dice === deckToAdd.slot2 ||
                                        dice === deckToAdd.slot3 ||
                                        dice === deckToAdd.slot4 ||
                                        dice === deckToAdd.slot5
                                    )
                            )
                            .map(name => (
                                <option key={`slot1${name}`}>{name}</option>
                            ))}
                    </select>
                    <select
                        defaultValue='Electric'
                        onChange={(evt): void => {
                            const clone = {
                                ...deckToAdd,
                            };
                            clone.slot2 = evt.target.value;
                            setDeckToAdd(clone);
                        }}
                    >
                        {diceList
                            ?.filter(
                                dice =>
                                    !(
                                        dice === deckToAdd.slot1 ||
                                        dice === deckToAdd.slot3 ||
                                        dice === deckToAdd.slot4 ||
                                        dice === deckToAdd.slot5
                                    )
                            )
                            .map(name => (
                                <option key={`slot2${name}`}>{name}</option>
                            ))}
                    </select>
                    <select
                        defaultValue='Poison'
                        onChange={(evt): void => {
                            const clone = {
                                ...deckToAdd,
                            };
                            clone.slot3 = evt.target.value;
                            setDeckToAdd(clone);
                        }}
                    >
                        {diceList
                            ?.filter(
                                dice =>
                                    !(
                                        dice === deckToAdd.slot1 ||
                                        dice === deckToAdd.slot2 ||
                                        dice === deckToAdd.slot4 ||
                                        dice === deckToAdd.slot5
                                    )
                            )
                            .map(name => (
                                <option key={`slot3${name}`}>{name}</option>
                            ))}
                    </select>
                    <select
                        defaultValue='Ice'
                        onChange={(evt): void => {
                            const clone = {
                                ...deckToAdd,
                            };
                            clone.slot4 = evt.target.value;
                            setDeckToAdd(clone);
                        }}
                    >
                        {diceList
                            ?.filter(
                                dice =>
                                    !(
                                        dice === deckToAdd.slot1 ||
                                        dice === deckToAdd.slot2 ||
                                        dice === deckToAdd.slot3 ||
                                        dice === deckToAdd.slot5
                                    )
                            )
                            .map(name => (
                                <option key={`slot4${name}`}>{name}</option>
                            ))}
                    </select>
                    <select
                        defaultValue='Wind'
                        onChange={(evt): void => {
                            const clone = {
                                ...deckToAdd,
                            };
                            clone.slot5 = evt.target.value;
                            setDeckToAdd(clone);
                        }}
                    >
                        {diceList
                            ?.filter(
                                dice =>
                                    !(
                                        dice === deckToAdd.slot1 ||
                                        dice === deckToAdd.slot2 ||
                                        dice === deckToAdd.slot3 ||
                                        dice === deckToAdd.slot4
                                    )
                            )
                            .map(name => (
                                <option key={`slot5${name}`}>{name}</option>
                            ))}
                    </select>
                    {invalidVersionToAdd ? (
                        <span className='invalid-warning'>
                            Current game version input is invalid.
                        </span>
                    ) : null}
                    {invalidRatingToAdd ? (
                        <span className='invalid-warning'>
                            Invalid Rating Input.
                        </span>
                    ) : null}
                </form>
                <button
                    onClick={addDeck}
                    type='submit'
                    disabled={invalidVersionToAdd || invalidRatingToAdd}
                >
                    Submit
                </button>
            </PopUp>
            <h3>Update Deck List</h3>
            <p>
                To begin updating the deck data, first enter the current game
                version in a format of #.#.#
            </p>
            <p>
                To Edit the decks, press the edit button, once you are done
                editing, press the button again to save the data to the
                database.
            </p>
            <label htmlFor='game-version'>
                Current Game Version :{' '}
                <input
                    className={
                        missingVersion || invalidVersion ? 'invalid' : ''
                    }
                    type='textbox'
                    placeholder='1.0.0'
                    onChange={(evt): void =>
                        setCurrentGameVersion(evt.target.value)
                    }
                />
            </label>
            <label htmlFor='add-deck'>
                Add a Deck :{' '}
                <button
                    type='button'
                    onClick={(): void => {
                        dispatch({
                            type: OPEN_POPUP,
                            payload: 'add-deck',
                        });
                    }}
                >
                    <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </label>
            {invalidVersion ? (
                <span className='invalid-warning'>
                    Current game version input is invalid.
                </span>
            ) : null}
            {invalidRating ? (
                <span className='invalid-warning'>Invalid Rating Input.</span>
            ) : null}
            {missingVersion ? (
                <span className='invalid-warning'>
                    You need to input the current game version.
                </span>
            ) : null}
            <hr className='divisor' />
            <h4>Filter</h4>
            <label htmlFor='deck-type-filter'>
                Deck Type :{' '}
                <select
                    onChange={(evt): void => {
                        filter.type = evt.target.value as
                            | '?'
                            | 'PvP'
                            | 'PvE'
                            | 'Crew';
                        setFilter({ ...filter });
                    }}
                >
                    <option>?</option>
                    <option>PvP</option>
                    <option>PvE</option>
                    <option>Crew</option>
                </select>
            </label>
            <label htmlFor='dice-filter'>
                <span>Dice : </span>
                <button
                    data-select-all={dices?.every(dice =>
                        filter.dice.includes(dice.name)
                    )}
                    type='button'
                    onClick={(evt): void => {
                        const target = evt.target as HTMLButtonElement;
                        if (checkboxRef) {
                            checkboxRef.forEach(eachRef => {
                                if (eachRef.current)
                                    // eslint-disable-next-line no-param-reassign
                                    eachRef.current.checked =
                                        target.innerText === 'Select All';
                            });
                        }
                        filter.dice =
                            target.innerText === 'Select All'
                                ? dices?.map(dice => dice.name) || []
                                : [];
                        setFilter({ ...filter });
                    }}
                >
                    {dices?.every(dice => filter.dice.includes(dice.name))
                        ? 'Deselect All'
                        : 'Select All'}
                </button>
                <div>
                    {dices?.map((dice, i) => (
                        <div key={dice.id} className='dice-container'>
                            <Dice dice={dice.name} />
                            <input
                                name={dice.name}
                                type='checkbox'
                                defaultChecked
                                ref={checkboxRef ? checkboxRef[i] : null}
                                onChange={(evt): void => {
                                    if (evt.target.checked) {
                                        if (
                                            !filter.dice.includes(
                                                evt.target.name
                                            )
                                        ) {
                                            filter.dice = [
                                                ...filter.dice,
                                                evt.target.name,
                                            ];
                                            setFilter({ ...filter });
                                        }
                                    } else {
                                        filter.dice = filter.dice.filter(
                                            d => d !== evt.target.name
                                        );
                                        setFilter({ ...filter });
                                    }
                                }}
                            />
                            <span className='checkbox-styler'>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                        </div>
                    ))}
                </div>
            </label>
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>rating</th>
                            <th>type</th>
                            <th>slot1</th>
                            <th>slot2</th>
                            <th>slot3</th>
                            <th>slot4</th>
                            <th>slot5</th>
                            <th>Toggle Edit</th>
                            <th>Remove Deck</th>
                        </tr>
                    </thead>
                    <tbody>
                        {decks
                            .filter(
                                deck =>
                                    filter.type === '?' ||
                                    filter.type === deck.type
                            )
                            .filter(
                                deck =>
                                    filter.dice.includes(deck.slot1) &&
                                    filter.dice.includes(deck.slot2) &&
                                    filter.dice.includes(deck.slot3) &&
                                    filter.dice.includes(deck.slot4) &&
                                    filter.dice.includes(deck.slot5)
                            )
                            .concat(
                                Array(9)
                                    .fill(-10)
                                    .map((i, j) => ({
                                        id: i - j,
                                        rating: 0,
                                        type: '-',
                                        slot1: '?',
                                        slot2: '?',
                                        slot3: '?',
                                        slot4: '?',
                                        slot5: '?',
                                        added: '-',
                                        updated: '-',
                                    }))
                            )
                            .filter((deck, i) => !(deck.id < 0 && i > 8))
                            .map(deck => (
                                <tr key={deck.id}>
                                    <td>{deck.id < 0 ? '-' : deck.id}</td>
                                    {activeEdit.id === deck.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    max={10}
                                                    step={0.25}
                                                    defaultValue={deck.rating}
                                                    className={
                                                        invalidRating
                                                            ? 'invalid'
                                                            : ''
                                                    }
                                                    onChange={(evt): void => {
                                                        const clone = {
                                                            ...activeEdit,
                                                        };
                                                        clone.rating = Number(
                                                            evt.target.value
                                                        );
                                                        setActiveEdit(clone);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    defaultValue={deck.type}
                                                    onChange={(evt): void => {
                                                        const clone = {
                                                            ...activeEdit,
                                                        };
                                                        clone.type = evt.target
                                                            .value as
                                                            | 'PvP'
                                                            | 'PvE'
                                                            | 'Crew';
                                                        setActiveEdit(clone);
                                                    }}
                                                >
                                                    <option>PvP</option>
                                                    <option>PvE</option>
                                                    <option>Crew</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    defaultValue={deck.slot1}
                                                    onChange={(evt): void => {
                                                        const clone = {
                                                            ...activeEdit,
                                                        };
                                                        clone.slot1 =
                                                            evt.target.value;
                                                        setActiveEdit(clone);
                                                    }}
                                                >
                                                    {diceList
                                                        .filter(
                                                            dice =>
                                                                !(
                                                                    dice ===
                                                                        activeEdit.slot2 ||
                                                                    dice ===
                                                                        activeEdit.slot3 ||
                                                                    dice ===
                                                                        activeEdit.slot4 ||
                                                                    dice ===
                                                                        activeEdit.slot5
                                                                )
                                                        )
                                                        .map(name => (
                                                            <option
                                                                key={`slot1${name}`}
                                                            >
                                                                {name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    defaultValue={deck.slot2}
                                                    onChange={(evt): void => {
                                                        const clone = {
                                                            ...activeEdit,
                                                        };
                                                        clone.slot2 =
                                                            evt.target.value;
                                                        setActiveEdit(clone);
                                                    }}
                                                >
                                                    {diceList
                                                        .filter(
                                                            dice =>
                                                                !(
                                                                    dice ===
                                                                        activeEdit.slot1 ||
                                                                    dice ===
                                                                        activeEdit.slot3 ||
                                                                    dice ===
                                                                        activeEdit.slot4 ||
                                                                    dice ===
                                                                        activeEdit.slot5
                                                                )
                                                        )
                                                        .map(name => (
                                                            <option
                                                                key={`slot2${name}`}
                                                            >
                                                                {name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    defaultValue={deck.slot3}
                                                    onChange={(evt): void => {
                                                        const clone = {
                                                            ...activeEdit,
                                                        };
                                                        clone.slot3 =
                                                            evt.target.value;
                                                        setActiveEdit(clone);
                                                    }}
                                                >
                                                    {diceList
                                                        .filter(
                                                            dice =>
                                                                !(
                                                                    dice ===
                                                                        activeEdit.slot1 ||
                                                                    dice ===
                                                                        activeEdit.slot2 ||
                                                                    dice ===
                                                                        activeEdit.slot4 ||
                                                                    dice ===
                                                                        activeEdit.slot5
                                                                )
                                                        )
                                                        .map(name => (
                                                            <option
                                                                key={`slot3${name}`}
                                                            >
                                                                {name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    defaultValue={deck.slot4}
                                                    onChange={(evt): void => {
                                                        const clone = {
                                                            ...activeEdit,
                                                        };
                                                        clone.slot4 =
                                                            evt.target.value;
                                                        setActiveEdit(clone);
                                                    }}
                                                >
                                                    {diceList
                                                        .filter(
                                                            dice =>
                                                                !(
                                                                    dice ===
                                                                        activeEdit.slot1 ||
                                                                    dice ===
                                                                        activeEdit.slot2 ||
                                                                    dice ===
                                                                        activeEdit.slot3 ||
                                                                    dice ===
                                                                        activeEdit.slot5
                                                                )
                                                        )
                                                        .map(name => (
                                                            <option
                                                                key={`slot4${name}`}
                                                            >
                                                                {name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    defaultValue={deck.slot5}
                                                    onChange={(evt): void => {
                                                        const clone = {
                                                            ...activeEdit,
                                                        };
                                                        clone.slot5 =
                                                            evt.target.value;
                                                        setActiveEdit(clone);
                                                    }}
                                                >
                                                    {diceList
                                                        .filter(
                                                            dice =>
                                                                !(
                                                                    dice ===
                                                                        activeEdit.slot1 ||
                                                                    dice ===
                                                                        activeEdit.slot2 ||
                                                                    dice ===
                                                                        activeEdit.slot3 ||
                                                                    dice ===
                                                                        activeEdit.slot4
                                                                )
                                                        )
                                                        .map(name => (
                                                            <option
                                                                key={`slot5${name}`}
                                                            >
                                                                {name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    type='button'
                                                    onClick={(): void => {
                                                        if (
                                                            activeEdit.rating !==
                                                                deck.rating ||
                                                            activeEdit.type !==
                                                                deck.type ||
                                                            activeEdit.slot1 !==
                                                                deck.slot1 ||
                                                            activeEdit.slot2 !==
                                                                deck.slot2 ||
                                                            activeEdit.slot3 !==
                                                                deck.slot3 ||
                                                            activeEdit.slot4 !==
                                                                deck.slot4 ||
                                                            activeEdit.slot5 !==
                                                                deck.slot5
                                                        ) {
                                                            if (
                                                                invalidVersion ||
                                                                invalidRating ||
                                                                missingVersion
                                                            ) {
                                                                dispatch({
                                                                    type: OPEN_POPUP,
                                                                    payload:
                                                                        'error',
                                                                });
                                                            } else {
                                                                updateDecks();
                                                            }
                                                        } else {
                                                            setActiveEdit({
                                                                ...initialEditState,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCheck}
                                                    />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <MemoRow
                                            deck={deck}
                                            setActiveEdit={setActiveEdit}
                                        />
                                    )}
                                    <td>
                                        <button
                                            disabled={deck.id < 0}
                                            type='button'
                                            onClick={(): void => {
                                                setDeckToDelete({
                                                    id: deck.id,
                                                    dice: [
                                                        deck.slot1,
                                                        deck.slot2,
                                                        deck.slot3,
                                                        deck.slot4,
                                                        deck.slot5,
                                                    ],
                                                });
                                                dispatch({
                                                    type: OPEN_POPUP,
                                                    payload: 'delete',
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
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
}
