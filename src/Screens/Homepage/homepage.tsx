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
                Hello all, this is a Random Dice community created website. In
                this website, you may found useful resources to the game such as
                the deck list, calculator and some game tips. You are welcome to
                join the community in discord or on reddit. Please note that
                this is not a website created by the official developers. Please
                contact the webmaster through discord or by emailing{' '}
                <a href={`mailto:admin@${process.env.REACT_APP_DOMAIN}`}>
                    {`admin@${process.env.REACT_APP_DOMAIN}`}
                </a>{' '}
                for any web related issue.
            </p>
            <p>
                This website uses modern framework and can served while having
                no internet connection. It can also be easily installed onto
                your device for convenient access, you can check out how to
                install in the links here for{' '}
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
            <br />
            <br />
            <br />
            <h3 className='news'>What&apos;s New?</h3>
            <p>
                Gold Calculator is updated into{' '}
                <Link to='/calculator/coop'>Co-op Grind calculator</Link>.
                Instead of calculating gold only, you can now also calculate the
                target diamond and legendary from card box.
            </p>
            <p>
                All calculators, wiki, resources are all now implemented on this
                website. You can request for more features, raise suggestions
                and report website glitches on{' '}
                <a
                    href='https://discord.gg/zQj6tCM'
                    target='_blank'
                    rel='noreferrer noopener'
                >
                    Discord
                </a>{' '}
                or by{' '}
                <a href={`mailto:admin@${process.env.REACT_APP_DOMAIN}`}>
                    Email
                </a>
                .
            </p>
            <p>
                A{' '}
                <a
                    href='https://www.patreon.com/RandomDiceCommunityWebsite'
                    target='_blank'
                    rel='noreferrer noopener'
                >
                    Patreon Page
                </a>{' '}
                is also set up for supporting this website. This website is
                served for free to the community but it does not run for free.
                If you appreciate what we are doing, feel free to drop a
                support. In return, you can enjoy benefits like ad free
                browsing.
            </p>
            <br />
            <br />
            <br />
            <h3 className='menu'>Menu</h3>
            <Menu menuList={menu} />
        </Main>
    );
}
