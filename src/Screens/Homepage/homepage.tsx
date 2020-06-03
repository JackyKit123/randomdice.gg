import React from 'react';
import Main from '../../Components/Main/main';
import Menu from '../../Components/Menu/menu';
import './homepage.less';
import { menu } from '../Misc/menuConfig';

export default function Homepage(): JSX.Element {
    return (
        <Main
            className='homepage'
            title='Random Dice Unofficial Site'
            content={
                <>
                    <h3 className='welcome'>Welcome</h3>
                    <p>
                        Hello all, this is a Random Dice community created
                        website. Please note that this is not a website created
                        by the official developers. Please contact the webmaster
                        through discord or by emailing{' '}
                        <a
                            href={`mailto:admin@${process.env.REACT_APP_DOMAIN}`}
                        >
                            {`admin@${process.env.REACT_APP_DOMAIN}`}
                        </a>{' '}
                        for any web related issue. In this website, you may
                        found useful resources to the game such as the deck
                        list, caculator and some game tips. You are welcome to
                        join the community in discord or on reddit.
                    </p>
                    <br />
                    <br />
                    <br />
                    <h3 className='welcome'>News</h3>
                    <p>
                        This is not a stable release of the website. More
                        features are still under development. You may
                        encountered some minor glitches when browing. The
                        website may also have unexpected downtime. You can have
                        a peak through of this website. For issue with the
                        website, due to the webmaster email has not yet been set
                        up, please do not hesitate to dm or mention
                        JackyKit#0333 in discord. I hope you enjoy browsing this
                        website.
                    </p>
                    <br />
                    <br />
                    <br />
                    <h3 className='menu'>Menu</h3>
                    <Menu menuList={menu} />
                </>
            }
        />
    );
}
