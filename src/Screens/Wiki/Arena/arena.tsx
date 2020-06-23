import React from 'react';
import Main from '../../../Components/Main/main';
import ArenaBox0Png from './Image/arena_box_0.png';
import ArenaBox1Png from './Image/arena_box_1.png';
import ArenaBox2Png from './Image/arena_box_2.png';
import ArenaBox3Png from './Image/arena_box_3.png';
import './arena.less';

export default function Arena(): JSX.Element {
    return (
        <Main title='Arena Guide' className='wiki arena'>
            <p>
                Here you will find all you need to know about the Arena and the
                mechanics involved.
            </p>
            <p>
                The Arena is a form of PvP that costs 100 Gems to gain entry to,
                after entering the Arena you will be asked to choose your deck
                settings. This will let you pick a Random Dice out of 3 options
                to complete your deck, upon completing your deck settings you
                can then compete with other players whom match your number of
                wins up to 12 wins.
            </p>
            <p>The rewards from winning each match is :</p>
            <ul>
                <li>100 Gold</li>
                <li>20 Diamond</li>
                <li>
                    <img
                        className='box'
                        src={ArenaBox0Png}
                        alt='arena rookie box'
                    />{' '}
                    Arena Rookie Box: Gold, common, rare, unique dice
                </li>
                <li>500 Gold</li>
                <li>
                    <img
                        className='box'
                        src={ArenaBox1Png}
                        alt='arena challenger box'
                    />{' '}
                    Arena Challenger Box: Gold, common, rare, unique and chance
                    of legendary dice
                </li>
                <li>1000 Gold</li>
                <li>80 Diamond</li>
                <li>
                    <img
                        className='box'
                        src={ArenaBox2Png}
                        alt='arena gladiator box'
                    />{' '}
                    Arena Gladiator Box: Gold, common, rare, unique and chance
                    of legendary dice
                </li>
                <li>2000 Gold</li>
                <li>100 Diamond</li>
                <li>5000 Gold</li>
                <li>
                    <img
                        className='box'
                        src={ArenaBox3Png}
                        alt='arena conqueror box'
                    />{' '}
                    Arena Conqueror Box: Gold, common, rare, unique and
                    legendary dice
                </li>
            </ul>
        </Main>
    );
}
