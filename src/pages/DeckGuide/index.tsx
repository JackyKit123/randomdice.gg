import React, { useRef } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import useReplaceAnchorWithHistory from 'misc/useReplaceAnchorWithHistory';
import Dice from 'components/Dice';
import GoogleAds from 'components/AdUnit';
import SMshare from 'components/ShareButton';
import useRootStateSelector from '@redux';

import { fetchDecksGuide, fetchDices } from 'misc/firebase';
import ConvertEmbed from 'components/YoutubeEmbed';
import PageWrapper from 'components/PageWrapper';

export default function DeckGuideMenu(): JSX.Element | null {
  const history = useHistory();
  const { name } = useParams<{ name: string }>();
  const {
    decks_guide: allGuides,
    dice,
    wiki: { battlefield },
    firebaseError,
  } = useRootStateSelector('fetchFirebaseReducer');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useReplaceAnchorWithHistory(wrapperRef, [dice, battlefield]);

  const guide = allGuides?.find(
    g => g.name.toLowerCase() === name.toLowerCase()
  );
  if (!guide) {
    history.push('/decks/guide');
    return <></>;
  }
  return (
    <PageWrapper
      isContentReady={!!(dice.length && battlefield.length)}
      error={firebaseError}
      retryFn={(dispatch): void => {
        fetchDecksGuide(dispatch);
        fetchDices(dispatch);
      }}
      title={`Decks Guide (${name})`}
      className='meta-deck-guide'
    >
      <div className='guide' ref={wrapperRef}>
        {guide?.archived ? (
          <div className='guide-archived'>
            <h4>This guide has been archived by the editor</h4>
          </div>
        ) : null}
        <h3>
          {guide.name} ({guide.type})
        </h3>
        {guide.diceList.map(dicelist => (
          <div className='dice-container' key={`guide-${dicelist.join()}`}>
            {dicelist.map((die, i) => (
              <Dice
                /* eslint-disable-next-line react/no-array-index-key */
                key={`guide-${dicelist.join()}-${die}${i}`}
                die={die}
              />
            ))}
          </div>
        ))}
        {guide && guide.battlefield > -1 && guide.type !== 'Crew' && (
          <div className='battlefield'>
            <p>
              Battlefield:{' '}
              {battlefield.find(b => b.id === guide.battlefield)?.name}
            </p>
          </div>
        )}
        <GoogleAds unitId='8891384324' />
        <hr className='divisor' />
        <ConvertEmbed htmlString={guide?.guide || ''} />
      </div>
      <hr className='divisor' />
      <SMshare name={`Decks Guide (${name})`} />
      <button
        type='button'
        className='read-more'
        onClick={(): void => history.push('/decks/guide')}
      >
        Read More Guides
      </button>
    </PageWrapper>
  );
}
