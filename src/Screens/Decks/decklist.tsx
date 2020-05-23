import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Components/Redux Storage/store';
import Main from '../../Components/Main/main';
import { fetchDecks } from '../fetchData';
import './decklist.less';

export default function DeckList(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchDecksReducer
    );
    const { decks, error } = selection;
    let jsx = <div />;
    if (decks && decks.length > 0) {
        const deckKeys = Object.keys(decks[0]);
        jsx = (
            <table>
                <tbody>
                    <tr>
                        {deckKeys.map(key => {
                            return <th key={key}>{key}</th>;
                        })}
                    </tr>
                    {decks.map(deck => (
                        <tr key={`deck-${deck.id}`}>
                            {Object.values(deck).map((data, i) => (
                                <td
                                    key={`deck-${deck.id}-datapoint-${deckKeys[i]}`}
                                >
                                    {data}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    } else if (error) {
        jsx = (
            <>
                <h3 className='error'>Oops! Something went wrong.</h3>
                <h4 className='error error-message'>{error.message}</h4>
                <button
                    type='button'
                    className='error-retry'
                    onClick={(): Promise<void> => fetchDecks(dispatch)}
                >
                    Click Here to try again
                </button>
            </>
        );
    } else {
        jsx = <div>Loading...</div>;
    }
    return <Main title='Deck List' content={jsx} />;
}
