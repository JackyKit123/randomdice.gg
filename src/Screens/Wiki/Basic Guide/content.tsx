import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import ShareButton from 'Components/ShareButton';
import ConvertEmbed from 'Components/YoutubeEmbed';
import { fetchWiki } from 'Firebase';
import useReplaceAnchorWithHistory from 'Misc/useReplaceAnchorWithHistory';

import { RootState } from 'Redux/store';
import PageWrapper from 'Components/PageWrapper';

export default function BasicGuide(): JSX.Element {
    const history = useHistory();
    const { title } = useParams<{ title: string }>();
    const { wiki, error } = useSelector(
        (state: RootState) => state.fetchWikiReducer
    );

    const wrapperRef = useRef<HTMLDivElement>(null);
    useReplaceAnchorWithHistory(wrapperRef, [wiki]);
    const guide = wiki?.tips.find(
        tip => tip.title.toLowerCase() === title.toLowerCase()
    );
    if (!guide) {
        history.push('/wiki/guide');
        return <></>;
    }
    return (
        <PageWrapper
            error={error}
            retryFn={fetchWiki}
            title='Basic Guides and Tips'
            className='wiki guide'
        >
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
        </PageWrapper>
    );
}
