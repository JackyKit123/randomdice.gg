import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
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
import AdUnit from '../../../Components/Ad Unit/ad';
import { RootState } from '../../../Misc/Redux Storage/store';
import { Dice as DiceType } from '../../../Misc/Redux Storage/Fetch Firebase/Dices/types';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchDices } from '../../../Misc/Firebase/fetchData';
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
            count: 1,
        },
        critical: {
            class: 3,
            level: 1,
            pip: 1,
        },
        moon: {
            active: false,
            class: 7,
            level: 1,
            pip: 1,
        },
    });
    let jsx;
    const data = {
        combo: dices?.find(dice => dice.name === 'Combo'),
        crit: dices?.find(dice => dice.name === 'Critical'),
        moon: dices?.find(dice => dice.name === 'Moon'),
    } as {
        [key: string]: DiceType;
    };

    const isInvalidCrit =
        !Number.isInteger(filter.crit) ||
        filter.crit < 111 ||
        filter.crit > 2108;
    const isInvalidCombo =
        !Number.isInteger(filter.combo.count) || filter.combo.count < 1;
    const invalidInput = isInvalidCombo || isInvalidCrit;

    if (Object.values(data).every(d => d !== undefined)) {
        data.combo.cupEff1 = 2;

        const dpsPerComboCount = (
            mode: 'raw' | 'crit' | 'moon',
            count = filter.combo.count
        ): { dmg: number; dps: number } => {
            const dmgPerCombo =
                data.combo.eff1 +
                data.combo.cupEff1 * (filter.combo.class - 7) +
                data.combo.pupEff1 * (filter.combo.level - 1);
            const baseAtk =
                data.combo.atk +
                data.combo.cupAtk * (filter.combo.class - 7) +
                data.combo.pupAtk * (filter.combo.level - 1);

            const roundTo3Sf = (val: number): number =>
                Math.round(val * 100) / 100;

            if (invalidInput) {
                return {
                    dmg: 0,
                    dps: 0,
                };
            }
            const dmg = (dmgPerCombo / 2) * (count ** 2 - count) + baseAtk;
            switch (mode) {
                case 'raw':
                    return {
                        dmg: roundTo3Sf(dmg),
                        dps: roundTo3Sf(
                            (dmg * 0.95 + dmg * 0.05 * (filter.crit / 100)) /
                                data.combo.spd
                        ),
                    };
                case 'crit': {
                    const critMultiplier =
                        (5 +
                            ((filter.critical.class - 3) * data.crit.cupEff1 +
                                data.crit.eff1) *
                                filter.critical.pip +
                            data.crit.pupEff1 * (filter.critical.level - 1)) /
                        100;
                    return {
                        dmg: roundTo3Sf(dmg),
                        dps: roundTo3Sf(
                            (dmg * (1 - critMultiplier) +
                                (dmg * critMultiplier * filter.crit) / 100) /
                                data.combo.spd
                        ),
                    };
                }
                case 'moon': {
                    const critMultiplier =
                        (5 + (filter.moon.active ? filter.moon.pip * 5 : 0)) /
                        100;
                    const spdBuff =
                        1 -
                        ((data.moon.eff1 +
                            data.moon.cupEff1 * (filter.moon.class - 7)) *
                            filter.moon.pip +
                            data.moon.pupEff1 * (filter.moon.level - 1)) /
                            100;
                    const atkSpd =
                        spdBuff * data.combo.spd <= 0.1
                            ? 0.1
                            : spdBuff * data.combo.spd;
                    const buffedDmg = filter.moon.active
                        ? (filter.moon.pip * 0.1 + 1) * dmg
                        : dmg;
                    return {
                        dmg: roundTo3Sf(buffedDmg),
                        dps: roundTo3Sf(
                            (buffedDmg * (1 - critMultiplier) +
                                (buffedDmg * critMultiplier * filter.crit) /
                                    100) /
                                atkSpd
                        ),
                    };
                }
                default:
                    return {
                        dmg: 0,
                        dps: 0,
                    };
            }
        };

        jsx = (
            <>
                <p>
                    This is a calculator for calculating the Combo Dice damage.
                    You can see the dps of combo raw damage and the dps of combo
                    when it is buffed by Critical and Moon Dice.
                </p>
                <p>
                    Do Remember that damage and dps shown is per pip. You will
                    have to multiply the total pip count on your board to get
                    the final dps.
                </p>
                <p>
                    Although you can calculate the dps for both the use of
                    critical dice and moon dice, the dps is not summed up. It
                    should not make sense to use both dice with combo.
                </p>
                <div className='divisor' />
                <div className='multiple-dice'>
                    <div className='dice-container'>
                        <Dice dice='Critical' />
                        <h3 className='desc'>{data.crit?.desc}</h3>
                        <form
                            className='filter'
                            onSubmit={(evt): void => evt.preventDefault()}
                        >
                            <label htmlFor='crit-class'>
                                <span>Class :</span>
                                <select
                                    name='crit-class'
                                    defaultValue={3}
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

                    <div className='dice-container'>
                        <Dice dice='Combo' />
                        <h3 className='desc'>{data.combo.desc}</h3>
                        <form
                            className='filter'
                            onSubmit={(evt): void => evt.preventDefault()}
                        >
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
                                    type='number'
                                    min={0}
                                    step={1}
                                    name='combo count'
                                    className={isInvalidCombo ? 'invalid' : ''}
                                    defaultValue={1}
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
                        <Dice dice='Moon' />
                        <h3 className='desc'>{data.moon?.desc}</h3>
                        <form
                            className='filter'
                            onSubmit={(evt): void => evt.preventDefault()}
                        >
                            <label
                                htmlFor='moon-active'
                                className='checkbox-label'
                            >
                                <span>Active : </span>
                                <input
                                    type='checkbox'
                                    onChange={(
                                        evt: React.ChangeEvent<HTMLInputElement>
                                    ): void => {
                                        filter.moon.active = evt.target.checked;
                                        setFilter({ ...filter });
                                    }}
                                />
                                <span className='checkbox-styler'>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>
                            <label htmlFor='moon-class'>
                                <span>Class :</span>
                                <select
                                    name='moon-class'
                                    defaultValue={7}
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.moon.class = Number(
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
                            <label htmlFor='moon-level'>
                                <span>Level :</span>
                                <select
                                    name='moon-level'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.moon.level = Number(
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
                            <label htmlFor='moon-pip'>
                                <span>Pip :</span>
                                <select
                                    name='moon-pip'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.moon.pip = Number(
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
                <form
                    className='filter'
                    onSubmit={(evt): void => evt.preventDefault()}
                >
                    <label htmlFor='crit dmg'>
                        <span>Crit%:</span>
                        <input
                            type='number'
                            min={111}
                            step={1}
                            max={2108}
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
                        <strong>111-2108</strong>.
                    </span>
                ) : (
                    ''
                )}
                <div className='divisor' />
                <AdUnit unitId='227378933' dimension='300x250' />
                <AdUnit unitId='219055766' dimension='970x90' />
                <div className='divisor' />
                <div className='result'>
                    <div className='dmg'>
                        <span>Damage per Combo pip:</span>
                        <span className='type'>No Buff</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : dpsPerComboCount('raw').dmg
                            }
                            disabled
                        />
                        <span className='type'>Crit Buffed</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : dpsPerComboCount('crit').dmg
                            }
                            disabled
                        />
                        <span className='type'>Moon Buffed</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : dpsPerComboCount('moon').dmg
                            }
                            disabled
                        />
                    </div>
                    <div className='dps'>
                        <span>DPS per Combo Pip:</span>
                        <span className='type'>No buff</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : dpsPerComboCount('raw').dps
                            }
                            disabled
                        />
                        <span className='type'>Crit Buffed</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : dpsPerComboCount('crit').dps
                            }
                            disabled
                        />
                        <span className='type'>Moon Buffed</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : dpsPerComboCount('moon').dps
                            }
                            disabled
                        />
                    </div>
                </div>
                <div className='chart-container'>
                    <VictoryChart
                        minDomain={{ x: 1 }}
                        maxDomain={{
                            x: filter.combo.count + 10 || 10,
                            y: Math.max(
                                dpsPerComboCount(
                                    'crit',
                                    filter.combo.count + 10
                                ).dps,
                                dpsPerComboCount(
                                    'moon',
                                    filter.combo.count + 10
                                ).dps
                            ),
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
                            colorScale={['#197cf0', '#ff0000', '#111111']}
                            data={[
                                { name: 'Moon Buffed' },
                                { name: 'Crit Buffed' },
                                { name: 'No Buff' },
                            ]}
                        />
                        <VictoryLine
                            name='Moon Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#197cf0', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dpsPerComboCount('moon', d.x).dps
                            }
                        />
                        <VictoryLine
                            name='Crit Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#ff0000', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dpsPerComboCount('crit', d.x).dps
                            }
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={100}
                            style={{
                                data: { stroke: '#111111', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dpsPerComboCount('raw', d.x).dps
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
                    dispatch({ type: CLEAR_ERRORS });
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
