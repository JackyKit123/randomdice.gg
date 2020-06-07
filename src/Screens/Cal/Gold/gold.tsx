import React, { useState } from 'react';
import Main from '../../../Components/Main/main';
import GoldImage from './gold.webp';
import '../cal.less';
import './gold.less';

export default function GoldImageCaculator(): JSX.Element {
    const [filter, setFilter] = useState({
        class: 12,
        currentGold: 0,
        targetGold: 40000,
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
    const isInvalidTargetGold =
        !Number.isInteger(filter.targetGold) || filter.targetGold < 0;
    const invalidGoldRelationship = filter.currentGold > filter.targetGold;
    const isInvalidWave =
        !Number.isInteger(filter.targetWave) || filter.targetWave <= 0;
    const invalidInput =
        isInvalidCurrentGold ||
        isInvalidTargetGold ||
        invalidGoldRelationship ||
        isInvalidWave;

    const minutesPerRun = filter.targetWave / 3;
    const cardsPerRun =
        filter.targetWave > 50
            ? (filter.targetWave - 50) * 3 + 50
            : filter.targetWave;
    const goldPerBox = cardBoxGoldPerClass[filter.class];
    const goldAim = filter.targetGold - filter.currentGold;
    const boxNeeded = Math.ceil(goldAim / goldPerBox);
    const cardsNeeded = boxNeeded * 40;
    const targetNumberOfRuns = Math.ceil(cardsNeeded / cardsPerRun);
    const minutesNeeded = targetNumberOfRuns * minutesPerRun;
    const timeNeeded =
        minutesNeeded >= 60
            ? `${Math.round((minutesNeeded / 60) * 100) / 100} Hour(s)`
            : `${minutesNeeded} Minute(s)`;

    return (
        <Main
            title='Gold Per Co-op Time Calculator'
            className='cal gold-cal'
            content={
                <>
                    <img src={GoldImage} alt='gold' />
                    <form className='filter'>
                        <label htmlFor='class'>
                            <span>Class :</span>
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
                                type='textbox'
                                name='current-gold'
                                defaultValue={0}
                                className={
                                    isInvalidCurrentGold ||
                                    invalidGoldRelationship
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
                                type='textbox'
                                name='target-gold'
                                defaultValue={40000}
                                className={
                                    isInvalidTargetGold ||
                                    invalidGoldRelationship
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
                        <label htmlFor='wave'>
                            <span>Mode :</span>
                            <select
                                name='wave'
                                onChange={(
                                    evt: React.ChangeEvent<HTMLSelectElement>
                                ): void => {
                                    filter.custom =
                                        evt.target.value === 'Custom';
                                    if (!filter.custom) {
                                        const val = Number(evt.target.value);
                                        filter.targetWave = val;
                                    }
                                    setFilter({ ...filter });
                                }}
                            >
                                <option value={30}>Gears 30s</option>
                                <option value={56}>Solar / Time 56s</option>
                                <option value={76}>Combo Mirror 76s</option>
                                <option>Custom</option>
                            </select>
                            {filter.custom ? (
                                <input
                                    type='textbox'
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
                    </form>
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
                    {isInvalidWave ? (
                        <span className='invalid-warning'>
                            Invalid Wave Number. Acceptable input is{' '}
                            <strong>positive integer</strong>.
                        </span>
                    ) : (
                        ''
                    )}
                    <div className='divisor' />
                    <div className='result'>
                        <div>
                            <span>Target number of runs :</span>
                            <input
                                type='textbox'
                                className={invalidInput ? 'invalid' : ''}
                                value={
                                    invalidInput
                                        ? 'Check Input'
                                        : targetNumberOfRuns
                                }
                                disabled
                            />
                        </div>
                        <div>
                            <span>Estimated Time needed :</span>
                            <input
                                type='textbox'
                                className={invalidInput ? 'invalid' : ''}
                                value={
                                    invalidInput ? 'Check Input' : timeNeeded
                                }
                                disabled
                            />
                        </div>
                    </div>
                </>
            }
        />
    );
}
