/* eslint-disable react/jsx-indent */
import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import Dice from 'Components/Dice';
import GoogleAds from 'Components/AdUnit';
import useReplaceAnchorWithHistory from 'Misc/useReplaceAnchorWithHistory';
import { RootState } from 'Redux/store';

import { fetchWiki } from 'Firebase';
import PageWrapper from 'Components/PageWrapper';

export default function DiceMechanic(): JSX.Element {
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

    const wrapperRef = useRef<HTMLDivElement>(null);
    useReplaceAnchorWithHistory(wrapperRef, [dices]);

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
        if (dices?.length && !mechanics?.includes('ad')) {
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

    return (
        <PageWrapper
            isContentReady={!!(dices?.length && mechanics)}
            error={error}
            retryFn={fetchWiki}
            title='Dice Mechanics'
            className='wiki dice-mechanics'
            description='A wiki with Random Dice game information. Basic introductions, tips and tricks and more!'
        >
            <p className='intro'>
                This page will inform you about the basic workings of all dice
                in the game. In game level ups generally increase the base
                attack and special attack of all dice. The amount of dots a dice
                has is commonly referred to as pips. Therefore a 6 dot dice is
                called a 6 pip dice. For dice value statistic, you can visit{' '}
                <Link to='/calculator/stat'>Dice Stat Calculator</Link>.
            </p>
            <section ref={wrapperRef}>
                {mechanics?.map(dice =>
                    dice === 'ad' ? (
                        <Fragment key='ad'>
                            <GoogleAds unitId='8891384324' />
                        </Fragment>
                    ) : (
                        <Fragment key={dice.id}>
                            <hr className='divisor' />
                            <div className='row' id={dice.name}>
                                <h3>{dice.name}</h3>

                                <Dice dice={dice.id} />

                                {ReactHtmlParser(sanitize(dice.detail))}
                            </div>
                        </Fragment>
                    )
                )}
            </section>
        </PageWrapper>
    );
}
