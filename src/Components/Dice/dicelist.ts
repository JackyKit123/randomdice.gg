import { Dices } from '../Redux Storage/Fetch Dices/types';

interface DiceList {
    common: string[];
    rare: string[];
    unique: string[];
    legendary: string[];
}
export default function(dices?: Dices): DiceList {
    const dicelist: DiceList = {
        common: [],
        rare: [],
        unique: [],
        legendary: [],
    };
    if (dices) {
        dices.forEach(dice => {
            switch (dice.rarity) {
                case 'Common':
                    dicelist.common.push(dice.name);
                    break;
                case 'Rare':
                    dicelist.rare.push(dice.name);
                    break;
                case 'Unique':
                    dicelist.unique.push(dice.name);
                    break;
                case 'Legendary':
                    dicelist.legendary.push(dice.name);
                    break;
                default:
                    break;
            }
        });
    }
    return dicelist;
}

// export default {
//     common: [
//         'Broken',
//         'Electric',
//         'Fire',
//         'Gamble',
//         'Ice',
//         'Iron',
//         'Lock',
//         'Poison',
//         'Wind',
//     ],
//     rare: [
//         'Crack',
//         'Critical',
//         'Crossbow',
//         'Energy',
//         'Light',
//         'Mine',
//         'Sacrificial',
//         'Thorn',
//     ],
//     unique: [
//         'Absorb',
//         'Death',
//         'Gears',
//         'Infect',
//         'Laser',
//         'Mighty Wind',
//         'Mimic',
//         'Modified Electric',
//         'Switch',
//         'Teleport',
//         'Wave',
//     ],
//     legendary: [
//         'Assassin',
//         'Blizzard',
//         'Combo',
//         'Element',
//         'Growth',
//         'Gun',
//         'Hell',
//         'Holy Sword',
//         'Joker',
//         'Landmine',
//         'Metastasis',
//         'Nuclear',
//         'Sand Swamp',
//         'Shield',
//         'Solar',
//         'Summoner',
//         'Supplement',
//         'Time',
//         'Typhoon',
//     ],
// };
