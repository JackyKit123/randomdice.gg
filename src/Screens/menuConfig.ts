import { FunctionComponent } from 'react';
import Homepage from './Homepage/homepage';
import Deck from './Decks/decklist';
import Combo from './Caculator/Combo/combo';

export type Menu = {
    [key: string]:
        | {
              path: string;
              component: FunctionComponent | null;
              external: boolean;
          }
        | Menu;
};

export const menu = {
    Home: {
        path: '/',
        component: Homepage,
        external: false,
    },
    Decks: {
        path: '/decks',
        component: Deck,
        external: false,
    },
    Caculator: {
        'Blizzard Slow Effect Caculator': {
            path: '/caculator/blizzard',
            component: null,
            external: false,
        },
        'Combo Damage Caculator': {
            path: '/caculator/combo',
            component: Combo,
            external: false,
        },
        'Solar Light vs Crit Comparison': {
            path: '/caculator/solar',
            component: null,
            external: false,
        },
    },
    Wiki: {
        PvP: {
            path: `https://random-dice.fandom.com/wiki/PvP_(Player_versus_Player)`,
            component: null,
            external: true,
        },
        PvE: {
            path: `https://random-dice.fandom.com/wiki/PvE_(Player_versus_Enviroment)`,
            component: null,
            external: true,
        },
        'Dice Mechanics': {
            path: `https://random-dice.fandom.com/wiki/Dice_Mechanics`,
            component: null,
            external: true,
        },
        'Boss Mechanics': {
            path: `https://random-dice.fandom.com/wiki/Boss`,
            component: null,
            external: true,
        },
        Guide: {
            path: `https://random-dice.fandom.com/wiki/Dice_Merging_Guide`,
            component: null,
            external: true,
        },
        'Patch Notes': {
            path: `https://random-dice.fandom.com/wiki/Patch_Notes`,
            component: null,
            external: true,
        },
        'The Store': {
            path: `https://random-dice.fandom.com/wiki/Store`,
            component: null,
            external: true,
        },
        'The Arena': {
            path: `https://random-dice.fandom.com/wiki/Arena`,
            component: null,
            external: true,
        },
        'Dice Menu/List': {
            path: `https://random-dice.fandom.com/wiki/Dice_Menu`,
            component: null,
            external: true,
        },
        'Box Drop Rates': {
            path: `https://random-dice.fandom.com/wiki/Box_Drop_Rates`,
            component: null,
            external: true,
        },
    },
};
