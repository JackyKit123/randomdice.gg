/* eslint-disable react/jsx-indent */
import React, { useEffect, useState, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import Dice from '../../../Components/Dice/dice';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import GoogleAds from '../../../Components/Ad Unit/ad';
import replaceAnchorWithHistory from '../../../Misc/HTMLAnchorNavigation';
import { RootState } from '../../../Misc/Redux Storage/store';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchWiki } from '../../../Misc/Firebase/fetchData';
import './dice.less';

export default function DiceMechanic(): JSX.Element {
    const history = useHistory();
    const dispatch = useDispatch();
    const { hash } = useLocation();
    const selection = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { error, dices } = selection;
    const [mechanics, setMechanics] = useState<
        (
            | {
                  id: number;
                  name: string;
                  detail: string;
              }
            | 'ad'
        )[]
    >();

    useEffect(() => {
        return replaceAnchorWithHistory(history);
    }, []);

    useEffect(() => {
        const target = document.getElementById(
            decodeURI(hash).replace(/^#/, '')
        );
        if (target) {
            target.scrollIntoView();
            setTimeout(
                () =>
                    window.scroll({
                        top: window.scrollY - 90,
                    }),
                0
            );
        }
    }, [mechanics, hash]);

    useEffect(() => {
        if (dices && !mechanics?.includes('ad')) {
            const tmp = dices.map(dice => ({
                id: dice.id,
                name: dice.name,
                detail: dice.detail,
            })) as (
                | {
                      id: number;
                      name: string;
                      detail: string;
                  }
                | 'ad'
            )[];
            tmp.splice(Math.min(Math.floor(dices.length / 2), 10), 0, 'ad');
            setMechanics(tmp);
        }
    }, [dices]);

    let jsx;

    if (dices && mechanics) {
        jsx = (
            <>
                <p className='intro'>
                    This page will inform you about the basic workings of all
                    dice in the game. In game level ups generally increase the
                    base attack and special attack of all dice. The amount of
                    dots a dice has is commonly referred to as pips. Therefore a
                    6 dot dice is called a 6 pip dice. For dice value statistic,
                    you can visit{' '}
                    <Link to='/calculator/stat'>Dice Stat Calculator</Link>.
                </p>
                <section>
                    {mechanics.map(dice =>
                        dice === 'ad' ? (
                            <Fragment key='ad'>
                                <hr className='divisor' />
                                <GoogleAds unitId='1144871846' />
                            </Fragment>
                        ) : (
                            <Fragment key={dice.id}>
                                <hr className='divisor' />
                                <div className='row' id={dice.name}>
                                    <h3>{dice.name}</h3>
                                    <figure>
                                        <Dice dice={dice.id} />
                                    </figure>
                                    {ReactHtmlParser(sanitize(dice.detail))}
                                </div>
                            </Fragment>
                        )
                    )}
                </section>
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
            <Helmet>
                <title>Random Dice Wiki</title>
                <meta property='og:title' content='Random Dice Wiki' />
                <meta
                    name='og:description'
                    content='A wiki with Random Dice game information. Basic introductions, tips and tricks and more!'
                />
                <meta
                    name='description'
                    content='A wiki with Random Dice game information. Basic introductions, tips and tricks and more!'
                />
            </Helmet>
            {jsx}
        </Main>
    );
}
