import React, { useRef } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useSelector } from 'react-redux';
import { sanitize } from 'dompurify';
import useReplaceAnchorWithHistory from 'Misc/useReplaceAnchorWithHistory';
import { WikiContent } from 'Redux/Fetch Firebase/Wiki/types';
import { RootState } from 'Redux/store';
import { fetchWiki } from 'Firebase';
import PageWrapper from 'Components/PageWrapper';

export default function Intro({
    type,
}: {
    type: keyof WikiContent['intro'];
}): JSX.Element {
    const selection = useSelector((state: RootState) => state.fetchWikiReducer);
    const { error, wiki } = selection;

    const wrapperRef = useRef<HTMLDivElement>(null);
    useReplaceAnchorWithHistory(wrapperRef, [wiki]);

    return (
        <PageWrapper
            isContentReady={!!wiki}
            error={error}
            retryFn={fetchWiki}
            title={`${type} Introduction`}
            className='wiki intro'
            description='A wiki with Random Dice game information. Basic introductions, tips and tricks and more!'
        >
            <div ref={wrapperRef}>
                {ReactHtmlParser(sanitize(wiki?.intro[type] ?? ''))}
            </div>
        </PageWrapper>
    );
}
