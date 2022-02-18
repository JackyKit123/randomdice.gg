import React, { useState } from 'react';
import { combinations } from 'mathjs';
import ReactHtmlParser from 'react-html-parser';
import PageWrapper from 'components/PageWrapper';
import replaceTextWithImgTag from 'misc/replaceTextWithImg';
import GoogleAds from 'components/AdUnit';
import useRootStateSelector from '@redux';

export default function GoldCalculator(): JSX.Element {
  const {
    wiki: { boss },
  } = useRootStateSelector('fetchFirebaseReducer');
  const [myClass, setClass] = useState(12);
  const [currentGold, setCurrentGold] = useState(0);
  const [targetGold, setTargetGold] = useState(0);
  const [currentDiamond, setCurrentDiamond] = useState(0);
  const [targetDiamond, setTargetDiamond] = useState(0);
  const [luck, setLuck] = useState(0);
  const [legendary, setLegendary] = useState(0);
  const [targetWave, setTargetWave] = useState(30);
  const [custom, setCustom] = useState(false);

  const cardBoxGoldPerClass = new Map([
    [1, 320],
    [2, 432],
    [3, 544],
    [4, 640],
    [5, 736],
    [6, 832],
    [7, 925],
    [8, 1024],
    [9, 1120],
    [10, 1312],
    [11, 1408],
    [12, 1504],
    [13, 1594],
    [14, 1687],
    [15, 1775],
    [16, 1866],
    [17, 1951],
    [18, 2044],
    [19, 2133],
    [20, 2222],
  ]);

  const coopWaveMode = new Map([
    [70, 'Pantheon YinYang'],
    [94, 'Colloseum Star/Solar C10 Moon Crack Snowball'],
    [110, 'Solar C11 Moon Crack Snowball'],
    [158, 'Solar C12 Moon Crack Snowball'],
    [174, 'Solar C12 Moon Crack Snowball >2000% Crit'],
    [270, 'C11 Galaxy Snowball'],
    [300, 'Recharge C12 Moon Sword Snowball'],
  ]);

  const isInvalidCurrentGold =
    !Number.isInteger(currentGold) || currentGold < 0;
  const isInvalidCurrentDiamond =
    !Number.isInteger(currentDiamond) || currentDiamond < 0;
  const isInvalidTargetGold = !Number.isInteger(targetGold) || targetGold < 0;
  const isInvalidTargetDiamond =
    !Number.isInteger(targetDiamond) || targetDiamond < 0;
  const invalidGoldRelationship = currentGold > targetGold;
  const invalidDiamondRelationship = currentDiamond > targetDiamond;
  const isInvalidWave = !Number.isInteger(targetWave) || targetWave <= 0;
  const invalidInput =
    isInvalidCurrentGold ||
    isInvalidTargetGold ||
    invalidGoldRelationship ||
    isInvalidCurrentDiamond ||
    isInvalidTargetDiamond ||
    invalidDiamondRelationship ||
    isInvalidWave;

  const earlyWaveCount = (boss.length - 1) * 5;
  const minutesPerRun = targetWave / 3.333 + 1;
  const cardsPerRun =
    targetWave > earlyWaveCount
      ? Math.floor((targetWave - earlyWaveCount) / 2) * 8 +
        ((targetWave - 1) % 2) * 2 +
        (earlyWaveCount / 5) * 8
      : Math.floor(targetWave / 5) * 8 +
        (targetWave % 5) +
        Number(targetWave % 5 >= 3);
  const goldPerBox = cardBoxGoldPerClass.get(myClass) || 0;
  const diamondPerBox = 3;
  const goldAim = targetGold - currentGold;
  const diamondAim = targetDiamond - currentDiamond;
  const boxNeededForLegendary = (box = legendary): number => {
    let probAccumulator = 0;
    for (let n = 0; n < legendary; n += 1) {
      probAccumulator += combinations(box, n) * 0.01 ** n * 0.99 ** (box - n);
    }
    if (probAccumulator > luck) {
      return boxNeededForLegendary(box + 1);
    }
    return box;
  };
  const boxNeeded = Math.ceil(
    Math.max(
      goldAim / goldPerBox,
      diamondAim / diamondPerBox,
      boxNeededForLegendary()
    )
  );
  const cardsNeeded = boxNeeded * 40;
  const targetNumberOfRuns = Math.ceil(cardsNeeded / cardsPerRun);
  const minutesNeeded = Math.max(targetNumberOfRuns * minutesPerRun - 1, 0);
  const timeNeeded =
    minutesNeeded >= 60
      ? `${Math.round((minutesNeeded / 60) * 100) / 100} Hour${
          minutesNeeded >= 120 ? 's' : ''
        }`
      : `${Math.round(minutesNeeded * 100) / 100} Minute${
          minutesNeeded % 60 > 1 ? 's' : ''
        }`;

  return (
    <PageWrapper
      title='Card Box Grind Calculator'
      className='cal coop-cal'
      description='Pre-defined calculators for Random Dice, calculate damage, dps, odds with ease using the easy to use calculators.'
    >
      <p>
        This is a calculator for the estimated time need to grind certain amount
        of gold, diamond, legendary dice based on the card box reward from Co-op
        quick run. For gold and diamond, input your current amount and target
        amount. For legendary, select the number of legendary you aim to get.
        Then select how lucky you are.
      </p>
      <p>
        The result for the boxes needed is the minimum amount to fit all 3
        criteria, For example, if you wish to get 100 gold and 10 diamond and 1
        legendary dice, we will calculate base on the boxes needed to get 1
        legendary because that takes the most time.
      </p>
      <p>
        By default, there are {coopWaveMode.size} modes:{' '}
        {Array.from(coopWaveMode.entries())
          .map(
            ([wave, mode]) =>
              `${mode} wave ${wave} run(${Math.round(
                (Number(wave) / 3.333) * 100
              ) / 100} mins)`
          )
          .join(', ')}
        . You can also enter a custom target wave goal.
      </p>
      <p>
        Keep in mind that the calculator assumes in average approximation of 18
        seconds per wave.
      </p>
      <hr className='divisor' />
      <section className='filter'>
        <form className='filter' onSubmit={(evt): void => evt.preventDefault()}>
          {ReactHtmlParser(replaceTextWithImgTag('{Gold}'))}
          <label htmlFor='class'>
            <span>PVP Rank :</span>
            <select
              name='class'
              defaultValue={12}
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void =>
                setClass(Number(evt.target.value))
              }
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
              <option>16</option>
              <option>17</option>
              <option>18</option>
              <option>19</option>
              <option>20</option>
            </select>
          </label>
          <label htmlFor='current-gold'>
            <span>Current Gold :</span>
            <input
              type='number'
              min={0}
              step={1}
              name='current-gold'
              defaultValue={0}
              className={
                isInvalidCurrentGold || invalidGoldRelationship ? 'invalid' : ''
              }
              onChange={(evt: React.ChangeEvent<HTMLInputElement>): void =>
                setCurrentGold(Number(evt.target.value))
              }
            />
          </label>
          <label htmlFor='target-gold'>
            <span>Target Gold :</span>
            <input
              type='number'
              min={0}
              step={1}
              name='target-gold'
              defaultValue={0}
              className={
                isInvalidTargetGold || invalidGoldRelationship ? 'invalid' : ''
              }
              onChange={(evt: React.ChangeEvent<HTMLInputElement>): void =>
                setTargetGold(Number(evt.target.value))
              }
            />
          </label>
          {isInvalidCurrentGold || isInvalidTargetGold ? (
            <span className='invalid-warning'>
              Invalid Gold Amount Input! Acceptable input is{' '}
              <strong>positive integer</strong>.
            </span>
          ) : (
            ''
          )}
          {invalidGoldRelationship ? (
            <span className='invalid-warning'>
              Invalid Gold Amount Input! Current Gold should be less than Target
              Gold.
            </span>
          ) : (
            ''
          )}
        </form>
        <form className='filter' onSubmit={(evt): void => evt.preventDefault()}>
          {ReactHtmlParser(replaceTextWithImgTag('{Diamond}'))}
          <label htmlFor='current-diamond'>
            <span>Current Diamond :</span>
            <input
              type='number'
              min={0}
              step={1}
              name='current-diamond'
              defaultValue={0}
              className={
                isInvalidCurrentDiamond || invalidDiamondRelationship
                  ? 'invalid'
                  : ''
              }
              onChange={(evt: React.ChangeEvent<HTMLInputElement>): void =>
                setCurrentDiamond(Number(evt.target.value))
              }
            />
          </label>
          <label htmlFor='target-diamond'>
            <span>Target Diamond :</span>
            <input
              type='number'
              min={0}
              step={1}
              name='target-diamond'
              defaultValue={0}
              className={
                isInvalidTargetDiamond || invalidDiamondRelationship
                  ? 'invalid'
                  : ''
              }
              onChange={(evt: React.ChangeEvent<HTMLInputElement>): void =>
                setTargetDiamond(Number(evt.target.value))
              }
            />
          </label>
          {isInvalidCurrentDiamond || isInvalidTargetDiamond ? (
            <span className='invalid-warning'>
              Invalid Diamond Amount Input! Acceptable input is{' '}
              <strong>positive integer</strong>.
            </span>
          ) : (
            ''
          )}
          {invalidDiamondRelationship ? (
            <span className='invalid-warning'>
              Invalid Diamond Amount Input! Current Diamond should be less than
              Target Diamond.
            </span>
          ) : (
            ''
          )}
        </form>
        <form className='filter' onSubmit={(evt): void => evt.preventDefault()}>
          {ReactHtmlParser(replaceTextWithImgTag('{Legendary Dice}'))}
          <label htmlFor='target-legendary'>
            <span>Target Legendary :</span>
            <select
              name='target-legendary'
              defaultValue={0}
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void =>
                setLegendary(Number(evt.target.value))
              }
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
            </select>
          </label>
          <label htmlFor='legendary-luck'>
            <span>Your Luck :</span>
            <select
              name='legendary-luck'
              defaultValue={0.5}
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void =>
                setLuck(Number(evt.target.value))
              }
            >
              <option value={0.1}>Very Unlucky (10%)</option>
              <option value={0.3}>Unlucky (30%)</option>
              <option value={0.5}>Moderate Luck (50%)</option>
              <option value={0.7}>Lucky (70%)</option>
              <option value={0.9}>Very Lucky (90%)</option>
            </select>
          </label>
        </form>
        <form className='filter' onSubmit={(evt): void => evt.preventDefault()}>
          <label htmlFor='wave'>
            <span>Mode :</span>
            <select
              name='wave'
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void => {
                const isCustom = evt.target.value === 'Custom';
                setCustom(isCustom);
                if (!isCustom) setTargetWave(Number(evt.target.value));
              }}
            >
              {Array.from(coopWaveMode.entries()).map(([wave, name]) => (
                <option
                  key={name}
                  value={wave}
                >{`${name} Wave ${wave}`}</option>
              ))}
              <option>Custom</option>
            </select>
            {custom ? (
              <input
                type='number'
                min={1}
                step={1}
                name='wave'
                placeholder='Wave#'
                className={isInvalidWave ? 'invalid' : ''}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>): void =>
                  setTargetWave(Number(evt.target.value))
                }
              />
            ) : null}
          </label>
          {isInvalidWave ? (
            <span className='invalid-warning'>
              Invalid Wave Number. Acceptable input is{' '}
              <strong>positive integer</strong>.
            </span>
          ) : (
            ''
          )}
        </form>
      </section>
      <hr className='divisor' />
      <section className='coop-gold-table'>
        <p>The gold for card boxes across ranks is as below.</p>
        <table className='horizontal'>
          <tbody>
            <tr>
              <th scope='row'>Class</th>
              {new Array(10).fill(1).map((i, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={j}>{i + j}</td>
              ))}
            </tr>
            <tr>
              <th scope='row'>Gold</th>
              {new Array(10).fill(1).map((i, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={j}>{cardBoxGoldPerClass.get(i + j)}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <table className='horizontal'>
          <tbody>
            <tr>
              <th scope='row'>Class</th>
              {new Array(10).fill(11).map((i, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={j}>{i + j}</td>
              ))}
            </tr>
            <tr>
              <th scope='row'>Gold</th>
              {new Array(10).fill(11).map((i, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={j}>{cardBoxGoldPerClass.get(i + j)}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <table className='vertical'>
          <thead>
            <tr>
              <th>Class</th>
              <th>Gold</th>
            </tr>
          </thead>
          <tbody>
            {new Array(20).fill(1).map((i, j) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={j}>
                <td>{i + j}</td>
                <td>{cardBoxGoldPerClass.get(i + j)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <GoogleAds unitId='8891384324' />
      <hr className='divisor' />
      <section className='result'>
        <label htmlFor='result'>
          <span>Card Boxes Needed :</span>
          <input
            type='textbox'
            className={invalidInput ? 'invalid' : ''}
            value={invalidInput ? 'Check Input' : boxNeeded}
            disabled
          />
        </label>
        <label htmlFor='result'>
          <span>Target number of runs :</span>
          <input
            type='textbox'
            className={invalidInput ? 'invalid' : ''}
            value={invalidInput ? 'Check Input' : targetNumberOfRuns}
            disabled
          />
        </label>
        <label htmlFor='result'>
          <span>Estimated Time needed :</span>
          <input
            type='textbox'
            className={invalidInput ? 'invalid' : ''}
            value={invalidInput ? 'Check Input' : timeNeeded}
            disabled
          />
        </label>
      </section>
    </PageWrapper>
  );
}
