import React from 'react';
import { Link } from 'react-router-dom';
import Main from '../../Components/Main/main';
import Menu from '../../Components/Menu/menu';
import './homepage.less';
import { menu } from '../../Misc/menuConfig';

export default function Homepage(): JSX.Element {
    return (
        <Main className='homepage' title='Random Dice Unofficial Site'>
            <h3 className='welcome'>Welcome</h3>
            <p>
                Hello all, this is a Random Dice community created website. You
                will find useful resources for the game such as deck lists,
                calculators, and game tips. This website uses a modern framework
                and can be served while having no internet connection; it can
                also be easily installed onto your device for convenient access,
                you can check out how to install in the links here for
                <a
                    href='https://www.howtogeek.com/fyi/how-to-install-progressive-web-apps-pwas-in-chrome/'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Desktop
                </a>{' '}
                and{' '}
                <a
                    href='https://medium.com/progressivewebapps/how-to-install-a-pwa-to-your-device-68a8d37fadc1'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Mobile
                </a>
                .
            </p>
            <p>
                You are welcome to join the community in discord or on Reddit.
                If you find any issues, please contact the webmaster through
                discord on JackyKit#0333 or by emailing{' '}
                <a href={`mailto:admin@${process.env.REACT_APP_DOMAIN}`}>
                    {`admin@${process.env.REACT_APP_DOMAIN}`}
                </a>{' '}
                for any web related issue.
            </p>
            <br />
            <br />
            <br />
            <h3 className='news'>What&apos;s New?</h3>
            <p>
                As most players should be aware of the power of moon dice in
                v4.1.0, we are starting to update some decks in the{' '}
                <Link to='/decks/pvp'>Deck List</Link>. More decks listing will
                be available this week.
            </p>
            <p>
                Moon buff is allowing the Solar to have synergy from it, Solar
                can exceed maximum attack speed cap with Moon dice. We have
                updated the{' '}
                <Link to='/calculator/solar'>Solar DPS Calculator</Link> to show
                the latest calculation.
            </p>
            <br />
            <br />
            <br />
            <h3 className='menu'>Menu</h3>
            <Menu menuList={menu} />
        </Main>
    );
}
