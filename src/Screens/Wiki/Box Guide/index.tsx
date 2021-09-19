import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ReactHtmlParser from 'react-html-parser';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Main from 'Components/Main';
import Error from 'Components/Error';
import Loading from 'Components/Loading';
import GoogleAds from 'Components/AdUnit';
import { RootState } from 'Redux/store';
import replaceTextWithImgTag from 'Misc/replaceTextWithImg';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';
import { fetchWiki, fetchDices } from 'Firebase';
import { WikiContent } from 'Redux/Fetch Firebase/Wiki/types';

export default function BoxGuide(): JSX.Element {
    const dispatch = useDispatch();
    const store = useSelector((state: RootState) => state);
    const [boxInfo, setBoxInfo] = useState<WikiContent['box']>();
    const { hash } = useLocation();
    const { dices } = store.fetchDicesReducer;
    const { wiki } = store.fetchWikiReducer;
    const error = store.fetchDicesReducer.error || store.fetchWikiReducer.error;

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
    }, [boxInfo, hash]);

    useEffect(() => {
        if (wiki && !wiki.box.find(box => box.img === 'ad')) {
            wiki.box.splice(Math.min(Math.floor(wiki.box.length / 2), 10), 0, {
                id: -1,
                name: 'ad',
                img: 'ad',
                contain: 'ad',
                from: 'ad',
            });
            setBoxInfo(wiki.box);
        }
    }, [wiki]);

    let jsx;
    if (dices?.length && boxInfo) {
        jsx = (
            <>
                <p>
                    In this page you will find list of box in the game. Where
                    they are obtained from and the reward they give.
                </p>
                <section>
                    {boxInfo.map(box =>
                        box.img === 'ad' ? (
                            <Fragment key='ad'>
                                <GoogleAds unitId='8891384324' />
                            </Fragment>
                        ) : (
                            <Fragment key={box.name}>
                                <hr className='divisor' />
                                <div id={box.name}>
                                    <h3>{box.name}</h3>
                                    <figure>
                                        <img src={box.img} alt={box.name} />
                                    </figure>
                                    <p>Obtained from: {box.from}</p>
                                    <p>
                                        Contains:{' '}
                                        {ReactHtmlParser(
                                            replaceTextWithImgTag(
                                                box.contain,
                                                dices
                                            )
                                        )}
                                    </p>
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
                    fetchDices(dispatch);
                    fetchWiki(dispatch);
                }}
            />
        );
    } else {
        jsx = <Loading />;
    }
    return (
        <Main title='Box Guide' className='wiki box-guide'>
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
