/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import * as math from 'mathjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { RootState } from 'Redux/store';
import Main from 'Components/Main';
import Error from 'Components/Error';
import LoadingScreen from 'Components/Loading';
import Dice from 'Components/Dice';
import { fetchDices } from 'Firebase';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';
import './arenadraft.less';
import GoogleAds from 'Components/Ad Unit';
import ShareButtons from 'Components/Social Media Share';

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
        1: -1,
        2: -1,
        3: -1,
    };
    const emptyDeck = {
        1: -1,
        2: -1,
        3: -1,
        4: -1,
        5: -1,
    };
    const [prevPick, setPrevPick] = useState<{ [key: number]: number }[]>([]);
    const [pick, setPick] = useState<{ [key: number]: number }>(emptyPick);
    const [deck, setDeck] = useState<{ [key: number]: number }>(emptyDeck);
    const [manualPick, setManualPick] = useState(-1 as number);

    let jsx;
    if (dices?.length) {
        interface DiceValue {
            dps: number;
            assist: number;
            slow: number;
            value: number;
        }

        const findDiceValue = (diceID: number): DiceValue => {
            const dice = dices.find(d => d.id === diceID);
            return {
                dps: dice?.arenaValue.dps || 0,
                assist: dice?.arenaValue.assist || 0,
                slow: dice?.arenaValue.slow || 0,
                value: dice?.arenaValue.value || 0,
            };
        };

        const pickDice = (i: number): void => {
            if (!Object.values(pick).includes(-1)) {
                const nextPick = Object.values(deck).indexOf(-1) + 1;
                if (nextPick >= 1 && nextPick <= 5) {
                    deck[nextPick] = pick[i];
                    setDeck({ ...deck });
                    setPrevPick([...prevPick, pick]);
                    setPick(emptyPick);
                    if (manualPickRef.current) {
                        manualPickRef.current.value = '-1';
                    }
                    setCurrentPick(currentPick + 1);
                }
            }
        };

        const manualPickDice = (id: number): void => {
            if (id < 0) {
                return;
            }
            const nextPick = Object.values(deck).indexOf(-1) + 1;
            if (nextPick >= 1 && nextPick <= 5) {
                deck[nextPick] = id;
                setDeck({ ...deck });
                setPrevPick([...prevPick, { 1: -1, 2: -1, 3: -1 }]);
                setPick(emptyPick);
                if (manualPickRef.current) {
                    manualPickRef.current.value = '-1';
                }
                setCurrentPick(currentPick + 1);
            }
            setManualPick(-1);
        };

        const deckScore = <T extends keyof DiceValue>(type: T): number => {
            return [1, 2, 3, 4, 5]
                .map(i => findDiceValue(deck[i])[type])
                .reduce((acc, curr) => acc + curr);
        };

        const calDiceRole = (diceId: number): number => {
            if (!dices.find(d => d.id === diceId)) {
                return 0;
            }
            const value = findDiceValue(diceId);
            const maxValue = Object.entries(value).find(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ([_, val]) => val === Math.max(...Object.values(value))
            );
            if (maxValue) {
                const diceRole = <T extends keyof DiceValue>(
                    targetScore: number,
                    deckType: T
                ): number =>
                    Math.round(
                        (Math.max(targetScore - deckScore(deckType), 0) /
                            targetScore) *
                            10 *
                            100
                    ) / 100;
                switch (maxValue[0]) {
                    case 'dps':
                        return diceRole(10, 'dps');
                    case 'assist':
                        return diceRole(15, 'assist');
                    case 'slow':
                        return diceRole(10, 'slow');
                    case 'value':
                        return diceRole(25, 'value');
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
                    compare the value and pick into one of them. Or if you are
                    confident, you can skip comparing and use the bypass option
                    below the table.
                </p>
                <p>
                    Usually, highest dice role value will result in the best
                    pick. If the highest dice role value are equal, the highest
                    dice value between them will be the best pick.
                </p>
                <p>
                    Take note that dice like typhoon or blizzard may be a good
                    pick even if their dice role are low. And you should usually
                    pick into typhoon and blizzard.
                </p>
                <p>
                    Once you finished picking you deck, we will show a rough
                    estimated win rate on the deck based on the deck score of
                    your deck.
                </p>
                <p>
                    Lastly, do be reminded that the legendary dice is not
                    available for the first 2 slots in your deck while Growth is
                    never available, the same thing applies for this tool.
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
                                                    data-value={
                                                        pick[tdIndex] < 0
                                                            ? '?'
                                                            : pick[tdIndex]
                                                    }
                                                    value={pick[tdIndex]}
                                                    onChange={(evt): void => {
                                                        pick[tdIndex] = Number(
                                                            evt.target.value
                                                        );
                                                        setPick({ ...pick });
                                                    }}
                                                >
                                                    <option value={-1}>
                                                        ?
                                                    </option>
                                                    {dices
                                                        .filter(dice =>
                                                            currentPick < 3
                                                                ? dice.rarity !==
                                                                      'Legendary' &&
                                                                  dice.id !== 36
                                                                : dice.id !== 36
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
                                                            ].includes(dice.id);
                                                        })
                                                        .map(dice => (
                                                            <option
                                                                value={dice.id}
                                                                key={`pick-${tdIndex}-${dice.id}`}
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
                                                Object.values(pick).includes(-1)
                                                    ? ''
                                                    : 'active'
                                            }`}
                                            key={tdIndex}
                                            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                                            tabIndex={
                                                Object.values(pick).includes(-1)
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
                                        <h4>Dice Role Value</h4>
                                    </td>
                                </tr>
                                <tr>
                                    {[1, 2, 3].map(tdIndex => (
                                        <td
                                            className='value'
                                            key={`diceRole${tdIndex}`}
                                        >
                                            {calDiceRole(pick[tdIndex])}
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
                        I do not need to compare the value, put this dice into
                        the deck directly:{' '}
                        <form
                            onSubmit={(evt): void => {
                                evt.preventDefault();
                                manualPickDice(manualPick);
                            }}
                        >
                            <label htmlFor='manual-select'>
                                <select
                                    ref={manualPickRef}
                                    data-value={
                                        manualPick < 0 ? '?' : manualPick
                                    }
                                    defaultValue={manualPick}
                                    onChange={(evt): void =>
                                        setManualPick(Number(evt.target.value))
                                    }
                                >
                                    <option value={-1}>?</option>
                                    {dices
                                        .filter(dice =>
                                            currentPick < 3
                                                ? dice.rarity !== 'Legendary' &&
                                                  dice.id !== 36
                                                : dice.id !== 36
                                        )
                                        .filter(
                                            dice =>
                                                !Object.values(deck).includes(
                                                    dice.id
                                                )
                                        )
                                        .map(dice => (
                                            <option
                                                value={dice.id}
                                                key={`pick--${dice.id}`}
                                            >
                                                {dice.name}
                                            </option>
                                        ))}
                                </select>
                            </label>
                            <button type='submit' disabled={manualPick < 0}>
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                        </form>
                    </div>
                    <button
                        type='button'
                        disabled={prevPick.length === 0}
                        onClick={(): void => {
                            setPick(prevPick.pop() || { 1: -1, 2: -1, 3: -1 });
                            if (currentPick > 1) {
                                deck[currentPick - 1] = -1;
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
                        ].every(val => val < 0)}
                        onClick={(): void => {
                            setPick(emptyPick);
                            setPrevPick([]);
                            setDeck(emptyDeck);
                            setCurrentPick(1);
                            if (manualPickRef.current) {
                                manualPickRef.current.value = '-1';
                            }
                        }}
                    >
                        Reset <FontAwesomeIcon icon={faTimes} />
                    </button>
                </section>
                <GoogleAds unitId='8891384324' />
                <section className='deck'>
                    <hr className='divisor' />
                    <h3>Your Deck</h3>
                    <div className='deck-list'>
                        {[1, 2, 3, 4, 5].map(i => (
                            <Dice key={`deck${i}`} dice={deck[i]} />
                        ))}
                    </div>
                    <h3>Deck Score</h3>
                    <label htmlFor='Main-Dps'>
                        <h4>Main DPS (target score: 10)</h4>
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
                        <h4>Value / Buff (target score: 25)</h4>
                        <input
                            type='textbox'
                            value={deckScore('value')}
                            disabled
                        />
                    </label>
                </section>
                <section
                    className={`winrate ${currentPick === 6 ? 'show' : ''}`}
                >
                    <hr className='divisor' />
                    <h3>Your Estimated Win Rate</h3>
                    <label htmlFor='win-rate'>
                        <input
                            type='textbox'
                            value={`${Math.round(winrate * 10000) / 100}%`}
                            disabled
                        />
                    </label>
                    <h3>Your Estimated Rewards</h3>
                    <label htmlFor='legendary-reward'>
                        Number of Legendary
                        <input
                            type='textbox'
                            value={
                                Math.round(
                                    (winProb[4] * 0.1 +
                                        winProb[7] * 0.4 +
                                        winProb[11] * 1) *
                                        10000
                                ) / 10000 || 0
                            }
                            disabled
                        />
                    </label>
                    <label htmlFor='diamond-reward'>
                        Diamond Reward
                        <input
                            type='textbox'
                            value={
                                Math.round(
                                    (winProb[1] * 20 +
                                        winProb[6] * 80 +
                                        winProb[9]) *
                                        100
                                ) / 100 || 0
                            }
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
                <hr className='divisor' />
                <ShareButtons name='Random Dice Arena Draft Toll' />
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
