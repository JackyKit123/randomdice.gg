import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '../../Screens/menuConfig';

export default function menu(props: {
    menuList: Menu;
    className?: string | undefined;
}): JSX.Element {
    const { menuList, className } = props;
    const createMenu = (menulist: Menu | string): JSX.Element[] =>
        Object.entries(menulist).map(menuItem => {
            let returnJsx;
            switch (true) {
                case typeof menuItem[1].path === 'string' &&
                    menuItem[1].external:
                    returnJsx = (
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href={menuItem[1].path}
                        >
                            {menuItem[0]}
                        </a>
                    );
                    break;
                case typeof menuItem[1].path === 'string' &&
                    !menuItem[1].external:
                    returnJsx = (
                        <Link to={menuItem[1].path}>{menuItem[0]}</Link>
                    );
                    break;
                default:
                    returnJsx = (
                        <>
                            <span>{menuItem[0]}</span>
                            <ul>{createMenu(menuItem[1])}</ul>
                        </>
                    );
            }
            return <li key={menuItem[0]}>{returnJsx}</li>;
        });
    return <ul className={`menu ${className}`}>{createMenu(menuList)}</ul>;
}
