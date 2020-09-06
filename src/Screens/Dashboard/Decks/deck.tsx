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
import { Dice as DiceType } from '../../../Misc/Redux Storage/Fetch Firebase/Dices/types';
import './deck.less';
import PopUp from '../../../Components/PopUp Overlay/popup';
import {
    CLOSE_POPUP,
    OPEN_POPUP,
} from '../../../Misc/Redux Storage/PopUp Overlay/types';

function DeckRow({
    deckInfo,
    setActiveEdit,
}: {
    deckInfo: Deck;
    setActiveEdit: (deckInfo: Deck) => void;
}): JSX.Element {
    return (
        <>
            <td>{deckInfo.rating}</td>
            <td>{deckInfo.type}</td>
            <td>
                {deckInfo.decks.map((deck, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className='deck-container' key={i}>
                        {deck.map(die => (
                            <Dice dice={die} key={die} />
                        ))}
                    </div>
                ))}
            </td>
            <td>
                <button
                    type='button'
                    disabled={deckInfo.id < 0}
                    onClick={(): void => setActiveEdit(deckInfo)}
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
        type: 'PvP' as 'PvP' | 'PvE' | 'PvE (Solo)' | 'PvE (Pair)' | 'Crew',
        decks: [[0, 1, 2, 3, 4]] as DiceType['id'][][],
        added: '',
        updated: null,
    };
    const [deckToAdd, setDeckToAdd] = useState({ ...initialNewDeckState });
    const [deckToDelete, setDeckToDelete] = useState({
        id: -1,
        dice: [[]] as DiceType['id'][][],
    });
    const [filter, setFilter] = useState({
        type: '?' as '?' | 'PvP' | 'PvE' | 'Crew',
        dice: dices?.map(dice => dice.id) || [],
    });

    const initialEditState = {
        id: -1,
        rating: 0,
        type: '-' as '-' | 'PvP' | 'PvE' | 'Crew',
        decks: [[]] as DiceType['id'][][],
        added: '',
        updated: null as string | null,
    };
    const [activeEdit, setActiveEdit] = useState({ ...initialEditState });
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
        database.ref('/last_updated/decks').set(new Date().toISOString());
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
        setDeckToDelete({ id: -1, dice: [[]] as DiceType['id'][][] });
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
        if (clone.type === 'PvE (Pair)' || clone.type === 'PvE (Solo)') {
            clone.type = 'PvE';
        }
        sortDecksAndUpdate([
            ...decks,
            clone as {
                id: number;
                rating: number;
                type: 'PvP' | 'PvE' | 'Crew';
                decks: DiceType['id'][][];
                added: string;
                updated: string | null;
            },
        ]);
        dispatch({ type: CLOSE_POPUP });
    };

    if (!dices?.length || !decks?.length) {
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
                {deckToDelete.dice.map((deck, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i}>
                        {deck.map(die => (
                            <Dice key={die} dice={die} />
                        ))}
                    </div>
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
                            defaultValue={deckToAdd.added}
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
                                | 'PvE (Solo)'
                                | 'PvE (Pair)'
                                | 'Crew';
                            if (clone.type === 'PvE (Pair)') {
                                clone.decks = [...clone.decks, [0, 1, 2, 3, 4]];
                            } else {
                                clone.decks = [...clone.decks];
                            }
                            setDeckToAdd(clone);
                        }}
                    >
                        <option>PvP</option>
                        <option>PvE (Solo)</option>
                        <option>PvE (Pair)</option>
                        <option>Crew</option>
                    </select>
                    {Array(5)
                        .fill('')
                        .map((_, i) => (
                            <select
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                defaultValue={i}
                                onChange={(evt): void => {
                                    const clone = {
                                        ...deckToAdd,
                                    };
                                    clone.decks[0][i] = Number(
                                        evt.target.value
                                    );
                                    setDeckToAdd(clone);
                                }}
                            >
                                {dices
                                    .filter(
                                        die =>
                                            !deckToAdd.decks[0].find(
                                                (dieId, j) =>
                                                    dieId === die.id && i !== j
                                            )
                                    )
                                    .map(die => (
                                        <option value={die.id} key={die.id}>
                                            {die.name}
                                        </option>
                                    ))}
                            </select>
                        ))}

                    {deckToAdd.type === 'PvE (Pair)' ? (
                        <>
                            <h3>Co-op Deck Pair</h3>
                            {Array(5)
                                .fill('')
                                .map((_, i) => (
                                    <select
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={i}
                                        defaultValue={i}
                                        onChange={(evt): void => {
                                            const clone = {
                                                ...deckToAdd,
                                            };
                                            clone.decks[1][i] = Number(
                                                evt.target.value
                                            );
                                            setDeckToAdd(clone);
                                        }}
                                    >
                                        {dices
                                            .filter(
                                                die =>
                                                    !deckToAdd.decks[1].find(
                                                        (dieId, j) =>
                                                            dieId === die.id &&
                                                            i !== j
                                                    )
                                            )
                                            .map(die => (
                                                <option
                                                    value={die.id}
                                                    key={die.id}
                                                >
                                                    {die.name}
                                                </option>
                                            ))}
                                    </select>
                                ))}
                        </>
                    ) : null}

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
                        setDeckToAdd({
                            id: -1,
                            rating: 0,
                            type: 'PvP' as 'PvP' | 'PvE' | 'Crew',
                            decks: [[0, 1, 2, 3, 4]] as DiceType['id'][][],
                            added: '',
                            updated: null,
                        });
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
            {typeof filter.dice !== 'undefined' ? (
                <label htmlFor='dice-filter'>
                    <span>Dice : </span>
                    <button
                        data-select-all={
                            (filter.dice.length || 0) <
                            dices.filter(die => die.rarity === 'Legendary')
                                .length
                        }
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
                                    ? dices
                                          .filter(
                                              die => die.rarity === 'Legendary'
                                          )
                                          .map(dice => dice.id)
                                    : [];
                            setFilter({ ...filter });
                        }}
                    >
                        {(filter.dice.length || 0) ===
                        dices.filter(die => die.rarity === 'Legendary').length
                            ? 'Deselect All'
                            : 'Select All'}
                    </button>
                    <div>
                        {dices
                            ?.filter(die => die.rarity === 'Legendary')
                            .map((dice, i) => (
                                <div key={dice.id} className='dice-container'>
                                    <Dice dice={dice.id} />
                                    <input
                                        value={dice.id}
                                        type='checkbox'
                                        defaultChecked
                                        ref={
                                            checkboxRef ? checkboxRef[i] : null
                                        }
                                        onChange={(evt): void => {
                                            if (evt.target.checked) {
                                                if (
                                                    !filter.dice.includes(
                                                        Number(evt.target.value)
                                                    )
                                                ) {
                                                    filter.dice = [
                                                        ...filter.dice,
                                                        Number(
                                                            evt.target.value
                                                        ),
                                                    ];
                                                    setFilter({ ...filter });
                                                }
                                            } else {
                                                filter.dice = filter.dice.filter(
                                                    dieId =>
                                                        dieId !==
                                                        Number(evt.target.value)
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
            ) : null}
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Rating</th>
                            <th>Type</th>
                            <th>Deck</th>
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
                            .filter(deckInfo =>
                                deckInfo.decks.some(deck =>
                                    deck.every(die => filter.dice.includes(die))
                                )
                            )
                            .concat(
                                Array(9)
                                    .fill(-10)
                                    .map((i, j) => ({
                                        id: i - j,
                                        rating: 0,
                                        type: '-',
                                        decks: [[]],
                                        added: '-',
                                        updated: '-',
                                    }))
                            )
                            .filter((deck, i) => !(deck.id < 0 && i > 8))
                            .map(deckInfo => (
                                <tr key={deckInfo.id}>
                                    <td>
                                        {deckInfo.id < 0 ? '-' : deckInfo.id}
                                    </td>
                                    {activeEdit.id === deckInfo.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type='number'
                                                    min={0}
                                                    max={10}
                                                    step={0.25}
                                                    defaultValue={
                                                        deckInfo.rating
                                                    }
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
                                                    defaultValue={deckInfo.type}
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
                                                {deckInfo.decks.map(
                                                    (deck, i) => (
                                                        <div
                                                            className='edit-container'
                                                            // eslint-disable-next-line react/no-array-index-key
                                                            key={i}
                                                        >
                                                            {deck.map(
                                                                (die, j) => (
                                                                    <select
                                                                        // eslint-disable-next-line react/no-array-index-key
                                                                        key={`${i}-${j}`}
                                                                        defaultValue={
                                                                            die
                                                                        }
                                                                        onChange={(
                                                                            evt
                                                                        ): void => {
                                                                            const clone = {
                                                                                ...activeEdit,
                                                                            };
                                                                            clone.decks = clone.decks.map(
                                                                                (
                                                                                    clonedDeck,
                                                                                    ii
                                                                                ) => {
                                                                                    if (
                                                                                        ii ===
                                                                                        i
                                                                                    ) {
                                                                                        return clonedDeck.map(
                                                                                            (
                                                                                                cloneDie,
                                                                                                jj
                                                                                            ) => {
                                                                                                if (
                                                                                                    jj ===
                                                                                                    j
                                                                                                ) {
                                                                                                    return Number(
                                                                                                        evt
                                                                                                            .target
                                                                                                            .value
                                                                                                    );
                                                                                                }
                                                                                                return cloneDie;
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                    return clonedDeck;
                                                                                }
                                                                            );
                                                                            setActiveEdit(
                                                                                clone
                                                                            );
                                                                        }}
                                                                    >
                                                                        {dices
                                                                            .filter(
                                                                                d => {
                                                                                    const findExisted = activeEdit.decks[
                                                                                        i
                                                                                    ].findIndex(
                                                                                        dieId =>
                                                                                            dieId ===
                                                                                            d.id
                                                                                    );
                                                                                    return (
                                                                                        findExisted ===
                                                                                            -1 ||
                                                                                        findExisted ===
                                                                                            j
                                                                                    );
                                                                                }
                                                                            )
                                                                            .map(
                                                                                d => (
                                                                                    <option
                                                                                        value={
                                                                                            d.id
                                                                                        }
                                                                                        // eslint-disable-next-line react/no-array-index-key
                                                                                        key={`${i}-${j}-${d.id}`}
                                                                                    >
                                                                                        {
                                                                                            d.name
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                    </select>
                                                                )
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    type='button'
                                                    onClick={(): void => {
                                                        if (
                                                            activeEdit.rating !==
                                                                deckInfo.rating ||
                                                            activeEdit.decks.some(
                                                                (
                                                                    editedDeck,
                                                                    i
                                                                ) =>
                                                                    editedDeck.some(
                                                                        (
                                                                            editedDie,
                                                                            j
                                                                        ) =>
                                                                            editedDie !==
                                                                            deckInfo
                                                                                .decks[
                                                                                i
                                                                            ][j]
                                                                    )
                                                            )
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
                                            deckInfo={deckInfo}
                                            setActiveEdit={setActiveEdit}
                                        />
                                    )}
                                    <td>
                                        <button
                                            disabled={deckInfo.id < 0}
                                            type='button'
                                            onClick={(): void => {
                                                setDeckToDelete({
                                                    id: deckInfo.id,
                                                    dice: deckInfo.decks,
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
