import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Dice from 'Components/Dice';
import { RootState } from 'Redux/store';

import { fetchDecksGuide, fetchDices } from 'Firebase';
import PageWrapper from 'Components/PageWrapper';

export default function DeckGuideMenu(): JSX.Element {
    const { guide, error } = useSelector(
        (state: RootState) => state.fetchDecksGuideReducer
    );
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { wiki } = useSelector((state: RootState) => state.fetchWikiReducer);

    return (
        <PageWrapper
            isContentReady={
                !!(guide?.length && dices?.length && wiki?.battlefield?.length)
            }
            error={error}
            retryFn={(dispatch): void => {
                fetchDecksGuide(dispatch);
                fetchDices(dispatch);
            }}
            title='Meta Decks Guide'
            className='meta-deck-guide'
            description='In-depth Random Dice meta decks explanations, guides teaching you the usage of different meta decks in the game.'
        >
            <p>
                In here you can find the guide to the meta decks. Click the deck
                below to show the detail guide for each decks. Archive section
                denotes decks that are off meta, you can still access them for
                curiosity.
            </p>
            {['PvP', 'Co-op', 'Crew'].map(guideType => (
                <Fragment key={guideType}>
                    <hr className='divisor' />
                    <h3>{guideType} Decks Guide</h3>
                    <table>
                        <tbody>
                            {guide
                                ?.filter(
                                    g => !g.archived && g.type === guideType
                                )
                                .map(g => (
                                    <tr key={g.id}>
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
                                                        {dicelist.map(
                                                            (dice, i) => (
                                                                <Dice
                                                                    /* eslint-disable-next-line react/no-array-index-key */
                                                                    key={`filter-${dicelist.join()}-${dice}-${i}`}
                                                                    dice={dice}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                ))}
                                                {g.battlefield > -1 &&
                                                g.type !== 'Crew' ? (
                                                    <div>
                                                        Battlefield:{' '}
                                                        {
                                                            wiki?.battlefield.find(
                                                                battlefield =>
                                                                    battlefield.id ===
                                                                    g.battlefield
                                                            )?.name
                                                        }
                                                    </div>
                                                ) : null}
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
                        ?.filter(g => g.archived)
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
                                        {g.battlefield > -1 &&
                                        g.type !== 'Crew' ? (
                                            <div>
                                                Battlefield:{' '}
                                                {
                                                    wiki?.battlefield.find(
                                                        battlefield =>
                                                            battlefield.id ===
                                                            g.battlefield
                                                    )?.name
                                                }
                                            </div>
                                        ) : null}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </PageWrapper>
    );
}
