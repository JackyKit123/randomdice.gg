import React from 'react';
import { Link } from 'react-router-dom';
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
                    <h3 className='welcome'>What&apos;s New?</h3>
                    <p style={{ textAlign: 'center' }}>
                        A Dice Stat Calculator is added. You can take a look at
                        this by clicking the link{' '}
                        <Link to='/calculator/dice'>HERE</Link>.
                    </p>
                    <p style={{ textAlign: 'center' }}>
                        An about us page is added. You can check out our message
                        and the credits into creating the website.{' '}
                        <Link to='/about/us'>About US</Link>{' '}
                        <Link to='/about/credit'>Credit</Link>
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
