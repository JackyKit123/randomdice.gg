import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    VictoryChart,
    VictoryLine,
    VictoryAxis,
    VictoryTheme,
    VictoryLabel,
    VictoryLegend,
} from 'victory';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import { RootState } from '../../../Components/Redux Storage/store';
import { clearError, fetchDices } from '../../Misc/fetchData';
import '../cal.less';
import './solar.less';

export default function SolarCaculator(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [filter, setFilter] = useState({
        crit: 111,
        duration: 10,
        solar: {
            class: 7,
            level: 1,
            pip: 1,
        },
        light: {
            class: 10,
            level: 1,
            pip: 1,
        },
        critical: {
            class: 10,
            level: 1,
            pip: 1,
        },
    });
    let jsx = <LoadingScreen />;
    const solarData = dices?.find(dice => dice.name === 'Solar');
    const lightData = dices?.find(dice => dice.name === 'Light');
    const critData = dices?.find(dice => dice.name === 'Critical');
    const isInvalidCrit =
        !Number.isInteger(filter.crit) ||
        filter.crit < 111 ||
        filter.crit > 2036;
    const isInvalidDuration =
        !Number.isInteger(filter.duration) || filter.duration <= 0;
    const invalidInput = isInvalidCrit || isInvalidDuration;

    if (solarData && lightData && critData) {
        const diceData = {
            solar: {
                baseAtk: solarData.atk,
                atkPerClass: solarData.cupAtk,
                atkPerLevel: solarData.pupAtk,
                atkSpd: solarData.spd / 2, // active solar
                splashDmg: solarData.eff1,
                splashDmgPerClass: solarData.cupEff1,
                splashDmgPerLevel: solarData.pupEff1,
            },
            light: {
                baseBuff: lightData.eff1,
                buffPerClass: lightData.cupEff1,
                buffPerLevel: lightData.pupEff1,
            },
            crit: {
                baseBuff: critData.eff1,
                buffPerClass: critData.cupEff1,
                buffPerLevel: critData.pupEff1,
            },
        };

        const basicDmgPerHit =
            (filter.solar.class - 7) * diceData.solar.atkPerClass +
            diceData.solar.baseAtk +
            diceData.solar.atkPerLevel * (filter.solar.level - 1);
        const basicDmgPerSplash =
            (filter.solar.class - 7) * diceData.solar.splashDmgPerClass +
            diceData.solar.splashDmg +
            diceData.solar.splashDmgPerLevel * (filter.solar.level - 1);

        const lightBuff =
            ((filter.light.class - 3) * diceData.light.buffPerClass +
                diceData.light.baseBuff) *
                filter.light.pip +
            diceData.light.buffPerLevel * (filter.light.level - 1);
        const critBuff =
            ((filter.critical.class - 3) * diceData.crit.buffPerClass +
                diceData.crit.baseBuff) *
                filter.critical.pip +
            diceData.crit.buffPerLevel * (filter.critical.level - 1);

        const atkSpdMultiplier = 1 - lightBuff / 100;
        const basicAtkSpd = diceData.solar.atkSpd;
        const buffedAtkSpd = diceData.solar.atkSpd * atkSpdMultiplier;
        const critMultiplier = (5 + critBuff) / 100;
        const basicCrit = 0.95 + 0.05 * (filter.crit / 100);
        const buffedCrit =
            1 - critMultiplier + critMultiplier * (filter.crit / 100);

        const dps = (
            sourceDmgPerHit: number,
            atkSpd: number,
            crit: number,
            duration: number
        ): number => {
            const numberOfHits = (duration * filter.solar.pip) / atkSpd;

            const hitDmgMultiplier =
                (numberOfHits / 2) * (numberOfHits / 2 + 1);

            const totalDmg = hitDmgMultiplier * sourceDmgPerHit;
            const finalDps = totalDmg * crit;
            return invalidInput ? 0 : finalDps;
        };

        const result = {
            basicAtkDps:
                Math.round(
                    dps(
                        basicDmgPerHit,
                        basicAtkSpd,
                        basicCrit,
                        filter.duration
                    ) * 100
                ) / 100,
            basicSplashDps:
                Math.round(
                    dps(
                        basicDmgPerSplash,
                        basicAtkSpd,
                        basicCrit,
                        filter.duration
                    ) * 100
                ) / 100,
            lightBuffAtk:
                Math.round(
                    dps(
                        basicDmgPerHit,
                        buffedAtkSpd,
                        basicCrit,
                        filter.duration
                    ) * 100
                ) / 100,
            lightBuffSplash:
                Math.round(
                    dps(
                        basicDmgPerSplash,
                        buffedAtkSpd,
                        basicCrit,
                        filter.duration
                    ) * 100
                ) / 100,
            critBuffAtk:
                Math.round(
                    dps(
                        basicDmgPerHit,
                        basicAtkSpd,
                        buffedCrit,
                        filter.duration
                    ) * 100
                ) / 100,
            critBuffSplash:
                Math.round(
                    dps(
                        basicDmgPerSplash,
                        basicAtkSpd,
                        buffedCrit,
                        filter.duration
                    ) * 100
                ) / 100,
            doubleBuffAtk:
                Math.round(
                    dps(
                        basicDmgPerHit,
                        buffedAtkSpd,
                        buffedCrit,
                        filter.duration
                    ) * 100
                ) / 100,
            doubleBuffSpash:
                Math.round(
                    dps(
                        basicDmgPerSplash,
                        buffedAtkSpd,
                        buffedCrit,
                        filter.duration
                    ) * 100
                ) / 100,
        };

        jsx = (
            <>
                <div className='dice-container'>
                    <div>
                        <Dice dice='Light' />
                        <h3 className='desc'>{lightData.desc}</h3>
                        <form className='filter'>
                            <label htmlFor='light-class'>
                                <span>Class :</span>
                                <select
                                    name='light-class'
                                    defaultValue={10}
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.light.class = Number(
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
                            <label htmlFor='light-level'>
                                <span>Level :</span>
                                <select
                                    name='light-level'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.light.level = Number(
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
                            <label htmlFor='light-pip'>
                                <span>Pip :</span>
                                <select
                                    name='light-pip'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.light.pip = Number(
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
                                    <option>6</option>
                                    <option>7</option>
                                </select>
                            </label>
                        </form>
                    </div>
                    <div>
                        <Dice dice='Solar' />
                        <h3 className='desc'>{solarData.desc}</h3>
                        <form className='filter'>
                            <label htmlFor='solar-class'>
                                <span>Class :</span>
                                <select
                                    name='solar-class'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.solar.class = Number(
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
                            <label htmlFor='solar-level'>
                                <span>Level :</span>
                                <select
                                    name='solar-level'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.solar.level = Number(
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
                            <label htmlFor='solar-pip'>
                                <span>Pip :</span>
                                <select
                                    name='solar-pip'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.solar.pip = Number(
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
                                    <option>6</option>
                                    <option>7</option>
                                </select>
                            </label>
                        </form>
                    </div>
                    <div>
                        <Dice dice='Critical' />
                        <h3 className='desc'>{critData.desc}</h3>
                        <form className='filter'>
                            <label htmlFor='crit-class'>
                                <span>Class :</span>
                                <select
                                    name='crit-class'
                                    defaultValue={10}
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
                            <label htmlFor='crit-level'>
                                <span>Level :</span>
                                <select
                                    name='crit-level'
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
                            <label htmlFor='crit-pip'>
                                <span>Pip :</span>
                                <select
                                    name='crit-pip'
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
                        <span>Crit% :</span>
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
                    <label htmlFor='duration'>
                        <span>Duration(s) :</span>
                        <input
                            type='textbox'
                            name='duration'
                            maxLength={3}
                            style={
                                !isInvalidDuration && filter.duration > 200
                                    ? {
                                          backgroundColor: '#ffff00',
                                      }
                                    : undefined
                            }
                            defaultValue={10}
                            className={isInvalidDuration ? 'invalid' : ''}
                            onChange={(
                                evt: React.ChangeEvent<HTMLInputElement>
                            ): void => {
                                const val = Number(evt.target.value);
                                filter.duration = val;
                                setFilter({ ...filter });
                            }}
                        />
                    </label>
                </form>
                {isInvalidCrit ? (
                    <span className='invalid-warning'>
                        Invalid Crit% Input! Acceptable input is{' '}
                        <strong>111-2036</strong>.
                    </span>
                ) : (
                    ''
                )}
                {isInvalidDuration ? (
                    <span className='invalid-warning'>
                        Invalid Time Input! Acceptable input is{' '}
                        <strong>positive integer</strong>.
                    </span>
                ) : (
                    ''
                )}
                {filter.duration > 200 ? (
                    <span className='invalid-warning'>
                        Warning! You have entered a duration larger than 200
                        seconds, a normal wave should not exceed 120 seconds,
                        entering a number too large will cause intensive
                        rendering.
                    </span>
                ) : (
                    ''
                )}
                <div className='filter-divisor' />
                <div className='chart-container'>
                    <VictoryChart
                        maxDomain={{
                            x: filter.duration || 0,
                            y: dps(
                                basicDmgPerHit,
                                buffedAtkSpd,
                                buffedCrit,
                                filter.duration
                            ),
                        }}
                        theme={VictoryTheme.material}
                    >
                        <VictoryLabel
                            text='Cumulative Base Attack Damage Over Time'
                            x={175}
                            y={30}
                            textAnchor='middle'
                        />
                        <VictoryAxis
                            label='Hit Duration (seconds)'
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
                                    case t > 999999999999:
                                        return `${Math.round(t / 100000000000) /
                                            10}T`;
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
                            colorScale={[
                                '#ffa500',
                                '#ffff00',
                                '#ff0000',
                                '#111111',
                            ]}
                            data={[
                                { name: 'Double Buffed' },
                                { name: 'Light Buffed' },
                                { name: 'Crit Buffed' },
                                { name: 'No Buff' },
                            ]}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={filter.duration * 10}
                            style={{
                                data: { stroke: '#111111', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dps(basicDmgPerHit, basicAtkSpd, basicCrit, d.x)
                            }
                        />
                        <VictoryLine
                            name='Light Buffed'
                            samples={filter.duration * 10}
                            style={{
                                data: { stroke: '#ffff00', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dps(
                                    basicDmgPerHit,
                                    buffedAtkSpd,
                                    basicCrit,
                                    d.x
                                )
                            }
                        />
                        <VictoryLine
                            name='Crit Buffed'
                            samples={filter.duration * 10}
                            style={{
                                data: { stroke: '#ff0000', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dps(
                                    basicDmgPerHit,
                                    basicAtkSpd,
                                    buffedCrit,
                                    d.x
                                )
                            }
                        />
                        <VictoryLine
                            name='Double Buffed'
                            samples={filter.duration * 10}
                            style={{
                                data: { stroke: '#ffa500', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dps(
                                    basicDmgPerHit,
                                    buffedAtkSpd,
                                    buffedCrit,
                                    d.x
                                )
                            }
                        />
                    </VictoryChart>
                    <VictoryChart
                        maxDomain={{
                            x: filter.duration || 0,
                            y: dps(
                                basicDmgPerHit,
                                buffedAtkSpd,
                                buffedCrit,
                                filter.duration
                            ),
                        }}
                        theme={VictoryTheme.material}
                    >
                        <VictoryLabel
                            text='Cumulative Splash Damage Over Time'
                            x={175}
                            y={30}
                            textAnchor='middle'
                        />
                        <VictoryAxis
                            label='Hit Duration (seconds)'
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
                                    case t > 999999999999:
                                        return `${Math.round(t / 100000000000) /
                                            10}T`;
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
                        <VictoryLine
                            name='No Buff'
                            samples={filter.duration * 10}
                            style={{
                                data: { stroke: '#111111', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dps(
                                    basicDmgPerSplash,
                                    basicAtkSpd,
                                    basicCrit,
                                    d.x
                                )
                            }
                        />
                        <VictoryLine
                            name='Light Buffed'
                            samples={filter.duration * 10}
                            style={{
                                data: { stroke: '#ffff00', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dps(
                                    basicDmgPerSplash,
                                    buffedAtkSpd,
                                    basicCrit,
                                    d.x
                                )
                            }
                        />
                        <VictoryLine
                            name='Crit Buffed'
                            samples={filter.duration * 10}
                            style={{
                                data: { stroke: '#ff0000', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dps(
                                    basicDmgPerSplash,
                                    basicAtkSpd,
                                    buffedCrit,
                                    d.x
                                )
                            }
                        />
                        <VictoryLine
                            name='Double Buffed'
                            samples={filter.duration * 10}
                            style={{
                                data: { stroke: '#ffa500', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dps(
                                    basicDmgPerSplash,
                                    buffedAtkSpd,
                                    buffedCrit,
                                    d.x
                                )
                            }
                        />
                        <VictoryLegend
                            x={50}
                            y={70}
                            orientation='vertical'
                            gutter={20}
                            colorScale={[
                                '#ffa500',
                                '#ffff00',
                                '#ff0000',
                                '#111111',
                            ]}
                            data={[
                                { name: 'Double Buffed' },
                                { name: 'Light Buffed' },
                                { name: 'Crit Buffed' },
                                { name: 'No Buff' },
                            ]}
                        />
                    </VictoryChart>
                </div>
                <div className='filter-divisor' />
                <div className='result'>
                    <div className='title'>
                        Cumulative Damage Over {filter.duration} seconds.
                    </div>
                    <div>
                        <span>Basic Attack</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.basicAtkDps
                            }
                            disabled
                        />
                        <span>Splash Dmg</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.basicSplashDps
                            }
                            disabled
                        />
                    </div>
                    <div>
                        <span>Light Buffed Basic Atk</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.lightBuffAtk
                            }
                            disabled
                        />
                        <span>Light Buffed Splash Dmg</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.lightBuffSplash
                            }
                            disabled
                        />
                    </div>
                    <div>
                        <span>Crit Buffed Basic Atk</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.critBuffAtk
                            }
                            disabled
                        />
                        <span>Crit Buffed Splash Dmg</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.critBuffSplash
                            }
                            disabled
                        />
                    </div>
                    <div>
                        <span>Double Buffed Basic Atk</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.doubleBuffAtk
                            }
                            disabled
                        />
                        <span>Double Buffed Splash Dmg</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.doubleBuffSpash
                            }
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
            title='Solar Light vs Crit Damage Caculator'
            className='solar-cal cal'
            content={jsx}
        />
    );
}
