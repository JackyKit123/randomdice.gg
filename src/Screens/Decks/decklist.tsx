import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../Components/Redux Storage/store';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import { fetchDecks, fetchDices, clearError } from '../Misc/fetchData';
import Dice from '../../Components/Dice/dice';
import Dicelist from '../../Components/Dice/dicelist';
import './decklist.less';
import { FILTER_ACTION } from '../../Components/Redux Storage/Deck Filter/types';

export default function DeckList({
    deckType,
}: {
    deckType: string;
}): JSX.Element {
    const history = useHistory();
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state);
    const { error } =
        selection.fetchDecksReducer || selection.fetchDicesReducer;
    let { decks } = selection.fetchDecksReducer;
    const { dices } = selection.fetchDicesReducer;
    const { filter } = selection.filterReducer;
    const dicelist = Dicelist(dices);

    if (dicelist.common.length > 0 && filter.legendary.length === 0) {
        dispatch({
            type: FILTER_ACTION,
            payload: {
                legendary: dicelist.legendary.map(legendary => ({
                    name: legendary,
                    checked: true,
                })),
                customSearch: filter.customSearch,
            },
        });
    }
    const legendaryMissing = filter.legendary
        .filter(legendary => !legendary.checked)
        .map(
            legendary => dices?.find(dice => dice.name === legendary.name)?.id
        );
    const customSearch =
        dices?.find(dice => dice.name === filter.customSearch)?.id || 0;

    let jsx = <div />;
    if (
        decks &&
        dicelist.common.length > 0 &&
        decks.length > 0 &&
        filter.legendary.length > 0
    ) {
        const Checkbox = ({
            legendary,
            i,
        }: {
            legendary: string;
            i: number;
        }): JSX.Element => (
            <input
                name={legendary}
                type='checkbox'
                defaultChecked={filter.legendary[i].checked}
                onChange={(evt): void => {
                    filter.legendary[i].checked = evt.target.checked;
                    dispatch({
                        type: FILTER_ACTION,
                        payload: filter,
                    });
                }}
            />
        );
        const deckKeys = Object.keys(decks[0]);
        decks = decks
            .filter(deckData => {
                const deck = [
                    deckData.slot1,
                    deckData.slot2,
                    deckData.slot3,
                    deckData.slot4,
                    deckData.slot5,
                ];
                return (
                    deck.every(dice => !legendaryMissing.includes(dice)) &&
                    deckData.type === deckType &&
                    (filter.customSearch === '?'
                        ? true
                        : deck.includes(customSearch))
                );
            })
            .map(deck => {
                const tempDeck = deck;
                if (!tempDeck.updated) {
                    tempDeck.updated = '-';
                }
                return tempDeck;
            });
        while (decks.length < 9 && decks.length !== 0) {
            decks.push({
                id: decks.length,
                type: '-',
                rating: 0,
                slot1: 0,
                slot2: 0,
                slot3: 0,
                slot4: 0,
                slot5: 0,
                added: '-',
                updated: '-',
            });
        }
        jsx = (
            <>
                <form className='filter'>
                    <div className='top-label'>
                        <label htmlFor='pvepvp'>
                            <span>PVE / PVE :</span>
                            <button
                                type='button'
                                name='pvepvp'
                                onClick={(): void =>
                                    history.replace(
                                        deckType === 'PvP' ? 'pve' : 'pvp'
                                    )
                                }
                            >
                                Switch to {deckType === 'PvP' ? 'PvE ' : 'PvP '}
                                view
                            </button>
                        </label>
                        <label htmlFor='Custom Search'>
                            <span>Custom Search :</span>
                            <select
                                name='Custom Search'
                                onChange={(evt): void => {
                                    filter.customSearch = evt.target.value;
                                    dispatch({
                                        type: FILTER_ACTION,
                                        payload: filter,
                                    });
                                }}
                                data-value={filter.customSearch}
                            >
                                <option value='?'>?</option>
                                {Object.values(dicelist)
                                    .flat()
                                    .map(dice => (
                                        <option value={dice} key={dice}>
                                            {dice}
                                        </option>
                                    ))}
                            </select>
                            <Dice dice={filter.customSearch} />
                        </label>
                    </div>
                    <div className='lower-label'>
                        <label htmlFor='legendariesOwned'>
                            <div className='label'>
                                <span>Legendaries Owned :</span>
                                <button
                                    type='button'
                                    data-select-all={filter.legendary.every(
                                        legendary => legendary.checked
                                    )}
                                    onClick={(): void => {
                                        filter.legendary = filter.legendary.map(
                                            legendary => ({
                                                name: legendary.name,
                                                checked: !filter.legendary.every(
                                                    f => f.checked
                                                ),
                                            })
                                        );
                                        dispatch({
                                            type: FILTER_ACTION,
                                            payload: filter,
                                        });
                                    }}
                                >
                                    {filter.legendary.every(f => f.checked)
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </button>
                            </div>
                            {dicelist.legendary.map((legendary: string, i) => (
                                <div
                                    className='legendary-filter'
                                    key={legendary}
                                >
                                    <Dice dice={legendary} />
                                    <Checkbox legendary={legendary} i={i} />
                                    <span className='checkbox-styler'>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                </div>
                            ))}
                        </label>
                    </div>
                </form>
                <div className='filter-divisor' />
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                {deckKeys.map(key => {
                                    return <th key={key}>{key}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {decks.length > 0 ? (
                                decks.map(deck => (
                                    <tr key={`deck-${deck.id}`}>
                                        {Object.values(deck).map((data, i) => (
                                            <td
                                                key={`deck-${deck.id}-datapoint-${deckKeys[i]}`}
                                            >
                                                {/* eslint-disable-next-line no-nested-ternary */}
                                                {deckKeys[i].match(
                                                    /^slot[1-5]$/
                                                ) ? (
                                                    <Dice dice={Number(data)} />
                                                ) : deck.type === '-' ? (
                                                    '-'
                                                ) : (
                                                    data
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr className='nomatch'>
                                    <td>Your Search returned no result!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    clearError(dispatch);
                    fetchDecks(dispatch);
                    fetchDices(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main
            title={`Deck List (${deckType})`}
            className='deck-list'
            content={jsx}
        />
    );
}

export const pvpDeck = (): JSX.Element => <DeckList deckType='PvP' />;
export const pveDeck = (): JSX.Element => <DeckList deckType='PvE' />;
