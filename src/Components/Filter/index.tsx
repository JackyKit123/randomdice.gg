import React, { useContext, useRef } from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dice from 'Components/Dice';
import useRootStateSelector from 'Redux';
import { DeckList, DiceList, Die } from 'types/database';
import { FilterContext } from './context';

function DeckTypeFilter({
    withOptionalDeckType,
}: {
    withOptionalDeckType: boolean;
}): JSX.Element {
    const { deckType, setDeckType } = useContext(FilterContext);

    return (
        <label htmlFor='co-opPvp'>
            <span>Deck Type :</span>
            <select
                value={deckType}
                onChange={(evt): void =>
                    setDeckType(evt.target.value as typeof deckType)
                }
            >
                {withOptionalDeckType && <option value='?'>?</option>}
                <option value='pvp'>PvP</option>
                <option value='co-op'>Co-op</option>
                <option value='crew'>Crew</option>
            </select>
        </label>
    );
}

function DeckProfileFilter(): JSX.Element {
    const { profile, setProfile } = useContext(FilterContext);

    return (
        <label htmlFor='profile'>
            <span>Legendary Class & Crit% Setting:</span>
            <select
                value={profile}
                onChange={(evt): void =>
                    setProfile(evt.target.value as typeof profile)
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
    dice: DiceList;
}

function CustomSearchFilter({ dice }: DiceListProps): JSX.Element {
    const { customSearch, setCustomSearch } = useContext(FilterContext);

    return (
        <label htmlFor='Custom Search'>
            <span>Custom Search :</span>
            <select
                name='Custom Search'
                value={customSearch}
                onChange={(evt): void =>
                    setCustomSearch(Number(evt.target.value))
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
            <Dice die={customSearch} />
        </label>
    );
}

function LegendaryListFilter({ dice }: DiceListProps): JSX.Element {
    const { legendaryOwned, setLegendaryOwned } = useContext(FilterContext);
    const allLegendaryDice = dice
        .filter(die => die.rarity === 'Legendary')
        .map(die => die.id);
    const legendaryOwnedFilterRef = useRef(null as null | HTMLDivElement);
    const selectedAll = legendaryOwned.length === allLegendaryDice.length;

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
                        setLegendaryOwned(
                            target.innerText === 'Select All'
                                ? dice
                                      .filter(die => die.rarity === 'Legendary')
                                      .map(die => die.id)
                                : []
                        );
                    }}
                >
                    {selectedAll ? 'Deselect All' : 'Select All'}
                </button>
            </div>
            <div className='filter-container' ref={legendaryOwnedFilterRef}>
                {allLegendaryDice.map((die: Die['id']) => (
                    <div className='legendary-filter' key={die}>
                        <Dice die={die} />
                        <input
                            value={die}
                            type='checkbox'
                            checked={legendaryOwned.includes(die)}
                            onChange={(evt): void =>
                                setLegendaryOwned(
                                    legendaryOwned.includes(die)
                                        ? legendaryOwned.filter(
                                              dieId =>
                                                  dieId !==
                                                  Number(evt.target.value)
                                          )
                                        : [
                                              ...legendaryOwned,
                                              Number(evt.target.value),
                                          ]
                                )
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

export default function FilterForm({
    withOptionalDeckType = false,
}: {
    withOptionalDeckType?: boolean;
}): JSX.Element {
    const { dice } = useRootStateSelector('fetchFirebaseReducer');

    return (
        <form className='filter'>
            <div className='top-label'>
                <DeckTypeFilter withOptionalDeckType={withOptionalDeckType} />
                <DeckProfileFilter />
                {dice && <CustomSearchFilter dice={dice} />}
            </div>
            <div className='lower-label'>
                {dice && <LegendaryListFilter dice={dice} />}
            </div>
        </form>
    );
}

export function useDeckFilter(decksList: DeckList): DeckList {
    const { dice } = useRootStateSelector('fetchFirebaseReducer');
    const { legendaryOwned, customSearch, profile, deckType } = useContext(
        FilterContext
    );

    const filteredDeck =
        decksList.filter(
            deckData =>
                deckData.decks.some(deck =>
                    deck.every(die =>
                        dice?.find(d => d.id === die)?.rarity === 'Legendary'
                            ? legendaryOwned.includes(die)
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

export * from './context';
