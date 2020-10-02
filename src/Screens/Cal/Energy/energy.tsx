import React, { useState } from 'react';
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
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import GoogleAds from '../../../Components/Ad Unit/ad';
import { RootState } from '../../../Misc/Redux Storage/store';
import { Dice as DiceType } from '../../../Misc/Redux Storage/Fetch Firebase/Dices/types';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchDices } from '../../../Misc/Firebase/fetchData';
import '../cal.less';
import './energy.less';
import findMaxCrit from '../../../Misc/findMaxCrit';

export default function EnergyCalculator(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [filter, setFilter] = useState({
        crit: 111,
        energy: {
            class: 3,
            level: 1,
            sp: 1,
        },
        critical: {
            class: 3,
            level: 1,
            pip: 1,
        },
        light: {
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
        energy: dices?.find(dice => dice.id === 14),
        crit: dices?.find(dice => dice.id === 13),
        light: dices?.find(dice => dice.id === 10),
        lunar: dices?.find(dice => dice.id === 47),
    } as {
        [key: string]: DiceType;
    };

    if (dices && Object.values(data).every(d => d !== undefined)) {
        const maxCrit = findMaxCrit(dices);
        const isInvalidCrit =
            !Number.isInteger(filter.crit) ||
            filter.crit < 111 ||
            filter.crit > maxCrit;
        const isInvalidSp =
            !Number.isInteger(filter.energy.sp) || filter.energy.sp < 0;
        const invalidInput = isInvalidSp || isInvalidCrit;
        const dpsPerSpCount = (
            mode: 'raw' | 'crit' | 'light' | 'lunar',
            sp = filter.energy.sp
        ): { dmg: number; dps: number } => {
            const dmgPerSp =
                data.energy.eff1 +
                data.energy.cupEff1 * (filter.energy.class - 3) +
                data.energy.pupEff1 * (filter.energy.level - 1);
            const baseAtk =
                data.energy.atk +
                data.energy.cupAtk * (filter.energy.class - 3) +
                data.energy.pupAtk * (filter.energy.level - 1);

            const roundTo3Sf = (val: number): number =>
                Math.round(val * 100) / 100;

            if (invalidInput) {
                return {
                    dmg: 0,
                    dps: 0,
                };
            }
            const dmg = (sp * dmgPerSp) / 100 + baseAtk;
            switch (mode) {
                case 'raw':
                    return {
                        dmg: roundTo3Sf(dmg),
                        dps: roundTo3Sf(
                            (dmg * 0.95 + dmg * 0.05 * (filter.crit / 100)) /
                                data.energy.spd
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
                                data.energy.spd
                        ),
                    };
                }
                case 'light': {
                    const spdBuff =
                        1 -
                        ((data.light.eff1 +
                            data.light.cupEff1 * (filter.light.class - 3)) *
                            filter.light.pip +
                            data.light.pupEff1 * (filter.light.level - 1)) /
                            100;
                    const atkSpd =
                        spdBuff * data.energy.spd <= 0.01
                            ? 0.01
                            : spdBuff * data.energy.spd;
                    return {
                        dmg: roundTo3Sf(dmg),
                        dps: roundTo3Sf(
                            (dmg * 0.95 + dmg * 0.05 * (filter.crit / 100)) /
                                atkSpd
                        ),
                    };
                }
                case 'lunar': {
                    const critMultiplier =
                        (5 + (filter.lunar.active ? filter.lunar.pip * 5 : 0)) /
                        100;
                    const spdBuff =
                        1 -
                        ((data.lunar.eff1 +
                            data.lunar.cupEff1 * (filter.lunar.class - 7)) *
                            filter.lunar.pip +
                            (filter.lunar.active ? 3 : 0) +
                            data.lunar.pupEff1 * (filter.lunar.level - 1)) /
                            100;
                    const atkSpd =
                        spdBuff * data.energy.spd <= 0.01
                            ? 0.01
                            : spdBuff * data.energy.spd;
                    const buffedDmg = filter.lunar.active
                        ? (filter.lunar.pip * 0.1 + 1) * dmg
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
                    This is a calculator for calculating the Energy Dice damage.
                    You can see the dps of energy raw damage and the dps of
                    energy when it is buffed by Light, Critical or Lunar Dice.
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
                    <div className='dice-container'>
                        <Dice dice='Light' />
                        <h3 className='desc'>{data.light?.desc}</h3>
                        <form
                            className='filter'
                            onSubmit={(evt): void => evt.preventDefault()}
                        >
                            <label htmlFor='light-class'>
                                <span>Class :</span>
                                <select
                                    name='light-class'
                                    defaultValue={3}
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
                    <div className='dice-container'>
                        <Dice dice='Energy' />
                        <h3 className='desc'>{data.energy.desc}</h3>
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
                                        filter.energy.class = Number(
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
                            <label htmlFor='energy level'>
                                <span>Level :</span>
                                <select
                                    name='energy level'
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.energy.level = Number(
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
                            <label htmlFor='energy-sp'>
                                <span>Sp:</span>
                                <input
                                    type='number'
                                    min={0}
                                    step={1}
                                    name='energy-sp'
                                    className={isInvalidSp ? 'invalid' : ''}
                                    defaultValue={0}
                                    onChange={(
                                        evt: React.ChangeEvent<HTMLInputElement>
                                    ): void => {
                                        const val = Number(evt.target.value);
                                        filter.energy.sp = val;
                                        setFilter({ ...filter });
                                    }}
                                />
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
                {isInvalidSp ? (
                    <span className='invalid-warning'>
                        Invalid Sp Count Input! Acceptable input is{' '}
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
                <GoogleAds unitId='1144871846' />
                <hr className='divisor' />
                <div className='result vertical'>
                    <div className='dmg'>
                        <h4>Damage per Energy pip:</h4>
                        <label htmlFor='result'>
                            <span className='type'>Raw Damage</span>
                            <input
                                type='textbox'
                                className={invalidInput ? 'invalid' : ''}
                                value={
                                    invalidInput
                                        ? 'Check Input'
                                        : Math.round(dpsPerSpCount('raw').dmg)
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
                                              (dpsPerSpCount('raw').dmg *
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
                                        : Math.round(dpsPerSpCount('lunar').dmg)
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
                                              (dpsPerSpCount('lunar').dmg *
                                                  filter.crit) /
                                                  100
                                          )
                                }
                                disabled
                            />
                        </label>
                    </div>
                    <div className='dps'>
                        <h4>DPS per Energy Pip:</h4>
                        <label htmlFor='result'>
                            <span className='type'>No buff</span>
                            <input
                                type='textbox'
                                className={invalidInput ? 'invalid' : ''}
                                value={
                                    invalidInput
                                        ? 'Check Input'
                                        : dpsPerSpCount('raw').dps
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
                                        : dpsPerSpCount('crit').dps
                                }
                                disabled
                            />
                        </label>
                        <label htmlFor='result'>
                            <span className='type'>Light Buffed</span>
                            <input
                                type='textbox'
                                className={invalidInput ? 'invalid' : ''}
                                value={
                                    invalidInput
                                        ? 'Check Input'
                                        : dpsPerSpCount('light').dps
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
                                        : dpsPerSpCount('lunar').dps
                                }
                                disabled
                            />
                        </label>
                    </div>
                </div>
                <div className='chart-container'>
                    <VictoryChart
                        minDomain={{ x: 0, y: 0 }}
                        maxDomain={{
                            x: filter.energy.sp + 100 || 10,
                            y:
                                Math.max(
                                    dpsPerSpCount(
                                        'crit',
                                        filter.energy.sp + 100
                                    ).dps,
                                    dpsPerSpCount(
                                        'lunar',
                                        filter.energy.sp + 100
                                    ).dps
                                ) + 10,
                        }}
                        theme={VictoryTheme.material}
                    >
                        <VictoryLabel
                            text='DPS Per Energy Pip'
                            x={175}
                            y={30}
                            textAnchor='middle'
                        />
                        <VictoryAxis
                            label='Sp Count'
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
                            colorScale={[
                                '#197cf0',
                                '#ff0000',
                                '#ffff00',
                                '#111111',
                            ]}
                            data={[
                                { name: 'Lunar Buffed' },
                                { name: 'Crit Buffed' },
                                { name: 'Light Buffed' },
                                { name: 'No Buff' },
                            ]}
                        />
                        <VictoryLine
                            name='Lunar Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#197cf0', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dpsPerSpCount('lunar', d.x).dps
                            }
                        />
                        <VictoryLine
                            name='Light Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#ffff00', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dpsPerSpCount('light', d.x).dps
                            }
                        />
                        <VictoryLine
                            name='Crit Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#ff0000', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dpsPerSpCount('crit', d.x).dps
                            }
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={100}
                            style={{
                                data: { stroke: '#111111', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                dpsPerSpCount('raw', d.x).dps
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
        <Main title='Energy Damage Calculator' className='energy-dmg-cal cal'>
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
