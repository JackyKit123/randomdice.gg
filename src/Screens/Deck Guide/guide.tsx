import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { sanitize } from 'dompurify';
import Main from '../../Components/Main/main';
import Dice from '../../Components/Dice/dice';
import AdUnit from '../../Components/Ad Unit/ad';
import decksGuide from './guide.content.json';
import './guide.less';

export default function DeckGuideMenu(): JSX.Element {
    const history = useHistory();
    const { name } = useParams();

    const guide = decksGuide.find(deck => deck.name === name) as {
        name: string;
        diceList: string[][];
        guide: string;
    };

    if (!guide) {
        history.push('/decks/guide');
    }

    return (
        <Main
            title={`Decks Guide (${guide?.name})`}
            className='meta-deck-guide'
        >
            <div className='guide'>
                <h3>{guide?.name}</h3>
                {guide?.diceList.map(dicelist => (
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
                <div className='divisor' />
                <AdUnit unitId='227378933' dimension='300x250' />
                <AdUnit unitId='219055766' dimension='970x90' />
                <div className='divisor' />
                <div
                    /* eslint-disable react/no-danger */
                    dangerouslySetInnerHTML={{
                        __html: sanitize(guide?.guide || ''),
                    }}
                />
            </div>
            <button
                type='button'
                onClick={(): void => history.push('/decks/guide')}
            >
                Read More Guides
            </button>
        </Main>
    );
}
