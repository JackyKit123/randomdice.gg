/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import * as math from 'mathjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faTimes } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../Misc/Redux Storage/store';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import Dice from '../../Components/Dice/dice';
import { fetchDices } from '../../Misc/Firebase/fetchData';
import { CLEAR_ERRORS } from '../../Misc/Redux Storage/Fetch Firebase/types';
import './arenadraft.less';
import GoogleAds from '../../Components/Ad Unit/ad';
import ShareButtons from '../../Components/Social Media Share/share';

export default function ArenaDraft(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error } = selection;
    const { dices } = selection;
    const manualPickRef = useRef(null as null | HTMLSelectElement);

    const [currentPick, setCurrentPick] = useState(1);
    const emptyPick = {
        1: '?',
        2: '?',
        3: '?',
    };
    const emptyDeck = {
        1: '?',
        2: '?',
        3: '?',
        4: '?',
        5: '?',
    };
    const [prevPick, setPrevPick] = useState<{ [key: number]: string }[]>([]);
    const [pick, setPick] = useState<{ [key: number]: string }>(emptyPick);
    const [deck, setDeck] = useState<{ [key: number]: string }>(emptyDeck);

    let jsx;
    if (dices && dices.length > 0) {
        interface DiceValue {
            dps: number;
            assist: number;
            slow: number;
            value: number;
        }

        const findDiceValue = (diceName: string): DiceValue => {
            const dice = dices.find(d => d.name === diceName);
            return {
                dps: dice?.arenaValue.dps || 0,
                assist: dice?.arenaValue.assist || 0,
                slow: dice?.arenaValue.slow || 0,
                value: dice?.arenaValue.value || 0,
            };
        };

        const pickDice = (i: number): void => {
            if (!Object.values(pick).includes('?')) {
                const nextPick = Object.values(deck).indexOf('?') + 1;
                if (nextPick >= 1 && nextPick <= 5) {
                    deck[nextPick] = pick[i];
                    setDeck({ ...deck });
                    setPrevPick([...prevPick, pick]);
                    setPick(emptyPick);
                    if (manualPickRef.current) {
                        manualPickRef.current.value = '?';
                    }
                    setCurrentPick(currentPick + 1);
                }
            }
        };

        const manualPickDice = (name: string): void => {
            if (name === '?') {
                return;
            }
            const nextPick = Object.values(deck).indexOf('?') + 1;
            if (nextPick >= 1 && nextPick <= 5) {
                deck[nextPick] = name;
                setDeck({ ...deck });
                setPrevPick([...prevPick, { 1: '?', 2: '?', 3: '?' }]);
                setPick(emptyPick);
                if (manualPickRef.current) {
                    manualPickRef.current.value = '?';
                }
                setCurrentPick(currentPick + 1);
            }
        };

        const deckScore = <T extends keyof DiceValue>(type: T): number => {
            return [1, 2, 3, 4, 5]
                .map(i => findDiceValue(deck[i])[type])
                .reduce((acc, curr) => acc + curr);
        };

        const calSynergy = (diceName: string): number => {
            if (!dices.find(d => d.name === diceName)) {
                return 0;
            }
            const value = findDiceValue(diceName);
            const maxValue = Object.entries(value).find(
                entry => entry[1] === Math.max(...Object.values(value))
            );
            if (maxValue) {
                const synergy = <T extends keyof DiceValue>(
                    targetScore: number,
                    deckType: T
                ): number =>
                    Math.round(
                        (Math.max(targetScore - deckScore(deckType), 0) /
                            targetScore) *
                            100
                    ) / 100;
                switch (maxValue[0]) {
                    case 'dps':
                        return synergy(15, 'dps');
                    case 'assists':
                        return synergy(15, 'assist');
                    case 'slow':
                        return synergy(10, 'slow');
                    case 'value':
                        return synergy(10, 'value');
                    default:
                        return 0;
                }
            }
            return 0;
        };

        let winrate = 0;
        const winProb = [] as number[];

        if (currentPick === 6) {
            winrate =
                1 /
                (1 +
                    Math.exp(
                        -(
                            deckScore('dps') +
                            deckScore('assist') +
                            deckScore('slow') +
                            deckScore('value') -
                            60
                        ) / 60
                    ));

            Array(13)
                .fill(3)
                .map((i, j) => i + j)
                .reduce((acc, val) => {
                    winProb.push(acc);
                    return (
                        acc -
                        math.combinations(val - 1, 2) *
                            (1 - winrate) ** 3 *
                            winrate ** (val - 3)
                    );
                }, 1);
        }

        jsx = (
            <>
                <p>
                    This is a Tool for assisting to draft an arena deck. To
                    start drafting, input you 3 dice in the section below. Once
                    all 3 dices are input into the picks section, you can
                    compare the value and pick into one of them.
                </p>
                <p>
                    Usually, highest synergy value will result in the best pick.
                    If the highest synergy value are equal, the highest dice
                    value between them will be the best pick.
                </p>
                <p>
                    Take note that dice like typhoon or blizzard may be a good
                    pick even if their synergy are low. And you should usually
                    pick into typhoon and blizzard.
                </p>
                <p>
                    Once you finished picking you deck, we will show a rough
                    estimated win rate on the deck based on the deck score of
                    your deck.
                </p>
                <hr className='divisor' />
                <section className='pick'>
                    <h3>Your Picks</h3>
                    <div className='table-container'>
                        <table className='pick'>
                            <tbody>
                                <tr>
                                    {[1, 2, 3].map((tdIndex, i) => (
                                        <td key={`pick${tdIndex}`}>
                                            <label htmlFor='option'>
                                                <div>Option {i + 1}</div>
                                                <select
                                                    data-value={pick[tdIndex]}
                                                    value={pick[tdIndex]}
                                                    onChange={(evt): void => {
                                                        pick[tdIndex] =
                                                            evt.target.value;
                                                        setPick({ ...pick });
                                                    }}
                                                >
                                                    <option>?</option>
                                                    {dices
                                                        .filter(dice =>
                                                            currentPick < 3
                                                                ? dice.rarity !==
                                                                      'Legendary' &&
                                                                  dice.name !==
                                                                      'Growth'
                                                                : dice.name !==
                                                                  'Growth'
                                                        )
                                                        .filter(dice => {
                                                            const activePicks = {
                                                                ...pick,
                                                            };
                                                            delete activePicks[
                                                                tdIndex
                                                            ];
                                                            return ![
                                                                ...Object.values(
                                                                    deck
                                                                ),
                                                                ...Object.values(
                                                                    activePicks
                                                                ),
                                                            ].includes(
                                                                dice.name
                                                            );
                                                        })
                                                        .map(dice => (
                                                            <option
                                                                key={`pick-${tdIndex}-${dice.name}`}
                                                            >
                                                                {dice.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    {[1, 2, 3].map(tdIndex => (
                                        <td
                                            className={`dice-container ${
                                                Object.values(pick).includes(
                                                    '?'
                                                )
                                                    ? ''
                                                    : 'active'
                                            }`}
                                            key={tdIndex}
                                            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                                            tabIndex={
                                                Object.values(pick).includes(
                                                    '?'
                                                )
                                                    ? -1
                                                    : 0
                                            }
                                            onClick={(): void =>
                                                pickDice(tdIndex)
                                            }
                                            onKeyDown={(evt): void => {
                                                if (
                                                    evt.keyCode === 13 ||
                                                    evt.keyCode === 32
                                                ) {
                                                    pickDice(tdIndex);
                                                }
                                            }}
                                        >
                                            <Dice dice={pick[tdIndex]} />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <h4>Synergy Value</h4>
                                    </td>
                                </tr>
                                <tr>
                                    {[1, 2, 3].map(tdIndex => (
                                        <td
                                            className='value'
                                            key={`synergy${tdIndex}`}
                                        >
                                            {calSynergy(pick[tdIndex])}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <h4>Dice Value</h4>
                                    </td>
                                </tr>
                                <tr>
                                    {[1, 2, 3].map(tdIndex => (
                                        <td
                                            className='value'
                                            key={`value${tdIndex}`}
                                        >
                                            {Math.max(
                                                ...(Object.values(
                                                    findDiceValue(pick[tdIndex])
                                                ) as number[])
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='manual'>
                        <label htmlFor='manual-select'>
                            I do not need to compare the value, put this dice
                            into the deck directly:{' '}
                            <select
                                ref={manualPickRef}
                                data-value='?'
                                onChange={(evt): void =>
                                    manualPickDice(evt.target.value)
                                }
                            >
                                <option>?</option>
                                {dices
                                    .filter(dice =>
                                        currentPick < 3
                                            ? dice.rarity !== 'Legendary' &&
                                              dice.name !== 'Growth'
                                            : dice.name !== 'Growth'
                                    )
                                    .filter(
                                        dice =>
                                            !Object.values(deck).includes(
                                                dice.name
                                            )
                                    )
                                    .map(dice => (
                                        <option key={`pick--${dice.name}`}>
                                            {dice.name}
                                        </option>
                                    ))}
                            </select>
                        </label>
                    </div>
                    <button
                        type='button'
                        disabled={prevPick.length === 0}
                        onClick={(): void => {
                            setPick(
                                prevPick.pop() || { 1: '?', 2: '?', 3: '?' }
                            );
                            if (currentPick > 1) {
                                deck[currentPick - 1] = '?';
                                setPrevPick([...prevPick]);
                                setDeck({ ...deck });
                                setCurrentPick(currentPick - 1);
                            }
                        }}
                    >
                        Undo <FontAwesomeIcon icon={faUndo} />
                    </button>
                    <button
                        type='button'
                        disabled={[
                            ...Object.values(deck),
                            ...Object.values(pick),
                        ].every(val => val === '?')}
                        onClick={(): void => {
                            setPick(emptyPick);
                            setPrevPick([]);
                            setDeck(emptyDeck);
                            setCurrentPick(1);
                            if (manualPickRef.current) {
                                manualPickRef.current.value = '?';
                            }
                        }}
                    >
                        Reset <FontAwesomeIcon icon={faTimes} />
                    </button>
                </section>
                <hr className='divisor' />
                <GoogleAds unitId='1144871846' />
                <section className='deck'>
                    <hr className='divisor' />
                    <h3>Your Deck</h3>
                    {[1, 2, 3, 4, 5].map(i => (
                        <Dice key={`deck${i}`} dice={deck[i]} />
                    ))}
                    <h3>Deck Score</h3>
                    <label htmlFor='Main-Dps'>
                        <h4>Main DPS (target score: 15)</h4>
                        <input
                            type='textbox'
                            value={deckScore('dps')}
                            disabled
                        />
                    </label>
                    <label htmlFor='Assist-Dps'>
                        <h4>Assist DPS (target score: 15)</h4>
                        <input
                            type='textbox'
                            value={deckScore('assist')}
                            disabled
                        />
                    </label>
                    <label htmlFor='Slow'>
                        <h4>Slow (target score: 10)</h4>
                        <input
                            type='textbox'
                            value={deckScore('slow')}
                            disabled
                        />
                    </label>
                    <label htmlFor='Value-Buff'>
                        <h4>Value / Buff (target score: 20)</h4>
                        <input
                            type='textbox'
                            value={deckScore('value')}
                            disabled
                        />
                    </label>
                </section>
                <hr className='divisor' />
                <ShareButtons name='Random Dice Arena Draft Toll' />
                <section
                    className={`winrate ${currentPick === 6 ? 'show' : ''}`}
                >
                    <hr className='divisor' />
                    <label htmlFor='win-rate'>
                        <h3>Your Estimated Win Rate</h3>
                        <input
                            type='textbox'
                            value={`${Math.round(winrate * 10000) / 100}%`}
                            disabled
                        />
                    </label>
                    <h3>Probability of Wins</h3>
                    {Array(12)
                        .fill('')
                        .map((_, i) => (
                            <label htmlFor='win-chance' key={winProb[i] || i}>
                                <span>{i + 1} : </span>
                                <input
                                    type='textbox'
                                    value={`${Math.round(
                                        winProb[i + 1] * 10000
                                    ) / 100}%`}
                                    disabled
                                />
                            </label>
                        ))}
                </section>
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    fetchDices(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title='Arena Draft Tool' className='arena-draft'>
            <Helmet>
                <title>Random Dice Arena Draft</title>
                <meta property='og:title' content='Random Dice Arena Draft' />
                <meta
                    name='og:description'
                    content='An Interactive Arena Drafter to assist you on building your arena deck for Random Dice! Put your options and compare the values, make your best deck for your 12wins game.'
                />
                <meta
                    name='description'
                    content='An Interactive Arena Drafter to assist you on building your arena deck for Random Dice! Put your options and compare the values, make your best deck for your 12wins game.'
                />
                <meta name='robots' content='follow' />
            </Helmet>
            {jsx}
        </Main>
    );
}
