import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Misc/Redux Storage/store';
import './dice.less';

export default function Dice({ dice }: { dice: number | string }): JSX.Element {
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const targetDice = dices?.find(d => d.id === dice || d.name === dice);

    return (
        <figure className='dice'>
            <img
                alt={`dice ${targetDice?.name || '?'}`}
                data-dice-rarity={targetDice?.rarity || '?'}
                src={
                    targetDice?.img ||
                    'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/Dice%20Images%2FEmpty?alt=media&token=ccd57102-a890-44ba-b6f0-29e91c765f58'
                }
            />
        </figure>
    );
}
