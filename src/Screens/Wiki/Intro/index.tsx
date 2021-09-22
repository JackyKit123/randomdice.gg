import React, { useRef } from 'react';
import ReactHtmlParser from 'react-html-parser';

import { sanitize } from 'dompurify';
import useReplaceAnchorWithHistory from 'Misc/useReplaceAnchorWithHistory';
import { WikiContent } from 'types/database';
import useRootStateSelector from 'Redux';
import { fetchWiki } from 'Firebase';
import PageWrapper from 'Components/PageWrapper';

export default function Intro({
  type,
}: {
  type: keyof WikiContent['intro'];
}): JSX.Element {
  const {
    wiki: { intro },
    firebaseError,
  } = useRootStateSelector('fetchFirebaseReducer');

  const wrapperRef = useRef<HTMLDivElement>(null);
  useReplaceAnchorWithHistory(wrapperRef, [intro[type]]);

  return (
    <PageWrapper
      isContentReady={!![intro[type]]}
      error={firebaseError}
      retryFn={fetchWiki}
      title={`${type} Introduction`}
      className='wiki intro'
      description='A wiki with Random Dice game information. Basic introductions, tips and tricks and more!'
    >
      <div ref={wrapperRef}>{ReactHtmlParser(sanitize(intro[type] ?? ''))}</div>
    </PageWrapper>
  );
}
