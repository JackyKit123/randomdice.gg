import { FunctionComponent, lazy } from 'react';
import Homepage from '../Screens/Homepage/homepage';

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
                component: lazy(() => import('../Screens/Decks/pvpDeck')),
            },
            {
                name: 'PvE Deck List',
                path: '/decks/pve',
                component: lazy(() => import('../Screens/Decks/pveDeck')),
            },
            {
                name: 'Crit% Data Per Class',
                path: '/critData',
                component: lazy(() => import('../Screens/Crit Info/crit')),
            },
            {
                name: 'Meta Decks Guide',
                path: '/decks/guide',
                component: lazy(() => import('../Screens/Deck Guide/guide')),
            },
        ],
    },
    {
        name: 'Calculator',
        childNode: [
            {
                name: 'Blizzard Slow Effect Calculator',
                path: '/calculator/blizzard',
                component: lazy(() =>
                    import('../Screens/Cal/Blizzard/blizzard')
                ),
            },
            {
                name: 'Combo Damage Calculator',
                path: '/calculator/combo',
                component: lazy(() => import('../Screens/Cal/Combo/combo')),
            },
            {
                name: 'Solar Damage Calculator',
                path: '/calculator/solar',
                component: lazy(() => import('../Screens/Cal/Solar/solar')),
            },
            {
                name: 'Gears DPS Calculator',
                path: '/calculator/gears',
                component: lazy(() => import('../Screens/Cal/Gears/gears')),
            },
            {
                name: 'Gold Grind Calculator',
                path: '/calculator/gold',
                component: lazy(() => import('../Screens/Cal/Gold/gold')),
            },
            {
                name: 'General DPS Calculator',
                path: '/calculator/dps',
                component: lazy(() => import('../Screens/Cal/DPS/dps')),
            },
            {
                name: 'Dice Stat Calculator',
                path: '/calculator/stat',
                component: lazy(() => import('../Screens/Cal/Dice Stat/dice')),
            },
        ],
    },
    {
        name: 'Wiki',
        childNode: [
            {
                name: 'PvP Introduction',
                path: '/wiki/pvp',
                component: lazy(() => import('../Screens/Wiki/Game Intro/pvp')),
            },
            {
                name: 'PvE  Introduction',
                path: '/wiki/pve',
                component: lazy(() => import('../Screens/Wiki/Game Intro/pve')),
            },
            {
                name: 'Dice Mechanics',
                path: '/wiki/dice_mechanics',
                component: lazy(() => import('../Screens/Wiki/Dice/dice')),
            },
            {
                name: 'Boss Mechanics',
                path: '/wiki/boss_mechanics',
                component: lazy(() => import('../Screens/Wiki/Boss/boss')),
            },
            {
                name: 'Guide and Tips',
                path: '/wiki/guide',
                component: lazy(() =>
                    import('../Screens/Wiki/Basic Guide/guide')
                ),
            },
            {
                name: 'Patch Note',
                path: '/wiki/patch_note',
                component: lazy(() =>
                    import('../Screens/Wiki/Patch Note/table')
                ),
            },
            {
                name: 'The Store',
                path: '/wiki/store',
                component: lazy(() => import('../Screens/Wiki/Store/store')),
            },
            {
                name: 'The Arena',
                path: '/wiki/arena',
                component: lazy(() => import('../Screens/Wiki/Arena/arena')),
            },
            {
                name: 'Box Guide',
                path: '/wiki/box_guide',
                component: lazy(() => import('../Screens/Wiki/Box Guide/box')),
            },
        ],
    },
    {
        name: 'About',
        childNode: [
            {
                name: 'About Us',
                path: '/about/us',
                component: lazy(() =>
                    import('../Screens/About/About Us/about')
                ),
            },
            {
                name: 'Credit',
                path: '/about/credit',
                component: lazy(() => import('../Screens/About/Credit/credit')),
            },
        ],
    },
];
