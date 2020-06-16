/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as math from 'mathjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faTimes } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../Misc/Redux Storage/store';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import { fetchDices, clearError, fetchArena } from '../../Misc/fetchData';
import Dice from '../../Components/Dice/dice';
import './arenadraft.less';

export default function ArenaDraft(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state);
    const { error } =
        selection.fetchDicesReducer || selection.fetchArenaReducer;
    const { dices } = selection.fetchDicesReducer;
    const dicesValue = selection.fetchArenaReducer.dices;

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
    if (dices && dicesValue && dices.length > 0) {
        interface DiceValue {
            dps: number;
            assists: number;
            slow: number;
            value: number;
        }

        const findDiceValue = (dice: string): DiceValue => {
            const diceId = dices.find(d => d.name === dice)?.id || 0;
            const diceValue = dicesValue.find(d => d.id === diceId);
            return {
                dps: diceValue?.dps || 0,
                assists: diceValue?.assists || 0,
                slow: diceValue?.slow || 0,
                value: diceValue?.value || 0,
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
                    setCurrentPick(currentPick + 1);
                }
            }
        };

        const deckScore = <T extends keyof DiceValue>(type: T): number => {
            return [1, 2, 3, 4, 5]
                .map(i => findDiceValue(deck[i])[type])
                .reduce((acc, curr) => acc + curr);
        };

        const calSynergy = (dice: string): number => {
            if (!dices.find(d => d.name === dice)) {
                return 0;
            }
            const value = findDiceValue(dice);
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
                        return synergy(15, 'assists');
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
                            deckScore('assists') +
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
                <div className='divisor' />
                <section className='pick'>
                    <h3>Your Picks</h3>
                    <div className='table-container'>
                        <table className='pick'>
                            <tbody>
                                <tr>
                                    {[1, 2, 3].map(tdIndex => (
                                        <td key={`pick${tdIndex}`}>
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
                                                              'Legendary'
                                                            : true
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
                                                        ].includes(dice.name);
                                                    })
                                                    .map(dice => (
                                                        <option
                                                            key={`pick-${tdIndex}-${dice.name}`}
                                                        >
                                                            {dice.name}
                                                        </option>
                                                    ))}
                                            </select>
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
                        }}
                    >
                        Reset <FontAwesomeIcon icon={faTimes} />
                    </button>
                </section>
                <section className='deck'>
                    <div className='divisor' />
                    <h3>Your Deck</h3>
                    {[1, 2, 3, 4, 5].map(i => (
                        <Dice key={`deck${i}`} dice={deck[i]} />
                    ))}
                    <h3>Deck Score</h3>
                    <h4>Main DPS (target score: 15)</h4>
                    <input type='textbox' value={deckScore('dps')} disabled />
                    <h4>Assist DPS (target score: 15)</h4>
                    <input
                        type='textbox'
                        value={deckScore('assists')}
                        disabled
                    />
                    <h4>Slow (target score: 10)</h4>
                    <input type='textbox' value={deckScore('slow')} disabled />
                    <h4>Value / Buff (target score: 20)</h4>
                    <input type='textbox' value={deckScore('value')} disabled />
                </section>
                <section
                    className={`winrate ${currentPick === 6 ? 'show' : ''}`}
                >
                    <div className='divisor' />
                    <h3>Your Estimated Win Rate</h3>
                    <input
                        type='textbox'
                        value={`${Math.round(winrate * 10000) / 100}%`}
                        disabled
                    />
                    <h3>Probability of Wins</h3>
                    {Array(12)
                        .fill('')
                        .map((_, i) => (
                            <div key={winProb[i] || i}>
                                <span>{i + 1} : </span>
                                <input
                                    type='textbox'
                                    value={`${Math.round(
                                        winProb[i + 1] * 10000
                                    ) / 100}%`}
                                    disabled
                                />
                            </div>
                        ))}
                </section>
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    clearError(dispatch);
                    fetchDices(dispatch);
                    fetchArena(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title='Arena Draft Tool' className='arena-draft'>
            {jsx}
        </Main>
    );
}
