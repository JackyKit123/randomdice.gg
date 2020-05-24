import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Components/Redux Storage/store';
import Main from '../../Components/Main/main';
import { fetchDecks, fetchDices, clearError } from '../fetchData';
import Dice from '../../Components/Dice/dice';
import DiceList from '../../Components/Dice/dicelist';
import './decklist.less';

export default function DeckList(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state);
    const { error } =
        selection.fetchDecksReducer || selection.fetchDicesReducer;
    let { decks } = selection.fetchDecksReducer;
    const { dices } = selection.fetchDicesReducer;

    const [filter1, setFilter1] = useState('PvP');
    const [filter2, setFilter2] = useState(
        DiceList.legendary.map(legendary => ({
            name: legendary,
            checked: true,
        }))
    );
    const [filter3, setFilter3] = useState('?');
    const legendaryMissing = filter2
        .filter(filter => !filter.checked)
        .map(filter => dices?.find(dice => dice.name === filter.name)?.id);
    const customSearch = dices?.find(dice => dice.name === filter3)?.id || '';

    let jsx = <div />;
    if (decks && decks.length > 0) {
        const deckKeys = Object.keys(decks[0]);
        decks = decks.filter(deckData => {
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
        });
        jsx = (
            <>
                <form>
                    <label htmlFor='pvepvp'>
                        PVE / PVE
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
                    <label htmlFor='legendariesOwned'>
                        Legendaries Owned:
                        {DiceList.legendary.map((legendary: string, i) => (
                            <div key={legendary}>
                                <Dice dice={legendary} />
                                <input
                                    name={legendary}
                                    type='checkbox'
                                    defaultChecked
                                    onChange={(evt): void => {
                                        filter2[i].checked = evt.target.checked;
                                        setFilter2([...filter2]);
                                    }}
                                />
                            </div>
                        ))}
                    </label>
                    <label htmlFor='Custom Search'>
                        Custom Search:
                        <select
                            name='Custom Search'
                            onChange={(evt): void =>
                                setFilter3(evt.target.value)
                            }
                        >
                            <option>?</option>
                            {Object.values(DiceList)
                                .flat()
                                .map(dice => (
                                    <option key={dice}>{dice}</option>
                                ))}
                        </select>
                    </label>
                </form>
                <table>
                    <tbody>
                        <tr>
                            {deckKeys.map(key => {
                                return <th key={key}>{key}</th>;
                            })}
                        </tr>
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
                                                data
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>Your Search returned no result!</tr>
                        )}
                    </tbody>
                </table>
            </>
        );
    } else if (error) {
        jsx = (
            <>
                <h3 className='error'>Oops! Something went wrong.</h3>
                <h4 className='error error-message'>{error.message}</h4>
                <button
                    type='button'
                    className='error-retry'
                    onClick={(): void => {
                        clearError(dispatch);
                        fetchDecks(dispatch);
                        fetchDices(dispatch);
                    }}
                >
                    Click Here to try again
                </button>
            </>
        );
    } else {
        jsx = <div>Loading...</div>;
    }
    return <Main title='Deck List' content={jsx} />;
}
