import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import AdUnit from '../../../Components/Ad Unit/ad';
import { RootState } from '../../../Misc/Redux Storage/store';
import './guide.less';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchWiki } from '../../../Misc/Firebase/fetchData';
import { WikiContent } from '../../../Misc/Redux Storage/Fetch Firebase/Wiki/types';
import replaceAnchorWithHistory from '../../../Misc/HTMLAnchorNavigation';

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
                <p>
                    Here you will find the some tips and trick to guide you off
                    the beginning of the game.
                </p>
                <section>
                    {tips.map(tip =>
                        tip.img === 'ad' ? (
                            <Fragment key='ad'>
                                <hr className='divisor' />
                                <AdUnit
                                    provider='Media.net'
                                    unitId='227378933'
                                    dimension='300x250'
                                />
                                <AdUnit
                                    provider='Media.net'
                                    unitId='219055766'
                                    dimension='970x90'
                                />
                            </Fragment>
                        ) : (
                            <Fragment key={tip.id}>
                                <hr className='divisor' />
                                <div className='tip'>
                                    <figure>
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
            {jsx}
        </Main>
    );
}
