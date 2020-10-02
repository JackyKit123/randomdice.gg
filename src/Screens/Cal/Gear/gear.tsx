import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import { RootState } from '../../../Misc/Redux Storage/store';
import { fetchDices } from '../../../Misc/Firebase/fetchData';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import '../cal.less';
import findMaxCrit from '../../../Misc/findMaxCrit';

export default function GearCalculator(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [filter, setFilter] = useState({
        class: 5,
        level: 1,
        chain: 1,
        pip: 1,
        crit: 111,
    });
    let jsx = <div />;
    const data = dices?.find(dice => dice.id === 26);

    if (dices?.length && data) {
        const maxCrit = findMaxCrit(dices);
        const isInvalidCrit =
            !Number.isInteger(filter.crit) ||
            filter.crit < 111 ||
            filter.crit > maxCrit;
        const isInvalidPip =
            !Number.isInteger(filter.pip) ||
            filter.pip < 1 ||
            filter.pip > 7 * 15;
        const isInvalidChain =
            filter.pip < filter.chain || filter.pip > filter.chain * 7;
        const invalidInput = isInvalidCrit || isInvalidChain || isInvalidPip;
        const atkDmg =
            data.atk +
            data.cupAtk * (filter.class - 5) +
            data.pupAtk * (filter.level - 1);
        const rawBuff =
            data.eff1 +
            data.cupEff1 * (filter.class - 5) +
            data.pupEff1 * (filter.level - 1);
        const dmgPerPip = atkDmg * (1 + (rawBuff / 100) * (filter.chain - 1));
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
                    1 (1 dice on board) and maxed at 15 chain length (board full
                    of dice).
                </p>
                <hr className='divisor' />
                <div className='dice-container'>
                    <div>
                        <Dice dice='Gear' />
                        <h3 className='desc'>{data.desc}</h3>
                    </div>
                </div>
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
                        </select>
                    </label>
                    <label htmlFor='pip'>
                        <span>Total Gear Pip:</span>
                        <input
                            type='number'
                            name='pip'
                            defaultValue={1}
                            min={1}
                            max={105}
                            step={1}
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
                            type='number'
                            name='crit dmg'
                            min={111}
                            max={maxCrit}
                            step={1}
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
                                ? 'too many gear pips comparing to the chain length.'
                                : 'chain length should be smaller than total gear pip.'
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
                        <strong>111-{maxCrit}</strong>.
                    </span>
                ) : (
                    ''
                )}
                <hr className='divisor' />
                <div className='result'>
                    <label htmlFor='result' className='dmg'>
                        <span>Damage per Gear pip :</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : dmgPerPip}
                            disabled
                        />
                    </label>
                    <label htmlFor='result' className='dps'>
                        <span>Total DPS :</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : dps}
                            disabled
                        />
                    </label>
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
        <Main title='Gear DPS Calculator' className='gear-dmg-cal cal'>
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
            {jsx}
        </Main>
    );
}
