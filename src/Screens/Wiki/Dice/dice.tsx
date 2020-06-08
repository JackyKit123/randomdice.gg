import React from 'react';
import { Link } from 'react-router-dom';
import Dice from '../../../Components/Dice/dice';
import Main from '../../../Components/Main/main';
import diceConfig from './dice.content.json';
import './dice.less';

export default function DiceMechanic(): JSX.Element {
    return (
        <Main title='Dice Mechanics' className='wiki dice-mechanics'>
            <p className='intro'>
                On this page you will find any Dice Mechanics (
                <span className='version'>{diceConfig.version}</span>). Dice
                Dots will only affect the Base Attack Speed of the dice; the
                in-game level up, instead, Increases the Base Attack and Special
                Attack of the dice. Some Dice tagged as Special, will have
                different dot mechanics. For every Die not tagged as Special,
                the normal description of how dots works applies. NOTICE: Dots
                are not affected by in-game power ups. Dots and Power-Ups are
                separated. Dots affects the Base Stats where as Power-Ups
                affects the Final Output. If you are unsure how it works, refer
                to Light Dice, Critical Dice and Hell Dice. For specific stat,
                refer to <Link to='/calculator/dice'>Dice Stat Calculator</Link>
                .
            </p>
            <ul>
                {diceConfig.dice.map(dice => (
                    <li key={dice.name}>
                        <div className='divisor' />
                        <h3>{dice.name}</h3>
                        <div className='dice-container'>
                            <Dice dice={dice.name || ''} />
                        </div>
                        <p>{dice.desc}</p>
                    </li>
                ))}
            </ul>
        </Main>
    );
}
