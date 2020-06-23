import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Misc/Redux Storage/store';
import empty from './empty.png';

export default function Dice({ dice }: { dice: number | string }): JSX.Element {
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const targetDice = dices?.find(d => d.id === dice || d.name === dice);
    return (
        <img
            alt={`dice ${targetDice?.name || '?'}`}
            src={targetDice?.img || empty}
        />
    );
}
