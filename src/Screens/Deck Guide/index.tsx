import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import replaceAnchorWithHistory from 'Misc/HTMLAnchorNavigation';
import Main from 'Components/Main';
import Error from 'Components/Error';
import LoadingScreen from 'Components/Loading';
import Dice from 'Components/Dice';
import GoogleAds from 'Components/AdUnit';
import SMshare from 'Components/ShareButton';
import { RootState } from 'Redux/store';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';
import { fetchDecksGuide, fetchDices } from 'Firebase';
import ConvertEmbed from 'Components/YoutubeEmbed';

export default function DeckGuideMenu(): JSX.Element | null {
    const history = useHistory();
    const dispatch = useDispatch();
    const { name } = useParams<{ name: string }>();
    const { guide, error } = useSelector(
        (state: RootState) => state.fetchDecksGuideReducer
    );
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { wiki } = useSelector((state: RootState) => state.fetchWikiReducer);
    useEffect(() => {
        return replaceAnchorWithHistory(history);
    }, []);

    let jsx;
    if (guide?.length && dices?.length && wiki?.battlefield?.length) {
        const thisGuide = guide.find(
            g => g.name.toLowerCase() === name.toLowerCase()
        );
        if (!thisGuide) {
            history.push('/decks/guide');
        }
        jsx = (
            <>
                <div className='guide'>
                    {thisGuide?.archived ? (
                        <div className='guide-archived'>
                            <h4>This guide has been archived by the editor</h4>
                        </div>
                    ) : null}
                    <h3>
                        {thisGuide?.name} ({thisGuide?.type})
                    </h3>
                    {thisGuide?.diceList.map(dicelist => (
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
                    {thisGuide &&
                    thisGuide.battlefield > -1 &&
                    thisGuide.type !== 'Crew' ? (
                        <div className='battlefield'>
                            <p>
                                Battlefield:{' '}
                                {
                                    wiki.battlefield.find(
                                        battlefield =>
                                            battlefield.id ===
                                            thisGuide.battlefield
                                    )?.name
                                }
                            </p>
                        </div>
                    ) : null}
                    <GoogleAds unitId='8891384324' />
                    <hr className='divisor' />
                    <ConvertEmbed htmlString={thisGuide?.guide || ''} />
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
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    fetchDecksGuide(dispatch);
                    fetchDices(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title={`Decks Guide (${name})`} className='meta-deck-guide'>
            {jsx}
        </Main>
    );
}
