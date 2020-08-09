import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import Main from '../../Components/Main/main';
import Menu from '../../Components/Menu/menu';
import './homepage.less';
import { menu } from '../../Misc/menuConfig';
import replaceAnchorWithHistory from '../../Misc/HTMLAnchorNavigation';
import { RootState } from '../../Misc/Redux Storage/store';
import ConvertEmbed from '../../Components/Youtube Embed/embed';

export default function Homepage(): JSX.Element {
    const history = useHistory();
    replaceAnchorWithHistory(history);
    const { news, error } = useSelector(
        (state: RootState) => state.fetchNewsReducer
    );

    return (
        <Main className='homepage' title='Random Dice Unofficial Site'>
            <section>
                <h3>Welcome</h3>
                <p>
                    Hello all, this is a Random Dice community created website.
                    You will find useful resources for the game such as deck
                    lists, calculators, and game tips. This website uses a
                    modern framework and can be served while having no internet
                    connection; it can also be easily installed onto your device
                    for convenient access, you can check out how to install in
                    the links here for{' '}
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
                    You are welcome to join the community in{' '}
                    <a
                        href='https://discord.gg/zQj6tCM'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Discord
                    </a>{' '}
                    or on{' '}
                    <a
                        href='https://www.reddit.com/r/randomdice/'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Reddit
                    </a>
                    . If you find any issues, please contact the webmaster
                    through Discord on JackyKit#0333 or by emailing{' '}
                    <a href={`mailto:admin@${process.env.REACT_APP_DOMAIN}`}>
                        {`admin@${process.env.REACT_APP_DOMAIN}`}
                    </a>{' '}
                    for any web related issue.
                </p>
            </section>
            <section>
                <h3>Game News</h3>
                {/* eslint-disable-next-line no-nested-ternary */}
                {news ? (
                    <ConvertEmbed htmlString={news.game} />
                ) : error ? (
                    `Unable to load the latest news : ${error}`
                ) : (
                    'Loading News...'
                )}
            </section>
            <section>
                <h3>Website News</h3>
                {/* eslint-disable-next-line no-nested-ternary */}
                {news
                    ? ReactHtmlParser(sanitize(news.website))
                    : error
                    ? `Unable to load the latest news : ${error}`
                    : 'Loading News...'}
            </section>
            <section>
                <h3>Menu</h3>
                <Menu menuList={menu} />
            </section>
        </Main>
    );
}
