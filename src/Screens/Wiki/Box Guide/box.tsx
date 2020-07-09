import React, { Fragment, useEffect, useState } from 'react';
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
import { WikiContent } from '../../../Misc/Redux Storage/Fetch Firebase/Wiki/types';

export default function BoxGuide(): JSX.Element {
    const dispatch = useDispatch();
    const store = useSelector((state: RootState) => state);
    const [boxInfo, setBoxInfo] = useState<WikiContent['box']>();
    const { hash } = useLocation();
    const { dices } = store.fetchDicesReducer;
    const { wiki } = store.fetchWikiReducer;
    const error = store.fetchDicesReducer.error || store.fetchWikiReducer.error;

    useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        document
            .getElementById(decodeURI(hash.replace(/^#/, '')))
            ?.scrollIntoView();
    }, [hash, dices, wiki]);

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
    if (dices && boxInfo) {
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
                            <Fragment key={box.name}>
                                <div id={box.name}>
                                    <hr className='divisor' />
                                    <div>
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
            {jsx}
        </Main>
    );
}
