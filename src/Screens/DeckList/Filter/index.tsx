import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dice from 'Components/Dice';
import { Dice as DiceType } from 'Redux/Fetch Firebase/Dices/types';
import { RootState } from 'Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, FILTER_ACTION } from 'Redux/Deck Filter/types';
import { Deck, Decks } from 'Redux/Fetch Firebase/Decks/types';

function useUpdateFilter(): (filterState: Filter) => void {
    const dispatch = useDispatch();

    return (filterState: Filter): void => {
        dispatch({
            type: FILTER_ACTION,
            payload: { ...filterState },
        });
    };
}

function DeckTypeFilter(): JSX.Element {
    const history = useHistory();
    const filter = useSelector((state: RootState) => state.filterReducer);
    const { deckType } = filter;
    const setFilter = useUpdateFilter();

    return (
        <label htmlFor='co-opPvp'>
            <span>Deck Type :</span>
            <select
                value={deckType}
                onChange={(evt): void => {
                    setFilter({
                        ...filter,
                        deckType: evt.target.value as typeof deckType,
                    });
                    history.push(`/decks/${evt.target.value.toLowerCase()}`);
                }}
            >
                <option value='pvp'>PvP</option>
                <option value='co-op'>Co-op</option>
                <option value='crew'>Crew</option>
            </select>
        </label>
    );
}

function DeckProfileFilter(): JSX.Element {
    const filter = useSelector((state: RootState) => state.filterReducer);
    const { profile } = filter;
    const setFilter = useUpdateFilter();

    return (
        <label htmlFor='profile'>
            <span>Legendary Class & Crit% Setting:</span>
            <select
                value={profile}
                onChange={(evt): void =>
                    setFilter({
                        ...filter,
                        profile: evt.target.value as typeof profile,
                    })
                }
            >
                <option value='default'>Class 7, {'<'} 600% Crit</option>
                <option value='c8'>Class 8, 600% - 900% Crit</option>
                <option value='c9'>Class 9, 900% - 1200% Crit</option>
                <option value='c10'>Class 10+, {'>'} 1200% Crit</option>
            </select>
        </label>
    );
}

interface DiceListProps {
    dice: DiceType[];
}

function CustomSearchFilter({ dice }: DiceListProps): JSX.Element {
    const filter = useSelector((state: RootState) => state.filterReducer);
    const { customSearch } = filter;
    const setFilter = useUpdateFilter();

    return (
        <label htmlFor='Custom Search'>
            <span>Custom Search :</span>
            <select
                name='Custom Search'
                value={customSearch}
                onChange={(evt): void =>
                    setFilter({
                        ...filter,
                        customSearch: Number(evt.target.value),
                    })
                }
                data-value={customSearch}
            >
                <option value={-1}>?</option>
                {dice?.map(die => (
                    <option value={die.id} key={die.id}>
                        {die.name}
                    </option>
                ))}
            </select>
            <Dice dice={customSearch} />
        </label>
    );
}

function LegendaryListFilter({ dice }: DiceListProps): JSX.Element {
    const filter = useSelector((state: RootState) => state.filterReducer);
    const { legendary } = filter;
    const setFilter = useUpdateFilter();
    const legendaryList = dice
        .filter(die => die.rarity === 'Legendary')
        .map(die => die.id);
    const legendaryOwnedFilterRef = useRef(null as null | HTMLDivElement);
    const selectedAll = legendary.length === legendaryList.length;
    useEffect(() => {
        if (legendaryList.length > 0 && legendary.length === 0) {
            setFilter({ ...filter, legendary: legendaryList });
        }
    }, [dice]);

    return (
        <label htmlFor='legendaryOwned'>
            <div className='label'>
                <span>Legendary Owned :</span>
                <button
                    type='button'
                    data-select-all={selectedAll}
                    onClick={(evt): void => {
                        const target = evt.target as HTMLButtonElement;
                        const { current } = legendaryOwnedFilterRef;
                        if (current) {
                            current
                                .querySelectorAll('input[type="checkbox"]')
                                .forEach(checkbox => {
                                    // eslint-disable-next-line no-param-reassign
                                    (checkbox as HTMLInputElement).checked = !selectedAll;
                                });
                        }
                        setFilter({
                            ...filter,
                            legendary:
                                target.innerText === 'Select All'
                                    ? dice
                                          .filter(
                                              die => die.rarity === 'Legendary'
                                          )
                                          .map(die => die.id)
                                    : [],
                        });
                    }}
                >
                    {selectedAll ? 'Deselect All' : 'Select All'}
                </button>
            </div>
            <div className='filter-container' ref={legendaryOwnedFilterRef}>
                {legendaryList.map((die: DiceType['id']) => (
                    <div className='legendary-filter' key={die}>
                        <Dice dice={die} />
                        <input
                            value={die}
                            type='checkbox'
                            checked={legendary.includes(die)}
                            onChange={(evt): void =>
                                setFilter({
                                    ...filter,
                                    legendary: legendary.includes(die)
                                        ? legendaryList.filter(
                                              dieId =>
                                                  dieId !==
                                                  Number(evt.target.value)
                                          )
                                        : [
                                              ...legendaryList,
                                              Number(evt.target.value),
                                          ],
                                })
                            }
                        />
                        <span className='checkbox-styler'>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                    </div>
                ))}
            </div>
        </label>
    );
}

export default function FilterForm(): JSX.Element {
    const { dices: dice } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );

    return (
        <form className='filter'>
            <div className='top-label'>
                <DeckTypeFilter />
                <DeckProfileFilter />
                {dice && <CustomSearchFilter dice={dice} />}
            </div>
            <div className='lower-label'>
                {dice && <LegendaryListFilter dice={dice} />}
            </div>
        </form>
    );
}

export function useDeckFilter(
    decksList: Decks,
    deckType: Lowercase<Deck['type']>
): Decks {
    const { dices: dice } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { legendary, customSearch, profile } = useSelector(
        (state: RootState) => state.filterReducer
    );

    const filteredDeck =
        decksList.filter(
            deckData =>
                deckData.decks.some(deck =>
                    deck.every(die =>
                        dice?.find(d => d.id === die)?.rarity === 'Legendary'
                            ? legendary.includes(die)
                            : true
                    )
                ) &&
                deckData.type.toLowerCase() === deckType &&
                (customSearch === -1
                    ? true
                    : deckData.decks.some(deck => deck.includes(customSearch)))
        ) ?? [];
    while (filteredDeck.length < 7 && filteredDeck.length !== 0) {
        filteredDeck.push({
            id: filteredDeck.length,
            type: '-',
            rating: {
                default: 0,
            },
            decks: [[-1, -2, -3, -4, -5]],
            guide: [-1],
            battlefield: -1,
        });
    }

    const sortedDeck = [...filteredDeck];
    sortedDeck.sort((deckA, deckB) => {
        const ratingA = deckA.rating[profile] || deckA.rating.default;
        const ratingB = deckB.rating[profile] || deckB.rating.default;
        if (ratingA > ratingB) {
            return -1;
        }
        if (ratingA < ratingB) {
            return 1;
        }
        if (ratingA === ratingB) {
            if (deckA.id > deckB.id) {
                return 1;
            }
            return -1;
        }
        return 0;
    });

    return sortedDeck;
}
