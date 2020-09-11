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
                    'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/Dice%20Images%2FEmpty.png?alt=media&token=60b222f0-33b0-4cfa-afa0-7655ecbdb8a8'
                }
            />
        </figure>
    );
}
