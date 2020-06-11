import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    VictoryTheme,
    VictoryChart,
    VictoryAxis,
    VictoryLine,
    VictoryLabel,
    VictoryLegend,
} from 'victory';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import { RootState } from '../../../Misc/Redux Storage/store';
import { clearError, fetchDices } from '../../../Misc/fetchData';
import '../cal.less';
import './combo.less';

export default function ComboCalculator(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [filter, setFilter] = useState({
        crit: 111,
        combo: {
            class: 7,
            level: 1,
            count: 0,
        },
        critical: {
            class: 3,
            level: 1,
            pip: 0,
        },
    });
    let jsx;
    const comboData = dices?.find(dice => dice.name === 'Combo');
    const critData = dices?.find(dice => dice.name === 'Critical');

    const isInvalidCrit =
        !Number.isInteger(filter.crit) ||
        filter.crit < 111 ||
        filter.crit > 2036;
    const isInvalidCombo =
        !Number.isInteger(filter.combo.count) || filter.combo.count < 0;
    const invalidInput = isInvalidCombo || isInvalidCrit;

    if (comboData && critData) {
        const comboDiceData = {
            baseAtk: comboData.atk,
            baseAtkPerClass: comboData.cupAtk,
            baseAtkPerLevel: comboData.pupAtk,
            atkSpd: comboData.spd,
            baseComboAtk: comboData.eff1,
            ComboAtkPerClass: 2 /* comboData.cupEff1 Combo Dice Data is mistaken */,
            ComboAtkPerLevel: comboData.pupEff1,
        };
        const critDiceData = {
            baseBuff: critData.eff1,
            buffPerClass: critData.cupEff1,
            buffPerLevel: critData.pupEff1,
        };

        const dmgPerCombo =
            comboDiceData.baseComboAtk +
            comboDiceData.ComboAtkPerClass * (filter.combo.class - 7) +
            comboDiceData.ComboAtkPerLevel * (filter.combo.level - 1);
        const baseAtk =
            comboDiceData.baseAtk +
            comboDiceData.baseAtkPerClass * (filter.combo.class - 7) +
            comboDiceData.baseAtkPerLevel * (filter.combo.level - 1);
        const critBuff =
            ((filter.critical.class - 3) * critDiceData.buffPerClass +
                critDiceData.baseBuff) *
                filter.critical.pip +
            critDiceData.buffPerLevel * (filter.critical.level - 1);
        const critMultiplier = filter.critical.pip
            ? (5 + critBuff) / 100
            : 0.05;

        const dmg =
            (dmgPerCombo / 2) * (filter.combo.count ** 2 - filter.combo.count) +
            baseAtk;
        const dps =
            Math.round(
                (dmg * (1 - critMultiplier) +
                    (dmg * critMultiplier * filter.crit) / 100) *
                    100
            ) / 100;

        const dpsPerComboCount = (count: number, useCrit: boolean): number => {
            if (invalidInput) {
                return 0;
            }
            const dmgInFn = (dmgPerCombo / 2) * (count ** 2 - count) + baseAtk;
            const critMultiplierInFn =
                useCrit && filter.critical.pip ? (5 + critBuff) / 100 : 0.05;
            return (
                dmgInFn * (1 - critMultiplierInFn) +
                (dmgInFn * critMultiplierInFn * filter.crit) / 100
            );
        };

        jsx = (
            <>
                <p>
                    This is a calculator for calculating the Combo Dice damage.
                    By default Critical Dice is not used (0 pip). You can
                    compare the dps per combo pip of with and without Critical
                    Dice.
                </p>
                <p>
                    Do Remember that damage and dps shown is per pip. You will
                    have to multiply the total pip count on your board to get
                    the final dps.
                </p>
                <div className='divisor' />
                <div className='multiple-dice'>
                    <div className='dice-container'>
                        <Dice dice='Combo' />
                        <h3 className='desc'>{comboData.desc}</h3>
                        <form className='filter'>
                            <label htmlFor='class'>
                                <span>Class :</span>
                                <select
                                    name='class'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.combo.class = Number(
                                            evt.target.value
                                        );
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
                            <label htmlFor='combo level'>
                                <span>Level :</span>
                                <select
                                    name='combo level'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.combo.level = Number(
                                            evt.target.value
                                        );
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
                                        filter.combo.count = val;
                                        setFilter({ ...filter });
                                    }}
                                />
                            </label>
                        </form>
                    </div>
                    <div className='dice-container'>
                        <Dice dice='Critical' />
                        <h3 className='desc'>{critData.desc}</h3>
                        <form className='filter'>
                            <label htmlFor='crit class'>
                                <span>Class :</span>
                                <select
                                    name='crit class'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.critical.class = Number(
                                            evt.target.value
                                        );
                                        setFilter({ ...filter });
                                    }}
                                >
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
                            <label htmlFor='crit level'>
                                <span>Level :</span>
                                <select
                                    name='crit level'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.critical.level = Number(
                                            evt.target.value
                                        );
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
                            <label htmlFor='crit pip'>
                                <span>Pip :</span>
                                <select
                                    name='crit pip'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.critical.pip = Number(
                                            evt.target.value
                                        );
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
                </div>
                <form className='filter'>
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
                <div className='divisor' />
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
                <div className='chart-container'>
                    <VictoryChart
                        maxDomain={{
                            x: filter.combo.count + 10 || 10,
                            y: dpsPerComboCount(filter.combo.count + 10, true),
                        }}
                        theme={VictoryTheme.material}
                    >
                        <VictoryLabel
                            text='DPS Per Combo Pip'
                            x={175}
                            y={30}
                            textAnchor='middle'
                        />
                        <VictoryAxis
                            label='Combo Count'
                            fixLabelOverlap
                            style={{
                                axisLabel: {
                                    padding: 30,
                                },
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            tickFormat={(t): string => {
                                switch (true) {
                                    case t > 999999999999999999999:
                                        return t;
                                    case t > 999999999999999999:
                                        return `${Math.round(
                                            t / 100000000000000000
                                        ) / 10}T`;
                                    case t > 999999999999999:
                                        return `${Math.round(
                                            t / 100000000000000
                                        ) / 10}T`;
                                    case t > 999999999999:
                                        return `${Math.round(t / 100000000000) /
                                            10}G`;
                                    case t > 999999999:
                                        return `${Math.round(t / 100000000) /
                                            10}B`;
                                    case t > 999999:
                                        return `${Math.round(t / 100000) /
                                            10}M`;
                                    case t > 999:
                                        return `${Math.round(t / 100) / 10}K`;
                                    default:
                                        return t;
                                }
                            }}
                        />
                        <VictoryLegend
                            x={50}
                            y={70}
                            orientation='vertical'
                            gutter={20}
                            colorScale={['#ff0000', '#111111']}
                            data={[
                                { name: 'Crit Buffed' },
                                { name: 'No Buff' },
                            ]}
                        />
                        <VictoryLine
                            name='Crit Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#ff0000', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dpsPerComboCount(d.x, true)
                            }
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={100}
                            style={{
                                data: { stroke: '#111111', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dpsPerComboCount(d.x, false)
                            }
                        />
                    </VictoryChart>
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
        <Main title='Combo Damage Calculator' className='combo-dmg-cal cal'>
            {jsx}
        </Main>
    );
}
