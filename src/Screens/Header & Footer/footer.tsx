import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faReddit,
    faDiscord,
    faWikipediaW,
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

export default function Footer(): JSX.Element {
    const communityList = {
        discord: {
            name: 'discord',
            icon: faDiscord,
            hyperlink: 'https://discord.gg/yfhWny9',
        },
        reddit: {
            name: 'reddit',
            icon: faReddit,
            hyperlink: 'https://www.reddit.com/r/randomdice/',
        },
        wiki: {
            name: 'wiki',
            icon: faWikipediaW,
            hyperlink: 'https://random-dice.fandom.com/wiki/Random_Dice_Wiki',
        },
    };
    return (
        <footer>
            <div className='container upper'>
                <div className='footerBar'>
                    <div className='container'>
                        Join the community!
                        <div className='community'>
                            {Object.values(communityList).map(community => (
                                <div key={community.name}>
                                    <a
                                        href={community.hyperlink}
                                        className={community.name}
                                    >
                                        <FontAwesomeIcon
                                            icon={community.icon}
                                        />{' '}
                                        {community.name}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='container lower'>
                <div className='footerBar'>
                    <div className='container'>
                        <span id='copyright'>
                            &#169; Copyright {new Date().getFullYear()} Random
                            Dice Community
                        </span>
                        <div className='footer-link'>
                            <Link to='/about/terms'>Terms and Conditions</Link>
                            <Link to='/about/privacy'>Privacy Policy</Link>
                            <Link to='/about'>About Us</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
