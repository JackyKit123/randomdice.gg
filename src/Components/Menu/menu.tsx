import React from 'react';
import { Link } from 'react-router-dom';

interface MenuItem {
    [key: string]: string | MenuItem;
}

export default function Menu({
    menuList,
}: {
    menuList: MenuItem;
}): JSX.Element {
    const createMenu = (menu: MenuItem): JSX.Element[] =>
        Object.entries(menu).map(menuItem => (
            <li key={menuItem[0]}>
                {typeof menuItem[1] === 'string' ? (
                    <Link to={menuItem[1]}> {menuItem[0]}</Link>
                ) : (
                    <span>{menuItem[0]}</span>
                )}
                {typeof menuItem[1] === 'string' ? (
                    ''
                ) : (
                    <ul>{createMenu(menuItem[1])}</ul>
                )}
            </li>
        ));
    return <ul className='menu'>{createMenu(menuList)}</ul>;
}
