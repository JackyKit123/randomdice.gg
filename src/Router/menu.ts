import { FunctionComponent, lazy } from 'react';
import Homepage from 'Screens/Homepage';
import DiscordLoginCallback from 'Components/Login';

export type Menu = {
    name?: string;
    path?: string;
    icon?: string;
    component?: FunctionComponent;
    excludeFromMenu?: true;
    childNode?: Menu[];
    privateRoute?: true;
};

export const menu: Menu[] = [
    {
        name: 'Home',
        path: '/',
        icon: 'Joker',
        component: Homepage,
    },
    {
        name: 'Resources',
        childNode: [
            {
                name: 'PvP Deck List',
                path: '/decks/pvp',
                icon: 'Critical',
                component: lazy(() => import('Screens/Decks')),
            },
            {
                name: 'Co-op Deck List',
                path: '/decks/co-op',
                icon: 'YinYang',
                component: lazy(() => import('Screens/Decks')),
            },
            {
                name: 'Crew Deck List',
                path: '/decks/crew',
                icon: 'Lunar',
                component: lazy(() => import('Screens/Decks')),
            },
            {
                name: 'Crit% Data Per Class',
                path: '/critData',
                icon: 'Scope',
                component: lazy(() => import('Screens/Crit Info')),
            },
            {
                name: 'Meta Decks Guide',
                path: '/decks/guide',
                icon: 'Metastasis',
                component: lazy(() => import('Screens/Deck Guide/guideMenu')),
            },
            {
                name: 'Arena Draft Tool',
                path: '/arenadraft',
                icon: 'Holy Sword',
                component: lazy(() => import('Screens/Arena')),
            },
            {
                name: 'YouTube Channels',
                path: '/youtube',
                icon: 'Fire',
                component: lazy(() => import('Screens/YoutubeListing')),
            },
            {
                name: 'Discord Bot',
                path: '/discord_bot',
                icon: 'Ice',
                component: lazy(() => import('Screens/Discord Bot')),
            },
            {
                path: '/decks/guide/:name',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Deck Guide')),
            },
        ],
    },
    {
        name: 'Calculator',
        childNode: [
            {
                name: 'Mob Speed Calculator',
                path: '/calculator/speed',
                icon: 'Flow',
                component: lazy(() => import('Screens/Cal/Speed')),
            },
            {
                name: 'Combo Damage Calculator',
                path: '/calculator/combo',
                icon: 'Combo',
                component: lazy(() => import('Screens/Cal/Combo')),
            },
            {
                name: 'Energy Damage Calculator',
                path: '/calculator/energy',
                icon: 'Light',
                component: lazy(() => import('Screens/Cal/Energy')),
            },
            {
                name: 'Solar Damage Calculator',
                path: '/calculator/solar',
                icon: 'Solar',
                component: lazy(() => import('Screens/Cal/Solar')),
            },
            {
                name: 'Gear DPS Calculator',
                path: '/calculator/gear',
                icon: 'Gear',
                component: lazy(() => import('Screens/Cal/Gear')),
            },
            {
                name: 'Co-op Grind Calculator',
                path: '/calculator/coop',
                icon: 'YinYang',
                component: lazy(() => import('Screens/Cal/Co-op')),
            },
            {
                name: 'General DPS Calculator',
                path: '/calculator/dps',
                icon: 'Typhoon',
                component: lazy(() => import('Screens/Cal/DPS')),
            },
            {
                name: 'Dice Stat Calculator',
                path: '/calculator/stat',
                icon: 'Modified Electric',
                component: lazy(() => import('Screens/Cal/Dice Stat')),
            },
        ],
    },
    {
        name: 'Wiki',
        childNode: [
            {
                name: 'PvP Introduction',
                path: '/wiki/pvp',
                icon: 'Critical',
                component: lazy(() => import('Screens/Wiki/Game Intro/pvp')),
            },
            {
                name: 'Co-op  Introduction',
                path: '/wiki/co-op',
                icon: 'YinYang',
                component: lazy(() => import('Screens/Wiki/Game Intro/coop')),
            },
            {
                name: 'Crew Introduction',
                path: '/wiki/crew',
                icon: 'Lunar',
                component: lazy(() => import('Screens/Wiki/Game Intro/crew')),
            },
            {
                name: 'Arena Introduction',
                path: '/wiki/arena',
                icon: 'Holy Sword',
                component: lazy(() => import('Screens/Wiki/Game Intro/arena')),
            },
            {
                name: 'Dice Mechanics',
                path: '/wiki/dice_mechanics',
                icon: 'Gear',
                component: lazy(() => import('Screens/Wiki/Dice')),
            },
            {
                name: 'Boss Mechanics',
                path: '/wiki/boss_mechanics',
                icon: 'ix10',
                component: lazy(() => import('Screens/Wiki/Boss')),
            },
            {
                name: 'Battlefield Info',
                path: '/wiki/battlefield',
                icon: 'Landmine',
                component: lazy(() => import('Screens/Wiki/Battlefield')),
            },
            {
                name: 'Guide and Tips',
                path: '/wiki/guide',
                icon: 'Random Growth',
                component: lazy(() =>
                    import('Screens/Wiki/Basic Guide/guideMenu')
                ),
                excludeFromMenu: true,
            },
            {
                path: '/wiki/guide/:title',
                excludeFromMenu: true,
                component: lazy(() =>
                    import('Screens/Wiki/Basic Guide/content')
                ),
            },
            {
                name: 'The Store',
                path: '/wiki/store',
                icon: 'Mimic',
                component: lazy(() => import('Screens/Wiki/Game Intro/store')),
            },
            {
                name: 'Box Guide',
                path: '/wiki/box_guide',
                icon: 'Bounty',
                component: lazy(() => import('Screens/Wiki/Box Guide')),
            },
        ],
    },
    {
        name: 'About',
        childNode: [
            {
                name: 'About Us',
                path: '/about/us',
                icon: 'Random Growth',
                component: lazy(() => import('Screens/About/About Us')),
            },
            {
                name: 'Community',
                path: '/about/community',
                icon: 'YinYang',
                component: lazy(() => import('Screens/About/Community')),
            },
            {
                name: 'Credit',
                path: '/about/credit',
                icon: 'Royal',
                component: lazy(() => import('Screens/About/Credit')),
            },
            {
                path: '/about/privacy',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Legal/privacyPolicy')),
            },
            {
                path: '/about/disclaimer',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Legal/disclaimer')),
            },
            {
                name: 'Support Us',
                path: '/about/patreon',
                icon: 'Sacrifice',
                component: lazy(() => import('Screens/About/Patreon')),
            },
            {
                path: '/about/patreon/:name',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/About/Patreon/profile')),
            },
            {
                path: '/about/terms',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Legal/terms')),
            },
        ],
    },
    {
        name: 'Dashboard',
        excludeFromMenu: true,
        childNode: [
            {
                path: '/dashboard',
                privateRoute: true,
                excludeFromMenu: true,
                component: lazy(() => import('Components/Dashboard')),
            },
            {
                name: 'Dice Information',
                privateRoute: true,
                path: '/dashboard/dice',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Dashboard/Dice')),
            },
            {
                name: 'Deck List',
                privateRoute: true,
                path: '/dashboard/deck',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Dashboard/Decks')),
            },
            {
                name: 'Decks Guide',
                privateRoute: true,
                path: '/dashboard/guide',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Dashboard/Decks Guide')),
            },
            {
                name: 'Game Introduction',
                privateRoute: true,
                path: '/dashboard/intro',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Dashboard/Wiki/Intro')),
            },
            {
                name: 'Boss Information',
                privateRoute: true,
                path: '/dashboard/boss',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Dashboard/Wiki/Boss')),
            },
            {
                name: 'Box Information',
                privateRoute: true,
                path: '/dashboard/box',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Dashboard/Wiki/Box')),
            },
            {
                name: 'Battlefield Information',
                privateRoute: true,
                path: '/dashboard/battlefield',
                excludeFromMenu: true,
                component: lazy(() =>
                    import('Screens/Dashboard/Wiki/Battlefields')
                ),
            },
            {
                name: 'Tips and Tricks',
                privateRoute: true,
                path: '/dashboard/tips',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Dashboard/Wiki/Tips')),
            },
            {
                name: 'News',
                privateRoute: true,
                path: '/dashboard/news',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Dashboard/News')),
            },
            {
                name: 'Credit',
                privateRoute: true,
                path: '/dashboard/credit',
                excludeFromMenu: true,
                component: lazy(() => import('Screens/Dashboard/Credit')),
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
