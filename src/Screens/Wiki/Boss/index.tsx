import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import { useLocation } from 'react-router-dom';
import Main from 'Components/Main';
import Error from 'Components/Error';
import LoadingScreen from 'Components/Loading';
import GoogleAds from 'Components/AdUnit';
import { RootState } from 'Redux/store';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';
import { fetchWiki } from 'Firebase';
import { WikiContent } from 'Redux/Fetch Firebase/Wiki/types';

export default function BossGuide(): JSX.Element {
    const dispatch = useDispatch();
    const { hash } = useLocation();
    const [bossInfo, setBossInfo] = useState<WikiContent['boss']>();
    const { wiki, error } = useSelector(
        (state: RootState) => state.fetchWikiReducer
    );

    useEffect(() => {
        if (wiki && !wiki.boss.find(boss => boss.img === 'ad')) {
            wiki.boss.splice(
                Math.min(Math.floor(wiki.boss.length / 2), 10),
                0,
                {
                    id: -1,
                    name: 'ad',
                    img: 'ad',
                    desc: 'ad',
                }
            );
            setBossInfo(wiki.boss);
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
    }, [bossInfo, hash]);

    let jsx;
    if (bossInfo) {
        jsx = (
            <>
                <p>On here you will find information about Game Boss.</p>
                <p>
                    First thing you can notice when the boss is appearing in the
                    field (PvP only), it will do an animation which lasts for a
                    few seconds where Blizzard can Apply Slowness effects and
                    Spike/Landmine can damage the boss before it goes to the
                    starting point. Boss Health points increases per waves, and
                    in PvP mode, the mobs on board that are not killed will
                    contribute to the increment of the boss health. So try not
                    to overwhelm your board with too many mobs.
                </p>
                <section className='boss-list'>
                    {bossInfo.map(boss =>
                        boss.img === 'ad' ? (
                            <Fragment key='ad'>
                                <GoogleAds unitId='8891384324' />
                            </Fragment>
                        ) : (
                            <Fragment key={boss.name}>
                                <hr className='divisor' />
                                <div className='boss' id={boss.name}>
                                    <figure>
                                        <img src={boss.img} alt={boss.name} />
                                    </figure>
                                    <h3>{boss.name}</h3>
                                    {ReactHtmlParser(sanitize(boss.desc))}
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
        <Main title='Boss Mechanics' className='boss-guide'>
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
