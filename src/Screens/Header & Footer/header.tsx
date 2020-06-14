import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './header-footer.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Menu from '../../Components/Menu/menu';
import { menu } from '../../Misc/menuConfig';

export default function Header(): JSX.Element {
    const history = useHistory();
    const [scrolled, setScrolled] = useState(true);
    const [menuToggle, setMenuToggle] = useState(false);
    history.listen(() => setMenuToggle(false));
    useEffect(() => {
        function handler(): void {
            if (
                document.body.clientHeight -
                    window.innerHeight -
                    window.scrollY >
                    120 &&
                window.scrollY > 0
            ) {
                setScrolled(true);
            } else if (window.scrollY === 0) setScrolled(false);
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
                        {/* <span className='login'>
                            <FontAwesomeIcon icon={faUserCircle} /> ADMIN Login
                        </span> */}
                    </div>
                </div>
                <div className='lowHeaderBar headerBar'>
                    <div className='container'>
                        <Menu
                            menuList={menu}
                            className={menuToggle ? 'open' : ''}
                        />
                        <button
                            type='button'
                            className='toggleMenu'
                            onClick={(): void => setMenuToggle(!menuToggle)}
                        >
                            <FontAwesomeIcon
                                icon={menuToggle ? faTimes : faBars}
                            />
                        </button>
                    </div>
                </div>
            </div>
            <div className='header-placeholder' />
        </header>
    );
}
