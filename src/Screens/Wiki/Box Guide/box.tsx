import React, { Fragment, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import Loading from '../../../Components/Loading/loading';
import AdUnit from '../../../Components/Ad Unit/ad';
import { RootState } from '../../../Misc/Redux Storage/store';
import replaceTextWithImgTag from '../../../Misc/replaceTextWithImg';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchWiki, fetchDices } from '../../../Misc/Firebase/fetchData';
import './box.less';

export default function BoxGuide(): JSX.Element {
    const dispatch = useDispatch();
    const store = useSelector((state: RootState) => state);
    const { hash } = useLocation();
    const { dices } = store.fetchDicesReducer;
    const { wiki } = store.fetchWikiReducer;
    const error = store.fetchDicesReducer.error || store.fetchWikiReducer.error;

    useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        document
            .getElementById(decodeURI(hash.replace(/^#/, '')))
            ?.scrollIntoView();
    }, [hash]);

    let jsx;
    if (dices && wiki) {
        jsx = (
            <>
                <p>
                    In this page you will find list of box in the game. Where
                    they are obtained from and the reward they give.
                </p>
                <div className='divisor' />
                <AdUnit unitId='227378933' dimension='300x250' />
                <AdUnit unitId='219055766' dimension='970x90' />
                <section>
                    {wiki.box.map(box => (
                        <Fragment key={box.name}>
                            <div id={box.name}>
                                <div className='divisor' />
                                <div>
                                    <h3>{box.name}</h3>
                                    <div className='box-container'>
                                        <img src={box.img} alt={box.name} />
                                    </div>
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
                            </div>
                        </Fragment>
                    ))}
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
            {jsx}
        </Main>
    );
}
