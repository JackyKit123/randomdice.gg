import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import Dice from '../../../Components/Dice/dice';
import { RootState } from '../../../Components/Redux Storage/store';
import { clearError, fetchDices } from '../../Misc/fetchData';
import '../cal.less';
import './dice.less';

export default function DiceStat(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [filter, setFilter] = useState({
        activeDice: 'Fire',
        class: 1,
        level: 1,
    });
    let jsx;
    const dice = dices?.find(d => d.name === filter.activeDice);

    if (dice) {
        let minClass: number;
        switch (dice?.rarity) {
            case 'Legendary':
                minClass = 7;
                break;
            case 'Unique':
                minClass = 5;
                break;
            case 'Rare':
                minClass = 3;
                break;
            default:
                minClass = 1;
        }
        if (filter.class < minClass) {
            filter.class = minClass;
            setFilter({ ...filter });
        }
        const atk =
            Math.floor(
                (dice.atk +
                    dice.cupAtk * (filter.class - minClass) +
                    dice.pupAtk * (filter.level - 1)) *
                    100
            ) / 100;
        const spd =
            Math.floor(
                (dice.spd +
                    dice.cupSpd * (filter.class - minClass) +
                    dice.pupSpd * (filter.level - 1)) *
                    100
            ) / 100;
        const eff1 =
            Math.floor(
                (dice.eff1 +
                    dice.cupEff1 * (filter.class - minClass) +
                    dice.pupEff1 * (filter.level - 1)) *
                    100
            ) / 100;
        const eff2 =
            Math.floor(
                (dice.eff2 +
                    dice.cupEff2 * (filter.class - minClass) +
                    dice.pupEff2 * (filter.level - 1)) *
                    100
            ) / 100;
        jsx = (
            <div className='container'>
                <div className='upper'>
                    <div className='img-container'>
                        <Dice dice={dice.name} />
                    </div>
                    <label htmlFor='class'>
                        Class :{' '}
                        <select
                            onChange={(evt): void => {
                                filter.class = Number(evt.target.value);
                                setFilter({ ...filter });
                            }}
                        >
                            {Array(15 - minClass + 1)
                                .fill('')
                                .map((_, i) => (
                                    <option key={`class-val-${i + minClass}`}>
                                        {i + minClass}
                                    </option>
                                ))}
                        </select>
                    </label>
                    <div className='dice-name'>
                        <span className={dice.rarity}>{dice.rarity}</span>
                        <select
                            onChange={(evt): void => {
                                const diceName = evt.target.value.replace(
                                    ' Dice',
                                    ''
                                );
                                filter.activeDice = diceName;
                                setFilter({ ...filter });
                            }}
                        >
                            {dices?.map(d => (
                                <option key={d.name}>{d.name} Dice</option>
                            ))}
                        </select>
                    </div>
                    <label htmlFor='level'>
                        Level :{' '}
                        <select
                            onChange={(evt): void => {
                                filter.level = Number(evt.target.value);
                                setFilter({ ...filter });
                            }}
                        >
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </label>
                    <div className='desc'>{dice.desc}</div>
                </div>
                <div className='lower'>
                    <div className='type'>
                        <span className='label'>Type</span>
                        <span className='value'>{dice.type}</span>
                    </div>
                    <div className='atk'>
                        <span className='label'>Atk</span>
                        <span className='value'>{atk || '-'}</span>
                    </div>
                    <div className='spd'>
                        <span className='label'>Attack Speed</span>
                        <span className='value'>
                            {spd || '-'}
                            {spd ? 's' : ''}
                        </span>
                    </div>
                    <div className='target'>
                        <span className='label'>Target</span>
                        <span className='value'>{dice.target || '-'}</span>
                    </div>
                    <div className='eff1'>
                        <span className='label'>{dice.nameEff1 || '.'}</span>
                        <span className='value'>
                            {eff1 || '-'}
                            {dice.unitEff1}
                        </span>
                    </div>
                    <div className='eff2'>
                        <span className='label'>{dice.nameEff2 || '.'}</span>
                        <span className='value'>
                            {eff2 || '-'}
                            {dice.unitEff2}
                        </span>
                    </div>
                </div>
            </div>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    clearError(dispatch);
                    fetchDices(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main
            title='Dice Stat Caculator'
            className='dice-stat-cal cal'
            content={jsx}
        />
    );
}
