import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import { RootState } from '../../../Components/Redux Storage/store';
import { clearError, fetchDices } from '../../Misc/fetchData';
import '../cal.less';

export default function ComboCaculator(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [filter, setFilter] = useState({
        class: 7,
        level: 1,
        combo: 0,
        crit: 111,
    });
    let jsx = <div />;
    const data = dices?.find(dice => dice.name === 'Combo');
    const isInvalidCrit =
        !Number.isInteger(filter.crit) ||
        filter.crit < 111 ||
        filter.crit > 2036;
    const isInvalidCombo = !Number.isInteger(filter.combo) || filter.combo < 0;
    const invalidInput = isInvalidCombo || isInvalidCrit;
    if (data) {
        const comboDiceData = {
            baseAtk: data.atk,
            baseAtkPerClass: data.cupAtk,
            baseAtkPerLevel: data.pupAtk,
            atkSpd: data.spd,
            baseComboAtk: data.eff1,
            ComboAtkPerClass: data.cupEff1,
            ComboAtkPerLevel: data.pupEff1,
        };
        const dmgPerCombo =
            comboDiceData.baseComboAtk +
            comboDiceData.ComboAtkPerClass * (filter.class - 7) +
            comboDiceData.ComboAtkPerLevel * (filter.level - 1);
        const baseAtk =
            comboDiceData.baseAtk +
            comboDiceData.baseAtkPerClass * (filter.class - 7) +
            comboDiceData.baseAtkPerLevel * (filter.level - 1);
        const dmg =
            (dmgPerCombo / 2) * (filter.combo ** 2 - filter.combo) + baseAtk;
        const dps = dmg * 0.95 + (dmg * 0.05 * filter.crit) / 100;
        jsx = (
            <>
                <div className='dice-container'>
                    <div>
                        <Dice dice='Combo' />
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
                    <label htmlFor='combo count'>
                        <span>Combo:</span>
                        <input
                            type='textbox'
                            name='combo count'
                            className={isInvalidCombo ? 'invalid' : ''}
                            defaultValue={0}
                            onChange={(
                                evt: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.combo = val;
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
                {isInvalidCombo ? (
                    <span className='invalid-warning'>
                        Invalid Combo Count Input! Acceptable input is{' '}
                        <strong>positive integer</strong>.
                    </span>
                ) : (
                    ''
                )}
                {isInvalidCrit ? (
                    <span className='invalid-warning'>
                        Invalid Crit% Input! Acceptable input is{' '}
                        <strong>111-2036</strong>.
                    </span>
                ) : (
                    ''
                )}
                <div className='filter-divisor' />
                <div className='result'>
                    <div className='dmg'>
                        <span>Damage per Combo pip:</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : dmg}
                            disabled
                        />
                    </div>
                    <div className='dps'>
                        <span>DPS per Combo Pip:</span>
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
                    clearError(dispatch);
                    fetchDices(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main
            title='Combo Damage Caculator'
            className='combo-dmg-cal cal'
            content={jsx}
        />
    );
}
