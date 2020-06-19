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

export default function GearsCalculator(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [filter, setFilter] = useState({
        class: 5,
        level: 1,
        chain: 0,
        pip: 1,
        crit: 111,
    });
    let jsx = <div />;
    const data = dices?.find(dice => dice.name === 'Gears');
    const isInvalidCrit =
        !Number.isInteger(filter.crit) ||
        filter.crit < 111 ||
        filter.crit > 2108;
    const isInvalidPip =
        !Number.isInteger(filter.pip) || filter.pip < 1 || filter.pip > 7 * 15;
    const isInvalidChain =
        filter.pip < filter.chain + 1 || filter.pip > (filter.chain + 1) * 7;
    const invalidInput = isInvalidCrit || isInvalidChain || isInvalidPip;

    if (data) {
        const gearsDiceData = {
            baseAtk: data.atk,
            baseAtkPerClass: data.cupAtk,
            baseAtkPerLevel: data.pupAtk,
            atkSpd: data.spd,
            baseChainBuff: data.eff1,
            chainBuffPerClass: data.cupEff1,
            chainBuffPerLevel: data.pupEff1,
        };

        const atkDmg =
            gearsDiceData.baseAtk +
            gearsDiceData.baseAtkPerClass * (filter.class - 5) +
            gearsDiceData.baseAtkPerLevel * (filter.level - 1);
        const rawBuff =
            gearsDiceData.baseChainBuff +
            gearsDiceData.chainBuffPerClass * (filter.class - 5) +
            gearsDiceData.chainBuffPerLevel * (filter.level - 1);
        const dmgPerPip = atkDmg * (1 + (rawBuff / 100) * filter.chain);
        const dps =
            Math.round(
                dmgPerPip *
                    filter.pip *
                    (0.95 + (0.05 * filter.crit) / 100) *
                    100
            ) / 100;

        jsx = (
            <>
                <p>
                    This is a calculator for calculating the damage per pip and
                    the total dps of the Gear Dice. The chain length start with
                    0 (1 dice on board) and maxed at 14 chain length (board full
                    of dice).
                </p>
                <div className='divisor' />
                <div className='dice-container'>
                    <div>
                        <Dice dice='Gears' />
                        <h3 className='desc'>{data.desc}</h3>
                    </div>
                </div>
                <form className='filter'>
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
                    <label htmlFor='chain'>
                        <span>Chain Length :</span>
                        <select
                            name='chain'
                            className={isInvalidChain ? 'invalid' : ''}
                            onChange={(
                                evt: React.ChangeEvent<HTMLSelectElement>
                            ): void => {
                                filter.chain = Number(evt.target.value);
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
                            <option>11</option>
                            <option>12</option>
                            <option>13</option>
                            <option>14</option>
                        </select>
                    </label>
                    <label htmlFor='pip'>
                        <span>Total Gears Pip:</span>
                        <input
                            type='textbox'
                            name='pip'
                            defaultValue={1}
                            className={
                                isInvalidPip || isInvalidChain ? 'invalid' : ''
                            }
                            onChange={(
                                evt: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.pip = val;
                                setFilter({ ...filter });
                            }}
                        />
                    </label>
                    <label htmlFor='crit dmg'>
                        <span>Crit%:</span>
                        <input
                            type='textbox'
                            name='crit dmg'
                            defaultValue={111}
                            className={isInvalidCrit ? 'invalid' : ''}
                            onChange={(
                                evt: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.crit = val;
                                setFilter({ ...filter });
                            }}
                        />
                    </label>
                </form>
                {isInvalidChain ? (
                    <span className='invalid-warning'>
                        {`Invalid pip amount, ${
                            filter.pip > filter.chain
                                ? 'too many gears pips comparing to the chain length.'
                                : 'chain length should be smaller than total gears pip.'
                        }`}
                    </span>
                ) : (
                    ''
                )}
                {isInvalidPip ? (
                    <span className='invalid-warning'>
                        Invalid Pip Count Input! Acceptable input is{' '}
                        <strong>1-105</strong>.
                    </span>
                ) : (
                    ''
                )}
                {isInvalidCrit ? (
                    <span className='invalid-warning'>
                        Invalid Crit% Input! Acceptable input is{' '}
                        <strong>111-2108</strong>.
                    </span>
                ) : (
                    ''
                )}
                <div className='divisor' />
                <div className='result'>
                    <div className='dmg'>
                        <span>Damage per Gears pip :</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : dmgPerPip}
                            disabled
                        />
                    </div>
                    <div className='dps'>
                        <span>Total DPS :</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : dps}
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
        <Main title='Gears DPS Calculator' className='gears-dmg-cal cal'>
            {jsx}
        </Main>
    );
}
