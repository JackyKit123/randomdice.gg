/* eslint-disable react/jsx-indent */
import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import Dice from '../../../Components/Dice/dice';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import AdUnit from '../../../Components/Ad Unit/ad';
import replaceAnchorWithHistory from '../../../Misc/HTMLAnchorNavigation';
import { RootState } from '../../../Misc/Redux Storage/store';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchWiki } from '../../../Misc/Firebase/fetchData';
import './dice.less';

export default function DiceMechanic(): JSX.Element {
    const history = useHistory();
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;

    useEffect(() => {
        return replaceAnchorWithHistory(history);
    });

    let jsx;

    if (dices) {
        const paragraph = dices.map(dice => (
            <li key={dice.name}>
                <div className='divisor' />
                <h3>{dice.name}</h3>
                <div className='dice-container'>
                    <Dice dice={dice.name || ''} />
                </div>
                {ReactHtmlParser(sanitize(dice.detail))}
            </li>
        ));
        paragraph.splice(
            25,
            0,
            <li key='ad'>
                <div className='divisor' />
                <AdUnit unitId='227378933' dimension='300x250' />
                <AdUnit unitId='219055766' dimension='970x90' />
            </li>
        );

        jsx = (
            <>
                <p className='intro'>
                    This page will inform you about the basic workings of all
                    dice in the game. In game level ups generally increase the
                    base attack and special attack of all dice. The amount of
                    dots a dice has is commonly referred to as pips. There for a
                    6 dot dice is called a 6 pip dice. For dice value statistic,
                    you can visit{' '}
                    <Link to='/calculator/stat'>Dice Stat Calculator</Link>.
                </p>
                <ul>{paragraph}</ul>
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    fetchWiki(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title='Dice Mechanics' className='wiki dice-mechanics'>
            {jsx}
        </Main>
    );
}
