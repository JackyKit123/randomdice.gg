import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Misc/Redux Storage/store';
import Image from './images';

export default function Dice({
    dice,
}: {
    dice: number | string;
}): JSX.Element | null {
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { dices } = selection;
    let targetDice;
    if (!dices) {
        return null;
    }
    if (typeof dice === 'number') {
        targetDice = dices.find(d => d.id === dice);
        if (targetDice) {
            return (
                <img
                    alt={`dice ${targetDice.name}`}
                    key={targetDice.name}
                    src={Image[targetDice.name]}
                />
            );
        }
        return <img alt='dice ?' src={Image['?']} />;
    }
    if (dices.find(d => d.name === dice)) {
        return <img alt={`dice ${dice}`} key={dice} src={Image[dice]} />;
    }
    return <img alt='dice ?' src={Image['?']} />;
}
