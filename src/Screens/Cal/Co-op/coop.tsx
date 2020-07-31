import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { combinations } from 'mathjs';
import ReactHtmlParser from 'react-html-parser';
import Main from '../../../Components/Main/main';
import replaceTextWithImgTag from '../../../Misc/replaceTextWithImg';
import '../cal.less';
import './coop.less';
import AdUnit from '../../../Components/Ad Unit/ad';

export default function GoldCalculator(): JSX.Element {
    const [filter, setFilter] = useState({
        class: 12,
        currentGold: 0,
        targetGold: 40000,
        currentDiamond: 0,
        targetDiamond: 500,
        luck: 0.5,
        legendary: 0,
        targetWave: 30,
        custom: false,
    });
    const cardBoxGoldPerClass: {
        [key: number]: number;
    } = {
        1: 320,
        2: 432,
        3: 544,
        4: 640,
        5: 736,
        6: 832,
        7: 925,
        8: 1024,
        9: 1120,
        10: 1312,
        11: 1408,
        12: 1504,
        13: 1594,
        14: 1687,
        15: 1775,
        16: 1866,
        17: 1951,
        18: 2044,
        19: 2133,
        20: 2222,
    };

    const isInvalidCurrentGold =
        !Number.isInteger(filter.currentGold) || filter.currentGold < 0;
    const isInvalidCurrentDiamond =
        !Number.isInteger(filter.currentDiamond) || filter.currentDiamond < 0;
    const isInvalidTargetGold =
        !Number.isInteger(filter.targetGold) || filter.targetGold < 0;
    const isInvalidTargetDiamond =
        !Number.isInteger(filter.targetDiamond) || filter.targetDiamond < 0;
    const invalidGoldRelationship = filter.currentGold > filter.targetGold;
    const invalidDiamondRelationship =
        filter.currentDiamond > filter.targetDiamond;
    const isInvalidWave =
        !Number.isInteger(filter.targetWave) || filter.targetWave <= 0;
    const invalidInput =
        isInvalidCurrentGold ||
        isInvalidTargetGold ||
        invalidGoldRelationship ||
        isInvalidCurrentDiamond ||
        isInvalidTargetDiamond ||
        invalidDiamondRelationship ||
        isInvalidWave;

    const minutesPerRun =
        filter.targetWave > 60
            ? (filter.targetWave - 60) / 2 + 20 + 1
            : filter.targetWave / 3 + 1;
    const cardsPerRun =
        filter.targetWave > 50
            ? (filter.targetWave - 50) * 3 + 50
            : filter.targetWave;
    const goldPerBox = cardBoxGoldPerClass[filter.class];
    const diamondPerBox = 3;
    const goldAim = filter.targetGold - filter.currentGold;
    const diamondAim = filter.targetDiamond - filter.currentDiamond;
    const boxNeededForLegendary = (box = filter.legendary): number => {
        let probAccumulator = 0;
        for (let n = 0; n < filter.legendary; n += 1) {
            probAccumulator +=
                combinations(box, n) * 0.01 ** n * 0.99 ** (box - n);
        }
        if (probAccumulator > filter.luck) {
            return boxNeededForLegendary(box + 1);
        }
        return box;
    };
    const boxNeeded = Math.ceil(
        Math.max(
            goldAim / goldPerBox,
            diamondAim / diamondPerBox,
            boxNeededForLegendary()
        )
    );
    const cardsNeeded = boxNeeded * 40;
    const targetNumberOfRuns = Math.ceil(cardsNeeded / cardsPerRun);
    const minutesNeeded = targetNumberOfRuns * minutesPerRun - 1;
    const timeNeeded =
        minutesNeeded >= 60
            ? `${Math.round((minutesNeeded / 60) * 100) / 100} Hour(s)`
            : `${Math.round(minutesNeeded * 100) / 100} Minute(s)`;

    return (
        <Main title='Card Box Grind Time Calculator' className='cal coop-cal'>
            <Helmet>
                <title>Random Dice Calculator</title>
                <meta property='og:title' content='Random Dice Calculator' />
                <meta
                    name='og:description'
                    content='Pre-defined calculators for Random Dice, calculate damage, dps, odds with ease using the easy to use calculators.'
                />
                <meta
                    name='description'
                    content='Pre-defined calculators for Random Dice, calculate damage, dps, odds with ease using the easy to use calculators.'
                />
            </Helmet>
            <p>
                This is a calculator for the estimated time need to grind
                certain amount of gold, diamond, legendary dice based on the
                card box reward from Co-op quick run. For gold and diamond,
                input your current amount and target amount. For legendary,
                select the number of legendary you aim to get. Then select how
                lucky you are.
            </p>
            <p>
                The result for the boxes needed is the minimum amount to fit all
                3 criteria, For example, if you wish to get 100 gold and 10
                diamond and 1 legendary dice, we will calculate base on the
                boxes needed to get 1 legendary because that takes the most
                time.
            </p>
            <p>
                By default, there are 4 modes: Gear deck wave 30 run (10 mins),
                Solar/Time wave 56 runs(18mins), Combo Mirror wave 76
                run(25mins), Solar Lunar wave 106 (43mins). You can also enter a
                custom target wave goal.
            </p>
            <p>
                Keep in mind that the calculator assume average 20 seconds per
                wave for wave 1 - 60. Then average 30 seconds per wave beyond
                wave 60. And extra 60 seconds between every games.
            </p>
            <hr className='divisor' />
            <section className='filter'>
                <form
                    className='filter'
                    onSubmit={(evt): void => evt.preventDefault()}
                >
                    {ReactHtmlParser(replaceTextWithImgTag('{Gold}'))}
                    <label htmlFor='class'>
                        <span>PVP Rank :</span>
                        <select
                            name='class'
                            defaultValue={12}
                            onChange={(
                                evt: React.ChangeEvent<HTMLSelectElement>
                            ): void => {
                                filter.class = Number(evt.target.value);
                                setFilter({ ...filter });
                            }}
                        >
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                            <option>13</option>
                            <option>14</option>
                            <option>15</option>
                            <option>16</option>
                            <option>17</option>
                            <option>18</option>
                            <option>19</option>
                            <option>20</option>
                        </select>
                    </label>
                    <label htmlFor='current-gold'>
                        <span>Current Gold :</span>
                        <input
                            type='number'
                            min={0}
                            step={1}
                            name='current-gold'
                            defaultValue={0}
                            className={
                                isInvalidCurrentGold || invalidGoldRelationship
                                    ? 'invalid'
                                    : ''
                            }
                            onChange={(
                                evt: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.currentGold = val;
                                setFilter({ ...filter });
                            }}
                        />
                    </label>
                    <label htmlFor='target-gold'>
                        <span>Target Gold :</span>
                        <input
                            type='number'
                            min={0}
                            step={1}
                            name='target-gold'
                            defaultValue={40000}
                            className={
                                isInvalidTargetGold || invalidGoldRelationship
                                    ? 'invalid'
                                    : ''
                            }
                            onChange={(
                                evt: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.targetGold = val;
                                setFilter({ ...filter });
                            }}
                        />
                    </label>
                    {isInvalidCurrentGold || isInvalidTargetGold ? (
                        <span className='invalid-warning'>
                            Invalid Gold Amount Input! Acceptable input is{' '}
                            <strong>positive integer</strong>.
                        </span>
                    ) : (
                        ''
                    )}
                    {invalidGoldRelationship ? (
                        <span className='invalid-warning'>
                            Invalid Gold Amount Input! Current Gold should be
                            less than Target Gold.
                        </span>
                    ) : (
                        ''
                    )}
                </form>
                <form
                    className='filter'
                    onSubmit={(evt): void => evt.preventDefault()}
                >
                    {ReactHtmlParser(replaceTextWithImgTag('{Diamond}'))}
                    <label htmlFor='current-diamond'>
                        <span>Current Diamond :</span>
                        <input
                            type='number'
                            min={0}
                            step={1}
                            name='current-diamond'
                            defaultValue={0}
                            className={
                                isInvalidCurrentDiamond ||
                                invalidDiamondRelationship
                                    ? 'invalid'
                                    : ''
                            }
                            onChange={(
                                evt: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.currentDiamond = val;
                                setFilter({ ...filter });
                            }}
                        />
                    </label>
                    <label htmlFor='target-diamond'>
                        <span>Target Diamond :</span>
                        <input
                            type='number'
                            min={0}
                            step={1}
                            name='target-diamond'
                            defaultValue={500}
                            className={
                                isInvalidTargetDiamond ||
                                invalidDiamondRelationship
                                    ? 'invalid'
                                    : ''
                            }
                            onChange={(
                                evt: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.targetDiamond = val;
                                setFilter({ ...filter });
                            }}
                        />
                    </label>
                    {isInvalidCurrentDiamond || isInvalidTargetDiamond ? (
                        <span className='invalid-warning'>
                            Invalid Diamond Amount Input! Acceptable input is{' '}
                            <strong>positive integer</strong>.
                        </span>
                    ) : (
                        ''
                    )}
                    {invalidDiamondRelationship ? (
                        <span className='invalid-warning'>
                            Invalid Diamond Amount Input! Current Diamond should
                            be less than Target Diamond.
                        </span>
                    ) : (
                        ''
                    )}
                </form>
                <form
                    className='filter'
                    onSubmit={(evt): void => evt.preventDefault()}
                >
                    {ReactHtmlParser(replaceTextWithImgTag('{Legendary Dice}'))}
                    <label htmlFor='target-legendary'>
                        <span>Target Legendary :</span>
                        <select
                            name='target-legendary'
                            defaultValue={0}
                            onChange={(
                                evt: React.ChangeEvent<HTMLSelectElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.legendary = val;
                                setFilter({ ...filter });
                            }}
                        >
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </select>
                    </label>
                    <label htmlFor='legendary-luck'>
                        <span>Your Luck :</span>
                        <select
                            name='legendary-luck'
                            defaultValue={0.5}
                            onChange={(
                                evt: React.ChangeEvent<HTMLSelectElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.luck = val;
                                setFilter({ ...filter });
                            }}
                        >
                            <option value={0.1}>Very Unlucky (10%)</option>
                            <option value={0.3}>Unlucky (30%)</option>
                            <option value={0.5}>Moderate Luck (50%)</option>
                            <option value={0.7}>Lucky (70%)</option>
                            <option value={0.9}>Very Lucky (90%)</option>
                        </select>
                    </label>
                </form>
                <form
                    className='filter'
                    onSubmit={(evt): void => evt.preventDefault()}
                >
                    <label htmlFor='wave'>
                        <span>Mode :</span>
                        <select
                            name='wave'
                            onChange={(
                                evt: React.ChangeEvent<HTMLSelectElement>
                            ): void => {
                                filter.custom = evt.target.value === 'Custom';
                                if (!filter.custom) {
                                    const val = Number(evt.target.value);
                                    filter.targetWave = val;
                                }
                                setFilter({ ...filter });
                            }}
                        >
                            <option value={30}>Gear 30s</option>
                            <option value={56}>Solar / Time 56s</option>
                            <option value={76}>Combo Mirror 76s</option>
                            <option value={106}>Solar Lunar 106s</option>
                            <option>Custom</option>
                        </select>
                        {filter.custom ? (
                            <input
                                type='number'
                                min={1}
                                step={1}
                                name='wave'
                                placeholder='Wave#'
                                className={isInvalidWave ? 'invalid' : ''}
                                onChange={(
                                    evt: React.ChangeEvent<HTMLInputElement>
                                ): void => {
                                    const val = Number(evt.target.value);
                                    filter.targetWave = val;
                                    setFilter({ ...filter });
                                }}
                            />
                        ) : null}
                    </label>
                    {isInvalidWave ? (
                        <span className='invalid-warning'>
                            Invalid Wave Number. Acceptable input is{' '}
                            <strong>positive integer</strong>.
                        </span>
                    ) : (
                        ''
                    )}
                </form>
            </section>
            <hr className='divisor' />
            <AdUnit
                provider='Media.net'
                unitId='227378933'
                dimension='300x250'
            />
            <AdUnit
                provider='Media.net'
                unitId='219055766'
                dimension='970x90'
            />
            <hr className='divisor' />
            <div className='result'>
                <label htmlFor='result'>
                    <span>Card Boxes Needed :</span>
                    <input
                        type='textbox'
                        className={invalidInput ? 'invalid' : ''}
                        value={invalidInput ? 'Check Input' : boxNeeded}
                        disabled
                    />
                </label>
                <label htmlFor='result'>
                    <span>Target number of runs :</span>
                    <input
                        type='textbox'
                        className={invalidInput ? 'invalid' : ''}
                        value={
                            invalidInput ? 'Check Input' : targetNumberOfRuns
                        }
                        disabled
                    />
                </label>
                <label htmlFor='result'>
                    <span>Estimated Time needed :</span>
                    <input
                        type='textbox'
                        className={invalidInput ? 'invalid' : ''}
                        value={invalidInput ? 'Check Input' : timeNeeded}
                        disabled
                    />
                </label>
            </div>
        </Main>
    );
}
