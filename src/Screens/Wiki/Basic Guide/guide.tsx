import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import GoogleAds from '../../../Components/Ad Unit/ad';
import { RootState } from '../../../Misc/Redux Storage/store';
import './guide.less';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchWiki } from '../../../Misc/Firebase/fetchData';
import { WikiContent } from '../../../Misc/Redux Storage/Fetch Firebase/Wiki/types';
import replaceAnchorWithHistory from '../../../Misc/HTMLAnchorNavigation';
import PopUp from '../../../Components/PopUp Overlay/popup';
import { OPEN_POPUP } from '../../../Misc/Redux Storage/PopUp Overlay/types';
import ShareButtons from '../../../Components/Social Media Share/share';

export default function Basic(): JSX.Element {
    const dispatch = useDispatch();
    const history = useHistory();
    const { wiki, error } = useSelector(
        (state: RootState) => state.fetchWikiReducer
    );
    const [tips, setTips] = useState<WikiContent['tips']>();

    useEffect(() => {
        if (wiki && !wiki.tips.find(tip => tip.img === 'ad')) {
            wiki.tips.splice(
                Math.min(Math.floor(wiki.tips.length / 2), 10),
                0,
                {
                    id: -1,
                    img: 'ad',
                    desc: 'ad',
                }
            );
            setTips(wiki.tips);
        }
    }, [wiki]);

    useEffect(() => {
        return replaceAnchorWithHistory(history);
    }, []);

    let jsx;
    if (tips) {
        jsx = (
            <>
                {tips.map(tip => (
                    <PopUp key={tip.id} popUpTarget={`guide-img-${tip.id}`}>
                        <img src={tip.img} alt='Tip and trick' />
                        <ShareButtons name='' url={tip.img} />
                    </PopUp>
                ))}
                <p>
                    Here you will find the some tips and trick to guide you off
                    the beginning of the game.
                </p>
                <section>
                    {tips.map(tip =>
                        tip.img === 'ad' ? (
                            <Fragment key='ad'>
                                <GoogleAds unitId='8891384324' />
                            </Fragment>
                        ) : (
                            <Fragment key={tip.id}>
                                <hr className='divisor' />
                                <div className='tip'>
                                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                                    <figure
                                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                                        tabIndex={0}
                                        onClick={(): void => {
                                            dispatch({
                                                type: OPEN_POPUP,
                                                payload: `guide-img-${tip.id}`,
                                            });
                                        }}
                                        onKeyDown={(): void => {
                                            dispatch({
                                                type: OPEN_POPUP,
                                                payload: `guide-img-${tip.id}`,
                                            });
                                        }}
                                    >
                                        <img
                                            src={tip.img}
                                            alt='Tip and trick'
                                        />
                                    </figure>
                                    <span>
                                        {ReactHtmlParser(sanitize(tip.desc))}
                                    </span>
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
        <Main title='Basic Guides and Tips' className='wiki guide'>
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
