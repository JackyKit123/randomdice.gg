import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import { RootState } from '../../../Misc/Redux Storage/store';
import { fetchDices } from '../../../Misc/Firebase/fetchData';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import '../cal.less';
import './dice.less';
import GoogleAds from '../../../Components/Ad Unit/ad';

export default function DiceStat(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [filter, setFilter] = useState({
        activeDice: 'Fire',
        class: 1,
        level: 1,
    });
    let jsx;
    const dice = dices?.find(d => d.name === filter.activeDice);

    if (dice) {
        let minClass: number;
        switch (dice?.rarity) {
            case 'Legendary':
                minClass = 7;
                break;
            case 'Unique':
                minClass = 5;
                break;
            case 'Rare':
                minClass = 3;
                break;
            default:
                minClass = 1;
        }
        if (filter.class < minClass) {
            filter.class = minClass;
            setFilter({ ...filter });
        }
        const atk =
            Math.round(
                (dice.atk +
                    dice.cupAtk * (filter.class - minClass) +
                    dice.pupAtk * (filter.level - 1)) *
                    100
            ) / 100;
        const spd =
            Math.round(
                (dice.spd +
                    dice.cupSpd * (filter.class - minClass) +
                    dice.pupSpd * (filter.level - 1)) *
                    100
            ) / 100;
        const eff1 =
            Math.round(
                (dice.eff1 +
                    dice.cupEff1 * (filter.class - minClass) +
                    dice.pupEff1 * (filter.level - 1)) *
                    100
            ) / 100;
        const eff2 =
            Math.round(
                (dice.eff2 +
                    dice.cupEff2 * (filter.class - minClass) +
                    dice.pupEff2 * (filter.level - 1)) *
                    100
            ) / 100;
        jsx = (
            <>
                <p>
                    This is a basic stat calculator for every dice. Note that
                    the pip count variable is not taken into account. It only
                    depicts the raw stat, you should not use this calculator to
                    calculate dps for dice like typhoon, mighty wind. For DPS
                    calculation, please use{' '}
                    <Link to='/calculator/dps'>dice DPS calculator</Link>{' '}
                    instead.
                </p>
                <hr className='divisor' />
                <div className='container'>
                    <div className='upper'>
                        <Dice dice={dice.id} />

                        <label htmlFor='class'>
                            Class :{' '}
                            <select
                                onChange={(evt): void => {
                                    filter.class = Number(evt.target.value);
                                    setFilter({ ...filter });
                                }}
                            >
                                {Array(15 - minClass + 1)
                                    .fill('')
                                    .map((_, i) => (
                                        <option
                                            key={`class-val-${i + minClass}`}
                                        >
                                            {i + minClass}
                                        </option>
                                    ))}
                            </select>
                        </label>
                        <label htmlFor='dice-name'>
                            <span className={dice.rarity}>{dice.rarity}</span>
                            <select
                                onChange={(evt): void => {
                                    const diceName = evt.target.value.replace(
                                        ' Dice',
                                        ''
                                    );
                                    filter.activeDice = diceName;
                                    setFilter({ ...filter });
                                }}
                            >
                                {dices?.map(d => (
                                    <option key={d.name}>{d.name} Dice</option>
                                ))}
                            </select>
                        </label>
                        <label htmlFor='level'>
                            Level :{' '}
                            <select
                                onChange={(evt): void => {
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
                        <div className='desc'>{dice.desc}</div>
                    </div>
                    <div className='lower'>
                        <div className='type'>
                            <span className='label'>Type</span>
                            <span className='value'>{dice.type}</span>
                        </div>
                        <div className='atk'>
                            <span className='label'>Atk</span>
                            <span className='value'>{atk || '-'}</span>
                        </div>
                        <div className='spd'>
                            <span className='label'>Attack Speed</span>
                            <span className='value'>
                                {spd || '-'}
                                {spd ? 's' : ''}
                            </span>
                        </div>
                        <div className='target'>
                            <span className='label'>Target</span>
                            <span className='value'>{dice.target || '-'}</span>
                        </div>
                        <div className='eff1'>
                            <span className='label'>
                                {dice.nameEff1 || '.'}
                            </span>
                            <span className='value'>
                                {eff1 || '-'}
                                {dice.unitEff1}
                            </span>
                        </div>
                        <div className='eff2'>
                            <span className='label'>
                                {dice.nameEff2 || '.'}
                            </span>
                            <span className='value'>
                                {eff2 || '-'}
                                {dice.unitEff2}
                            </span>
                        </div>
                    </div>
                </div>
                <GoogleAds unitId='8891384324' />
                <hr className='divisor' />
                <p>
                    The table below shows the information of upgrading a dice
                    class. Copies needed and gold needed mean the cost of
                    upgrading the dice to the next level. While contribution to
                    crit damage refers to the total critical damage contributed
                    towards you total crit%, it does not increase the critical
                    chance of the dice.
                </p>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Rarity</th>
                                <th>Class Up</th>
                                <th>Copies Needed</th>
                                <th>Gold Need</th>
                                <th>Contribution to Crit% dmg</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='common'>
                                <td>
                                    <p>Common</p>
                                </td>
                                <td>
                                    <p>1 &gt; 2</p>
                                    <p>2 &gt; 3</p>
                                    <p>3 &gt; 4</p>
                                    <p>4 &gt; 5</p>
                                    <p>5 &gt; 6</p>
                                    <p>6 &gt; 7</p>
                                    <p>7 &gt; 8</p>
                                    <p>8 &gt; 9</p>
                                    <p>9 &gt; 10</p>
                                    <p>10 &gt; 11</p>
                                    <p>11 &gt; 12</p>
                                    <p>12 &gt; 13</p>
                                    <p>13 &gt; 14</p>
                                    <p>14 &gt; 15</p>
                                </td>
                                <td>
                                    <p>2</p>
                                    <p>4</p>
                                    <p>10</p>
                                    <p>20</p>
                                    <p>50</p>
                                    <p>100</p>
                                    <p>200</p>
                                    <p>400</p>
                                    <p>800</p>
                                    <p>2,000</p>
                                    <p>5,000</p>
                                    <p>10,000</p>
                                    <p>20,000</p>
                                    <p>50,000</p>
                                </td>
                                <td>
                                    <p>5</p>
                                    <p>20</p>
                                    <p>50</p>
                                    <p>150</p>
                                    <p>400</p>
                                    <p>1,000</p>
                                    <p>2,000</p>
                                    <p>4,000</p>
                                    <p>8,000</p>
                                    <p>20,000</p>
                                    <p>50,000</p>
                                    <p>100,000</p>
                                    <p>200,000</p>
                                    <p>400,000</p>
                                </td>
                                <td>
                                    <p>1%</p>
                                    <p>2%</p>
                                    <p>2%</p>
                                    <p>3%</p>
                                    <p>3%</p>
                                    <p>3%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                </td>
                            </tr>
                            <tr className='rare'>
                                <td>
                                    <p>Rare</p>
                                </td>
                                <td>
                                    <p>3 &gt; 4</p>
                                    <p>4 &gt; 5</p>
                                    <p>5 &gt; 6</p>
                                    <p>6 &gt; 7</p>
                                    <p>7 &gt; 8</p>
                                    <p>8 &gt; 9</p>
                                    <p>9 &gt; 10</p>
                                    <p>10 &gt; 11</p>
                                    <p>11 &gt; 12</p>
                                    <p>12 &gt; 13</p>
                                    <p>13 &gt; 14</p>
                                    <p>14 &gt; 15</p>
                                </td>
                                <td>
                                    <p>2</p>
                                    <p>4</p>
                                    <p>10</p>
                                    <p>20</p>
                                    <p>50</p>
                                    <p>100</p>
                                    <p>200</p>
                                    <p>500</p>
                                    <p>1,000</p>
                                    <p>2,000</p>
                                    <p>4,000</p>
                                    <p>10,000</p>
                                </td>
                                <td>
                                    <p>50</p>
                                    <p>150</p>
                                    <p>400</p>
                                    <p>1,000</p>
                                    <p>2,000</p>
                                    <p>4,000</p>
                                    <p>8,000</p>
                                    <p>20,000</p>
                                    <p>50,000</p>
                                    <p>100,000</p>
                                    <p>200,000</p>
                                    <p>400,000</p>
                                </td>
                                <td>
                                    <p>2%</p>
                                    <p>2%</p>
                                    <p>3%</p>
                                    <p>3%</p>
                                    <p>3%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                </td>
                            </tr>
                            <tr className='unique'>
                                <td>
                                    <p>Unique</p>
                                </td>
                                <td>
                                    <p>5 &gt; 6</p>
                                    <p>6 &gt; 7</p>
                                    <p>7 &gt; 8</p>
                                    <p>8 &gt; 9</p>
                                    <p>9 &gt; 10</p>
                                    <p>10 &gt; 11</p>
                                    <p>11 &gt; 12</p>
                                    <p>12 &gt; 13</p>
                                    <p>13 &gt; 14</p>
                                    <p>14 &gt; 15</p>
                                </td>
                                <td>
                                    <p>2</p>
                                    <p>4</p>
                                    <p>10</p>
                                    <p>20</p>
                                    <p>50</p>
                                    <p>100</p>
                                    <p>300</p>
                                    <p>600</p>
                                    <p>1,000</p>
                                    <p>2,000</p>
                                </td>
                                <td>
                                    <p>400</p>
                                    <p>1,000</p>
                                    <p>2,000</p>
                                    <p>4,000</p>
                                    <p>8,000</p>
                                    <p>20,000</p>
                                    <p>50,000</p>
                                    <p>100,000</p>
                                    <p>200,000</p>
                                    <p>400,000</p>
                                </td>
                                <td>
                                    <p>3%</p>
                                    <p>3%</p>
                                    <p>3%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                </td>
                            </tr>
                            <tr className='legendary'>
                                <td>
                                    <p>Legendary</p>
                                </td>
                                <td>
                                    <p>7 &gt; 8</p>
                                    <p>8 &gt; 9</p>
                                    <p>9 &gt; 10</p>
                                    <p>10 &gt; 11</p>
                                    <p>11 &gt; 12</p>
                                    <p>12 &gt; 13</p>
                                    <p>13 &gt; 14</p>
                                    <p>14 &gt; 15</p>
                                </td>
                                <td>
                                    <p>2</p>
                                    <p>4</p>
                                    <p>10</p>
                                    <p>20</p>
                                    <p>50</p>
                                    <p>100</p>
                                    <p>150</p>
                                    <p>200</p>
                                </td>
                                <td>
                                    <p>4,000</p>
                                    <p>8,000</p>
                                    <p>16,000</p>
                                    <p>100,000</p>
                                    <p>200,000</p>
                                    <p>400,000</p>
                                    <p>600,000</p>
                                    <p>800,000</p>
                                </td>
                                <td>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>4%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                    <p>5%</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
        <Main title='Dice Stat Calculator' className='dice-stat-cal cal'>
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
