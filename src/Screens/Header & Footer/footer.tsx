import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faReddit,
    faDiscord,
    faWikipediaW,
} from '@fortawesome/free-brands-svg-icons';

export default function Footer(): JSX.Element {
    const communityList = {
        discord: {
            name: 'discord',
            icon: faDiscord,
            hyperlink: 'https://discord.gg/tPQHazK',
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
            <div className='container'>
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
        </footer>
    );
}
