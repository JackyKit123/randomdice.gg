import React from 'react';
import Main from '../../Components/Main/main';
import Menu from '../../Components/Menu/menu';
import './homepage.less';
import menulist from '../menu.config';

export default function Homepage(): JSX.Element {
    return (
        <Main
            title='Random Dice Unofficial Site'
            content={
                <>
                    <h3>Welcome</h3>
                    <p>
                        Hello all, this is a Random Dice community created
                        website. Please note that this is not a website created
                        by the official developers. Please contact the webmaster
                        through discord or by emailing{' '}
                        <a href={`mailto:admin@${window.location.hostname}`}>
                            {`admin@${window.location.hostname}`}
                        </a>{' '}
                        for any web related issue. In this website, you may
                        found useful resources to the game such as the deck
                        list, caculator and some game tips. You are welcome to
                        join the community in discord or on reddit.
                    </p>
                    <br />
                    <br />
                    <br />
                    <h3>Menu</h3>
                    <Menu menuList={menulist} />
                </>
            }
        />
    );
}
