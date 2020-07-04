import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { sanitize } from 'dompurify';
import ReactHtmlParser from 'react-html-parser';
import replaceAnchorWithHistory from '../../Misc/HTMLAnchorNavigation';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import Dice from '../../Components/Dice/dice';
import AdUnit from '../../Components/Ad Unit/ad';
import './guide.less';
import { RootState } from '../../Misc/Redux Storage/store';
import { CLEAR_ERRORS } from '../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchDecksGuide, fetchDices } from '../../Misc/Firebase/fetchData';

export default function DeckGuideMenu(): JSX.Element | null {
    const history = useHistory();
    const dispatch = useDispatch();
    const { name } = useParams();
    const { guide, error } = useSelector(
        (state: RootState) => state.fetchDecksGuideReducer
    );
    useEffect(() => {
        return replaceAnchorWithHistory(history);
    });

    let jsx;
    if (guide) {
        const thisGuide = guide.find(g => g.name === name);
        if (!thisGuide) {
            history.push('/decks/guide');
        }
        jsx = (
            <>
                <div className='guide'>
                    <h3>{name}</h3>
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
                    <hr className='divisor' />
                    <AdUnit unitId='227378933' dimension='300x250' />
                    <AdUnit unitId='219055766' dimension='970x90' />
                    <hr className='divisor' />
                    {ReactHtmlParser(sanitize(thisGuide?.guide || ''))}
                </div>
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
