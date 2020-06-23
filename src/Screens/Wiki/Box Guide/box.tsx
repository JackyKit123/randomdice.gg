import React, { useState, useEffect } from 'react';
import Main from '../../../Components/Main/main';
import AdUnit from '../../../Components/Ad Unit/ad';
import GoldPng from '../../Cal/Co-op/Image/gold.png';
import Dice from '../../../Components/Dice/dice';
import DefaultBoxPng from './Image/default.png';
import './box.less';

export default function BoxGuide(): JSX.Element {
    const [boxList, setBoxList] = useState(Array(24).fill(DefaultBoxPng));

    useEffect(() => {
        Promise.all(
            Array(24)
                .fill('')
                .map((_, i) => import(`./Image/${i}.png`))
        ).then(val => {
            setBoxList(val.map(v => v.default));
        });
    }, []);

    const imgGold = <img src={GoldPng} alt='gold' className='gold' />;

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
                        <img src={boxList[0]} alt='Common Box' />
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
                        <img src={boxList[1]} alt='Burning Box' />
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
                        <img src={boxList[2]} alt='Electric Box' />
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
                        <img src={boxList[3]} alt='Death Box' />
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
                        <img src={boxList[4]} alt='Rainbow Box' />
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
                        <img src={boxList[6]} alt='Frozen Box' />
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
                        <img src={boxList[7]} alt='Weapon Box' />
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
                        <img src={boxList[8]} alt='Assassination Box' />
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
                        <img src={boxList[19]} alt='Typhoon Box' />
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
                        <img src={boxList[20]} alt='Healing Box' />
                    </div>
                    <p>Obtained from: Sales Bundle, PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Sacrificial' /> +{' '}
                        <Dice dice='Supplement' />
                    </p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Mechanic Box</h3>
                    <div className='box-container'>
                        <img src={boxList[21]} alt='Mechanic Box' />
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
                        <img src={boxList[22]} alt='Chemical Box' />
                    </div>
                    <p>Obtained from: PvP Reward</p>
                    <p>
                        Contains: <Dice dice='Element' />
                    </p>
                </li>
                <div className='divisor' />
                <AdUnit unitId='227378933' dimension='300x250' />
                <AdUnit unitId='219055766' dimension='970x90' />
                <div className='divisor' />
                <li>
                    <h3>King&apos;s Legacy</h3>
                    <div className='box-container'>
                        <img src={boxList[12]} alt="King's Legacy" />
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
                        <img src={boxList[23]} alt="Queen's Legacy" />
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
                        <img src={boxList[13]} alt='Rare Box' />
                    </div>
                    <p>Obtained from: Shop</p>
                    <p>Contains: rare dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Unique Box</h3>
                    <div className='box-container'>
                        <img src={boxList[11]} alt='Unique Box' />
                    </div>
                    <p>Obtained from: Shop</p>
                    <p>Contains: unique dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Legend Box</h3>
                    <div className='box-container'>
                        <img src={boxList[16]} alt='Legend Box' />
                    </div>
                    <p>Obtained from: Shop, PvP Reward</p>
                    <p>Contains: 1 legendary dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Gold Box</h3>
                    <div className='box-container'>
                        <img src={boxList[9]} alt='Gold Box' />
                    </div>
                    <p>Obtained from: PvP Reward, Shop</p>
                    <p>Contains: {imgGold}, normal and rare dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Platinum Box</h3>
                    <div className='box-container'>
                        <img src={boxList[14]} alt='Platinum Box' />
                    </div>
                    <p>Obtained from: PvP Reward, Shop</p>
                    <p>Contains: {imgGold}, normal , rare and unique</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Diamond Box</h3>
                    <div className='box-container'>
                        <img src={boxList[10]} alt='Diamond Box' />
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
                        <img src={boxList[15]} alt='Support Box' />
                    </div>
                    <p>Obtained from: Watching Ad after losing a PvP game</p>
                    <p>Contains: {imgGold}, normal , rare, unique dice</p>
                </li>
                <div className='divisor' />
                <li>
                    <h3>Card Box</h3>
                    <div className='box-container'>
                        <img src={boxList[17]} alt='Support Box' />
                    </div>
                    <p>Obtained from: 40 cards from PvE</p>
                    <p>
                        Contains:{imgGold}, 3 Diamond, normal , rare, unique
                        dice and 1% chance of legendary
                    </p>
                </li>
            </ul>
        </Main>
    );
}
