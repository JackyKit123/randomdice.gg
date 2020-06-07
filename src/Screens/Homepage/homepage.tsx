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
                        website. In this website, you may found useful resources
                        to the game such as the deck list, caculator and some
                        game tips. You are welcome to join the community in
                        discord or on reddit. Please note that this is not a
                        website created by the official developers. Please
                        contact the webmaster through discord or by emailing{' '}
                        <a
                            href={`mailto:admin@${process.env.REACT_APP_DOMAIN}`}
                        >
                            {`admin@${process.env.REACT_APP_DOMAIN}`}
                        </a>{' '}
                        for any web related issue.
                    </p>
                    <br />
                    <br />
                    <br />
                    <h3 className='news'>What&apos;s New?</h3>
                    <p>Site Performance is greatly enhanced.</p>
                    <p>
                        A meaningful description is added to each resource in
                        the website to allow easier understanding of usage of
                        each tools.
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
