import React, { useState } from 'react';
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
import { Dice as DiceType } from '../../../Misc/Redux Storage/Fetch Dices/types';
import Dice from '../../../Components/Dice/dice';
import { RootState } from '../../../Misc/Redux Storage/store';
import { clearError, fetchDices } from '../../../Misc/fetchData';
import '../cal.less';
import './dps.less';

export default function DpsCalculator(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [filter, setFilter] = useState({
        windClass: 1,
        ironClass: 1,
        gambleClass: 1,
        crossbowClass: 3,
        mwindClass: 5,
        melecClass: 5,
        typhoonClass: 7,
        critical: {
            enable: false,
            class: 3,
            level: 1,
            pip: 1,
        },
        light: {
            enable: false,
            class: 3,
            level: 1,
            pip: 1,
        },
        pip: 1,
        level: 1,
        crit: 111,
    });
    let jsx = <div />;
    const isInvalidCrit =
        !Number.isInteger(filter.crit) ||
        filter.crit < 111 ||
        filter.crit > 2036;
    const invalidInput = isInvalidCrit;

    const data = {
        wind: dices?.find(dice => dice.name === 'Wind'),
        iron: dices?.find(dice => dice.name === 'Iron'),
        gamble: dices?.find(dice => dice.name === 'Gamble'),
        crossbow: dices?.find(dice => dice.name === 'Crossbow'),
        mwind: dices?.find(dice => dice.name === 'Mighty Wind'),
        melec: dices?.find(dice => dice.name === 'Modified Electric'),
        typhoon: dices?.find(dice => dice.name === 'Typhoon'),
        critical: dices?.find(dice => dice.name === 'Critical'),
        light: dices?.find(dice => dice.name === 'Light'),
    } as { [key: string]: DiceType };

    if (Object.values(data).every(d => d !== undefined)) {
        const lightBuff = filter.light.enable
            ? ((filter.light.class - 3) * data.light.cupEff1 +
                  data.light.eff1) *
                  filter.light.pip +
              data.light.pupEff1 * (filter.light.level - 1)
            : 0;
        const critBuff = filter.critical.enable
            ? (((filter.critical.class - 3) * data.critical.cupEff1 +
                  data.critical.eff1) *
                  filter.critical.pip +
                  data.critical.pupEff1 * (filter.critical.level - 1) +
                  5) /
              100
            : 0.05;

        const atkSpdMultiplier = 1 - lightBuff / 100;
        const critMultiplier = 1 - critBuff + critBuff * (filter.crit / 100);

        const roundTo3Sf = (val: number): number => Math.round(val * 100) / 100;

        const baseAtkDmg = (
            dice: DiceType,
            diceClass: number,
            level: number
        ): number => {
            let minClass = 1;
            switch (dice.rarity) {
                case 'Common':
                    minClass = 1;
                    break;
                case 'Rare':
                    minClass = 3;
                    break;
                case 'Unique':
                    minClass = 5;
                    break;
                case 'Legendary':
                    minClass = 7;
                    break;
                default:
                    minClass = 1;
            }
            return (
                dice.atk +
                dice.cupAtk * (diceClass - minClass) +
                dice.pupAtk * (level - 1)
            );
        };

        const windDps = (level = filter.level): number => {
            const windSpdBuff =
                1 +
                (data.wind.eff1 +
                    data.wind.pupEff1 * (level - 1) +
                    data.wind.cupEff1 * (filter.windClass - 1)) /
                    100;
            const dpsPerPip =
                (baseAtkDmg(data.wind, filter.windClass, level) /
                    ((data.wind.spd * atkSpdMultiplier) / windSpdBuff)) *
                critMultiplier;
            const dps = dpsPerPip * filter.pip;
            return roundTo3Sf(dps);
        };

        const ironDps = (boss = false, level = filter.level): number => {
            const dpsPerPip =
                (baseAtkDmg(data.iron, filter.ironClass, level) /
                    (data.iron.spd * atkSpdMultiplier)) *
                critMultiplier;
            const dps = dpsPerPip * filter.pip;
            return roundTo3Sf(boss ? dps * 2 : dps);
        };

        const gambleDps = (level = filter.level): number => {
            data.gamble.atk = 7;
            const dpsPerPip =
                ((baseAtkDmg(data.gamble, filter.gambleClass, level) +
                    (1 + filter.crit) / 2) /
                    ((data.gamble.spd +
                        data.gamble.cupSpd * (filter.gambleClass - 1)) *
                        atkSpdMultiplier)) *
                critMultiplier;
            const dps = dpsPerPip * filter.pip;
            return roundTo3Sf(dps);
        };

        const crossbowDps = (level = filter.level): number => {
            const dpsPerPip =
                ((baseAtkDmg(data.crossbow, filter.crossbowClass, level) +
                    (data.crossbow.eff1 +
                        data.crossbow.pupEff1 * (level - 1) +
                        data.crossbow.cupEff1 * (filter.crossbowClass - 3)) /
                        5) /
                    ((data.crossbow.spd +
                        data.crossbow.cupSpd * (filter.crossbowClass - 3)) *
                        atkSpdMultiplier)) *
                critMultiplier;
            const dps = dpsPerPip * filter.pip;
            return roundTo3Sf(dps);
        };

        const mwindDps = (level = filter.level): number => {
            const baseDmgPerPip = baseAtkDmg(
                data.mwind,
                filter.mwindClass,
                level
            );
            const phase1Dps =
                (baseDmgPerPip / (data.mwind.spd * atkSpdMultiplier)) *
                critMultiplier;
            const phase2Dps =
                (baseDmgPerPip / (0.1 * atkSpdMultiplier)) * critMultiplier;
            const phase1Time = data.mwind.eff2;
            const phase2Time =
                data.mwind.eff1 +
                data.mwind.pupEff1 * (level - 1) +
                data.mwind.cupEff1 * (filter.mwindClass - 5);
            const dpsPerPip =
                (phase1Dps * phase1Time + phase2Dps * phase2Time) /
                (phase1Time + phase2Time);
            const dps = dpsPerPip * filter.pip;
            return roundTo3Sf(dps);
        };

        const melecDps = (boss = false, level = filter.level): number => {
            const basicDpsPerPip =
                (baseAtkDmg(data.melec, filter.melecClass, level) /
                    (data.melec.spd * atkSpdMultiplier)) *
                critMultiplier;
            const lightingDPSPerPip =
                ((data.melec.eff1 +
                    data.melec.pupEff1 * (level - 1) +
                    data.melec.cupEff1 * (filter.melecClass - 5)) /
                    (data.melec.spd * atkSpdMultiplier)) *
                critMultiplier;
            const dps = boss
                ? basicDpsPerPip * filter.pip + lightingDPSPerPip
                : (basicDpsPerPip + lightingDPSPerPip) * filter.pip;
            return roundTo3Sf(dps);
        };

        const typhoonDps = (level = filter.level): number => {
            const baseDmgPerPip = baseAtkDmg(
                data.typhoon,
                filter.typhoonClass,
                level
            );
            const phase1Dps =
                (baseDmgPerPip / (data.typhoon.spd * atkSpdMultiplier)) *
                critMultiplier;
            const phase2Dps =
                (baseDmgPerPip / (0.1 * atkSpdMultiplier)) * critMultiplier;
            const phase3Dps =
                (baseDmgPerPip / (0.1 * atkSpdMultiplier)) *
                (filter.crit / 100);
            const phase1Time = data.typhoon.eff1;
            const phase2Time = data.typhoon.eff2;
            const phase3Time = 1;
            const dpsPerPip =
                (phase1Dps * phase1Time +
                    phase2Dps * phase2Time +
                    phase3Dps * phase3Time) /
                (phase1Time + phase2Time + phase3Time);
            const dps = dpsPerPip * filter.pip;
            return roundTo3Sf(dps);
        };

        const maxDps = Math.max(
            windDps(5),
            ironDps(true, 5),
            gambleDps(5),
            crossbowDps(5),
            mwindDps(5),
            melecDps(false, 5),
            typhoonDps(5)
        );

        jsx = (
            <>
                <p>
                    This is a calculator for calculating the dps for generic
                    dice that have no special interactions or effect and instead
                    they attack plain basic attack damage.
                </p>
                <p>
                    We have only included damage dealer dice like typhoon. Value
                    dice or slow dice dps is ignored as their dps in negligible.
                    For dice with special interaction like Solar, Gear or Combo,
                    please refer to the tab for more information.
                </p>
                <p>
                    Moreover, dice that deals AOE damage is not included. This
                    includes Landmine, Thorn, Infect, etc. Basically, only meta
                    dps dice are included. You can request for more calculators
                    for other dice and your suggestion may be considered and we
                    will make more calculators.
                </p>
                <div className='divisor' />
                <h3>DPS Dice</h3>
                <div className='multiple-dice'>
                    <div className='dice-container'>
                        <Dice dice='Wind' />
                        <h3 className='desc'>{data.wind.desc}</h3>
                        <form className='filter'>
                            <label htmlFor='class'>
                                <span>Class :</span>
                                <select
                                    name='class'
                                    defaultValue={filter.windClass}
                                    onChange={(
                                        evt: React.ChangeEvent<
                                            HTMLSelectElement
                                        >
                                    ): void => {
                                        filter.windClass = Number(
                                            evt.target.value
                                        );
                                        setFilter({ ...filter });
                                    }}
                                >
                                    {Array(15)
                                        .fill('')
                                        .map((_, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <option key={`wind-${i}`}>
                                                {i + 1}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </form>
                    </div>
                    <div className='dice-container'>
                        <Dice dice='Iron' />
                        <h3 className='desc'>{data.iron.desc}</h3>
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
                                        filter.ironClass = Number(
                                            evt.target.value
                                        );
                                        setFilter({ ...filter });
                                    }}
                                >
                                    {Array(15)
                                        .fill('')
                                        .map((_, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <option key={`iron-${i}`}>
                                                {i + 1}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </form>
                    </div>
                    <div className='dice-container'>
                        <Dice dice='Gamble' />
                        <h3 className='desc'>{data.gamble.desc}</h3>
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
                                        filter.gambleClass = Number(
                                            evt.target.value
                                        );
                                        setFilter({ ...filter });
                                    }}
                                >
                                    {Array(15)
                                        .fill('')
                                        .map((_, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <option key={`gamble-${i}`}>
                                                {i + 1}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </form>
                    </div>
                    <div className='dice-container'>
                        <Dice dice='Crossbow' />
                        <h3 className='desc'>{data.crossbow.desc}</h3>
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
                                        filter.crossbowClass = Number(
                                            evt.target.value
                                        );
                                        setFilter({ ...filter });
                                    }}
                                >
                                    {Array(13)
                                        .fill('')
                                        .map((_, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <option key={`crossbow-${i}`}>
                                                {i + 3}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </form>
                    </div>
                    <div className='dice-container'>
                        <Dice dice='Mighty Wind' />
                        <h3 className='desc'>{data.mwind.desc}</h3>
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
                                        filter.mwindClass = Number(
                                            evt.target.value
                                        );
                                        setFilter({ ...filter });
                                    }}
                                >
                                    {Array(11)
                                        .fill('')
                                        .map((_, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <option key={`mwind-${i}`}>
                                                {i + 5}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </form>
                    </div>
                    <div className='dice-container'>
                        <Dice dice='Modified Electric' />
                        <h3 className='desc'>{data.melec.desc}</h3>
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
                                        filter.melecClass = Number(
                                            evt.target.value
                                        );
                                        setFilter({ ...filter });
                                    }}
                                >
                                    {Array(11)
                                        .fill('')
                                        .map((_, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <option key={`melec-${i}`}>
                                                {i + 5}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </form>
                    </div>
                    <div className='dice-container'>
                        <Dice dice='Typhoon' />
                        <h3 className='desc'>{data.typhoon.desc}</h3>
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
                                        filter.typhoonClass = Number(
                                            evt.target.value
                                        );
                                        setFilter({ ...filter });
                                    }}
                                >
                                    {Array(9)
                                        .fill('')
                                        .map((_, i) => (
                                            // eslint-disable-next-line react/no-array-index-key
                                            <option key={`typhoon-${i}`}>
                                                {i + 7}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </form>
                    </div>
                </div>
                {isInvalidCrit ? (
                    <span className='invalid-warning'>
                        Invalid Crit% Input! Acceptable input is{' '}
                        <strong>111-2036</strong>.
                    </span>
                ) : (
                    ''
                )}
                <form className='filter'>
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
                    <label htmlFor='pip'>
                        <span>Pip for every dice:</span>
                        <select
                            name='pip'
                            onChange={(
                                evt: React.ChangeEvent<HTMLSelectElement>
                            ): void => {
                                filter.pip = Number(evt.target.value);
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
                <div className='divisor' />
                <h3>Buff Dice</h3>
                <div className='multiple-dice'>
                    <div className='dice-container'>
                        <Dice dice='Light' />
                        <h3 className='desc'>{data.light?.desc}</h3>
                        <form className='filter'>
                            <label htmlFor='light-enable'>
                                <span>Enabled : </span>
                                <input
                                    type='checkbox'
                                    onChange={(
                                        evt: React.ChangeEvent<HTMLInputElement>
                                    ): void => {
                                        filter.light.enable =
                                            evt.target.checked;
                                        setFilter({ ...filter });
                                    }}
                                />
                                <span className='checkbox-styler'>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>
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
                        <Dice dice='Critical' />
                        <h3 className='desc'>{data.critical?.desc}</h3>
                        <form className='filter'>
                            <label htmlFor='crit-enable'>
                                <span>Enabled : </span>
                                <input
                                    type='checkbox'
                                    onChange={(
                                        evt: React.ChangeEvent<HTMLInputElement>
                                    ): void => {
                                        filter.critical.enable =
                                            evt.target.checked;
                                        setFilter({ ...filter });
                                    }}
                                />
                                <span className='checkbox-styler'>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            </label>
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
                <div className='divisor' />
                <div className='result'>
                    <div className='wave-dmg'>
                        <span>DPS on wave :</span>
                        <span className='dice-name'>Wind</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : windDps()}
                            disabled
                        />
                        <span className='dice-name'>Iron</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : ironDps()}
                            disabled
                        />
                        <span className='dice-name'>Gamble</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : gambleDps()}
                            disabled
                        />
                        <span className='dice-name'>Crossbow</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : crossbowDps()}
                            disabled
                        />
                        <span className='dice-name'>Mighty Wind</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : mwindDps()}
                            disabled
                        />
                        <span className='dice-name'>Modified Electric</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : melecDps()}
                            disabled
                        />
                        <span className='dice-name'>Typhoon</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : typhoonDps()}
                            disabled
                        />
                    </div>
                    <div className='boss-dmg'>
                        <span>DPS on boss :</span>
                        <span className='dice-name'>Wind</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : windDps()}
                            disabled
                        />
                        <span className='dice-name'>Iron</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : ironDps(true)}
                            disabled
                        />
                        <span className='dice-name'>Gamble</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : gambleDps()}
                            disabled
                        />
                        <span className='dice-name'>Crossbow</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : crossbowDps()}
                            disabled
                        />
                        <span className='dice-name'>Mighty Wind</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : mwindDps()}
                            disabled
                        />
                        <span className='dice-name'>Modified Electric</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={
                                invalidInput ? 'Check Input' : melecDps(true)
                            }
                            disabled
                        />
                        <span className='dice-name'>Typhoon</span>
                        <input
                            type='textbox'
                            className={invalidInput ? 'invalid' : ''}
                            value={invalidInput ? 'Check Input' : typhoonDps()}
                            disabled
                        />
                    </div>
                </div>
                <div className='divisor' />
                <p>
                    The chart below updates according to the information you
                    input above, so you can enter the your dice class and read
                    the expected dps below.
                </p>
                <div className='chart-container'>
                    <VictoryChart
                        domain={{
                            x: [1, 5],
                            y: [0, maxDps * 1.1],
                        }}
                        theme={VictoryTheme.material}
                    >
                        <VictoryLabel
                            text='DPS on wave for dice at certain level'
                            x={175}
                            y={30}
                            textAnchor='middle'
                        />
                        <VictoryAxis
                            label='Level'
                            fixLabelOverlap
                            style={{
                                axisLabel: {
                                    padding: 30,
                                },
                            }}
                        />
                        <VictoryAxis dependentAxis />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#a9efe6', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => windDps(d.x)}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#898989', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                ironDps(false, d.x)
                            }
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#6f25d6', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => gambleDps(d.x)}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#fa762c', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => crossbowDps(d.x)}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#22e7e3', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => mwindDps(d.x)}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#f8390f', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                melecDps(false, d.x)
                            }
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#061b1c', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => typhoonDps(d.x)}
                        />
                        <VictoryLegend
                            x={50}
                            y={50}
                            orientation='horizontal'
                            itemsPerRow={2}
                            width={100}
                            gutter={10}
                            colorScale={[
                                '#f8390f',
                                '#898989',
                                '#6f25d6',
                                '#fa762c',
                                '#22e7e3',
                                '#a9efe6',
                                '#061b1c',
                            ]}
                            data={[
                                { name: 'Modified Electric' },
                                { name: 'Iron' },
                                { name: 'Gamble' },
                                { name: 'Crossbow' },
                                { name: 'Mighty Wind' },
                                { name: 'Wind' },
                                { name: 'Typhoon' },
                            ]}
                        />
                    </VictoryChart>
                    <VictoryChart
                        domain={{
                            x: [1, 5],
                            y: [0, maxDps * 1.1],
                        }}
                        theme={VictoryTheme.material}
                    >
                        <VictoryLabel
                            text='DPS on boss for dice at certain level'
                            x={175}
                            y={30}
                            textAnchor='middle'
                        />
                        <VictoryAxis
                            label='Level'
                            fixLabelOverlap
                            style={{
                                axisLabel: {
                                    padding: 30,
                                },
                            }}
                        />
                        <VictoryAxis dependentAxis />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#a9efe6', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => windDps(d.x)}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#898989', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => ironDps(true, d.x)}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#6f25d6', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => gambleDps(d.x)}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#fa762c', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => crossbowDps(d.x)}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#22e7e3', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => mwindDps(d.x)}
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#f8390f', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number =>
                                melecDps(true, d.x)
                            }
                        />
                        <VictoryLine
                            name='No Buff'
                            samples={4}
                            style={{
                                data: { stroke: '#061b1c', strokeWidth: 1 },
                            }}
                            y={(d: { x: number }): number => typhoonDps(d.x)}
                        />
                        <VictoryLegend
                            x={50}
                            y={50}
                            orientation='horizontal'
                            itemsPerRow={2}
                            width={100}
                            gutter={10}
                            colorScale={[
                                '#f8390f',
                                '#898989',
                                '#6f25d6',
                                '#fa762c',
                                '#22e7e3',
                                '#a9efe6',
                                '#061b1c',
                            ]}
                            data={[
                                { name: 'Modified Electric' },
                                { name: 'Iron' },
                                { name: 'Gamble' },
                                { name: 'Crossbow' },
                                { name: 'Mighty Wind' },
                                { name: 'Wind' },
                                { name: 'Typhoon' },
                            ]}
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
        <Main title='Generic DPS Calculator' className='generic-dmg-cal cal'>
            {jsx}
        </Main>
    );
}
