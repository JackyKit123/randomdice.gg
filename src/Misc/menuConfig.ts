import { FunctionComponent, lazy } from 'react';
import Homepage from '../Screens/Homepage/homepage';
import DiscordLoginCallback from '../Components/Login/login';

export type Menu = {
    name?: string;
    path?: string;
    component?: FunctionComponent;
    excludeFromMenu?: boolean;
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
                component: lazy(() =>
                    import('../Screens/Deck Guide/guideMenu')
                ),
            },
            {
                name: 'Arena Draft Tool',
                path: '/arenadraft',
                component: lazy(() => import('../Screens/Arena/arenadraft')),
            },
            {
                path: '/decks/guide/:name',
                excludeFromMenu: true,
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
                name: 'Gear DPS Calculator',
                path: '/calculator/gear',
                component: lazy(() => import('../Screens/Cal/Gear/gear')),
            },
            {
                name: 'Co-op Grind Calculator',
                path: '/calculator/coop',
                component: lazy(() => import('../Screens/Cal/Co-op/coop')),
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
                name: 'Crew Introduction',
                path: '/wiki/crew',
                component: lazy(() =>
                    import('../Screens/Wiki/Game Intro/crew')
                ),
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
            {
                path: '/about/privacy',
                excludeFromMenu: true,
                component: lazy(() => import('../Screens/Legal/privacyPolicy')),
            },
            {
                name: 'Support Us',
                path: '/about/patreon',
                component: lazy(() =>
                    import('../Screens/About/Patreon/patreon')
                ),
            },
            {
                path: '/about/patreon/:name',
                excludeFromMenu: true,
                component: lazy(() =>
                    import('../Screens/About/Patreon/profile')
                ),
            },
            {
                path: '/about/terms',
                excludeFromMenu: true,
                component: lazy(() => import('../Screens/Legal/terms')),
            },
        ],
    },
    {
        name: 'Dashboard',
        excludeFromMenu: true,
        childNode: [
            {
                path: '/dashboard',
                excludeFromMenu: true,
                component: lazy(() =>
                    import('../Components/Dashboard/dashboard')
                ),
            },
            {
                name: 'Updated Deck List',
                path: '/dashboard/deck',
                excludeFromMenu: true,
                component: lazy(() =>
                    import('../Screens/Dashboard/Decks/deck')
                ),
            },
            {
                name: 'Update Written Deck Guide',
                path: '/dashboard/guide',
                excludeFromMenu: true,
                component: lazy(() =>
                    import('../Screens/Dashboard/Decks Guide/guide')
                ),
            },
            {
                name: 'Update Detail Dice Mechanics',
                path: '/dashboard/dice_mechanics',
                excludeFromMenu: true,
                component: lazy(() =>
                    import('../Screens/Dashboard/Wiki/Dice Mechanics/dice')
                ),
            },
            {
                name: 'Update Game Introduction',
                path: '/dashboard/intro',
                excludeFromMenu: true,
                component: lazy(() =>
                    import('../Screens/Dashboard/Wiki/Intro/intro')
                ),
            },
        ],
    },
    {
        path: '/discord_login',
        excludeFromMenu: true,
        component: DiscordLoginCallback,
    },
    {
        path: '/patreon_login',
        excludeFromMenu: true,
        component: DiscordLoginCallback,
    },
];
