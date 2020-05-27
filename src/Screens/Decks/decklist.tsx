import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../Components/Redux Storage/store';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import { fetchDecks, fetchDices, clearError } from '../Misc/fetchData';
import Dice from '../../Components/Dice/dice';
import Dicelist from '../../Components/Dice/dicelist';
import './decklist.less';

export default function DeckList(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state);
    const { error } =
        selection.fetchDecksReducer || selection.fetchDicesReducer;
    let { decks } = selection.fetchDecksReducer;
    const { dices } = selection.fetchDicesReducer;
    const dicelist = Dicelist(dices);

    const [filter1, setFilter1] = useState('PvP');
    const [filter2, setFilter2] = useState(
        dicelist.legendary.map(legendary => ({
            name: legendary,
            checked: true,
        }))
    );
    if (dicelist.common.length > 0 && filter2.length === 0) {
        setFilter2(
            dicelist.legendary.map(legendary => ({
                name: legendary,
                checked: true,
            }))
        );
    }
    const [filter3, setFilter3] = useState('?');
    const legendaryMissing = filter2
        .filter(filter => !filter.checked)
        .map(filter => dices?.find(dice => dice.name === filter.name)?.id);
    const customSearch = dices?.find(dice => dice.name === filter3)?.id || '';

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
            defaultChecked={filter2[i].checked}
            onChange={(evt): void => {
                filter2[i].checked = evt.target.checked;
                setFilter2([...filter2]);
            }}
        />
    );

    let jsx = <div />;
    if (decks && dicelist.common.length > 0 && decks.length > 0) {
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
                    deckData.type === filter1 &&
                    (filter3 === '?' ? true : deck.indexOf(customSearch) > 0)
                );
            })
            .map(deck => {
                const tempDeck = deck;
                tempDeck.name = '-';
                if (!tempDeck.updated) {
                    tempDeck.updated = '-';
                }
                return tempDeck;
            });
        while (decks.length < 9 && decks.length !== 0) {
            decks.push({
                id: `xxx-${decks.length}`,
                name: '-',
                type: filter1,
                rating: '-',
                slot1: '0',
                slot2: '0',
                slot3: '0',
                slot4: '0',
                slot5: '0',
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
                            <select
                                name='pvepvp'
                                onChange={(evt): void =>
                                    setFilter1(evt.target.value)
                                }
                            >
                                <option value='PvP'>PvP</option>
                                <option value='PvE'>PvE</option>
                            </select>
                        </label>
                        <label htmlFor='Custom Search'>
                            <span>Custom Search :</span>
                            <select
                                name='Custom Search'
                                onChange={(evt): void =>
                                    setFilter3(evt.target.value)
                                }
                                data-value={filter3}
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
                            <Dice dice={filter3} />
                        </label>
                    </div>
                    <div className='lower-label'>
                        <label htmlFor='legendariesOwned'>
                            <div className='label'>
                                <span>Legendaries Owned :</span>
                                <input
                                    type='submit'
                                    value={
                                        filter2.every(filter => filter.checked)
                                            ? 'Deselect All'
                                            : 'Select All'
                                    }
                                    onClick={(
                                        evt: React.MouseEvent<HTMLInputElement>
                                    ): void => {
                                        evt.preventDefault();
                                        const {
                                            value,
                                        } = evt?.target as HTMLInputElement;
                                        setFilter2(
                                            filter2.map(filter => {
                                                return {
                                                    name: filter.name,
                                                    checked:
                                                        value === 'Select All',
                                                };
                                            })
                                        );
                                    }}
                                />
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
                                                {deckKeys[i].match(
                                                    /^slot[1-5]$/
                                                ) ? (
                                                    <Dice dice={Number(data)} />
                                                ) : (
                                                    data?.replace(/-[1-9]/, '')
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
    return <Main title='Deck List' className='deck-list' content={jsx} />;
}
