import React from 'react';
import { useHistory } from 'react-router-dom';
import Main from '../../Components/Main/main';
import Dice from '../../Components/Dice/dice';
import guide from './guide.content.json';
import './guide.less';

export default function DeckGuideMenu(): JSX.Element {
    const history = useHistory();
    const decks = guide as {
        name: string;
        diceList: string[][];
        guide: string;
    }[];

    return (
        <Main title='Meta Decks Guide' className='meta-deck-guide'>
            <p>
                In here you can find the guide to the meta decks. Click the deck
                below to show the detail guide for each decks.
            </p>
            <div className='divisor' />
            <table className='filter'>
                <tbody>
                    {decks.map(deck => (
                        <tr
                            key={deck.name}
                            // eslint-disable-next-line jsx-a11y/tabindex-no-positive
                            tabIndex={1}
                            onClick={(): void =>
                                history.push(`/decks/guide/${deck.name}`)
                            }
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
        </Main>
    );
}
