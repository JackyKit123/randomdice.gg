import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Main from 'Components/Main';
import Error from 'Components/Error';
import LoadingScreen from 'Components/Loading';
import ShareButton from 'Components/ShareButton';
import ConvertEmbed from 'Components/YoutubeEmbed';
import { fetchWiki } from 'Firebase';
import useReplaceAnchorWithHistory from 'Misc/useReplaceAnchorWithHistory';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';
import { RootState } from 'Redux/store';

export default function BasicGuide(): JSX.Element {
    const dispatch = useDispatch();
    const history = useHistory();
    const { title } = useParams<{ title: string }>();
    const { wiki, error } = useSelector(
        (state: RootState) => state.fetchWikiReducer
    );

    const wrapperRef = useRef<HTMLDivElement>(null);
    useReplaceAnchorWithHistory(wrapperRef, [wiki]);

    let jsx;
    if (wiki?.tips) {
        const guide = wiki.tips.find(
            tip => tip.title.toLowerCase() === title.toLowerCase()
        );
        if (!guide) {
            history.push('/wiki/guide');
        } else {
            jsx = (
                <div ref={wrapperRef}>
                    <h3>{guide.title}</h3>
                    <ConvertEmbed htmlString={guide.content} />
                    <hr className='divisor' />
                    <ShareButton name={`Random Dice Guide (${guide.title})`} />
                    <button
                        type='button'
                        className='read-more'
                        onClick={(): void => history.push('/wiki/guide')}
                    >
                        Read More Guides
                    </button>
                </div>
            );
        }
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
            </Helmet>
            {jsx}
        </Main>
    );
}
