import React from 'react';
import Main from '../../../Components/Main/main';

export default function PVE(): JSX.Element {
    return (
        <Main title='PvE Introduction'>
            <p>
                In PvE ( Also called Alliance and Co-op mode ). You will be
                playing together with another player facing wave after wave of
                enemies in order to gain cards to open the card box. PvE unlike
                PvP has a preset boss rotation ( Summoner, Silencer, Knight,
                Magician and Leon). Unlike PvP each wave has a limited amount of
                enemies making SP management a crucial factor in this game mode.
                To compensate this, whenever an enemy dies the same amount of SP
                is gained by both players in the match. Furthermore you will
                face a boss on waves 10, 20, 30, 40 and 50, after which boss
                will spawn every 2 waves. ( Note that there will be increasingly
                more speedy enemies and less normal ones as you get to higher
                waves ).
            </p>
            <p>
                When you first play PvE you will notice a difference on the path
                the enemies take, unlike PvP ( That has a single path going
                around your track ). PvE has a T shaped path in which the
                enemies spawn at the same time on both sides, where you will be
                able to attack your side only until the enemies reaches the
                common corner. Note that the path is shorter than in PvP!
            </p>
            <p>
                After wave 50, bosses will spawn every 2 waves and you will get
                3 cards per wave.
            </p>
        </Main>
    );
}
