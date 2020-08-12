/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory, useLocation } from 'react-router-dom';
import { RootState } from '../../Misc/Redux Storage/store';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import GoogleAds from '../../Components/Ad Unit/ad';
import Dice from '../../Components/Dice/dice';
import PopUp from '../../Components/PopUp Overlay/popup';
import { FILTER_ACTION } from '../../Misc/Redux Storage/Deck Filter/types';
import { fetchDecks, fetchDices } from '../../Misc/Firebase/fetchData';
import { CLEAR_ERRORS } from '../../Misc/Redux Storage/Fetch Firebase/types';
import './decklist.less';
import { OPEN_POPUP } from '../../Misc/Redux Storage/PopUp Overlay/types';
import ShareButtons from '../../Components/Social Media Share/share';

export default function DeckList(): JSX.Element {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state);
    const { error } =
        selection.fetchDecksReducer || selection.fetchDicesReducer;
    const { decks } = selection.fetchDecksReducer;
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { filter } = selection.filterReducer;
    const deckType = location.pathname
        .replace(/^\/decks\//i, '')
        .toLowerCase() as 'pvp' | 'pve' | 'crew';

    const legendaryList =
        dices
            ?.filter(dice => dice.rarity === 'Legendary')
            .map(dice => dice.name) || [];
    const [findAlt, setFindAlt] = useState([] as string[]);

    useEffect(() => {
        if (legendaryList.length > 0 && filter.legendary.length === 0) {
            dispatch({
                type: FILTER_ACTION,
                payload: {
                    legendary: legendaryList,
                    customSearch: filter.customSearch,
                },
            });
        }
    }, [dices]);

    let jsx;
    if (dices && decks && decks.length > 0) {
        const Checkbox = ({
            legendary,
        }: {
            legendary: string;
        }): JSX.Element => (
            <input
                name={legendary}
                type='checkbox'
                defaultChecked={filter.legendary.includes(legendary)}
                onChange={(evt): void => {
                    if (evt.target.checked) {
                        filter.legendary = [
                            ...filter.legendary,
                            evt.target.name,
                        ];
                    } else {
                        filter.legendary = filter.legendary.filter(
                            l => l !== evt.target.name
                        );
                    }
                    dispatch({
                        type: FILTER_ACTION,
                        payload: { ...filter },
                    });
                }}
            />
        );

        const options = [
            dices.find(alt => alt.name === findAlt[0]),
            dices.find(alt => alt.name === findAlt[1]),
            dices.find(alt => alt.name === findAlt[2]),
            dices.find(alt => alt.name === findAlt[3]),
            dices.find(alt => alt.name === findAlt[4]),
        ];

        const deckKeys = [
            'id',
            'type',
            'rating',
            'slot1',
            'slot2',
            'slot3',
            'slot4',
            'slot5',
            'alternatives',
            'added',
            'updated',
        ];

        const filteredDeck = decks
            .filter(deckData => {
                const deck = [
                    deckData.slot1,
                    deckData.slot2,
                    deckData.slot3,
                    deckData.slot4,
                    deckData.slot5,
                ];
                return (
                    deck.every(dice =>
                        dices.find(d => d.name === dice)?.rarity === 'Legendary'
                            ? filter.legendary.includes(dice)
                            : true
                    ) &&
                    deckData.type.toLowerCase() === deckType &&
                    (filter.customSearch === '?'
                        ? true
                        : deck.includes(filter.customSearch))
                );
            })
            .map(deck => {
                return {
                    id: deck.id,
                    type: deck.type,
                    rating: deck.rating,
                    slot1: deck.slot1,
                    slot2: deck.slot2,
                    slot3: deck.slot3,
                    slot4: deck.slot4,
                    slot5: deck.slot5,
                    alternatives: [
                        deck.slot1,
                        deck.slot2,
                        deck.slot3,
                        deck.slot4,
                        deck.slot5,
                    ],
                    added: deck.added,
                    updated: deck.updated ? deck.updated : '-',
                };
            });
        while (filteredDeck.length < 9 && filteredDeck.length !== 0) {
            filteredDeck.push({
                id: filteredDeck.length,
                type: '-',
                rating: 0,
                slot1: '?',
                slot2: '?',
                slot3: '?',
                slot4: '?',
                slot5: '?',
                alternatives: [],
                added: '-',
                updated: '-',
            });
        }

        jsx = (
            <>
                <p>
                    This is a interactive deck list for PVP, PVE and Crew decks.
                    You can filter the legendary you have below. In this page{' '}
                    <strong>{deckType} decks</strong> are shown, you can switch
                    the deck type below. You can also specify a dice in Custom
                    Search, which will show the decks with the dice you
                    specified.
                </p>
                <p>
                    We know that that not everyone have every legendary dices
                    for every decks, so you can click on the button in
                    alternatives column to show yourself some alternative
                    options for some legendary dice.
                </p>
                <hr className='divisor' />
                <PopUp popUpTarget='alt'>
                    <h3>Alternatives List</h3>
                    <div className='original'>
                        <Dice dice={findAlt[0]} />
                        <Dice dice={findAlt[1]} />
                        <Dice dice={findAlt[2]} />
                        <Dice dice={findAlt[3]} />
                        <Dice dice={findAlt[4]} />
                    </div>
                    {options?.map((alt, i) => (
                        <div key={Number(new Date()) + Math.random() + i}>
                            <Dice dice={findAlt[i]} />
                            <h4>
                                {alt?.alternatives?.desc
                                    ? alt?.alternatives?.desc
                                    : 'You should not need to replace this.'}
                            </h4>
                            {alt?.alternatives?.desc ? (
                                <h5>Alternatives :</h5>
                            ) : null}
                            <div className='replacement'>
                                {options[
                                    i
                                ]?.alternatives?.list.map((altDice: string) =>
                                    altDice ? (
                                        <Dice dice={altDice} key={altDice} />
                                    ) : null
                                )}
                            </div>
                        </div>
                    ))}
                </PopUp>
                <form className='filter'>
                    <div className='top-label'>
                        <label htmlFor='pvePvp'>
                            <span>Deck Type :</span>
                            <select
                                value={deckType}
                                onChange={(evt): void =>
                                    history.push(
                                        `/decks/${evt.target.value.toLowerCase()}`
                                    )
                                }
                            >
                                <option value='pvp'>PvP</option>
                                <option value='pve'>PvE</option>
                                <option value='crew'>Crew</option>
                            </select>
                        </label>
                        <label htmlFor='Custom Search'>
                            <span>Custom Search :</span>
                            <select
                                name='Custom Search'
                                defaultValue={filter.customSearch}
                                onChange={(evt): void => {
                                    filter.customSearch = evt.target.value;
                                    dispatch({
                                        type: FILTER_ACTION,
                                        payload: { ...filter },
                                    });
                                }}
                                data-value={filter.customSearch}
                            >
                                <option value='?'>?</option>
                                {dices.map(dice => (
                                    <option value={dice.name} key={dice.name}>
                                        {dice.name}
                                    </option>
                                ))}
                            </select>
                            <Dice dice={filter.customSearch} />
                        </label>
                    </div>
                    <div className='lower-label'>
                        <label htmlFor='legendaryOwned'>
                            <div className='label'>
                                <span>Legendary Owned :</span>
                                <button
                                    type='button'
                                    data-select-all={
                                        filter.legendary.length ===
                                        dices.filter(
                                            d => d.rarity === 'Legendary'
                                        ).length
                                    }
                                    onClick={(): void => {
                                        filter.legendary =
                                            filter.legendary.length ===
                                            legendaryList.length
                                                ? []
                                                : legendaryList;
                                        dispatch({
                                            type: FILTER_ACTION,
                                            payload: { ...filter },
                                        });
                                    }}
                                >
                                    {filter.legendary.length ===
                                    legendaryList.length
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </button>
                            </div>
                            {legendaryList.map((legendary: string) => (
                                <div
                                    className='legendary-filter'
                                    key={legendary}
                                >
                                    <Dice dice={legendary} />
                                    <Checkbox legendary={legendary} />
                                    <span className='checkbox-styler'>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                </div>
                            ))}
                        </label>
                    </div>
                </form>
                <hr className='divisor' />
                <GoogleAds unitId='1144871846' />
                <hr className='divisor' />
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
                            {filteredDeck.length > 0 ? (
                                filteredDeck.map(deck => (
                                    <tr key={`deck-${deck.id}`}>
                                        {Object.values(deck).map((data, i) => (
                                            <td
                                                key={`deck-${deck.id}-datapoint-${deckKeys[i]}`}
                                            >
                                                {deckKeys[i].match(
                                                    /^slot[1-5]$/
                                                ) ? (
                                                    <Dice
                                                        dice={data as string}
                                                    />
                                                ) : deck.type === '-' ? (
                                                    '-'
                                                ) : deckKeys[i] ===
                                                  'alternatives' ? (
                                                    <button
                                                        aria-label='see alternatives'
                                                        type='button'
                                                        onClick={(): void => {
                                                            dispatch({
                                                                type: OPEN_POPUP,
                                                                payload: 'alt',
                                                            });
                                                            setFindAlt(
                                                                data as string[]
                                                            );
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faExchangeAlt}
                                                        />
                                                    </button>
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
                <hr className='divisor' />
                <ShareButtons name='Random Dice Deck List' />
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
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
            title={`Deck List (${
                deckType === 'pvp' ? 'PvP' : deckType === 'pve' ? 'PvE' : 'Crew'
            })`}
            className='deck-list'
        >
            <Helmet>
                <title>
                    Random Dice{' '}
                    {`Deck List (${
                        deckType === 'pvp'
                            ? 'PvP'
                            : deckType === 'pve'
                            ? 'PvE'
                            : 'Crew'
                    })`}
                </title>
                <meta
                    property='og:title'
                    content={`Random Dice ${
                        deckType === 'pvp'
                            ? 'PvP'
                            : deckType === 'pve'
                            ? 'PvE'
                            : 'Crew'
                    } Deck List`}
                />
                <meta
                    property='og:url'
                    content={`https://${process.env.REACT_APP_DOMAIN}${location.pathname}`}
                />
                <meta
                    name='og:description'
                    content='An Interactive Deck List to build your deck for Random Dice! Put your missing legendary and find the best deck for you!'
                />
                <meta
                    name='description'
                    content='An Interactive Deck List to build your deck for Random Dice! Put your missing legendary and find the best deck for you!'
                />

                <link
                    rel='canonical'
                    href={`https://${process.env.REACT_APP_DOMAIN}${location.pathname}`}
                />
            </Helmet>
            {jsx}
        </Main>
    );
}
