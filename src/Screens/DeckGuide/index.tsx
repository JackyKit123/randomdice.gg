import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import useReplaceAnchorWithHistory from 'Misc/useReplaceAnchorWithHistory';
import Dice from 'Components/Dice';
import GoogleAds from 'Components/AdUnit';
import SMshare from 'Components/ShareButton';
import { RootState } from 'Redux/store';

import { fetchDecksGuide, fetchDices } from 'Firebase';
import ConvertEmbed from 'Components/YoutubeEmbed';
import PageWrapper from 'Components/PageWrapper';

export default function DeckGuideMenu(): JSX.Element | null {
    const history = useHistory();
    const { name } = useParams<{ name: string }>();
    const { guide: allGuides, error } = useSelector(
        (state: RootState) => state.fetchDecksGuideReducer
    );
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { wiki } = useSelector((state: RootState) => state.fetchWikiReducer);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useReplaceAnchorWithHistory(wrapperRef, [dices, wiki]);

    const guide = allGuides?.find(
        g => g.name.toLowerCase() === name.toLowerCase()
    );
    if (!guide) {
        history.push('/decks/guide');
        return <></>;
    }
    return (
        <PageWrapper
            isContentReady={!!(dices?.length && wiki?.battlefield?.length)}
            error={error}
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
                    <div
                        className='dice-container'
                        key={`guide-${dicelist.join()}`}
                    >
                        {dicelist.map((dice, i) => (
                            <Dice
                                /* eslint-disable-next-line react/no-array-index-key */
                                key={`guide-${dicelist.join()}-${dice}${i}`}
                                dice={dice}
                            />
                        ))}
                    </div>
                ))}
                {guide && guide.battlefield > -1 && guide.type !== 'Crew' && (
                    <div className='battlefield'>
                        <p>
                            Battlefield:{' '}
                            {
                                wiki?.battlefield.find(
                                    battlefield =>
                                        battlefield.id === guide.battlefield
                                )?.name
                            }
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
