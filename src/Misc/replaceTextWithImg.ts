import { Dices } from './Redux Storage/Fetch Firebase/Dices/types';

export default function replaceTextWithImgTag(
    dices: Dices,
    text: string
): string {
    return text
        .replace(/{Dice:\w*( \w*)*}/g, match => {
            const diceName = match.replace('{Dice:', '').replace('}', '');
            const imgUrl = dices.find(dice => dice.name === diceName)?.img;
            const nullDiceUrl =
                'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/Dice%20Images%2FEmpty.png?alt=media&token=193f9435-4c38-4ef0-95cd-317d9fbe6efe';
            return `<img src="${imgUrl || nullDiceUrl}" alt="${
                imgUrl ? `dice ${diceName}` : 'dice ?'
            }" />`;
        })
        .replace(
            /({Gold}|{Diamond}|{Common Dice}|{Rare Dice}|{Unique Dice}|{Legendary Dice})/g,
            match => {
                let src: string;
                const alt = match.replace(/{|}/g, '');
                switch (match) {
                    case '{Gold}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FGold.png?alt=media&token=bbde2bc8-21e8-4b51-9e72-c2bd4914d371';
                        break;
                    case '{Diamond}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FDiamond.png?alt=media&token=d151bac0-7979-4f73-a140-ad4b8aa63600';
                        break;
                    case '{Common Dice}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FCommon%20Dice.png?alt=media&token=a02c6e1e-f084-40b7-b147-dd0e1855d9af';
                        break;
                    case '{Rare Dice}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FRare%20Dice.png?alt=media&token=42a77dc1-ccfe-41de-ba36-9ff775269b0a';
                        break;
                    case '{Unique Dice}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FUnique%20Dice.png?alt=media&token=b00aaf25-dafe-4020-b88e-b61fe998670c';
                        break;
                    case '{Legendary Dice}':
                        src =
                            'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FLegendary%20Dice.png?alt=media&token=2271d03d-5fab-40c0-a9f4-19803688d9e9';
                        break;
                    default:
                        src = '';
                }
                return `<img src="${src}" alt="${alt}" />`;
            }
        );
}
