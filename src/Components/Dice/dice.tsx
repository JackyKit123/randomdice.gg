import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux Storage/store';
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
        targetDice = dices.find(d => d.id === dice.toString());
        if (targetDice) {
            return (
                <img
                    alt={targetDice.name}
                    key={targetDice.name}
                    src={Image[targetDice.name]}
                />
            );
        }
        return null;
    }
    return <img alt={dice} key={dice} src={Image[dice]} />;
}
