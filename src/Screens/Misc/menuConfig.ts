import { FunctionComponent } from 'react';
import Homepage from '../Homepage/homepage';
import { pveDeck, pvpDeck } from '../Decks/decklist';
import Combo from '../Cal/Combo/combo';
import Blizzard from '../Cal/Blizzard/blizzard';
import Solar from '../Cal/Solar/solar';

export type Menu = {
    name: string;
    path?: string;
    component?: FunctionComponent;
    external?: boolean;
    childNode?: Menu[];
};

export const menu: Menu[] = [
    {
        name: 'Home',
        path: '/',
        component: Homepage,
    },
    {
        name: 'Decks',
        childNode: [
            {
                name: 'PvP Deck List',
                path: '/decks/pvp',
                component: pvpDeck,
            },
            {
                name: 'PvE Deck List',
                path: '/decks/pve',
                component: pveDeck,
            },
        ],
    },
    {
        name: 'Calculator',
        childNode: [
            {
                name: 'Blizzard Slow Effect Caculator',
                path: '/calculator/blizzard',
                component: Blizzard,
            },
            {
                name: 'Combo Damage Caculator',
                path: '/calculator/combo',
                component: Combo,
            },
            {
                name: 'Solar Light vs Crit Comparison',
                path: '/calculator/solar',
                component: Solar,
            },
        ],
    },
    {
        name: 'Wiki',
        path: `https://random-dice.fandom.com/wiki/Random_Dice_Wiki`,
        childNode: [
            {
                name: 'PvP',
                path: `https://random-dice.fandom.com/wiki/PvP_(Player_versus_Player)`,
                external: true,
            },
            {
                name: 'PvE',
                path: `https://random-dice.fandom.com/wiki/PvE_(Player_versus_Enviroment)`,
                external: true,
            },
            {
                name: 'Dice Mechanics',
                path: `https://random-dice.fandom.com/wiki/Dice_Mechanics`,
                external: true,
            },
            {
                name: 'Boss Mechanics',
                path: `https://random-dice.fandom.com/wiki/Boss`,
                external: true,
            },
            {
                name: 'Guide',
                path: `https://random-dice.fandom.com/wiki/Dice_Merging_Guide`,
                external: true,
            },
            {
                name: 'Patch Notes',
                path: `https://random-dice.fandom.com/wiki/Patch_Notes`,
                external: true,
            },
            {
                name: 'The Store',
                path: `https://random-dice.fandom.com/wiki/Store`,
                external: true,
            },
            {
                name: 'The Arena',
                path: `https://random-dice.fandom.com/wiki/Arena`,
                external: true,
            },
            {
                name: 'Dice Menu/List',
                path: `https://random-dice.fandom.com/wiki/Dice_Menu`,
                external: true,
            },
            {
                name: 'Box Drop Rates',
                path: `https://random-dice.fandom.com/wiki/Box_Drop_Rates`,
                external: true,
            },
        ],
    },
];
