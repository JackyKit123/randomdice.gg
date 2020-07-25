import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import Dice from '../../Components/Dice/dice';
import './guide.less';
import { RootState } from '../../Misc/Redux Storage/store';
import { CLEAR_ERRORS } from '../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchDecksGuide, fetchDices } from '../../Misc/Firebase/fetchData';
import AdUnit from '../../Components/Ad Unit/ad';

export default function DeckGuideMenu(): JSX.Element {
    const dispatch = useDispatch();
    const { guide, error } = useSelector(
        (state: RootState) => state.fetchDecksGuideReducer
    );

    let jsx;
    if (guide) {
        if (!guide.find(g => g.guide === 'ad')) {
            guide.splice(Math.min(Math.floor(guide.length / 2), 10), 0, {
                id: -10,
                diceList: [],
                guide: 'ad',
                name: 'ad',
            });
        }
        jsx = (
            <>
                <p>
                    In here you can find the guide to the meta decks. Click the
                    deck below to show the detail guide for each decks.
                </p>
                <hr className='divisor' />
                <table className='filter'>
                    <tbody>
                        {guide.map(deck =>
                            deck.guide === 'ad' ? (
                                <tr key='ad' className='ad'>
                                    <td colSpan={2}>
                                        <AdUnit
                                            provider='Media.net'
                                            unitId='227378933'
                                            dimension='300x250'
                                        />
                                        <AdUnit
                                            provider='Media.net'
                                            unitId='219055766'
                                            dimension='970x90'
                                        />
                                    </td>
                                </tr>
                            ) : (
                                <tr key={deck.id}>
                                    <td>
                                        <Link to={`/decks/guide/${deck.name}`}>
                                            <span>{deck.name}</span>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/decks/guide/${deck.name}`}>
                                            {deck.diceList.map(dicelist => (
                                                <div
                                                    className='dice-container'
                                                    key={`filter-${dicelist.join()}`}
                                                >
                                                    {dicelist.map((dice, i) => (
                                                        <Dice
                                                            /* eslint-disable-next-line react/no-array-index-key */
                                                            key={`filter-${dicelist.join()}-${dice}${i}`}
                                                            dice={dice}
                                                        />
                                                    ))}
                                                </div>
                                            ))}
                                        </Link>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
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
        <Main title='Meta Decks Guide' className='meta-deck-guide'>
            <Helmet>
                <title>Random Dice Decks Guide</title>
                <meta property='og:title' content='Random Dice Decks Guide' />
                <meta
                    name='og:description'
                    content='In-depth Random Dice meta decks explanations, guides teaching you the usage of different meta decks in the game.'
                />
                <meta
                    name='description'
                    content='In-depth Random Dice meta decks explanations, guides teaching you the usage of different meta decks in the game.'
                />
                <meta name='robots' content='follow' />
            </Helmet>
            {jsx}
        </Main>
    );
}
