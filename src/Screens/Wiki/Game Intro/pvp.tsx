import React from 'react';
import { Link } from 'react-router-dom';
import Main from '../../../Components/Main/main';
import './pvp.less';

export default function PVP(): JSX.Element {
    return (
        <Main title='PvP Introduction' className='pvp-intro'>
            <p>Here you will find how PvP works and how to beat opponents.</p>
            <p>
                PvP is a Player vs Player based match, since they have removed
                bots from the game in v2.0, you will always be facing real
                players which you might find hard, but with these tips you
                should be able to do better than a lot of players on PvP :
            </p>
            <ul>
                <li>
                    You must know that when you kill an enemy in PvP, it will
                    appear on your opponents side, which means early offensive
                    attacks can be good sometimes. This can be done by using
                    Infect or Mighty Wind Dice.
                </li>
                <li>
                    You will get a Random Boss at the start of the match and
                    every time a boss is defeated, getting a Knight means all
                    your dices will be shuffled, so a nice strategy there would
                    be waiting for the boss to change your dices and then you
                    fix the board by merging unnecessary dice.
                </li>
                <li>
                    After every Boss Fight, the amount of SP given by killing an
                    enemy will raise by 10 up to a max of 50.
                </li>
                <li>
                    In order to build your own deck you might need to consider
                    to have 1 Ice/Blizzard, 1 or 2 damage dealers and 2-3
                    support Dice. A list of deck can be seen in{' '}
                    <Link to='/decks/pvp'>PvP Deck List</Link>.
                </li>
            </ul>
        </Main>
    );
}
