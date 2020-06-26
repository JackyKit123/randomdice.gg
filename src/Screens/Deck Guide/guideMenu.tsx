import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import Dice from '../../Components/Dice/dice';
import './guide.less';
import { RootState } from '../../Misc/Redux Storage/store';
import { CLEAR_ERRORS } from '../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchDecksGuide, fetchDices } from '../../Misc/Firebase/fetchData';

export default function DeckGuideMenu(): JSX.Element {
    const history = useHistory();
    const dispatch = useDispatch();
    const { guide, error } = useSelector(
        (state: RootState) => state.fetchDecksGuideReducer
    );

    let jsx;
    if (guide) {
        jsx = (
            <>
                <p>
                    In here you can find the guide to the meta decks. Click the
                    deck below to show the detail guide for each decks.
                </p>
                <div className='divisor' />
                <table className='filter'>
                    <tbody>
                        {guide.map(deck => (
                            <tr
                                key={deck.name}
                                tabIndex={0}
                                onClick={(): void =>
                                    history.push(`/decks/guide/${deck.name}`)
                                }
                                onKeyDown={(evt): void => {
                                    // Enter or SpaceBar
                                    if (
                                        evt.keyCode === 13 ||
                                        evt.keyCode === 32
                                    ) {
                                        history.push(
                                            `/decks/guide/${deck.name}`
                                        );
                                    }
                                }}
                            >
                                <td>{deck.name}</td>
                                <td>
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
            {jsx}
        </Main>
    );
}
