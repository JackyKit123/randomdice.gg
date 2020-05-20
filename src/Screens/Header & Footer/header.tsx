import React from 'react';
import './header-footer.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Menu from './menu';

export default function Header(): JSX.Element {
    const menuList = {
        Home: '/',
        Decks: '/decks',
        Caculator: {
            'Blizzard Slow Effect Caculator': '/caculator/blizzard',
            'Combo Damage Caculator': '/caculator/combo',
            'Solar Light vs Crit Comparison': '/caculator/solar',
        },
    };

    return (
        <header>
            <div className='container'>
                <div className='topHeaderBar headerBar'>
                    <div className='container'>
                        <span className='login'>
                            <FontAwesomeIcon icon={faUserCircle} /> ADMIN Login
                        </span>
                    </div>
                </div>
                <div className='lowHeaderBar headerBar'>
                    <div className='container'>
                        <Menu menuList={menuList} />
                    </div>
                </div>
            </div>
            <div className='header-placeholder' />
        </header>
    );
}
