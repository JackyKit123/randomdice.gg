import React, { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
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
import { RootState } from '../../../Misc/Redux Storage/store';
import { Dice as DiceType } from '../../../Misc/Redux Storage/Fetch Firebase/Dices/types';
import { fetchDices } from '../../../Misc/Firebase/fetchData';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import '../cal.less';
import './solar.less';
import GoogleAds from '../../../Components/Ad Unit/ad';

export default function SolarCalculator(): JSX.Element {
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
        lunar: {
            active: false,
            class: 7,
            level: 1,
            pip: 1,
        },
    });
    let jsx;

    const isInvalidCrit =
        !Number.isInteger(filter.crit) ||
        filter.crit < 111 ||
        filter.crit > 2225;
    const isInvalidDuration =
        !Number.isInteger(filter.duration) || filter.duration <= 0;
    const invalidInput = isInvalidCrit || isInvalidDuration;

    const diceData = {
        solar: dices?.find(dice => dice.name === 'Solar') as
            | DiceType
            | undefined,
        light: dices?.find(dice => dice.name === 'Light') as
            | DiceType
            | undefined,
        crit: dices?.find(dice => dice.name === 'Critical') as
            | DiceType
            | undefined,
        lunar: dices?.find(dice => dice.name === 'Lunar') as
            | DiceType
            | undefined,
    };

    if (diceData.solar && diceData.light && diceData.crit && diceData.lunar) {
        const basicDmgPerHit =
            (filter.solar.class - 7) * diceData.solar.cupAtk +
            diceData.solar.atk +
            diceData.solar.pupAtk * (filter.solar.level - 1);
        const basicDmgPerSplash =
            (filter.solar.class - 7) * diceData.solar.cupEff1 +
            diceData.solar.eff1 +
            diceData.solar.pupEff1 * (filter.solar.level - 1);
        const lunarBuffedDmgPerHit = filter.lunar.active
            ? ((filter.lunar.pip * 10) / 100 + 1) * basicDmgPerHit
            : basicDmgPerHit;
        const lunarBuffedDmgPerSplash = filter.lunar.active
            ? ((filter.lunar.pip * 10) / 100 + 1) * basicDmgPerSplash
            : basicDmgPerSplash;

        const lightBuff =
            ((filter.light.class - 3) * diceData.light.cupEff1 +
                diceData.light.eff1) *
                filter.light.pip +
            diceData.light.pupEff1 * (filter.light.level - 1);
        const lunarSpdBuff =
            ((filter.lunar.class - 7) * diceData.lunar.cupEff1 +
                diceData.lunar.eff1) *
                filter.lunar.pip +
            (filter.lunar.active ? 3 : 0) +
            diceData.lunar.pupEff1 * (filter.lunar.level - 1);
        const critBuff =
            ((filter.critical.class - 3) * diceData.crit.cupEff1 +
                diceData.crit.eff1) *
                filter.critical.pip +
            diceData.crit.pupEff1 * (filter.critical.level - 1);
        const lunarCritBuff = filter.lunar.active ? filter.lunar.pip * 5 : 0;

        const atkSpdMultiplier = 1 - lightBuff / 100;
        const lunarAtkSpdMultiplier = 1 - lunarSpdBuff / 100;
        const basicAtkSpd = diceData.solar.spd;
        let buffedAtkSpd = diceData.solar.spd * atkSpdMultiplier;
        buffedAtkSpd = buffedAtkSpd <= 0.01 ? 0.01 : buffedAtkSpd;
        let lunarBuffedAtkSpd = diceData.solar.spd * lunarAtkSpdMultiplier;
        lunarBuffedAtkSpd =
            lunarBuffedAtkSpd <= 0.01 ? 0.01 : lunarBuffedAtkSpd;

        const critMultiplier = (5 + critBuff) / 100;
        const lunarCritMultiplier = (5 + lunarCritBuff) / 100;
        const basicCrit = 0.95 + 0.05 * (filter.crit / 100);
        const buffedCrit =
            1 - critMultiplier + critMultiplier * (filter.crit / 100);
        const lunarBuffedCrit =
            1 - lunarCritMultiplier + lunarCritMultiplier * (filter.crit / 100);
        const lunarCritDoubleBuffedCrit = Math.max(buffedCrit, lunarBuffedCrit);

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
            basicAtkDps: useMemo(
                () =>
                    Math.round(
                        dps(
                            basicDmgPerHit,
                            basicAtkSpd,
                            basicCrit,
                            filter.duration
                        ) * 100
                    ) / 100,
                [
                    filter.solar.class,
                    filter.solar.level,
                    filter.solar.pip,
                    filter.duration,
                    filter.crit,
                ]
            ),
            basicSplashDps: useMemo(
                () =>
                    Math.round(
                        dps(
                            basicDmgPerSplash,
                            basicAtkSpd,
                            basicCrit,
                            filter.duration
                        ) * 100
                    ) / 100,
                [
                    filter.solar.class,
                    filter.solar.level,
                    filter.solar.pip,
                    filter.duration,
                    filter.crit,
                ]
            ),
            lightBuffAtk: useMemo(
                () =>
                    Math.round(
                        dps(
                            basicDmgPerHit,
                            buffedAtkSpd,
                            basicCrit,
                            filter.duration
                        ) * 100
                    ) / 100,
                [
                    filter.solar.class,
                    filter.solar.level,
                    filter.solar.pip,
                    filter.light.class,
                    filter.light.level,
                    filter.light.pip,
                    filter.duration,
                    filter.crit,
                ]
            ),
            lightBuffSplash: useMemo(
                () =>
                    Math.round(
                        dps(
                            basicDmgPerSplash,
                            buffedAtkSpd,
                            basicCrit,
                            filter.duration
                        ) * 100
                    ) / 100,
                [
                    filter.solar.class,
                    filter.solar.level,
                    filter.solar.pip,
                    filter.light.class,
                    filter.light.level,
                    filter.light.pip,
                    filter.duration,
                    filter.crit,
                ]
            ),
            critBuffAtk: useMemo(
                () =>
                    Math.round(
                        dps(
                            basicDmgPerHit,
                            basicAtkSpd,
                            buffedCrit,
                            filter.duration
                        ) * 100
                    ) / 100,
                [
                    filter.solar.class,
                    filter.solar.level,
                    filter.solar.pip,
                    filter.critical.class,
                    filter.critical.level,
                    filter.critical.pip,
                    filter.duration,
                    filter.crit,
                ]
            ),
            critBuffSplash: useMemo(
                () =>
                    Math.round(
                        dps(
                            basicDmgPerSplash,
                            basicAtkSpd,
                            buffedCrit,
                            filter.duration
                        ) * 100
                    ) / 100,
                [
                    filter.solar.class,
                    filter.solar.level,
                    filter.solar.pip,
                    filter.critical.class,
                    filter.critical.level,
                    filter.critical.pip,
                    filter.duration,
                    filter.crit,
                ]
            ),
            lunarBuffAtk: useMemo(
                () =>
                    Math.round(
                        dps(
                            lunarBuffedDmgPerHit,
                            lunarBuffedAtkSpd,
                            lunarBuffedCrit,
                            filter.duration
                        ) * 100
                    ) / 100,
                [
                    filter.solar.class,
                    filter.solar.level,
                    filter.solar.pip,
                    filter.lunar.active,
                    filter.lunar.class,
                    filter.lunar.level,
                    filter.lunar.pip,
                    filter.duration,
                    filter.crit,
                ]
            ),
            lunarBuffSplash: useMemo(
                () =>
                    Math.round(
                        dps(
                            lunarBuffedDmgPerSplash,
                            lunarBuffedAtkSpd,
                            lunarBuffedCrit,
                            filter.duration
                        ) * 100
                    ) / 100,
                [
                    filter.solar.class,
                    filter.solar.level,
                    filter.solar.pip,
                    filter.lunar.active,
                    filter.lunar.class,
                    filter.lunar.level,
                    filter.lunar.pip,
                    filter.duration,
                    filter.crit,
                ]
            ),
        };

        jsx = (
            <>
                <p>
                    This calculator is for calculating the cumulative damage of
                    the Solar Dice over a period of time with the buff of
                    Critical Dice and Light Dice. You can compare the difference
                    in damage of Solar with different class and level of Light
                    Dice or Critical Dice.
                </p>
                <p>
                    Please note that the graph is depicting the total damage
                    across certain period of time instead of the damage per
                    second at a certain point of time.
                </p>
                <hr className='divisor' />
                <div className='multiple-dice'>
                    <div className='dice-container'>
                        <Dice dice='Light' />
                        <h3 className='desc'>{diceData.light.desc}</h3>
                        <form
                            className='filter'
                            onSubmit={(evt): void => evt.preventDefault()}
                        >
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
                    <div className='dice-container'>
                        <Dice dice='Lunar' />
                        <h3 className='desc'>{diceData.lunar.desc}</h3>
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
                        <Dice dice='Critical' />
                        <h3 className='desc'>{diceData.crit.desc}</h3>
                        <form
                            className='filter'
                            onSubmit={(evt): void => evt.preventDefault()}
                        >
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
                    <div className='dice-container'>
                        <Dice dice='Solar' />
                        <h3 className='desc'>{diceData.solar.desc}</h3>
                        <form
                            className='filter'
                            onSubmit={(evt): void => evt.preventDefault()}
                        >
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
                </div>
                <form
                    className='filter'
                    onSubmit={(evt): void => evt.preventDefault()}
                >
                    <label htmlFor='crit dmg'>
                        <span>Crit% :</span>
                        <input
                            type='number'
                            name='crit dmg'
                            min={111}
                            max={2225}
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
                    <label htmlFor='duration'>
                        <span>Duration(s) :</span>
                        <input
                            type='number'
                            min={1}
                            step={1}
                            name='duration'
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
                        <strong>111-2225</strong>.
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
                <hr className='divisor' />
                <GoogleAds unitId='1144871846' />
                <hr className='divisor' />
                <div className='chart-container'>
                    <VictoryChart
                        maxDomain={{
                            x: filter.duration || 0,
                            y: Math.max(
                                dps(
                                    basicDmgPerHit,
                                    buffedAtkSpd,
                                    buffedCrit,
                                    filter.duration
                                ),
                                dps(
                                    lunarBuffedDmgPerHit,
                                    lunarBuffedAtkSpd,
                                    lunarCritDoubleBuffedCrit,
                                    filter.duration
                                )
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
                            colorScale={[
                                '#d178ff',
                                '#ff6a00',
                                '#197cf0',
                                '#ffff00',
                                '#ff0000',
                                '#111111',
                            ]}
                            data={[
                                { name: 'Lunar + Crit' },
                                { name: 'Light + Crit' },
                                { name: 'Lunar Buffed' },
                                { name: 'Light Buffed' },
                                { name: 'Crit Buffed' },
                                { name: 'No Buff' },
                            ]}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={100}
                            style={{
                                data: { stroke: '#111111', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        basicDmgPerHit,
                                        basicAtkSpd,
                                        basicCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Light Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#ffff00', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        basicDmgPerHit,
                                        buffedAtkSpd,
                                        basicCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.light.class,
                                    filter.light.level,
                                    filter.light.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Crit Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#ff0000', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        basicDmgPerHit,
                                        basicAtkSpd,
                                        buffedCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.critical.class,
                                    filter.critical.level,
                                    filter.critical.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Lunar Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#197cf0', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        lunarBuffedDmgPerHit,
                                        lunarBuffedAtkSpd,
                                        lunarBuffedCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.lunar.active,
                                    filter.lunar.class,
                                    filter.lunar.level,
                                    filter.lunar.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Light + Crit'
                            samples={100}
                            style={{
                                data: { stroke: '#ff6a00', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        basicDmgPerHit,
                                        buffedAtkSpd,
                                        buffedCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.critical.class,
                                    filter.critical.level,
                                    filter.critical.pip,
                                    filter.light.class,
                                    filter.light.level,
                                    filter.light.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Lunar + Crit'
                            samples={100}
                            style={{
                                data: { stroke: '#d178ff', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        lunarBuffedDmgPerHit,
                                        lunarBuffedAtkSpd,
                                        lunarCritDoubleBuffedCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.critical.class,
                                    filter.critical.level,
                                    filter.critical.pip,
                                    filter.lunar.active,
                                    filter.lunar.class,
                                    filter.lunar.level,
                                    filter.lunar.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                    </VictoryChart>
                    <VictoryChart
                        maxDomain={{
                            x: filter.duration || 0,
                            y: Math.max(
                                dps(
                                    basicDmgPerHit,
                                    buffedAtkSpd,
                                    buffedCrit,
                                    filter.duration
                                ),
                                dps(
                                    lunarBuffedDmgPerHit,
                                    lunarBuffedAtkSpd,
                                    lunarCritDoubleBuffedCrit,
                                    filter.duration
                                )
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
                        <VictoryLine
                            name='No Buff'
                            samples={100}
                            style={{
                                data: { stroke: '#111111', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        basicDmgPerSplash,
                                        basicAtkSpd,
                                        basicCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Light Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#ffff00', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        basicDmgPerSplash,
                                        buffedAtkSpd,
                                        basicCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.light.class,
                                    filter.light.level,
                                    filter.light.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Crit Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#ff0000', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        basicDmgPerSplash,
                                        basicAtkSpd,
                                        buffedCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.critical.class,
                                    filter.critical.level,
                                    filter.critical.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Lunar Buffed'
                            samples={100}
                            style={{
                                data: { stroke: '#197cf0', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        lunarBuffedDmgPerSplash,
                                        lunarBuffedAtkSpd,
                                        lunarBuffedCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.lunar.active,
                                    filter.lunar.class,
                                    filter.lunar.level,
                                    filter.lunar.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Light + Crit'
                            samples={100}
                            style={{
                                data: { stroke: '#ff6a00', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        basicDmgPerSplash,
                                        buffedAtkSpd,
                                        buffedCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.critical.class,
                                    filter.critical.level,
                                    filter.critical.pip,
                                    filter.light.class,
                                    filter.light.level,
                                    filter.light.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLine
                            name='Lunar + Crit'
                            samples={100}
                            style={{
                                data: { stroke: '#d178ff', strokeWidth: 1 },
                            }}
                            y={useCallback(
                                (d: { x: number }): number =>
                                    dps(
                                        lunarBuffedDmgPerSplash,
                                        lunarBuffedAtkSpd,
                                        lunarCritDoubleBuffedCrit,
                                        d.x
                                    ),
                                [
                                    filter.solar.class,
                                    filter.solar.level,
                                    filter.solar.pip,
                                    filter.critical.class,
                                    filter.critical.level,
                                    filter.critical.pip,
                                    filter.lunar.active,
                                    filter.lunar.class,
                                    filter.lunar.level,
                                    filter.lunar.pip,
                                    filter.duration,
                                    filter.crit,
                                ]
                            )}
                        />
                        <VictoryLegend
                            x={50}
                            y={70}
                            orientation='vertical'
                            gutter={20}
                            colorScale={[
                                '#d178ff',
                                '#ff6a00',
                                '#197cf0',
                                '#ffff00',
                                '#ff0000',
                                '#111111',
                            ]}
                            data={[
                                { name: 'Lunar + Crit' },
                                { name: 'Light + Crit' },
                                { name: 'Lunar Buffed' },
                                { name: 'Light Buffed' },
                                { name: 'Crit Buffed' },
                                { name: 'No Buff' },
                            ]}
                        />
                    </VictoryChart>
                </div>
                <hr className='divisor' />
                <h3>Cumulative Damage Over {filter.duration} seconds.</h3>
                <div className='result'>
                    <label htmlFor='result'>
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
                    </label>
                    <label htmlFor='result'>
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
                    </label>
                    <label htmlFor='result'>
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
                    </label>
                    <label htmlFor='result'>
                        <span>Lunar Buffed Basic Atk</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.lunarBuffAtk
                            }
                            disabled
                        />
                        <span>Lunar Buffed Splash Dmg</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput
                                    ? 'Check Input'
                                    : result.lunarBuffSplash
                            }
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
        <Main title='Solar Damage Calculator' className='solar-cal cal'>
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
