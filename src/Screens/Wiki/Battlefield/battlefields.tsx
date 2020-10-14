import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import { useLocation } from 'react-router-dom';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import GoogleAds from '../../../Components/Ad Unit/ad';
import { RootState } from '../../../Misc/Redux Storage/store';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchWiki } from '../../../Misc/Firebase/fetchData';
import './battlefields.less';
import { WikiContent } from '../../../Misc/Redux Storage/Fetch Firebase/Wiki/types';

export default function BattlefieldGuide(): JSX.Element {
    const dispatch = useDispatch();
    const { hash } = useLocation();
    const [battlefieldInfo, setBattlefieldInfo] = useState<
        WikiContent['battlefield']
    >();
    const { wiki, error } = useSelector(
        (state: RootState) => state.fetchWikiReducer
    );
    const [battleFieldLevel, setBattlefieldLevel] = useState(1);
    const containerRef = useRef(null as null | HTMLElement);

    useEffect(() => {
        if (
            wiki &&
            !wiki.battlefield.find(battlefield => battlefield.img === 'ad')
        ) {
            wiki.battlefield.splice(
                Math.min(Math.floor(wiki.battlefield.length / 2), 10),
                0,
                {
                    id: -1,
                    name: 'ad',
                    img: 'ad',
                    desc: 'ad',
                    buffName: 'ad',
                    buffValue: 0,
                    buffUnit: 'ad',
                    buffCupValue: 0,
                }
            );
            setBattlefieldInfo(wiki.battlefield);
        }
    }, [wiki]);

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
    }, [battlefieldInfo, hash]);

    let jsx;
    if (battlefieldInfo) {
        jsx = (
            <>
                <p>
                    Here you will find information about battlefields skins and
                    their effects. Since patch 5.3.0, battlefield skins now give
                    a unique buff instead of being cosmetic purpose only. The
                    buff for individual battlefield skins can be viewed below.
                </p>
                <section className='battlefield-list' ref={containerRef}>
                    {battlefieldInfo.map(battlefield =>
                        battlefield.img === 'ad' ? (
                            <Fragment key='ad'>
                                <GoogleAds unitId='8891384324' />
                            </Fragment>
                        ) : (
                            <Fragment key={battlefield.name}>
                                <hr className='divisor' />
                                <div
                                    className='battlefield'
                                    id={battlefield.name}
                                >
                                    <figure>
                                        <img
                                            src={battlefield.img}
                                            alt={battlefield.name}
                                        />
                                    </figure>
                                    <h3>{battlefield.name}</h3>
                                    <div className='battlefield-buff-value'>
                                        {battlefield.buffName} :{' '}
                                        {battlefield.buffValue +
                                            battlefield.buffCupValue *
                                                battleFieldLevel}
                                        {battlefield.buffUnit}
                                    </div>
                                    <label htmlFor='battlefield-level'>
                                        Set BattleField Level:{' '}
                                        <select
                                            onChange={(evt): void => {
                                                setBattlefieldLevel(
                                                    Number(evt.target.value)
                                                );
                                                if (containerRef.current) {
                                                    containerRef.current
                                                        .querySelectorAll(
                                                            'label[for="battlefield-level"] > select'
                                                        )
                                                        .forEach(element => {
                                                            // eslint-disable-next-line no-param-reassign
                                                            (element as HTMLSelectElement).value =
                                                                evt.target.value;
                                                        });
                                                }
                                            }}
                                        >
                                            {Array(20)
                                                .fill(1)
                                                .map((i, j) => (
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    <option key={j}>
                                                        {i + j}
                                                    </option>
                                                ))}
                                        </select>
                                    </label>
                                    {ReactHtmlParser(
                                        sanitize(battlefield.desc)
                                    )}
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
        <Main title='Battlefield Mechanics' className='battlefield-guide'>
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
