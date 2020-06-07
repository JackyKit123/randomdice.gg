import { FunctionComponent, lazy } from 'react';
import Homepage from '../Homepage/homepage';

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
                component: lazy(() => import('../Decks/pvpDeck')),
            },
            {
                name: 'PvE Deck List',
                path: '/decks/pve',
                component: lazy(() => import('../Decks/pveDeck')),
            },
            {
                name: 'Crit% Data Per Class',
                path: '/critData',
                component: lazy(() => import('../Crit Info/crit')),
            },
        ],
    },
    {
        name: 'Calculator',
        childNode: [
            {
                name: 'Blizzard Slow Effect Calculator',
                path: '/calculator/blizzard',
                component: lazy(() => import('../Cal/Blizzard/blizzard')),
            },
            {
                name: 'Combo Damage Calculator',
                path: '/calculator/combo',
                component: lazy(() => import('../Cal/Combo/combo')),
            },
            {
                name: 'Solar Light vs Crit Comparison',
                path: '/calculator/solar',
                component: lazy(() => import('../Cal/Solar/solar')),
            },
            {
                name: 'Gears DPS Calculator',
                path: '/calculator/gears',
                component: lazy(() => import('../Cal/Gears/gears')),
            },
            {
                name: 'Gold Grind Calculator',
                path: '/calculator/gold',
                component: lazy(() => import('../Cal/Gold/gold')),
            },
            {
                name: 'Dice Stat Calculator',
                path: '/calculator/dice',
                component: lazy(() => import('../Cal/Dice Stat/dice')),
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
                component: lazy(() => import('../About/About Us/about')),
            },
            {
                name: 'Credit',
                path: '/about/credit',
                component: lazy(() => import('../About/Credit/credit')),
            },
        ],
    },
];
