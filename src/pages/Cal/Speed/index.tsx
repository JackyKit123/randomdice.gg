import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Dice from '@components/Dice';
import useRootStateSelector from '@redux';
import { fetchDices } from 'misc/firebase';

import GoogleAds from '@components/AdUnit';
import PageWrapper from '@components/PageWrapper';

export default function SpeedCalculator(): JSX.Element {
  const { dice, firebaseError } = useRootStateSelector('fetchFirebaseReducer');
  const [filter, setFilter] = useState({
    blizzard: {
      class: 7,
      level: 1,
      dice1Pips: 0,
      dice2Pips: 0,
      dice3Pips: 0,
    },
    ice: {
      class: 1,
      level: 1,
      enable: false,
    },
    sand: {
      enable: false,
    },
    flow: {
      class: 7,
      level: 1,
      mode: 'PvP',
      count: 0,
      pip: 0,
    },
  });

  const data = {
    blizzard: dice?.find(die => die.id === 35),
    ice: dice?.find(die => die.id === 4),
    flow: dice?.find(die => die.id === 48),
    sand: dice?.find(die => die.id === 30),
  };
  const blizzardSlow =
    data.blizzard &&
    Math.min(
      (data.blizzard.cupEff1 * (filter.blizzard.class - 7) +
        data.blizzard.pupEff1 * (filter.blizzard.level - 1) +
        data.blizzard.eff1) *
        (filter.blizzard.dice1Pips +
          filter.blizzard.dice2Pips +
          filter.blizzard.dice3Pips),
      50
    );
  const iceSlow =
    data.ice &&
    Math.min(
      (data.ice.cupEff1 * (filter.ice.class - 1) +
        data.ice.pupEff1 * (filter.ice.level - 1) +
        data.ice.eff1) *
        3 *
        Number(filter.ice.enable),
      50
    );
  const sandSlow = filter.sand.enable ? 40 : 0;
  const flowSpeed =
    data.flow &&
    (filter.flow.mode === 'PvP'
      ? (data.flow.cupEff1 * (filter.flow.class - 7) + data.flow.eff1) *
          filter.flow.pip +
        data.flow.pupEff1 * (filter.flow.level - 1) * filter.flow.count
      : Math.max(
          -1 *
            ((data.flow.cupEff2 * (filter.flow.class - 7) + data.flow.eff2) *
              filter.flow.pip +
              data.flow.pupEff2 * (filter.flow.level - 1) * filter.flow.count),
          -40
        ));
  const totalSlow =
    flowSpeed &&
    blizzardSlow &&
    iceSlow &&
    Math.max(flowSpeed - Math.max(blizzardSlow, iceSlow) - sandSlow, -90);

  const invalidFlowPip = filter.flow.pip < 0 || filter.flow.pip > 105;
  const invalidFlowCount =
    filter.flow.pip / 7 > filter.flow.count ||
    filter.flow.pip < filter.flow.count;

  return (
    <PageWrapper
      isContentReady={!!(data.blizzard && data.ice && data.flow && data.sand)}
      error={firebaseError}
      retryFn={fetchDices}
      title='Mod Speed Factor Calculator'
      className='speed-cal cal'
      description='Pre-defined calculators for Random Dice, calculate damage, dps, odds with ease using the easy to use calculators.'
    >
      <p>
        This calculator is for calculating the mob speed factor. Max Slow from
        frost effect by ice and blizzard is 3 Frost layers, which is 50% maxed.
        Flow has no speed cap in pvp while having 40% max slow in co-op. We do
        not have accurate data for the slow effect for sand swamp and we assumed
        it to be 40%.
      </p>
      <hr className='divisor' />
      <form className='filter' onSubmit={(evt): void => evt.preventDefault()}>
        <div className='dice-container'>
          <Dice die='Blizzard' />
          <h3 className='desc'>{data.blizzard?.desc}</h3>
          <label htmlFor='blizzard-class'>
            <span>Class :</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.blizzard.class = Number(evt.target.value);
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
          <label htmlFor='blizzard-level'>
            <span>Level :</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.blizzard.level = Number(evt.target.value);
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
          <label htmlFor='blizzard-dice1dot'>
            <span>Pips of the 1st Blizzard:</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.blizzard.dice1Pips = Number(evt.target.value);
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
          <label htmlFor='blizzard-dice2dot'>
            <span>Pips of the 2nd Blizzard:</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.blizzard.dice2Pips = Number(evt.target.value);
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
          <label htmlFor='blizzard-dice3dot'>
            <span>Pips of the 3rd Blizzard:</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.blizzard.dice3Pips = Number(evt.target.value);
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
        </div>
        <div className='dice-container'>
          <Dice die='Flow' />
          <h3 className='desc'>{data.flow?.desc}</h3>
          <label htmlFor='flow-class'>
            <span>Class :</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.flow.class = Number(evt.target.value);
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
          <label htmlFor='flow-level'>
            <span>Level :</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.flow.level = Number(evt.target.value);
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
          <label htmlFor='flow-mode'>
            <span>Mode :</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.flow.mode = evt.target.value;
                setFilter({ ...filter });
              }}
            >
              <option value='PvP'>PvP (speed up)</option>
              <option value='Co-op'>Co-op (slow down)</option>
            </select>
          </label>
          <label htmlFor='flow-dot'>
            <span>Total Pips of Flow :</span>
            <input
              type='number'
              min={0}
              max={105}
              step={1}
              defaultValue={0}
              className={invalidFlowPip ? 'invalid' : ''}
              onChange={(evt: React.ChangeEvent<HTMLInputElement>): void => {
                filter.flow.pip = Number(evt.target.value);
                setFilter({ ...filter });
              }}
            />
          </label>
          <label htmlFor='flow-counter'>
            <span>Total Numbers of Flow dice:</span>
            <select
              className={invalidFlowCount ? 'invalid' : ''}
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.flow.count = Number(evt.target.value);
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
        </div>
        <div className='dice-container'>
          <Dice die='Sand Swamp' />
          <h3 className='desc'>{data.sand?.desc}</h3>
          <label htmlFor='sand-enable' className='checkbox-label'>
            <span>Enabled : </span>
            <input
              type='checkbox'
              onChange={(evt: React.ChangeEvent<HTMLInputElement>): void => {
                filter.sand.enable = evt.target.checked;
                setFilter({ ...filter });
              }}
            />
            <span className='checkbox-styler'>
              <FontAwesomeIcon icon={faCheck} />
            </span>
          </label>
        </div>
        <div className='dice-container'>
          <Dice die='Ice' />
          <h3 className='desc'>{data.ice?.desc}</h3>
          <label htmlFor='ice-class'>
            <span>Class :</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.ice.class = Number(evt.target.value);
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
          <label htmlFor='ice-level'>
            <span>Level :</span>
            <select
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                filter.ice.level = Number(evt.target.value);
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
          <label htmlFor='ice-enable' className='checkbox-label'>
            <span>Enabled : </span>
            <input
              type='checkbox'
              onChange={(evt: React.ChangeEvent<HTMLInputElement>): void => {
                filter.ice.enable = evt.target.checked;
                setFilter({ ...filter });
              }}
            />
            <span className='checkbox-styler'>
              <FontAwesomeIcon icon={faCheck} />
            </span>
          </label>
        </div>
        {invalidFlowPip ? (
          <span className='invalid-warning'>
            The total pip count of flow should be between{' '}
            <strong>0-105.</strong>
          </span>
        ) : null}
        {invalidFlowCount ? (
          <span className='invalid-warning'>
            The number of flow dice should be at{' '}
            {filter.flow.pip < filter.flow.count
              ? `most ${filter.flow.pip} `
              : `least ${Math.ceil(filter.flow.pip / 7)} `}
            for {filter.flow.pip} pips of flow.
          </span>
        ) : null}
      </form>
      <GoogleAds unitId='8891384324' />
      <hr className='divisor' />
      <div className='result'>
        <label htmlFor='result'>
          <span>Slow Effect of Blizzard:</span>
          <input type='textbox' value={`-${blizzardSlow}%`} disabled />
        </label>
        <label htmlFor='result'>
          <span>Slow Effect of Ice:</span>
          <input type='textbox' value={`-${iceSlow}%`} disabled />
        </label>
        <label htmlFor='result'>
          <span>Speed Effect of Flow:</span>
          <input
            className={invalidFlowPip || invalidFlowCount ? 'invalid' : ''}
            type='textbox'
            value={
              invalidFlowPip || invalidFlowCount
                ? 'Check Input'
                : `${flowSpeed && flowSpeed > 0 ? '+' : ''}${flowSpeed}%`
            }
            disabled
          />
        </label>
        <label htmlFor='result'>
          <span>Mob Speed:</span>
          <input
            className={invalidFlowPip || invalidFlowCount ? 'invalid' : ''}
            type='textbox'
            value={
              invalidFlowPip || invalidFlowCount
                ? 'Check Input'
                : `${totalSlow && totalSlow > 0 ? '+' : ''}${totalSlow}%`
            }
            disabled
          />
        </label>
      </div>
    </PageWrapper>
  );
}
