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
import Dashboard from 'Components/Dashboard';
import LoadingScreen from 'Components/Loading';
import Dice from 'Components/Dice';
import { Deck, Decks } from 'Redux/Fetch Firebase/Decks/types';
import { RootState } from 'Redux/store';
import { Dice as DiceType } from 'Redux/Fetch Firebase/Dices/types';
import './deck.less';
import PopUp from 'Components/PopUp Overlay';
import { CLOSE_POPUP, OPEN_POPUP } from 'Redux/PopUp Overlay/types';
import { DecksGuide } from 'Redux/Fetch Firebase/Decks Guide/types';
import { Battlefield } from 'Redux/Fetch Firebase/Wiki/types';
import { fetchDecks } from 'Firebase';

function DeckRow({
    deckInfo,
    setActiveEdit,
    guides,
    battlefields,
}: {
    deckInfo: Deck;
    setActiveEdit: (deckInfo: Deck) => void;
    guides: DecksGuide;
    battlefields: Battlefield[];
}): JSX.Element {
    return (
        <>
            <td>{deckInfo.rating.default}</td>
            <td>{deckInfo.rating.c8}</td>
            <td>{deckInfo.rating.c9}</td>
            <td>{deckInfo.rating.c10}</td>
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
                {
                    battlefields.find(
                        battlefield => battlefield.id === deckInfo.battlefield
                    )?.name
                }
            </td>
            <td>
                <div className='deck-guide-labels'>
                    {deckInfo.guide.map((guide, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={i}>
                            {guides.find(g => g.id === guide)?.name ||
                                'Auto Detect'}
                        </div>
                    ))}
                </div>
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
    const { wiki } = useSelector((state: RootState) => state.fetchWikiReducer);
    const filterRef = useRef(null as null | HTMLDivElement);
    const [decks, setDecks] = useState<Decks>([]);
    const [guides, setGuides] = useState<DecksGuide>([]);
    const initialNewDeckState = {
        id: -1,
        rating: {
            default: 0,
        } as Deck['rating'],
        type: 'PvP' as
            | 'PvP'
            | 'Co-op'
            | 'Co-op (Solo)'
            | 'Co-op (Pair)'
            | 'Crew',
        decks: [[0, 1, 2, 3, 4]] as DiceType['id'][][],
        guide: [-1],
        battlefield: -1,
    };
    const [deckToAdd, setDeckToAdd] = useState({ ...initialNewDeckState });
    const [deckToDelete, setDeckToDelete] = useState({
        id: -1,
        dice: [[]] as DiceType['id'][][],
    });
    const [filter, setFilter] = useState({
        type: '?' as '?' | 'PvP' | 'Co-op' | 'Crew',
        customSearch: -1,
        dice: [] as number[],
    });

    useEffect(() => {
        if (dices) {
            filter.dice = dices
                .filter(dice => dice.rarity === 'Legendary')
                .map(dice => dice.id);
            setFilter({ ...filter });
        }
    }, [dices]);

    const initialEditState = {
        id: -1,
        rating: {
            default: 0,
        } as Deck['rating'],
        type: '-',
        decks: [[]],
        guide: [-1],
        battlefield: -1,
    } as Deck;
    const [activeEdit, setActiveEdit] = useState({ ...initialEditState });
    const invalidRating = !Object.values(activeEdit.rating).every(
        rating => typeof rating === 'undefined' || (rating >= 0 && rating <= 10)
    );
    const invalidRatingToAdd = !Object.values(deckToAdd.rating).every(
        rating => typeof rating === 'undefined' || (rating >= 0 && rating <= 10)
    );

    useEffect(() => {
        database
            .ref('/decks')
            .once('value')
            .then(snapshot => setDecks(snapshot.val()));
        database
            .ref('/decks_guide')
            .once('value')
            .then(snapshot => setGuides(snapshot.val()));
    }, []);

    const sortDecksAndUpdate = (deckList: Decks): void => {
        deckList.sort((a, b) => {
            if (a.rating.default > b.rating.default) {
                return -1;
            }
            if (a.rating.default < b.rating.default) {
                return 1;
            }
            if (a.rating.default === b.rating.default) {
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
        fetchDecks(dispatch);
    };

    const updateDecks = (): void => {
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
        if (clone.type === 'Co-op (Pair)' || clone.type === 'Co-op (Solo)') {
            clone.type = 'Co-op';
        }
        sortDecksAndUpdate([...decks, clone as Deck]);
        dispatch({ type: CLOSE_POPUP });
    };

    if (!dices?.length || !decks?.length || !wiki?.battlefield?.length) {
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
                {invalidRating ? (
                    <span className='invalid-warning'>
                        Invalid Rating Input.
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
                    {['default', 'c8', 'c9', 'c10'].map(ratingType => (
                        <label
                            htmlFor={`${ratingType}-rating`}
                            key={ratingType}
                        >
                            <div>
                                {ratingType === 'default'
                                    ? 'Default'
                                    : 'Optional'}{' '}
                                Rating
                            </div>
                            <div>
                                {
                                    ({
                                        default: '(c7 Legends, < 600%)',
                                        c8: '(c8 Legends, 600% - 900%)',
                                        c9: '(c9 Legends, 900% - 1200%)',
                                        c10: '(c10+ Legends, > 1200%)',
                                    } as { [key: string]: string })[ratingType]
                                }
                            </div>
                            <input
                                defaultValue={
                                    ratingType === 'default' ? 0 : undefined
                                }
                                type='number'
                                min={0}
                                max={10}
                                step={0.25}
                                className={invalidRatingToAdd ? 'invalid' : ''}
                                onChange={(evt): void => {
                                    const clone = {
                                        ...deckToAdd,
                                    };
                                    clone.rating[
                                        ratingType as keyof Deck['rating']
                                    ] = Number(evt.target.value);
                                    setDeckToAdd(clone);
                                }}
                            />
                        </label>
                    ))}
                    <label htmlFor='deck-type'>
                        Deck Type:{' '}
                        <select
                            defaultValue='PvP'
                            onChange={(evt): void => {
                                const clone = {
                                    ...deckToAdd,
                                };
                                clone.type = evt.target.value as
                                    | 'PvP'
                                    | 'Co-op (Solo)'
                                    | 'Co-op (Pair)'
                                    | 'Crew';
                                if (clone.type === 'Co-op (Pair)') {
                                    clone.decks = [
                                        ...clone.decks,
                                        [0, 1, 2, 3, 4],
                                    ];
                                } else {
                                    clone.decks = [...clone.decks];
                                }
                                setDeckToAdd(clone);
                            }}
                        >
                            <option>PvP</option>
                            <option>Co-op (Solo)</option>
                            <option>Co-op (Pair)</option>
                            <option>Crew</option>
                        </select>
                    </label>
                    {deckToAdd.type === 'Crew' ? null : (
                        <label htmlFor='battlefield'>
                            Battlefield:{' '}
                            <select
                                defaultValue={-1}
                                onChange={(evt): void => {
                                    const clone = {
                                        ...deckToAdd,
                                    };
                                    clone.battlefield = Number(
                                        evt.target.value
                                    );
                                    setDeckToAdd(clone);
                                }}
                            >
                                <option value={-1}>?</option>
                                {wiki.battlefield.map(battlefield => (
                                    <option
                                        key={battlefield.id}
                                        value={battlefield.id}
                                    >
                                        {battlefield.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                    <label htmlFor='dice-list'>
                        Dice List:{' '}
                        <div>
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
                        </div>
                    </label>
                    <label htmlFor='associated-guide'>
                        Associated Deck Guide:{' '}
                        <select
                            defaultValue='PvP'
                            onChange={(evt): void => {
                                const clone = {
                                    ...deckToAdd,
                                };
                                clone.guide[0] = Number(evt.target.value);
                                setDeckToAdd(clone);
                            }}
                        >
                            <option value={-1}>Auto detect</option>
                            {guides.map(guide => (
                                <option key={guide.id} value={guide.id}>
                                    {guide.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    {deckToAdd.type === 'Co-op (Pair)' ? (
                        <>
                            <label htmlFor='dice-list-coop-pair'>
                                Co-op Deck Pair:{' '}
                                <div>
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
                                                                    dieId ===
                                                                        die.id &&
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
                                </div>
                            </label>
                            <label htmlFor='associated-guide'>
                                Associated Deck Guide:{' '}
                                <select
                                    defaultValue='PvP'
                                    onChange={(evt): void => {
                                        const clone = {
                                            ...deckToAdd,
                                        };
                                        clone.guide[1] = Number(
                                            evt.target.value
                                        );
                                        setDeckToAdd(clone);
                                    }}
                                >
                                    <option value={-1}>Auto detect</option>
                                    {guides.map(guide => (
                                        <option key={guide.id} value={guide.id}>
                                            {guide.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </>
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
                    disabled={invalidRatingToAdd}
                >
                    Submit
                </button>
            </PopUp>
            <h3>Update Deck List</h3>
            <p>
                To Edit the decks, press the edit button, once you are done
                editing, press the button again to save the data to the
                database.
            </p>
            <label htmlFor='add-deck'>
                Add a Deck :{' '}
                <button
                    type='button'
                    onClick={(): void => {
                        setDeckToAdd({
                            id: -1,
                            rating: {
                                default: 0,
                            },
                            type: 'PvP',
                            decks: [[0, 1, 2, 3, 4]],
                            guide: [-1],
                            battlefield: -1,
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
            {invalidRating ? (
                <span className='invalid-warning'>Invalid Rating Input.</span>
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
                            | 'Co-op'
                            | 'Crew';
                        setFilter({ ...filter });
                    }}
                >
                    <option>?</option>
                    <option>PvP</option>
                    <option>Co-op</option>
                    <option>Crew</option>
                </select>
            </label>
            <label htmlFor='Custom Search'>
                Custom Search :{' '}
                <select
                    name='Custom Search'
                    defaultValue={filter.customSearch}
                    onChange={(evt): void => {
                        filter.customSearch = Number(evt.target.value);
                        setFilter({ ...filter });
                    }}
                    data-value={filter.customSearch}
                >
                    <option value={-1}>?</option>
                    {dices.map(dice => (
                        <option value={dice.id} key={dice.id}>
                            {dice.name}
                        </option>
                    ))}
                </select>
                <Dice dice={filter.customSearch} />
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
                            const { current } = filterRef;
                            if (current) {
                                current
                                    .querySelectorAll('input[type="checkbox"]')
                                    .forEach(checkbox => {
                                        // eslint-disable-next-line no-param-reassign
                                        (checkbox as HTMLInputElement).checked =
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
                    <div ref={filterRef}>
                        {dices
                            ?.filter(die => die.rarity === 'Legendary')
                            .map(dice => (
                                <div key={dice.id} className='dice-container'>
                                    <Dice dice={dice.id} />
                                    <input
                                        value={dice.id}
                                        type='checkbox'
                                        defaultChecked
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
                            <th>Rating C7</th>
                            <th>Rating C8</th>
                            <th>Rating C9</th>
                            <th>Rating C10</th>
                            <th>Type</th>
                            <th>Deck</th>
                            <th>Battlefield</th>
                            <th>Associated Deck Guide</th>
                            <th>Toggle Edit</th>
                            <th>Remove Deck</th>
                        </tr>
                    </thead>
                    <tbody>
                        {decks
                            .filter(
                                deckInfo =>
                                    (filter.type === '?' ||
                                        filter.type === deckInfo.type) &&
                                    deckInfo.decks.some(deck =>
                                        deck.every(dice =>
                                            dices.find(d => d.id === dice)
                                                ?.rarity === 'Legendary'
                                                ? filter.dice.includes(dice)
                                                : true
                                        )
                                    ) &&
                                    (filter.customSearch === -1
                                        ? true
                                        : deckInfo.decks.some(deck =>
                                              deck.includes(filter.customSearch)
                                          ))
                            )
                            .concat(
                                Array(9)
                                    .fill(-10)
                                    .map((i, j) => ({
                                        id: i - j,
                                        rating: {
                                            default: 0,
                                        },
                                        type: '-',
                                        decks: [[]],
                                        guide: [-1],
                                        battlefield: -1,
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
                                            {['default', 'c8', 'c9', 'c10'].map(
                                                ratingType => (
                                                    <td key={ratingType}>
                                                        <input
                                                            type='number'
                                                            min={0}
                                                            max={10}
                                                            step={0.25}
                                                            defaultValue={
                                                                deckInfo.rating[
                                                                    ratingType as keyof Deck['rating']
                                                                ]
                                                            }
                                                            className={
                                                                invalidRating
                                                                    ? 'invalid'
                                                                    : ''
                                                            }
                                                            onChange={(
                                                                evt
                                                            ): void => {
                                                                const clone = {
                                                                    ...activeEdit,
                                                                };
                                                                const cloneRating = {
                                                                    ...clone.rating,
                                                                };
                                                                cloneRating[
                                                                    ratingType as keyof Deck['rating']
                                                                ] = Number(
                                                                    evt.target
                                                                        .value
                                                                );
                                                                clone.rating = cloneRating;
                                                                setActiveEdit(
                                                                    clone
                                                                );
                                                            }}
                                                        />
                                                    </td>
                                                )
                                            )}
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
                                                            | 'Co-op'
                                                            | 'Crew';
                                                        setActiveEdit(clone);
                                                    }}
                                                >
                                                    <option>PvP</option>
                                                    <option>Co-op</option>
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
                                                <select
                                                    defaultValue={
                                                        deckInfo.battlefield
                                                    }
                                                    disabled={
                                                        activeEdit.type ===
                                                        'Crew'
                                                    }
                                                    onChange={(evt): void => {
                                                        const clone = {
                                                            ...activeEdit,
                                                        };
                                                        clone.battlefield = Number(
                                                            evt.target.value
                                                        );
                                                        setActiveEdit(clone);
                                                    }}
                                                >
                                                    <option value={-1}>
                                                        ?
                                                    </option>
                                                    {wiki.battlefield.map(
                                                        battlefield => (
                                                            <option
                                                                key={
                                                                    battlefield.id
                                                                }
                                                                value={
                                                                    battlefield.id
                                                                }
                                                            >
                                                                {
                                                                    battlefield.name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </td>
                                            <td>
                                                {deckInfo.guide.map(
                                                    (guideId, i) => (
                                                        <select
                                                            // eslint-disable-next-line react/no-array-index-key
                                                            key={i}
                                                            defaultValue={
                                                                guideId
                                                            }
                                                            onChange={(
                                                                evt
                                                            ): void => {
                                                                const clone = {
                                                                    ...activeEdit,
                                                                };
                                                                clone.guide = clone.guide.map(
                                                                    (
                                                                        clonedGuideId,
                                                                        ii
                                                                    ) =>
                                                                        ii === i
                                                                            ? Number(
                                                                                  evt
                                                                                      .target
                                                                                      .value
                                                                              )
                                                                            : clonedGuideId
                                                                );
                                                                setActiveEdit(
                                                                    clone
                                                                );
                                                            }}
                                                        >
                                                            <option value={-1}>
                                                                Auto Detect
                                                            </option>
                                                            {guides.map(
                                                                guide => (
                                                                    <option
                                                                        key={
                                                                            guide.id
                                                                        }
                                                                        value={
                                                                            guide.id
                                                                        }
                                                                    >
                                                                        {
                                                                            guide.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    )
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    type='button'
                                                    onClick={(): void => {
                                                        if (
                                                            activeEdit.rating
                                                                .default !==
                                                                deckInfo.rating
                                                                    .default ||
                                                            activeEdit.rating
                                                                .c8 !==
                                                                deckInfo.rating
                                                                    .c8 ||
                                                            activeEdit.rating
                                                                .c9 !==
                                                                deckInfo.rating
                                                                    .c9 ||
                                                            activeEdit.rating
                                                                .c10 !==
                                                                deckInfo.rating
                                                                    .c10 ||
                                                            activeEdit.battlefield !==
                                                                deckInfo.battlefield ||
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
                                                            ) ||
                                                            activeEdit.guide.some(
                                                                (guide, i) =>
                                                                    guide !==
                                                                    deckInfo
                                                                        .guide[
                                                                        i
                                                                    ]
                                                            )
                                                        ) {
                                                            if (invalidRating) {
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
                                            guides={guides}
                                            battlefields={wiki.battlefield}
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
