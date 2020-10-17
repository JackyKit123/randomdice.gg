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
    const [battleFieldLevel, setBattlefieldLevel] = useState(0);
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
                    source: 'ad',
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

    const coinsPerLevel = new Map([
        [1, 100],
        [2, 500],
        [3, 1000],
        [4, 1500],
        [5, 2000],
        [6, 3000],
        [7, 4000],
        [8, 5000],
        [9, 6000],
        [10, 8000],
        [11, 10000],
        [12, 12000],
        [13, 15000],
        [14, 20000],
        [15, 25000],
        [16, 30000],
        [17, 40000],
        [18, 55000],
        [19, 75000],
        [20, 100000],
    ]);

    let jsx;
    if (battlefieldInfo) {
        jsx = (
            <>
                <p>
                    Since patch 5.3.0, battlefield skins now give a unique buff
                    in addition to being a cosmetic. The buff given by each
                    individual battlefield skin can be viewed below.
                </p>
                <p>
                    The battlefield buff effect can be leveled up using gold.
                    The maximum level for the battlefield skin is your pvp rank,
                    meaning that level 20 is the maximum level for all
                    battlefield skins. Below is a table showing the cost to
                    upgrade the battlefield skins. It takes a total of{' '}
                    {Array.from(coinsPerLevel.values()).reduce(
                        (acc, cur) => acc + cur
                    )}{' '}
                    gold to upgrade a battlefield skin to max level.
                </p>
                <p>
                    In co-op mode, the battlefield from the player with higher
                    pvp rank will be used. If both players are the same pvp
                    rank, the battlefield used is randomly picked. The only
                    exception is that the default light mode battlefield skin is
                    never chosen despite one player having higher pvp rank.
                </p>
                <div className='table-container'>
                    <table className='horizontal'>
                        <tbody>
                            <tr>
                                <th scope='row'>Level</th>
                                {new Array(10).fill(1).map((i, j) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <td key={j}>{i + j}</td>
                                ))}
                            </tr>
                            <tr>
                                <th scope='row'>Gold</th>
                                {new Array(10).fill(1).map((i, j) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <td key={j}>{coinsPerLevel.get(i + j)}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                    <table className='horizontal'>
                        <tbody>
                            <tr>
                                <th scope='row'>Level</th>
                                {new Array(10).fill(11).map((i, j) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <td key={j}>{i + j}</td>
                                ))}
                            </tr>
                            <tr>
                                <th scope='row'>Gold</th>
                                {new Array(10).fill(11).map((i, j) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <td key={j}>{coinsPerLevel.get(i + j)}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                    <table className='vertical'>
                        <thead>
                            <tr>
                                <th>Level</th>
                                <th>Gold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {new Array(20).fill(1).map((i, j) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <tr key={j}>
                                    <td>{i + j}</td>
                                    <td>{coinsPerLevel.get(i + j)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                                    <div>
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
                                            {Array(21)
                                                .fill(0)
                                                .map((_, i) => (
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    <option key={i}>{i}</option>
                                                ))}
                                        </select>
                                    </label>
                                    <div>
                                        Obtained from: {battlefield.source}
                                    </div>
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
