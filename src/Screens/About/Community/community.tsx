import React, { useEffect, useState } from 'react';
import Main from '../../../Components/Main/main';
import { navDiscord } from '../../../Misc/customGaEvent';
import './community.less';

export default function CommunityListing(): JSX.Element {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        window.addEventListener('resize', () =>
            setWindowWidth(window.innerWidth)
        );
        return (): void =>
            window.removeEventListener('resize', () =>
                setWindowWidth(window.innerWidth)
            );
    }, []);

    const discordCommunities = [
        {
            name: 'Main Discord',
            url: 'https://discord.randomdice.gg',
            serverId: '804222694488932362',
            googleAnalyticTrack: true,
        },
        {
            name: 'Portuguese Discord',
            url: 'https://discord.gg/262YzUq',
            serverId: '685228114649153536',
        },
        {
            name: 'Spanish Discord',
            url: 'https://discord.gg/77NjNAd',
            serverId: '683850754662072328',
        },
    ] as {
        name: string;
        url: string;
        serverId: string;
        googleAnalyticTrack?: true;
    }[];

    return (
        <Main title='Community' className='community' disallowAd>
            <p>
                Here you can find a list of communities that you can join, come
                hang out with us if you have not joined any Random Dice
                community!
            </p>
            <hr className='divisor' />
            {discordCommunities.map(community => (
                <div key={community.serverId} className='block'>
                    <h3>
                        <a
                            href={community.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={(): void => {
                                if (community.googleAnalyticTrack) navDiscord();
                            }}
                        >
                            {community.name}
                        </a>
                    </h3>
                    <iframe
                        title='discord'
                        src={`https://discordapp.com/widget?id=${community.serverId}&theme=dark`}
                        width={Math.min(350, windowWidth - 120)}
                        height='500'
                        allowTransparency
                        frameBorder='0'
                        sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'
                    />
                </div>
            ))}
            <hr className='divisor' />
            <h3>
                <a
                    href='https://reddit.com/r/randomdice'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Random Dice Subreddit
                </a>
            </h3>
            <iframe
                src='https://redditjs.com/r/randomdice/new/?cssTheme=dark'
                title='reddit'
                width={Math.min(500, windowWidth - 80)}
                height={500}
            />
        </Main>
    );
}
