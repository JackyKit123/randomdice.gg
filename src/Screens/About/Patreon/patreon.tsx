import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPatreon } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import Main from '../../../Components/Main/main';
import BreakkyPng from './Breakky.png';
import './patreon.less';

export default function PatreonIntro(): JSX.Element {
    return (
        <Main title='Patreon' className='patreon'>
            <div className='patreon-icon'>
                <div className='container'>
                    <FontAwesomeIcon icon={faPatreon} />
                </div>
            </div>
            <p>
                This website is served for free to the community but it does not
                run for free. If you appreciate what we are doing, feel free to
                drop a support. In return, you can enjoy benefits like ad free
                browsing. Or a dedicated page for you to leave your message to
                the community.
            </p>
            <p>
                You can become a patreon at{' '}
                <a
                    href='https://www.patreon.com/RandomDiceCommunityWebsite'
                    target='_blank'
                    rel='noreferrer noopener'
                >
                    https://www.patreon.com/RandomDiceCommunityWebsite
                </a>
                .
            </p>
            <hr className='divisor' />
            <h3>Tier 3 Supporters</h3>
            <ul>
                <li>
                    <span>Breakky</span>
                    <figure>
                        <img src={BreakkyPng} alt='icon of Breakky' />
                    </figure>
                    <div>
                        <Link to='/about/patreon/Breakky/'>
                            Message from Breakky
                        </Link>
                    </div>
                </li>
            </ul>
            <h3>Tier 2 Supporters</h3>
            <ul />
            <h3>Tier 1 Supporters</h3>
            <ul />
        </Main>
    );
}
