import React, { useState } from 'react';
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
import { Die } from 'types/database';

import Dice from 'components/Dice';
import { fetchDices } from 'misc/firebase';
import GoogleAds from 'components/AdUnit';
import findMaxCrit from 'misc/findMaxCrit';
import PageWrapper from 'components/PageWrapper';
import useRootStateSelector from '@redux';

export default function DpsCalculator(): JSX.Element {
  const { dice, firebaseError } = useRootStateSelector('fetchFirebaseReducer');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filter, setFilter] = useState({
    electricClass: 1,
    windClass: 1,
    ironClass: 1,
    brokenClass: 1,
    gambleClass: 1,
    arrowClass: 3,
    mwindClass: 5,
    melecClass: 5,
    typhoonClass: 7,
    critical: {
      enable: false,
      class: 3,
      level: 1,
      pip: 1,
    },
    lunar: {
      enable: false,
      active: false,
      class: 7,
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

  const data = {
    electric: dice?.find(die => die.id === 1),
    wind: dice?.find(die => die.id === 2),
    iron: dice?.find(die => die.id === 5),
    broken: dice?.find(die => die.id === 6),
    gamble: dice?.find(die => die.id === 7),
    arrow: dice?.find(die => die.id === 16),
    mwind: dice?.find(die => die.id === 24),
    melec: dice?.find(die => die.id === 22),
    typhoon: dice?.find(die => die.id === 43),
    critical: dice?.find(die => die.id === 13),
    light: dice?.find(die => die.id === 10),
    lunar: dice?.find(die => die.id === 47),
  } as { [key: string]: Die };

  const maxCrit = findMaxCrit(dice);
  const isInvalidCrit =
    !Number.isInteger(filter.crit) ||
    filter.crit < 111 ||
    filter.crit > maxCrit;
  const invalidInput = isInvalidCrit;
  const lightBuff = filter.light.enable
    ? ((filter.light.class - 3) * data.light.cupEff1 + data.light.eff1) *
        filter.light.pip +
      data.light.pupEff1 * (filter.light.level - 1)
    : 0;
  const lunarSpdBuff = filter.lunar.enable
    ? ((filter.lunar.class - 7) * data.lunar.cupEff1 + data.lunar.eff1) *
        filter.lunar.pip +
      (filter.lunar.active ? 3 : 0) +
      data.lunar.pupEff1 * (filter.lunar.level - 1)
    : 0;
  const critBuff = filter.critical.enable
    ? (((filter.critical.class - 3) * data.critical.cupEff1 +
        data.critical.eff1) *
        filter.critical.pip +
        data.critical.pupEff1 * (filter.critical.level - 1) +
        5) /
      100
    : 0;
  const lunarCritBuff =
    filter.lunar.enable && filter.lunar.active
      ? (5 * filter.lunar.pip) / 100
      : 0;
  const critBuffSum = Math.max(critBuff, lunarCritBuff) + 0.05;
  const critMultiplier = 1 - critBuffSum + critBuffSum * (filter.crit / 100);

  const roundTo3Sf = (val: number): number => Math.round(val * 100) / 100;

  const baseAtkDmg = (die: Die, diceClass: number, level: number): number => {
    let minClass = 1;
    switch (die.rarity) {
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
    const atk =
      die.atk + die.cupAtk * (diceClass - minClass) + die.pupAtk * (level - 1);
    const lunarAtkBuffMultiplier =
      filter.lunar.enable && filter.lunar.active
        ? (10 * filter.lunar.pip) / 100 + 1
        : 1;
    return atk * lunarAtkBuffMultiplier;
  };

  const atkSpd = (die: Die, diceClass = 0): number => {
    const atkSpdMultiplier = Math.min(
      1 - lightBuff / 100,
      1 - lunarSpdBuff / 100
    );
    let minClass = 1;
    switch (die.rarity) {
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
    const baseAtkSpd = die.spd;
    const cupAtkSpd = diceClass ? die.cupSpd * (diceClass - minClass) : 0;
    const buffedSpd = (baseAtkSpd + cupAtkSpd) * atkSpdMultiplier;
    return buffedSpd <= 0.01 ? 0.01 : buffedSpd;
  };

  const electricDps = (boss = false, level = filter.level): number => {
    const basicDpsPerPip =
      (baseAtkDmg(data.electric, filter.electricClass, level) /
        atkSpd(data.electric, filter.electricClass)) *
      critMultiplier;
    const lightingDPSPerPip =
      ((data.electric.eff1 +
        data.electric.pupEff1 * (level - 1) +
        data.electric.cupEff1 * (filter.electricClass - 1)) /
        atkSpd(data.electric, filter.electricClass)) *
      critMultiplier;
    const dps = boss
      ? (basicDpsPerPip + lightingDPSPerPip) * filter.pip
      : (basicDpsPerPip + lightingDPSPerPip * (0.7 + 0.3 + 0.3)) * filter.pip;
    return invalidInput ? 0 : roundTo3Sf(dps);
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
        (atkSpd(data.wind) / windSpdBuff)) *
      critMultiplier;
    const dps = dpsPerPip * filter.pip;
    return invalidInput ? 0 : roundTo3Sf(dps);
  };

  const ironDps = (boss = false, level = filter.level): number => {
    const dpsPerPip =
      (baseAtkDmg(data.iron, filter.ironClass, level) / atkSpd(data.iron)) *
      critMultiplier;
    const dps = dpsPerPip * filter.pip;
    return invalidInput ? 0 : roundTo3Sf(boss ? dps * 2 : dps);
  };

  const brokenDps = (level = filter.level): number => {
    const dpsPerPip =
      (baseAtkDmg(data.broken, filter.brokenClass, level) /
        atkSpd(data.broken)) *
      critMultiplier;
    const dps = dpsPerPip * filter.pip;
    return invalidInput ? 0 : roundTo3Sf(dps);
  };

  const gambleDps = (level = filter.level): number => {
    const dpsPerPip =
      (baseAtkDmg(data.gamble, filter.gambleClass, level) * critMultiplier +
        (1 + filter.crit) / 2) /
      atkSpd(data.gamble, filter.gambleClass);
    const dps = dpsPerPip * filter.pip;
    return invalidInput ? 0 : roundTo3Sf(dps);
  };

  const arrowDps = (level = filter.level): number => {
    const dpsPerPip =
      ((baseAtkDmg(data.arrow, filter.arrowClass, level) +
        (data.arrow.eff1 +
          data.arrow.pupEff1 * (level - 1) +
          data.arrow.cupEff1 * (filter.arrowClass - 3)) /
          5) /
        atkSpd(data.arrow, filter.arrowClass)) *
      critMultiplier;
    const dps = dpsPerPip * filter.pip;
    return invalidInput ? 0 : roundTo3Sf(dps);
  };

  const mwindDps = (level = filter.level): number => {
    const baseDmgPerPip = baseAtkDmg(data.mwind, filter.mwindClass, level);
    const phase1Dps = (baseDmgPerPip / atkSpd(data.mwind)) * critMultiplier;
    const phase2Dps = (baseDmgPerPip / 0.1) * critMultiplier;
    const phase1Time = data.mwind.eff2;
    const phase2Time =
      data.mwind.eff1 +
      data.mwind.pupEff1 * (level - 1) +
      data.mwind.cupEff1 * (filter.mwindClass - 5);
    const dpsPerPip =
      (phase1Dps * phase1Time + phase2Dps * phase2Time) /
      (phase1Time + phase2Time);
    const dps = dpsPerPip * filter.pip;
    return invalidInput ? 0 : roundTo3Sf(dps);
  };

  const melecDps = (boss = false, level = filter.level): number => {
    const basicDpsPerPip =
      (baseAtkDmg(data.melec, filter.melecClass, level) / atkSpd(data.melec)) *
      critMultiplier;
    const lightingDPSPerPip =
      ((data.melec.eff1 +
        data.melec.pupEff1 * (level - 1) +
        data.melec.cupEff1 * (filter.melecClass - 5)) /
        atkSpd(data.melec)) *
      critMultiplier;
    const dps = boss
      ? (basicDpsPerPip + lightingDPSPerPip) * filter.pip
      : (basicDpsPerPip + lightingDPSPerPip * filter.pip) * filter.pip;
    return invalidInput ? 0 : roundTo3Sf(dps);
  };

  const typhoonDps = (level = filter.level): number => {
    const baseDmgPerPip = baseAtkDmg(data.typhoon, filter.typhoonClass, level);
    const phase1Dps = (baseDmgPerPip / atkSpd(data.typhoon)) * critMultiplier;
    const phase2Dps = (baseDmgPerPip / 0.1) * critMultiplier;
    const phase3Dps = (baseDmgPerPip / 0.1) * (filter.crit / 100);
    const phase1Time = data.typhoon.eff1;
    const phase2Time = data.typhoon.eff2;
    const phase3Time = 1;
    const dpsPerPip =
      (phase1Dps * phase1Time +
        phase2Dps * phase2Time +
        phase3Dps * phase3Time) /
      (phase1Time + phase2Time + phase3Time);
    const dps = dpsPerPip * filter.pip;
    return invalidInput ? 0 : roundTo3Sf(dps);
  };

  const maxDps = invalidInput
    ? 1000
    : Math.max(
        electricDps(false, 5),
        windDps(5),

        ironDps(true, 5),
        brokenDps(5),
        gambleDps(5),
        arrowDps(5),
        mwindDps(5),
        melecDps(false, 5),
        typhoonDps(5)
      );

  return (
    <PageWrapper
      isContentReady={
        !!(
          dice?.length &&
          Object.values(data).every(die => typeof die !== 'undefined')
        )
      }
      error={firebaseError}
      retryFn={fetchDices}
      title='General DPS Calculator'
      className='generic-dmg-cal cal'
      description='Pre-defined calculators for Random Dice, calculate damage, dps, odds with ease using the easy to use calculators.'
    >
      <p>
        This is a calculator for calculating the dps for generic dice that have
        no special interactions or effect and instead they attack plain basic
        attack damage.
      </p>
      <p>
        We have only included damage dealer dice like typhoon. Value dice or
        slow dice dps is ignored as their dps in negligible. For dice with
        special interaction like Solar, Gear or Combo, please refer to the tab
        for more information.
      </p>
      <p>
        Moreover, dice that deals AOE damage is not included. This includes
        Landmine, Thorn, Infect, etc. Basically, only meta dps dice are
        included. You can request for more calculators for other dice and your
        suggestion may be considered and we will make more calculators.
      </p>
      <hr className='divisor' />
      <h3>DPS Dice</h3>
      <div className='multiple-dice'>
        <div className='dice-container'>
          <Dice die='Electric' />
          <h3 className='desc'>{data.electric.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='class'>
              <span>Class :</span>
              <select
                name='class'
                defaultValue={filter.electricClass}
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.electricClass = Number(evt.target.value);
                  setFilter({ ...filter });
                }}
              >
                {Array(15)
                  .fill('')
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={`electric-${i}`}>{i + 1}</option>
                  ))}
              </select>
            </label>
          </form>
        </div>
        <div className='dice-container'>
          <Dice die='Wind' />
          <h3 className='desc'>{data.wind.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='class'>
              <span>Class :</span>
              <select
                name='class'
                defaultValue={filter.windClass}
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.windClass = Number(evt.target.value);
                  setFilter({ ...filter });
                }}
              >
                {Array(15)
                  .fill('')
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={`wind-${i}`}>{i + 1}</option>
                  ))}
              </select>
            </label>
          </form>
        </div>
        <div className='dice-container'>
          <Dice die='Iron' />
          <h3 className='desc'>{data.iron.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='class'>
              <span>Class :</span>
              <select
                name='class'
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.ironClass = Number(evt.target.value);
                  setFilter({ ...filter });
                }}
              >
                {Array(15)
                  .fill('')
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={`iron-${i}`}>{i + 1}</option>
                  ))}
              </select>
            </label>
          </form>
        </div>
        <div className='dice-container'>
          <Dice die='Broken' />
          <h3 className='desc'>{data.broken.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='class'>
              <span>Class :</span>
              <select
                name='class'
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.brokenClass = Number(evt.target.value);
                  setFilter({ ...filter });
                }}
              >
                {Array(15)
                  .fill('')
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={`broken-${i}`}>{i + 1}</option>
                  ))}
              </select>
            </label>
          </form>
        </div>
        <div className='dice-container'>
          <Dice die='Gamble' />
          <h3 className='desc'>{data.gamble.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='class'>
              <span>Class :</span>
              <select
                name='class'
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.gambleClass = Number(evt.target.value);
                  setFilter({ ...filter });
                }}
              >
                {Array(15)
                  .fill('')
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={`gamble-${i}`}>{i + 1}</option>
                  ))}
              </select>
            </label>
          </form>
        </div>
        <div className='dice-container'>
          <Dice die='Arrow' />
          <h3 className='desc'>{data.arrow.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='class'>
              <span>Class :</span>
              <select
                name='class'
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.arrowClass = Number(evt.target.value);
                  setFilter({ ...filter });
                }}
              >
                {Array(13)
                  .fill('')
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={`arrow-${i}`}>{i + 3}</option>
                  ))}
              </select>
            </label>
          </form>
        </div>
        <div className='dice-container'>
          <Dice die='Mighty Wind' />
          <h3 className='desc'>{data.mwind.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='class'>
              <span>Class :</span>
              <select
                name='class'
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.mwindClass = Number(evt.target.value);
                  setFilter({ ...filter });
                }}
              >
                {Array(11)
                  .fill('')
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={`mwind-${i}`}>{i + 5}</option>
                  ))}
              </select>
            </label>
          </form>
        </div>
        <div className='dice-container'>
          <Dice die='Modified Electric' />
          <h3 className='desc'>{data.melec.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='class'>
              <span>Class :</span>
              <select
                name='class'
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.melecClass = Number(evt.target.value);
                  setFilter({ ...filter });
                }}
              >
                {Array(11)
                  .fill('')
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={`melec-${i}`}>{i + 5}</option>
                  ))}
              </select>
            </label>
          </form>
        </div>
        <div className='dice-container'>
          <Dice die='Typhoon' />
          <h3 className='desc'>{data.typhoon.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='class'>
              <span>Class :</span>
              <select
                name='class'
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.typhoonClass = Number(evt.target.value);
                  setFilter({ ...filter });
                }}
              >
                {Array(9)
                  .fill('')
                  .map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={`typhoon-${i}`}>{i + 7}</option>
                  ))}
              </select>
            </label>
          </form>
        </div>
      </div>
      {isInvalidCrit ? (
        <span className='invalid-warning'>
          Invalid Crit% Input! Acceptable input is{' '}
          <strong>111-{maxCrit}</strong>.
        </span>
      ) : (
        ''
      )}
      <form className='filter' onSubmit={(evt): void => evt.preventDefault()}>
        <label htmlFor='level'>
          <span>Level :</span>
          <select
            name='level'
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
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
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
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
            type='number'
            name='crit dmg'
            min={111}
            max={maxCrit}
            step={1}
            defaultValue={111}
            className={isInvalidCrit ? 'invalid' : ''}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>): void => {
              const val = Number(evt.target.value);
              filter.crit = val;
              setFilter({ ...filter });
            }}
          />
        </label>
      </form>
      <hr className='divisor' />
      <h3>Buff Dice</h3>
      <div className='multiple-dice'>
        <div className='dice-container'>
          <Dice die='Light' />
          <h3 className='desc'>{data.light?.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='light-enable' className='checkbox-label'>
              <span>Enabled : </span>
              <input
                type='checkbox'
                onChange={(evt: React.ChangeEvent<HTMLInputElement>): void => {
                  filter.light.enable = evt.target.checked;
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
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.light.class = Number(evt.target.value);
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
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.light.level = Number(evt.target.value);
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
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.light.pip = Number(evt.target.value);
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
          <Dice die='Lunar' />
          <h3 className='desc'>{data.lunar?.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='lunar-enable' className='checkbox-label'>
              <span>Enabled : </span>
              <input
                type='checkbox'
                onChange={(evt: React.ChangeEvent<HTMLInputElement>): void => {
                  filter.lunar.enable = evt.target.checked;
                  setFilter({ ...filter });
                }}
              />
              <span className='checkbox-styler'>
                <FontAwesomeIcon icon={faCheck} />
              </span>
            </label>
            <label htmlFor='lunar-active' className='checkbox-label'>
              <span>Active : </span>
              <input
                type='checkbox'
                onChange={(evt: React.ChangeEvent<HTMLInputElement>): void => {
                  filter.lunar.active = evt.target.checked;
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
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.lunar.class = Number(evt.target.value);
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
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.lunar.level = Number(evt.target.value);
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
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.lunar.pip = Number(evt.target.value);
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
          <Dice die='Critical' />
          <h3 className='desc'>{data.critical?.desc}</h3>
          <form
            className='filter'
            onSubmit={(evt): void => evt.preventDefault()}
          >
            <label htmlFor='crit-enable' className='checkbox-label'>
              <span>Enabled : </span>
              <input
                type='checkbox'
                onChange={(evt: React.ChangeEvent<HTMLInputElement>): void => {
                  filter.critical.enable = evt.target.checked;
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
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.critical.class = Number(evt.target.value);
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
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.critical.level = Number(evt.target.value);
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
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                  filter.critical.pip = Number(evt.target.value);
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
      <GoogleAds unitId='8891384324' />
      <hr className='divisor' />
      <div className='result vertical'>
        <div className='wave-dmg'>
          <h4>DPS on wave :</h4>
          <label htmlFor='result'>
            <span className='dice-name'>Electric</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : electricDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Wind</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : windDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Iron</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : ironDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Broken</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : brokenDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Gamble</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : gambleDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Arrow</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : arrowDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Mighty Wind</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : mwindDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Modified Electric</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : melecDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Typhoon</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : typhoonDps()}
              disabled
            />
          </label>
        </div>
        <div className='boss-dmg'>
          <h4>DPS on boss :</h4>
          <label htmlFor='result'>
            <span className='dice-name'>Electric</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : electricDps(true)}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Wind</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : windDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Iron</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : ironDps(true)}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Broken</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : brokenDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Gamble</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : gambleDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Arrow</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : arrowDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Mighty Wind</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : mwindDps()}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Modified Electric</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : melecDps(true)}
              disabled
            />
          </label>
          <label htmlFor='result'>
            <span className='dice-name'>Typhoon</span>
            <input
              type='textbox'
              className={invalidInput ? 'invalid' : ''}
              value={invalidInput ? 'Check Input' : typhoonDps()}
              disabled
            />
          </label>
        </div>
      </div>
      <hr className='divisor' />
      <p>
        The chart below updates according to the information you input above, so
        you can enter the your dice class and read the expected dps below.
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
            tickValues={[1, 2, 3, 4, 5]}
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
                  return `${Math.round(t / 100000000000000000) / 10}Q`;
                case t > 999999999999999:
                  return `${Math.round(t / 100000000000000) / 10}t`;
                case t > 999999999999:
                  return `${Math.round(t / 100000000000) / 10}G`;
                case t > 999999999:
                  return `${Math.round(t / 100000000) / 10}B`;
                case t > 999999:
                  return `${Math.round(t / 100000) / 10}M`;
                case t > 999:
                  return `${Math.round(t / 100) / 10}K`;
                default:
                  return t;
              }
            }}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#f9b912', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => electricDps(false, d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#a9efe6', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => windDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#898989', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => ironDps(false, d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#9f0ff4', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => brokenDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#6f25d6', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => gambleDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#fa762c', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => arrowDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#22e7e3', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => mwindDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#f8390f', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => melecDps(false, d.x)}
          />
          <VictoryLine
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
              '#f9b912',
              '#898989',
              '#9f0ff4',
              '#6f25d6',
              '#fa762c',
              '#22e7e3',
              '#a9efe6',
              '#061b1c',
            ]}
            data={[
              { name: 'Modified Electric' },
              { name: 'Electric' },
              { name: 'Iron' },
              { name: 'Broken' },
              { name: 'Gamble' },
              { name: 'Arrow' },
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
            tickValues={[1, 2, 3, 4, 5]}
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
                  return `${Math.round(t / 100000000000000000) / 10}q`;
                case t > 999999999999999:
                  return `${Math.round(t / 100000000000000) / 10}t`;
                case t > 999999999999:
                  return `${Math.round(t / 100000000000) / 10}G`;
                case t > 999999999:
                  return `${Math.round(t / 100000000) / 10}B`;
                case t > 999999:
                  return `${Math.round(t / 100000) / 10}M`;
                case t > 999:
                  return `${Math.round(t / 100) / 10}K`;
                default:
                  return t;
              }
            }}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#f9b912', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => electricDps(true, d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#a9efe6', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => windDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#898989', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => ironDps(true, d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#9f0ff4', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => brokenDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#6f25d6', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => gambleDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#fa762c', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => arrowDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#22e7e3', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => mwindDps(d.x)}
          />
          <VictoryLine
            samples={4}
            style={{
              data: { stroke: '#f8390f', strokeWidth: 1 },
            }}
            y={(d: { x: number }): number => melecDps(true, d.x)}
          />
          <VictoryLine
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
              '#f9b912',
              '#898989',
              '#9f0ff4',
              '#6f25d6',
              '#fa762c',
              '#22e7e3',
              '#a9efe6',
              '#061b1c',
            ]}
            data={[
              { name: 'Modified Electric' },
              { name: 'Electric' },
              { name: 'Iron' },
              { name: 'Broken' },
              { name: 'Gamble' },
              { name: 'Arrow' },
              { name: 'Mighty Wind' },
              { name: 'Wind' },
              { name: 'Typhoon' },
            ]}
          />
        </VictoryChart>
      </div>
    </PageWrapper>
  );
}
