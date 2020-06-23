import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Main from '../../../Components/Main/main';
import BreakkyPng from './Breakky.png';
import Patreons from './patreon.json';
import './patreon.less';

export default function PatreonProfile(): JSX.Element {
    const history = useHistory();
    const { name } = useParams();

    const patreon = Patreons.find(p => p.name === name);

    if (!patreon) {
        history.push('/about/patreon');
    }

    return (
        <Main
            title={`Patreon Supporter ${patreon?.name}`}
            className='patreon-profile'
        >
            <h3>Message from {patreon?.name}</h3>
            <div className='img-container'>
                <img src={BreakkyPng} alt={`Icon of ${patreon?.name}`} />
            </div>
            <div className='message'>
                <p>{patreon?.name} does not have a message to share yet.</p>
            </div>
            <button
                type='button'
                onClick={(): void => history.push('/about/patreon')}
            >
                Back to Patreon Page
            </button>
        </Main>
    );
}
