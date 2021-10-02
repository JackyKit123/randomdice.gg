import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import useRootStateSelector from '@redux';

import { fetchWiki } from 'misc/firebase';
import PageWrapper from 'components/PageWrapper';

export default function BasicGuideMenu(): JSX.Element {
  const { wiki, firebaseError } = useRootStateSelector('fetchFirebaseReducer');

  return (
    <PageWrapper
      isContentReady={!!wiki?.tips}
      error={firebaseError}
      retryFn={fetchWiki}
      title='Basic Guides and Tips'
      className='wiki guide'
    >
      <p>
        Here you will find the articles for some tips and trick in this game.
      </p>
      <section>
        {['Beginners', 'Intermediate', 'Advanced'].map(level => (
          <Fragment key={level}>
            <h3>{level} Guide</h3>
            <ul>
              {wiki?.tips
                .filter(tip => tip.level === level)
                .map(tip => (
                  <li key={tip.id}>
                    <Link to={`/wiki/guide/${tip.title}`}>{tip.title}</Link>
                  </li>
                ))}
            </ul>
          </Fragment>
        ))}
      </section>
    </PageWrapper>
  );
}
