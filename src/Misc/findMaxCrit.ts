import { DiceList } from 'types/database';

export default function findMaxCrit(dice: DiceList): number {
    if (!dice.length) {
        return 0;
    }
    const classUpCrit = dice
        .map(die => {
            switch (die.rarity) {
                case 'Common':
                    return (
                        1 + 2 + 2 + 3 + 3 + 3 + 4 + 4 + 4 + 4 + 5 + 5 + 5 + 5
                    );
                case 'Rare':
                    return 2 + 2 + 3 + 3 + 3 + 4 + 4 + 4 + 4 + 5 + 5 + 5;
                case 'Unique':
                    return 3 + 3 + 3 + 4 + 4 + 4 + 4 + 5 + 5 + 5;
                case 'Legendary':
                    return 4 + 4 + 4 + 4 + 5 + 5 + 5 + 5;
                default:
                    return 0;
            }
        })
        .reduce((accumulator, currentVal) => accumulator + currentVal);
    return 111 + classUpCrit;
}
