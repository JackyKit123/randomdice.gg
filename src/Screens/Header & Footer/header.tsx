import React, { useState, useEffect } from 'react';
import './header-footer.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Menu from '../../Components/Menu/menu';
import menulist from '../menu.config';

export default function Header(): JSX.Element {
    const [scrolled, setScrolled] = useState(true);
    useEffect(() => {
        function handler(): void {
            setScrolled(window.scrollY > 0);
        }
        handler();
        window.addEventListener('scroll', handler);
        return (): void => window.removeEventListener('scroll', handler);
    });

    return (
        <header className={scrolled ? 'scroll' : ''}>
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
                        <Menu menuList={menulist} />
                    </div>
                </div>
            </div>
            <div className='header-placeholder' />
        </header>
    );
}
