import { FunctionComponent } from 'react';
import Homepage from '../Homepage/homepage';
import { pveDeck, pvpDeck } from '../Decks/decklist';
import Combo from '../Cal/Combo/combo';
import Blizzard from '../Cal/Blizzard/blizzard';
import Solar from '../Cal/Solar/solar';
import Gears from '../Cal/Gears/gears';
import Gold from '../Cal/Gold/gold';
import critData from '../Crit Info/crit';
import DiceStat from '../Cal/Dice Stat/dice';
import AboutUs from '../About/About Us/about';
import Credit from '../About/Credit/credit';

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
        name: 'Resources',
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
            {
                name: 'Crit% Data Per Class',
                path: '/critData',
                component: critData,
            },
        ],
    },
    {
        name: 'Calculator',
        childNode: [
            {
                name: 'Blizzard Slow Effect Calculator',
                path: '/calculator/blizzard',
                component: Blizzard,
            },
            {
                name: 'Combo Damage Calculator',
                path: '/calculator/combo',
                component: Combo,
            },
            {
                name: 'Solar Light vs Crit Comparison',
                path: '/calculator/solar',
                component: Solar,
            },
            {
                name: 'Gears DPS Calculator',
                path: '/calculator/gears',
                component: Gears,
            },
            {
                name: 'Gold Grind Calculator',
                path: '/calculator/gold',
                component: Gold,
            },
            {
                name: 'Dice Stat Calculator',
                path: '/calculator/dice',
                component: DiceStat,
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
    {
        name: 'About',
        childNode: [
            {
                name: 'About Us',
                path: '/about/us',
                component: AboutUs,
            },
            {
                name: 'Credit',
                path: '/about/credit',
                component: Credit,
            },
        ],
    },
];
