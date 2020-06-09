import React from 'react';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import MiniWebp from './Image/mini.webp';
import SnakeWebp from './Image/snake.webp';
import SilencerWebp from './Image/silencer.webp';
import KnightWebp from './Image/knight.webp';
import MagicianWebp from './Image/magician.webp';
import LeonWebp from './Image/leon.webp';
import MiniPng from './Image/mini.png';
import SnakePng from './Image/snake.png';
import SilencerPng from './Image/silencer.png';
import KnightPng from './Image/knight.png';
import MagicianPng from './Image/magician.png';
import LeonPng from './Image/leon.png';
import Main from '../../../Components/Main/main';
import Dice from '../../../Components/Dice/dice';
import './boss.less';

export default function BossGuide(): JSX.Element {
    return (
        <Main title='Boss Mechanics' className='boss-guide'>
            <p>On here you will find information about Game Boss.</p>
            <p>
                First thing you can notice when the boss is appearing in the
                field (PvP only), it will do an animation which lasts for a few
                seconds where Blizzard can Apply Slowness effects and
                Spike/Landmine can damage the boss before it goes to the
                starting point. Boss Health points seems to be random, but are
                still based on a Hp Range (based on wave/n° of boss).
            </p>
            <p>
                Any boss is not affected by Death/Hell and some other Dice will
                work different on them.
            </p>
            <ul className='dice'>
                <li>
                    <div className='dice-container'>
                        <Dice dice='Death' />
                    </div>
                    <span>The special ability will not affect the Boss.</span>
                </li>
                <li>
                    <div className='dice-container'>
                        <Dice dice='Hell' />
                    </div>
                    <span>The special ability will not affect the Boss.</span>
                </li>
                <li>
                    <div className='dice-container'>
                        <Dice dice='Holy Sword' />
                    </div>
                    <span>
                        His special ability will deal % of the Boss Remaining
                        Hp, the damage % is proportionate to the Dice Class and
                        Level-Up In-Game.
                    </span>
                </li>
                <li>
                    <div className='dice-container'>
                        <Dice dice='Nuclear' />
                    </div>
                    <span>
                        When merged will deal % of the boss Remaining Hp, the
                        damage % is proportionate to the Dice Class and Dots
                        amount when merging.
                    </span>
                </li>
                <li>
                    <div className='dice-container'>
                        <Dice dice='Landmine' />
                    </div>
                    <span>
                        Once in a while landmine will install a Special Landmine
                        which will deal % of the Boss Remaining Hp, the damage %
                        is proportionate to the Dice Class and Level-Up In-Game.
                    </span>
                </li>
                <li>
                    <div className='dice-container'>
                        <Dice dice='Element' />
                    </div>
                    <span>
                        When the Element Sphere hits the Boss it will % of the
                        boss Remaining Hp, number of spheres can be increased
                        with Dots, when spinning speed is increased with
                        Level-Up In-Game.
                    </span>
                </li>
                <li>
                    <div className='dice-container'>
                        <Dice dice='Gun' />
                    </div>
                    <span>
                        When Gun Dice reaches 7 Dots, it will transform into
                        Sniper Dice, which will deal high % of the boss
                        Remaining Hp, but attack speed is low. Damage % can be
                        increased through Class-Up only.
                    </span>
                </li>
            </ul>
            <p>
                The following is a list of boss you will find in game. Boss can
                cast special abilities. It will be explained below.
            </p>
            <ul className='boss-list'>
                <li>
                    <div className='divisor' />
                    <div className='boss-container'>
                        <img
                            src={isWebpSupported() ? MiniWebp : MiniPng}
                            alt='Mini Boss'
                        />
                    </div>
                    <h3>Mini Boss</h3>
                    <p>
                        Generates once in a while on PvP, on PvE will instead
                        spawn every 10 waves after the 5th wave (5-15-25-35-45),
                        that changes when Leon Boss is passed.
                    </p>
                    <p>No Abilities.</p>
                </li>
                <li>
                    <div className='divisor' />

                    <div className='boss-container'>
                        <img
                            src={isWebpSupported() ? SnakeWebp : SnakePng}
                            alt='Snake Boss'
                        />
                    </div>
                    <h3>Snake Boss</h3>
                    <p>
                        Snake Boss will trigger his ability after a couple of
                        seconds from spawning then the ability goes on cooldown.
                    </p>
                    <p>
                        Ability (Summon): Summons 2 Normal Enemies and 1 Fast
                        Enemy. cooldown: 8 Seconds.
                    </p>
                    <p>
                        Summoned enemies are based on the remaining Boss HP,
                        Normal Enemies has 10% of the boss hp (Boss HP/10) and
                        Fast Enemies has around 5% of the boss HP (Boss HP/20).
                    </p>
                </li>
                <li>
                    <div className='divisor' />

                    <div className='boss-container'>
                        <img
                            src={isWebpSupported() ? SilencerWebp : SilencerPng}
                            alt='Silencer Boss'
                        />
                    </div>
                    <h3>Silencer Boss</h3>
                    <p>
                        Silencer Boss will trigger his ability after a couple of
                        seconds from spawning then the ability goes on Cooldown.
                    </p>
                    <p>
                        Ability (Silence): Silences two random Dice on your
                        board. Cooldown: 8 Seconds.
                    </p>
                    <p>
                        If Element Dice is Silenced, he will no longer attack
                        but the spinning spheres will still spin around it and
                        damage the Silencer Boss.
                    </p>
                </li>
                <li>
                    <div className='divisor' />
                    <div className='boss-container'>
                        <img
                            src={isWebpSupported() ? KnightWebp : KnightPng}
                            alt='Knight Boss'
                        />
                    </div>
                    <h3>Knight Boss</h3>
                    <p>
                        Knight Boss will trigger his ability after a couple of
                        seconds from spawning then the ability goes on Cooldown.
                    </p>
                    <p>
                        Ability (Randomize): Switches all your Dice in the
                        board, Dots are not affected. Cooldown: 8 seconds.
                    </p>
                    <p>
                        Can be used as a Growth Boost or for Assassin/Summoner
                        Merging, good for when you have a bad board.
                    </p>
                </li>
                <li>
                    <div className='divisor' />

                    <div className='boss-container'>
                        <img
                            src={isWebpSupported() ? MagicianWebp : MagicianPng}
                            alt='Magician Boss'
                        />
                    </div>
                    <h3>Magician Boss</h3>
                    <p>
                        Magician Boss will trigger his ability after a couple of
                        seconds from spawning then the ability goes on Cooldown.
                    </p>
                    <p>
                        Notice, differently than other bosses, magician has an
                        ability cycle.
                    </p>
                    <p>
                        First Ability (Meteor): Throws a Meteor at a Random
                        Dice, can be avoided by merging or by killing the Boss.
                        Time till next ability: 5 seconds.
                    </p>
                    <p>
                        Second Ability (Cleanse): Deletes everything on the
                        track on from himself, gains a temporary shield that
                        prevents special effects on him such as Slow/Poison also
                        Resets the Lock/Teleport block so they can trigger the
                        effect again. (Can completely obliterate the entire
                        board if you are using teleport). Time till next
                        ability: 5 seconds.
                    </p>
                    <p>
                        Third Ability (Self Heal): Heals himself. Time till next
                        ability: 5 seconds.
                    </p>
                </li>
                <li>
                    <div className='divisor' />

                    <div className='boss-container'>
                        <img
                            src={isWebpSupported() ? LeonWebp : LeonPng}
                            alt='Leon Boss'
                        />
                    </div>
                    <h3>Leon Boss</h3>
                    <p>
                        Leon Boss will trigger his ability after a couple of
                        seconds from spawning then the ability goes on Cooldown.
                    </p>
                    <p>
                        Leon, differently than other bosses, will trigger the
                        first ability only once.
                    </p>
                    <p>
                        First Ability (Howl): Downgrades Half of your Dice on
                        the board by 1, Dice that has 1 Dot only, will be
                        destroyed. Time till next ability: 5 seconds.
                    </p>
                    <p>
                        Second Ability (Dash): Dashes forward in the track,
                        Ignores any slowing effects, can be blocked by Barrier
                        Block (Shield). Cooldown: 5 Seconds.
                    </p>
                </li>
            </ul>
        </Main>
    );
}
