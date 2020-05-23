import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '../../Screens/menuConfig';

interface MenuProps {
    menuList: Menu;
}

export default function menu({ menuList }: MenuProps): JSX.Element {
    const createMenu = (menulist: Menu | string): JSX.Element[] =>
        Object.entries(menulist).map(menuItem => (
            <li key={menuItem[0]}>
                {typeof menuItem[1].path === 'string' ? (
                    <Link to={menuItem[1].path}> {menuItem[0]}</Link>
                ) : (
                    <span>{menuItem[0]}</span>
                )}
                {typeof menuItem[1].path === 'string' ? (
                    ''
                ) : (
                    <ul>{createMenu(menuItem[1])}</ul>
                )}
            </li>
        ));
    return <ul className='menu'>{createMenu(menuList)}</ul>;
}
