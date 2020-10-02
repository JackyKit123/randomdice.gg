import React, { Fragment } from 'react';
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

export default function DeckGuideMenu(): JSX.Element {
    const dispatch = useDispatch();
    const { guide, error } = useSelector(
        (state: RootState) => state.fetchDecksGuideReducer
    );
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );

    let jsx;
    if (guide?.length && dices?.length) {
        jsx = (
            <>
                <p>
                    In here you can find the guide to the meta decks. Click the
                    deck below to show the detail guide for each decks. Archive
                    section denotes decks that are off meta, you can still
                    access them for curiosity.
                </p>
                {['PvP', 'Co-op', 'Crew'].map(guideType => (
                    <Fragment key={guideType}>
                        <hr className='divisor' />
                        <h3>{guideType} Decks Guide</h3>
                        <table>
                            <tbody>
                                {guide
                                    .filter(
                                        g => !g.archived && g.type === guideType
                                    )
                                    .map(g => (
                                        <tr key={g.id}>
                                            <td>
                                                <Link
                                                    to={`/decks/guide/${g.name}`}
                                                >
                                                    <span>{g.name}</span>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/decks/guide/${g.name}`}
                                                >
                                                    {g.diceList.map(
                                                        dicelist => (
                                                            <div
                                                                className='dice-container'
                                                                key={`filter-${dicelist.join()}`}
                                                            >
                                                                {dicelist.map(
                                                                    (
                                                                        dice,
                                                                        i
                                                                    ) => (
                                                                        <Dice
                                                                            /* eslint-disable-next-line react/no-array-index-key */
                                                                            key={`filter-${dicelist.join()}-${dice}-${i}`}
                                                                            dice={
                                                                                dice
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </Fragment>
                ))}
                <hr className='divisor' />
                <h3>Archived Section</h3>
                <table className='archived'>
                    <tbody>
                        {guide
                            .filter(g => g.archived)
                            .map(g => (
                                <tr key={g.id}>
                                    <td>
                                        <Link to={`/decks/guide/${g.type}`}>
                                            <span>{g.type}</span>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/decks/guide/${g.name}`}>
                                            <span>{g.name}</span>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/decks/guide/${g.name}`}>
                                            {g.diceList.map(dicelist => (
                                                <div
                                                    className='dice-container'
                                                    key={`filter-${dicelist.join()}`}
                                                >
                                                    {dicelist.map((dice, i) => (
                                                        <Dice
                                                            /* eslint-disable-next-line react/no-array-index-key */
                                                            key={`filter-${dicelist.join()}-${dice}-${i}`}
                                                            dice={dice}
                                                        />
                                                    ))}
                                                </div>
                                            ))}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
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
