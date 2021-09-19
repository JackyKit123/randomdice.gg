/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from 'Redux/store';
import GoogleAds from 'Components/AdUnit';
import Dice from 'Components/Dice';
import PopUp from 'Components/PopUp';
import { fetchDecks, fetchDices } from 'Firebase';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';
import { Dice as DiceType } from 'Redux/Fetch Firebase/Dices/types';
import { OPEN_POPUP } from 'Redux/PopUp Overlay/types';
import ShareButtons from 'Components/ShareButton';
import PageWrapper from 'Components/PageWrapper';
import FilterForm, { useDeckFilter } from './Filter';

export default function DeckList(): JSX.Element {
    const location = useLocation();
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state);
    const { error } =
        selection.fetchDecksReducer || selection.fetchDicesReducer;
    const {
        fetchDecksReducer: { decks },
        fetchDecksGuideReducer: { guide },
        fetchDicesReducer: { dices },
        fetchWikiReducer: { wiki },
        filterReducer: filter,
    } = selection;
    const deckType = location.pathname
        .replace(/^\/decks\//i, '')
        .toLowerCase() as 'pvp' | 'co-op' | 'crew';
    const sortedDeck = useDeckFilter(decks ?? [], deckType);
    const [findAlt, setFindAlt] = useState([] as DiceType['id'][]);

    return (
        <PageWrapper
            isContentReady={Boolean(
                dices?.length &&
                    decks?.length &&
                    guide?.length &&
                    wiki?.battlefield?.length
            )}
            error={error}
            retryFn={(): void => {
                dispatch({ type: CLEAR_ERRORS });
                fetchDecks(dispatch);
                fetchDices(dispatch);
            }}
            title={`Deck List (${
                deckType === 'pvp'
                    ? 'PvP'
                    : deckType === 'co-op'
                    ? 'Co-op'
                    : 'Crew'
            })`}
            description='An Interactive Deck List to build your deck for Random Dice! Put your missing legendary and find the best deck for you!'
            className='deck-list'
        >
            <p>
                This is a interactive deck list for PVP, PVE and Crew decks. You
                can filter the legendary you have below. In this page{' '}
                <strong>{deckType} decks</strong> are shown, you can switch the
                deck type below. You can also specify a dice in Custom Search,
                which will show the decks with the dice you specified.
            </p>
            <p>
                We know that that not everyone have every legendary dices for
                every decks, so you can click on the button in alternatives
                column to show yourself some alternative options for some
                legendary dice.
            </p>
            <p>
                You can choose to have varying legendary class and crit% to see
                different ratings for certain decks at certain dice class or
                level.
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
                        alternatives: dices?.find(die => die.id === alt)
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
                                        {die.alternatives.list?.map(altDice =>
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
                                <h4>You should not need to replace this.</h4>
                            )}
                        </div>
                    ))}
            </PopUp>
            <FilterForm />
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
                            {deckType === 'crew' ? null : <th>Battlefield</th>}
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
                                            : deckInfo.rating[filter.profile] ||
                                              deckInfo.rating.default}
                                    </td>
                                    <td>
                                        {deckInfo.decks.map((deck, i) => (
                                            <div
                                                className={`deck-container ${
                                                    !(
                                                        deck.every(dice =>
                                                            dices?.find(
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
                                    {deckType === 'crew' ? null : (
                                        <td>
                                            <Link
                                                className='battlefield-link'
                                                to={`/wiki/battlefield#${
                                                    wiki?.battlefield.find(
                                                        battlefield =>
                                                            battlefield.id ===
                                                            deckInfo.battlefield
                                                    )?.name
                                                }`}
                                            >
                                                {
                                                    wiki?.battlefield.find(
                                                        battlefield =>
                                                            battlefield.id ===
                                                            deckInfo.battlefield
                                                    )?.name
                                                }
                                            </Link>
                                        </td>
                                    )}
                                    <td>
                                        <div className='button-container'>
                                            {deckInfo.decks.map((deck, i) => (
                                                <button
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    key={i}
                                                    disabled={
                                                        deckInfo.type === '-'
                                                    }
                                                    aria-label='see alternatives'
                                                    type='button'
                                                    onClick={(): void => {
                                                        dispatch({
                                                            type: OPEN_POPUP,
                                                            payload: 'alt',
                                                        });
                                                        setFindAlt(deck);
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faExchangeAlt}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className='link-container'>
                                            {deckInfo.decks.map((deck, i) => {
                                                return (
                                                    <Link
                                                        key={deck.toString()}
                                                        className='deck-guide-link'
                                                        to={`/decks/guide/${guide?.find(
                                                            eachGuide =>
                                                                deckInfo.guide[
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
                                                            icon={faInfoCircle}
                                                        />
                                                    </Link>
                                                );
                                            })}
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
        </PageWrapper>
    );
}
