import React, { useState, useEffect } from 'react';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import Main from '../../../Components/Main/main';
import GoldPng from '../../Cal/Gold/gold.png';
import GoldWebp from '../../Cal/Gold/gold.webp';
import Dice from '../../../Components/Dice/dice';
import DefaultBoxPng from './Image/default.png';
import DefaultBoxWebp from './Image/default.webp';
import './box.less';

export default function BoxGuide(): JSX.Element {
    const [boxList, setBoxList] = useState({
        png: Array(24).fill(DefaultBoxPng),
        webp: Array(24).fill(DefaultBoxWebp),
    });

    useEffect(() => {
        Promise.all(
            Array(24)
                .fill('')
                .map((_, i) => import(`./Image/${i}.png`))
        ).then(val => {
            boxList.png = val.map(v => v.default);
            setBoxList({ ...boxList });
        });
        Promise.all(
            Array(24)
                .fill('')
                .map((_, i) => import(`./Image/${i}.webp`))
        ).then(val => {
            boxList.webp = val.map(v => v.default);
            setBoxList({ ...boxList });
        });
    }, []);

    const imgGold = (
        <img src={isWebpSupported() ? GoldWebp : GoldPng} alt='gold' />
    );

    return (
        <Main title='Box Guide' className='wiki box-guide'>
            <p>
                In this page you will find list of box in the game. Where they
                are obtained from and the reward they give.
            </p>
            <ul>
                <div className='divisor' />
                <li>
                    <h3>Common Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[0]
                                    : boxList.png[0]
                            }
                            alt='Common Box'
                        />
                    </div>
                    <p>Obtained from: Shop (Free)</p>
                    <p>
                        Contains: {imgGold} and common dice, depending on pvp
                        rank
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Burning Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[1]
                                    : boxList.png[1]
                            }
                            alt='Burning Box'
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Fire' /> + (
                        <Dice dice='Landmine' /> or <Dice dice='Nuclear' />)
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Electric Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[2]
                                    : boxList.png[2]
                            }
                            alt='Electric Box'
                        />
                    </div>
                    <p>Obtained from: PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Electric' /> + (
                        <Dice dice='Laser' /> or{' '}
                        <Dice dice='Modified Electric' />)
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Death Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[3]
                                    : boxList.png[3]
                            }
                            alt='Death Box'
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Death' /> + <Dice dice='Hell' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Rainbow Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[4]
                                    : boxList.png[4]
                            }
                            alt='Rainbow Box'
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Mimic' /> + <Dice dice='Joker' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Frozen Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[6]
                                    : boxList.png[6]
                            }
                            alt='Frozen Box'
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Ice' /> + <Dice dice='Blizzard' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Weapon Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[7]
                                    : boxList.png[7]
                            }
                            alt='Weapon Box'
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Holy Sword' /> or{' '}
                        <Dice dice='Shield' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Assassination Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[8]
                                    : boxList.png[8]
                            }
                            alt='Assassination Box'
                        />
                    </div>
                    <p>Obtained from: PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Assassin' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Typhoon Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[19]
                                    : boxList.png[19]
                            }
                            alt='Typhoon Box'
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Wind' /> +{' '}
                        <Dice dice='Mighty Wind' /> + <Dice dice='Typhoon' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Healing Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[20]
                                    : boxList.png[20]
                            }
                            alt='Healing Box'
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Sacrifice' /> +{' '}
                        <Dice dice='Supplement' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Mechanic Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[21]
                                    : boxList.png[21]
                            }
                            alt='Mechanic Box'
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Iron' /> + <Dice dice='Gears' /> +{' '}
                        <Dice dice='Gun' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Chemical Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[22]
                                    : boxList.png[22]
                            }
                            alt='Chemical Box'
                        />
                    </div>
                    <p>Obtained from: PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Element' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>King&apos;s Legacy</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[12]
                                    : boxList.png[12]
                            }
                            alt="King's Legacy"
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward, Shop</p>
                    <p>
                        Contains: {imgGold}, common, rare, unique, 1 legendary
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Queen&apos;s Legacy</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[23]
                                    : boxList.png[23]
                            }
                            alt="Queen's Legacy"
                        />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward, Shop</p>
                    <p>
                        Contains: <Dice dice='Summoner' /> or{' '}
                        <Dice dice='Growth' /> or <Dice dice='Metastasis' /> or{' '}
                        <Dice dice='Time' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Rare Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[13]
                                    : boxList.png[13]
                            }
                            alt='Rare Box'
                        />
                    </div>
                    <p>Obtained from: Shop</p>
                    <p>Contains: rare dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Unique Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[11]
                                    : boxList.png[11]
                            }
                            alt='Unique Box'
                        />
                    </div>
                    <p>Obtained from: Shop</p>
                    <p>Contains: unique dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Legend Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[16]
                                    : boxList.png[16]
                            }
                            alt='Legend Box'
                        />
                    </div>
                    <p>Obtained from: Shop</p>
                    <p>Contains: 1 legendary dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Gold Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[9]
                                    : boxList.png[9]
                            }
                            alt='Gold Box'
                        />
                    </div>
                    <p>Obtained from: PvP Reward, Shop</p>
                    <p>Contains: {imgGold}, normal and rare dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Platinum Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[9]
                                    : boxList.png[9]
                            }
                            alt='Platinum Box'
                        />
                    </div>
                    <p>Obtained from: PvP Reward, Shop</p>
                    <p>Contains: {imgGold}, normal , rare and unique</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Diamond Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[10]
                                    : boxList.png[10]
                            }
                            alt='Diamond Box'
                        />
                    </div>
                    <p>Obtained from: PvP Reward, Shop</p>
                    <p>
                        Contains: {imgGold}, normal , rare, unique and chance of
                        legendary dice
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Support Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[15]
                                    : boxList.png[15]
                            }
                            alt='Support Box'
                        />
                    </div>
                    <p>Obtained from: Watching Ad after losing a PvP game</p>
                    <p>Contains: {imgGold}, normal , rare, unique dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Card Box</h3>
                    <div className='box-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? boxList.webp[17]
                                    : boxList.png[17]
                            }
                            alt='Support Box'
                        />
                    </div>
                    <p>Obtained from: 40 cards from PvE</p>
                    <p>
                        Contains: {imgGold}, normal , rare, unique dice and 1%
                        chance of legendary
                    </p>
                </li>
            </ul>
        </Main>
    );
}
