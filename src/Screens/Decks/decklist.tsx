/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faExchangeAlt,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory, useLocation } from 'react-router-dom';
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
import { Dice as DiceType } from '../../Misc/Redux Storage/Fetch Firebase/Dices/types';
import { Deck } from '../../Misc/Redux Storage/Fetch Firebase/Decks/types';
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
    const { guide } = selection.fetchDecksGuideReducer;
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { wiki } = useSelector((state: RootState) => state.fetchWikiReducer);
    const filterRef = useRef(null as null | HTMLDivElement);
    const { filter } = selection.filterReducer;
    const deckType = location.pathname
        .replace(/^\/decks\//i, '')
        .toLowerCase() as 'pvp' | 'co-op' | 'crew';

    const legendaryList =
        dices
            ?.filter(dice => dice.rarity === 'Legendary')
            .map(dice => dice.id) || [];
    const [findAlt, setFindAlt] = useState([] as DiceType['id'][]);

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
    if (
        dices?.length &&
        decks?.length &&
        guide?.length &&
        wiki?.battlefield.length
    ) {
        const filteredDeck = decks.filter(
            deckData =>
                deckData.decks.some(deck =>
                    deck.every(dice =>
                        dices.find(d => d.id === dice)?.rarity === 'Legendary'
                            ? filter.legendary.includes(dice)
                            : true
                    )
                ) &&
                deckData.type.toLowerCase() === deckType &&
                (filter.customSearch === -1
                    ? true
                    : deckData.decks.some(deck =>
                          deck.includes(filter.customSearch)
                      ))
        );
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
            const ratingA =
                deckA.rating[filter.profile] || deckA.rating.default;
            const ratingB =
                deckB.rating[filter.profile] || deckB.rating.default;
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
                <p>
                    You can choose to have varying legendary class and crit% to
                    see different ratings for certain decks at certain dice
                    class or level.
                </p>
                <p>
                    {' '}
                    The rating of these {deckType} decks is determined by{' '}
                    {deckType === 'pvp' || deckType === 'crew'
                        ? 'first rating the strongest decks, and then we compare whichever decks can consistency beat one another deck.'
                        : 'a mix of factors for the highest wave, consistency, and the speed of the deck.'}
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
                    {findAlt
                        .map(alt => ({
                            id: alt,
                            alternatives: dices.find(die => die.id === alt)
                                ?.alternatives,
                        }))
                        .map(die => (
                            <div key={die.id}>
                                <Dice dice={die.id} />
                                {die.alternatives ? (
                                    <>
                                        <h4>{die.alternatives.desc}</h4>
                                        <h5>Alternatives :</h5>
                                        <div className='replacement'>
                                            {die.alternatives.list.map(
                                                altDice =>
                                                    altDice ? (
                                                        <Dice
                                                            dice={altDice}
                                                            key={altDice}
                                                        />
                                                    ) : null
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <h4>
                                        You should not need to replace this.
                                    </h4>
                                )}
                            </div>
                        ))}
                </PopUp>
                <form className='filter'>
                    <div className='top-label'>
                        <label htmlFor='co-opPvp'>
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
                                <option value='co-op'>Co-op</option>
                                <option value='crew'>Crew</option>
                            </select>
                        </label>
                        <label htmlFor='profile'>
                            <span>Legendary Class & Crit% Setting:</span>
                            <select
                                defaultValue={filter.profile}
                                onChange={(evt): void => {
                                    filter.profile = evt.target
                                        .value as keyof Deck['rating'];
                                    dispatch({
                                        type: FILTER_ACTION,
                                        payload: { ...filter },
                                    });
                                }}
                            >
                                <option value='default'>
                                    Class 7, {'<'} 600% Crit
                                </option>
                                <option value='c8'>
                                    Class 8, 600% - 900% Crit
                                </option>
                                <option value='c9'>
                                    Class 9, 900% - 1200% Crit
                                </option>
                                <option value='c10'>
                                    Class 10+, {'>'} 1200% Crit
                                </option>
                            </select>
                        </label>
                        <label htmlFor='Custom Search'>
                            <span>Custom Search :</span>
                            <select
                                name='Custom Search'
                                defaultValue={filter.customSearch}
                                onChange={(evt): void => {
                                    filter.customSearch = Number(
                                        evt.target.value
                                    );
                                    dispatch({
                                        type: FILTER_ACTION,
                                        payload: { ...filter },
                                    });
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
                                    onClick={(evt): void => {
                                        const target = evt.target as HTMLButtonElement;
                                        const { current } = filterRef;
                                        if (current) {
                                            current
                                                .querySelectorAll(
                                                    'input[type="checkbox"]'
                                                )
                                                .forEach(checkbox => {
                                                    // eslint-disable-next-line no-param-reassign
                                                    (checkbox as HTMLInputElement).checked =
                                                        target.innerText ===
                                                        'Select All';
                                                });
                                        }
                                        filter.legendary =
                                            target.innerText === 'Select All'
                                                ? dices
                                                      .filter(
                                                          die =>
                                                              die.rarity ===
                                                              'Legendary'
                                                      )
                                                      .map(dice => dice.id)
                                                : [];
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
                            <div className='filter-container' ref={filterRef}>
                                {legendaryList.map(
                                    (legendary: DiceType['id']) => (
                                        <div
                                            className='legendary-filter'
                                            key={legendary}
                                        >
                                            <Dice dice={legendary} />
                                            <input
                                                value={legendary}
                                                type='checkbox'
                                                defaultChecked
                                                onChange={(evt): void => {
                                                    if (evt.target.checked) {
                                                        if (
                                                            !filter.legendary.includes(
                                                                Number(
                                                                    evt.target
                                                                        .value
                                                                )
                                                            )
                                                        ) {
                                                            filter.legendary = [
                                                                ...filter.legendary,
                                                                Number(
                                                                    evt.target
                                                                        .value
                                                                ),
                                                            ];
                                                            dispatch({
                                                                type: FILTER_ACTION,
                                                                payload: {
                                                                    ...filter,
                                                                },
                                                            });
                                                        }
                                                    } else {
                                                        filter.legendary = filter.legendary.filter(
                                                            dieId =>
                                                                dieId !==
                                                                Number(
                                                                    evt.target
                                                                        .value
                                                                )
                                                        );
                                                        dispatch({
                                                            type: FILTER_ACTION,
                                                            payload: {
                                                                ...filter,
                                                            },
                                                        });
                                                    }
                                                }}
                                            />
                                            <span className='checkbox-styler'>
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                />
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </label>
                    </div>
                </form>
                <GoogleAds unitId='8891384324' />
                <hr className='divisor' />
                <p className='updated'>
                    The deck list was last updated on{' '}
                    {new Date(
                        JSON.parse(
                            localStorage.getItem('last_updated') || '{}'
                        ).decks
                    ).toDateString()}
                    .
                </p>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Rating</th>
                                <th>Deck</th>
                                <th>Battlefield</th>
                                <th>Alternatives</th>
                                <th>Deck Guide</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDeck.length > 0 ? (
                                sortedDeck.map(deckInfo => (
                                    <tr key={`deck-${deckInfo.id}`}>
                                        <td>
                                            {deckInfo.type === '-'
                                                ? '-'
                                                : deckInfo.id}
                                        </td>
                                        <td>
                                            {deckInfo.type === '-'
                                                ? '-'
                                                : deckInfo.rating[
                                                      filter.profile
                                                  ] || deckInfo.rating.default}
                                        </td>
                                        <td>
                                            {deckInfo.decks.map((deck, i) => (
                                                <div
                                                    className={`deck-container ${
                                                        !(
                                                            deck.every(dice =>
                                                                dices.find(
                                                                    d =>
                                                                        d.id ===
                                                                        dice
                                                                )?.rarity ===
                                                                'Legendary'
                                                                    ? filter.legendary.includes(
                                                                          dice
                                                                      )
                                                                    : true
                                                            ) &&
                                                            (filter.customSearch ===
                                                            -1
                                                                ? true
                                                                : deck.includes(
                                                                      filter.customSearch
                                                                  ))
                                                        )
                                                            ? 'grey-out'
                                                            : ''
                                                    }`}
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    key={i}
                                                >
                                                    {deck.map(die => (
                                                        <Dice
                                                            key={die}
                                                            dice={die}
                                                        />
                                                    ))}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <Link
                                                className='battlefield-link'
                                                to={`/wiki/battlefield#${
                                                    wiki.battlefield.find(
                                                        battlefield =>
                                                            battlefield.id ===
                                                            deckInfo.battlefield
                                                    )?.name
                                                }`}
                                            >
                                                {
                                                    wiki.battlefield.find(
                                                        battlefield =>
                                                            battlefield.id ===
                                                            deckInfo.battlefield
                                                    )?.name
                                                }
                                            </Link>
                                        </td>
                                        <td>
                                            <div className='button-container'>
                                                {deckInfo.decks.map(
                                                    (deck, i) => (
                                                        <button
                                                            // eslint-disable-next-line react/no-array-index-key
                                                            key={i}
                                                            disabled={
                                                                deckInfo.type ===
                                                                '-'
                                                            }
                                                            aria-label='see alternatives'
                                                            type='button'
                                                            onClick={(): void => {
                                                                dispatch({
                                                                    type: OPEN_POPUP,
                                                                    payload:
                                                                        'alt',
                                                                });
                                                                setFindAlt(
                                                                    deck
                                                                );
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faExchangeAlt
                                                                }
                                                            />
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className='link-container'>
                                                {deckInfo.decks.map(
                                                    (deck, i) => {
                                                        return (
                                                            <Link
                                                                key={deck.toString()}
                                                                className='deck-guide-link'
                                                                to={`/decks/guide/${guide.find(
                                                                    eachGuide =>
                                                                        deckInfo
                                                                            .guide[
                                                                            i
                                                                        ] ===
                                                                            eachGuide.id ||
                                                                        eachGuide.diceList.find(
                                                                            list =>
                                                                                list.every(
                                                                                    dieId =>
                                                                                        deck.includes(
                                                                                            dieId
                                                                                        )
                                                                                ) &&
                                                                                deckInfo.type ===
                                                                                    eachGuide.type
                                                                        )
                                                                )?.name || ''}`}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faInfoCircle
                                                                    }
                                                                />
                                                            </Link>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </td>
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
                deckType === 'pvp'
                    ? 'PvP'
                    : deckType === 'co-op'
                    ? 'Co-op'
                    : 'Crew'
            })`}
            className='deck-list'
        >
            <Helmet>
                <title>
                    Random Dice{' '}
                    {`Deck List (${
                        deckType === 'pvp'
                            ? 'PvP'
                            : deckType === 'co-op'
                            ? 'Co-op'
                            : 'Crew'
                    })`}
                </title>
                <meta
                    property='og:title'
                    content={`Random Dice ${
                        deckType === 'pvp'
                            ? 'PvP'
                            : deckType === 'co-op'
                            ? 'Co-op'
                            : 'Crew'
                    } Deck List`}
                />
                <meta
                    property='og:url'
                    content={`https://randomdice.gg${location.pathname}`}
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
                    href={`https://randomdice.gg${location.pathname}`}
                />
            </Helmet>
            {jsx}
        </Main>
    );
}
