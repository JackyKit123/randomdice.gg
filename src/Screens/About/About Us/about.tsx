import React from 'react';
import Main from '../../../Components/Main/main';
import Icon from './discord_icon.png';
import './about.less';

export default function AboutUs(): JSX.Element {
    return (
        <Main
            title='About Us'
            className='about'
            content={
                <>
                    <p>
                        This website is created to provide the community some
                        information for the game Random Dice.
                    </p>
                    <p>
                        This website is maintained by the community and has no
                        affiliate with the official developer nor the game
                        developing company 111%.
                    </p>
                    <p>
                        We strive to provide the most updated information but
                        please keep in mind that the information is authored by
                        the community and we will need to spend our time into
                        making the content. We welcome any suggestions and ideas
                        from the community.
                    </p>
                    <div className='divisor' />
                    <h3>Webmaster Information</h3>
                    <div className='img-container'>
                        <img src={Icon} alt='Icon of JackyKit' />
                    </div>
                    <p>Hi, I am the developer of this website.</p>
                    <p>
                        I hope you are enjoying the content of this website and
                        found it useful
                    </p>
                    <p>
                        I like to listen to what you want. You can contact me
                        through email{' '}
                        <a
                            href={`mailto:admin@${process.env.REACT_APP_DOMAIN}`}
                        >{`admin@${process.env.REACT_APP_DOMAIN}`}</a>{' '}
                        or you can ping me on Discord.
                    </p>
                    <p>
                        My discord tag is JackyKit#0333. You can find me and
                        play games with me. I am also a fan of random dice!
                    </p>
                    <p>
                        Lastly, this website runs off my personal pocket, it
                        costs me some money montly to operate the website. If
                        you appreciate what I am doing, you can consider
                        supporting me on patreon, details can be seen on the
                        Pateron page at{' '}
                        <a
                            target='_blank'
                            href='https://www.patreon.com/RandomDiceCommunityWebsite'
                            rel='noopener noreferrer'
                        >
                            https://www.patreon.com/RandomDiceCommunityWebsite
                        </a>
                        .
                    </p>
                </>
            }
        />
    );
}