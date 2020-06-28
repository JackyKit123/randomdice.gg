import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import { RootState } from '../../../Misc/Redux Storage/store';
import { fetchDices } from '../../../Misc/Firebase/fetchData';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import '../cal.less';
import './blizzard.less';

export default function BlizzardCalculator(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [filter, setFilter] = useState({
        class: 7,
        level: 1,
        dice1Pips: 0,
        dice2Pips: 0,
        dice3Pips: 0,
    });
    let jsx;
    const data = dices?.find(dice => dice.name === 'Blizzard');

    if (data) {
        const blizzardDiceData = {
            slowPerClass: data.cupEff1,
            slowPerLevel: data.pupEff1,
            slowPerPip: data.eff1,
            unit: data.unitEff1,
        };
        const sharedSlowEffect =
            blizzardDiceData.slowPerClass * (filter.class - 7) +
            blizzardDiceData.slowPerLevel * (filter.level - 1);
        const dice1slow = filter.dice1Pips
            ? sharedSlowEffect + blizzardDiceData.slowPerPip * filter.dice1Pips
            : 0;
        const dice2slow = filter.dice2Pips
            ? sharedSlowEffect + blizzardDiceData.slowPerPip * filter.dice2Pips
            : 0;
        const dice3slow = filter.dice3Pips
            ? sharedSlowEffect + blizzardDiceData.slowPerPip * filter.dice3Pips
            : 0;
        const totalSlow = Math.min(dice1slow + dice2slow + dice3slow, 50);

        jsx = (
            <>
                <p>
                    This calculator is not for calculating the dps of Blizzard
                    Dice. It is for calculating the total slow effect by
                    Blizzard Dice. Maximum slow effect is 50%. You can calculate
                    the total slow using the calculator below. Max Slow is 3
                    Frost layers, extra blizzard dices will not give extra slow
                    when 3 layers of frost are applied.
                </p>
                <div className='divisor' />
                <div className='dice-container'>
                    <Dice dice='Blizzard' />
                    <h3 className='desc'>{data.desc}</h3>

                    <form
                        className='filter'
                        onSubmit={(evt): void => evt.preventDefault()}
                    >
                        <label htmlFor='class'>
                            <span>Class :</span>
                            <select
                                name='class'
                                onChange={(
                                    evt: React.ChangeEvent<HTMLSelectElement>
                                ): void => {
                                    filter.class = Number(evt.target.value);
                                    setFilter({ ...filter });
                                }}
                            >
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                                <option>13</option>
                                <option>14</option>
                                <option>15</option>
                            </select>
                        </label>
                        <label htmlFor='level'>
                            <span>Level :</span>
                            <select
                                name='level'
                                onChange={(
                                    evt: React.ChangeEvent<HTMLSelectElement>
                                ): void => {
                                    filter.level = Number(evt.target.value);
                                    setFilter({ ...filter });
                                }}
                            >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </label>
                        <label htmlFor='dice1dot'>
                            <span>Pips of the 1st Blizzard:</span>
                            <select
                                name='dice1dot'
                                onChange={(
                                    evt: React.ChangeEvent<HTMLSelectElement>
                                ): void => {
                                    filter.dice1Pips = Number(evt.target.value);
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
                            </select>
                        </label>
                        <label htmlFor='dice2dot'>
                            <span>Pips of the 2nd Blizzard:</span>
                            <select
                                name='dice2dot'
                                onChange={(
                                    evt: React.ChangeEvent<HTMLSelectElement>
                                ): void => {
                                    filter.dice2Pips = Number(evt.target.value);
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
                            </select>
                        </label>
                        <label htmlFor='dice3dot'>
                            <span>Pips of the 3rd Blizzard:</span>
                            <select
                                name='dice3dot'
                                onChange={(
                                    evt: React.ChangeEvent<HTMLSelectElement>
                                ): void => {
                                    filter.dice3Pips = Number(evt.target.value);
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
                            </select>
                        </label>
                    </form>
                </div>
                <div className='divisor' />
                <div className='result'>
                    <div>
                        <span>Slow Effect of 1st Blizzard:</span>
                        <input
                            type='textbox'
                            value={`${dice1slow}${blizzardDiceData.unit}`}
                            disabled
                        />
                    </div>
                    <div>
                        <span>Slow Effect of 2nd Blizzard:</span>
                        <input
                            type='textbox'
                            value={`${dice2slow}${blizzardDiceData.unit}`}
                            disabled
                        />
                    </div>
                    <div>
                        <span>Slow Effect of 3rd Blizzard:</span>
                        <input
                            type='textbox'
                            value={`${dice3slow}${blizzardDiceData.unit}`}
                            disabled
                        />
                    </div>
                    <div>
                        <span>Total Slow Effect:</span>
                        <input
                            type='textbox'
                            value={`${totalSlow}${blizzardDiceData.unit}`}
                            disabled
                        />
                    </div>
                </div>
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
        <Main
            title='Blizzard Slow Effect Calculator'
            className='blizz-slow-cal cal'
        >
            {jsx}
        </Main>
    );
}
