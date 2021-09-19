import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
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
import Main from 'Components/Main';
import Error from 'Components/Error';
import LoadingScreen from 'Components/Loading';
import Dice from 'Components/Dice';
import GoogleAds from 'Components/AdUnit';
import { RootState } from 'Redux/store';
import { Dice as DiceType } from 'Redux/Fetch Firebase/Dices/types';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';
import { fetchDices } from 'Firebase';
import findMaxCrit from 'Misc/findMaxCrit';

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
        lunar: {
            active: false,
            class: 7,
            level: 1,
            pip: 1,
        },
    });
    let jsx;
    const data = {
        combo: dices?.find(dice => dice.id === 46),
        crit: dices?.find(dice => dice.id === 13),
        lunar: dices?.find(dice => dice.id === 47),
    } as {
        [key: string]: DiceType | undefined;
    };

    const maxCrit = findMaxCrit(dices);
    const isInvalidCrit =
        !Number.isInteger(filter.crit) ||
        filter.crit < 111 ||
        filter.crit > maxCrit;
    const isInvalidCombo =
        !Number.isInteger(filter.combo.count) || filter.combo.count < 1;
    const invalidInput = isInvalidCombo || isInvalidCrit;

    const dpsPerComboCount = (
        mode: 'raw' | 'crit' | 'lunar' | 'lunar+crit',
        count = filter.combo.count
    ): { dmg: number; dps: number } => {
        if (!(data.combo && data.crit && data.lunar) || invalidInput) {
            return {
                dmg: 0,
                dps: 0,
            };
        }
        const dmgPerCombo =
            data.combo.eff1 +
            data.combo.cupEff1 * (filter.combo.class - 7) +
            data.combo.pupEff1 * (filter.combo.level - 1);
        const baseAtk =
            data.combo?.atk +
            data.combo?.cupAtk * (filter.combo.class - 7) +
            data.combo?.pupAtk * (filter.combo.level - 1);

        const roundTo3Sf = (val: number): number => Math.round(val * 100) / 100;

        const dmg = (dmgPerCombo * count * (count + 1)) / 2 + baseAtk;
        const criticalCritMultiplier =
            (5 +
                ((filter.critical.class - 3) * data.crit?.cupEff1 +
                    data.crit?.eff1) *
                    filter.critical.pip +
                data.crit?.pupEff1 * (filter.critical.level - 1)) /
            100;
        const lunarCritMultiplier =
            (5 + (filter.lunar.active ? filter.lunar.pip * 5 : 0)) / 100;
        const lunarSpdBuff =
            1 -
            ((data.lunar.eff1 + data.lunar.cupEff1 * (filter.lunar.class - 7)) *
                filter.lunar.pip +
                (filter.lunar.active ? 3 : 0) +
                data.lunar.pupEff1 * (filter.lunar.level - 1)) /
                100;
        const lunarBuffedDmg = filter.lunar.active
            ? (filter.lunar.pip * 0.1 + 1) * dmg
            : dmg;
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
                return {
                    dmg: roundTo3Sf(dmg),
                    dps: roundTo3Sf(
                        (dmg * (1 - criticalCritMultiplier) +
                            (dmg * criticalCritMultiplier * filter.crit) /
                                100) /
                            data.combo.spd
                    ),
                };
            }
            case 'lunar': {
                const atkSpd =
                    lunarSpdBuff * data.combo.spd <= 0.01
                        ? 0.01
                        : lunarSpdBuff * data.combo.spd;
                return {
                    dmg: roundTo3Sf(lunarBuffedDmg),
                    dps: roundTo3Sf(
                        (lunarBuffedDmg * (1 - lunarCritMultiplier) +
                            (lunarBuffedDmg *
                                lunarCritMultiplier *
                                filter.crit) /
                                100) /
                            atkSpd
                    ),
                };
            }
            case 'lunar+crit': {
                const atkSpd =
                    lunarSpdBuff * data.combo.spd <= 0.01
                        ? 0.01
                        : lunarSpdBuff * data.combo.spd;
                return {
                    dmg: roundTo3Sf(lunarBuffedDmg),
                    dps: roundTo3Sf(
                        (lunarBuffedDmg *
                            (1 -
                                Math.max(
                                    lunarCritMultiplier,
                                    criticalCritMultiplier
                                )) +
                            (lunarBuffedDmg *
                                Math.max(
                                    lunarCritMultiplier,
                                    criticalCritMultiplier
                                ) *
                                filter.crit) /
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

    const plotGraphCallback = {
        lunar: useCallback(
            (d: { x: number }): number => dpsPerComboCount('lunar', d.x).dps,
            [
                filter.lunar.active,
                filter.lunar.class,
                filter.lunar.level,
                filter.lunar.pip,
                filter.combo.class,
                filter.combo.level,
                filter.combo.count,
                filter.crit,
            ]
        ),
        crit: useCallback(
            (d: { x: number }): number => dpsPerComboCount('crit', d.x).dps,
            [
                filter.critical.class,
                filter.critical.level,
                filter.critical.pip,
                filter.combo.class,
                filter.combo.level,
                filter.combo.count,
                filter.crit,
            ]
        ),
        raw: useCallback(
            (d: { x: number }): number => dpsPerComboCount('raw', d.x).dps,
            [
                filter.combo.class,
                filter.combo.level,
                filter.combo.count,
                filter.crit,
            ]
        ),
    };

    if (data.combo && data.crit && data.lunar) {
        jsx = (
            <>
                <p>
                    This is a calculator for calculating the Combo Dice damage.
                    You can see the dps of combo raw damage and the dps of combo
                    when it is buffed by Critical and Lunar Dice.
                </p>
                <p>
                    Do Remember that damage and dps shown is per pip. You will
                    have to multiply the total pip count on your board to get
                    the final dps.
                </p>
                <hr className='divisor' />
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
                        <Dice dice='Lunar' />
                        <h3 className='desc'>{data.lunar?.desc}</h3>
                        <form
                            className='filter'
                            onSubmit={(evt): void => evt.preventDefault()}
                        >
                            <label
                                htmlFor='lunar-active'
                                className='checkbox-label'
                            >
                                <span>Active : </span>
                                <input
                                    type='checkbox'
                                    onChange={(
                                        evt: React.ChangeEvent<HTMLInputElement>
                                    ): void => {
                                        filter.lunar.active =
                                            evt.target.checked;
                                        setFilter({ ...filter });
                                    }}
                                />
                                <span className='checkbox-styler'>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>
                            <label htmlFor='lunar-class'>
                                <span>Class :</span>
                                <select
                                    name='lunar-class'
                                    defaultValue={7}
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.lunar.class = Number(
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
                            <label htmlFor='lunar-level'>
                                <span>Level :</span>
                                <select
                                    name='lunar-level'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.lunar.level = Number(
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
                            <label htmlFor='lunar-pip'>
                                <span>Pip :</span>
                                <select
                                    name='lunar-pip'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.lunar.pip = Number(
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
                            max={maxCrit}
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
                        <strong>111-{maxCrit}</strong>.
                    </span>
                ) : (
                    ''
                )}
                <GoogleAds unitId='8891384324' />
                <hr className='divisor' />
                <div className='result vertical'>
                    <div className='dmg'>
                        <h4>Damage per Combo pip:</h4>
                        <label htmlFor='result'>
                            <span className='type'>Raw Damage</span>
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
                        </label>
                        <label htmlFor='result'>
                            <span className='type'>Crit Damage</span>
                            <input
                                type='textbox'
                                className={invalidInput ? 'invalid' : ''}
                                value={
                                    invalidInput
                                        ? 'Check Input'
                                        : Math.round(
                                              (dpsPerComboCount('raw').dmg *
                                                  filter.crit) /
                                                  100
                                          )
                                }
                                disabled
                            />
                        </label>
                        <label htmlFor='result'>
                            <span className='type'>Lunar Buffed</span>
                            <input
                                type='textbox'
                                className={invalidInput ? 'invalid' : ''}
                                value={
                                    invalidInput
                                        ? 'Check Input'
                                        : dpsPerComboCount('lunar').dmg
                                }
                                disabled
                            />
                        </label>
                        <label htmlFor='result'>
                            <span className='type'>Lunar Crit Damage</span>
                            <input
                                type='textbox'
                                className={invalidInput ? 'invalid' : ''}
                                value={
                                    invalidInput
                                        ? 'Check Input'
                                        : Math.round(
                                              (dpsPerComboCount('lunar').dmg *
                                                  filter.crit) /
                                                  100
                                          )
                                }
                                disabled
                            />
                        </label>
                    </div>
                    <div className='dps'>
                        <h4>DPS per Combo Pip:</h4>
                        <label htmlFor='result'>
                            <span className='type'>No Buff</span>
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
                        </label>
                        <label htmlFor='result'>
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
                        </label>
                        <label htmlFor='result'>
                            <span className='type'>Lunar Buffed</span>
                            <input
                                type='textbox'
                                className={invalidInput ? 'invalid' : ''}
                                value={
                                    invalidInput
                                        ? 'Check Input'
                                        : dpsPerComboCount('lunar').dps
                                }
                                disabled
                            />
                        </label>
                    </div>
                </div>
                <div className='chart-container'>
                    <VictoryChart
                        minDomain={{ x: 1 }}
                        maxDomain={{
                            x: filter.combo.count + 10 || 10,
                            y: Math.max(
                                dpsPerComboCount(
                                    'lunar',
                                    filter.combo.count + 10
                                ).dps,
                                dpsPerComboCount(
                                    'crit',
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
                                        ) / 10}q`;
                                    case t > 999999999999999:
                                        return `${Math.round(
                                            t / 100000000000000
                                        ) / 10}t`;
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
                                { name: 'Lunar Buffed' },
                                { name: 'Crit Buffed' },
                                { name: 'No Buff' },
                            ]}
                        />
                        <VictoryLine
                            name='Lunar Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#197cf0', strokeWidth: 1 },
                            }}
                            y={plotGraphCallback.lunar}
                        />
                        <VictoryLine
                            name='Crit Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#ff0000', strokeWidth: 1 },
                            }}
                            y={plotGraphCallback.crit}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={100}
                            style={{
                                data: { stroke: '#111111', strokeWidth: 1 },
                            }}
                            y={plotGraphCallback.raw}
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
