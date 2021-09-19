import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ReactHtmlParser from 'react-html-parser';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sanitize } from 'dompurify';
import Main from 'Components/Main';
import Error from 'Components/Error';
import LoadingScreen from 'Components/Loading';
import replaceAnchorWithHistory from 'Misc/HTMLAnchorNavigation';
import { WikiContent } from 'Redux/Fetch Firebase/Wiki/types';
import { RootState } from 'Redux/store';
import { fetchWiki } from 'Firebase';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';

export default function Intro({
    type,
}: {
    type: keyof WikiContent['intro'];
}): JSX.Element {
    const history = useHistory();
    const dispatch = useDispatch();
    const selection = useSelector((state: RootState) => state.fetchWikiReducer);
    const { error, wiki } = selection;

    useEffect(() => {
        return replaceAnchorWithHistory(history);
    }, []);

    let jsx;

    if (wiki) {
        jsx = ReactHtmlParser(sanitize(wiki.intro[type]));
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
        <Main title={`${type} Introduction`} className='wiki intro'>
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
