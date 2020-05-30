import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuProp } from '../../Screens/Misc/menuConfig';

export default function Menu(props: {
    menuList: MenuProp[];
    className?: string | undefined;
}): JSX.Element {
    const { menuList, className } = props;
    const location = useLocation();
    console.log(location.pathname);
    const createMenu = (menulist: MenuProp[]): (JSX.Element | null)[] => {
        return menulist.map((menu: MenuProp) => {
            let anchor;
            switch (true) {
                case menu.external:
                    anchor = (
                        <a
                            target='_blank'
                            rel='noopener noreferrer'
                            href={menu.path}
                        >
                            {menu.name}
                        </a>
                    );
                    break;
                case !menu.external && menu.path === location.pathname:
                    anchor = <span className='active'>{menu.name}</span>;
                    break;
                case !menu.external && menu.path !== undefined:
                    anchor = <Link to={String(menu.path)}>{menu.name}</Link>;
                    break;
                default:
                    anchor = <span>{menu.name}</span>;
            }
            const childNode = menu.childNode ? (
                <ul>{createMenu(menu.childNode)}</ul>
            ) : null;
            return (
                <li key={`menu-${className}-${menu.name}`}>
                    {anchor}
                    {childNode}
                </li>
            );
        });
    };
    return <ul className={`menu ${className}`}>{createMenu(menuList)}</ul>;
}
