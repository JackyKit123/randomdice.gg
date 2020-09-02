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
        <img
            alt={`dice ${targetDice?.name || '?'}`}
            data-dice-rarity={targetDice?.rarity || '?'}
            src={
                targetDice?.img ||
                'https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/Dice%20Images%2FEmpty.png?alt=media&token=193f9435-4c38-4ef0-95cd-317d9fbe6efe'
            }
        />
    );
}
