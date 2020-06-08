import React from 'react';
import { useSelector } from 'react-redux';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import { RootState } from '../../Misc/Redux Storage/store';
import webp from './webp';
import png from './png';

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
                    src={
                        isWebpSupported()
                            ? webp[targetDice.name]
                            : png[targetDice.name]
                    }
                />
            );
        }
        return (
            <img alt='dice ?' src={isWebpSupported() ? webp['?'] : png['?']} />
        );
    }
    if (dices.find(d => d.name === dice)) {
        return (
            <img
                alt={`dice ${dice}`}
                key={dice}
                src={isWebpSupported() ? webp[dice] : png[dice]}
            />
        );
    }
    return <img alt='dice ?' src={isWebpSupported() ? webp['?'] : png['?']} />;
}
