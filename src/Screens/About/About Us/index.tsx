import React from 'react';
import Main from 'Components/Main';
import './about.less';

export default function AboutUs(): JSX.Element {
    return (
        <Main title='About Us' className='about' disallowAd>
            <p>
                This website is created to provide the community some
                information for the game Random Dice.
            </p>
            <p>
                This website is maintained by the community and has no affiliate
                with the official developer nor the game developing company
                111%.
            </p>
            <p>
                We strive to provide the most updated information but please
                keep in mind that the information is authored by the community
                and we will need to spend our time into making the content. We
                welcome any suggestions and ideas from the community.
            </p>
            <hr className='divisor' />
            <h3>Webmaster Information</h3>
            <figure>
                <img
                    src='https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/People%20Images%2FJackyKit?alt=media&token=8b725823-fb9a-4cff-ab15-a99282d2be61'
                    alt='Icon of JackyKit'
                />
            </figure>
            <p>Hi, I am the developer of this website.</p>
            <p>
                I hope you are enjoying the content of this website and found it
                useful.
            </p>
            <p>
                I like to listen to what you want. You can contact me through
                email{' '}
                <a href='mailto:admin@randomdice.gg'>admin@randomdice.gg</a> or
                you can ping me on Discord.
            </p>
            <p>
                My discord tag is{' '}
                <a
                    href='https://discordapp.com/users/195174308052467712'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    JackyKit#0333
                </a>
                . You can find me and play games with me. I am also a fan of
                Random Dice!
            </p>
            <p>
                Lastly, this website runs off my personal pocket, it costs me
                some money monthly to operate the website. If you appreciate
                what I am doing, you can consider supporting me on patreon,
                details can be seen on the Patreon page at{' '}
                <a
                    target='_blank'
                    href='https://www.patreon.com/RandomDiceCommunityWebsite'
                    rel='noopener noreferrer'
                >
                    https://www.patreon.com/RandomDiceCommunityWebsite
                </a>
                .
            </p>
        </Main>
    );
}
