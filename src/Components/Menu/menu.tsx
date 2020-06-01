import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Menu as MenuProp } from '../../Screens/Misc/menuConfig';

export default function Menu(props: {
    menuList: MenuProp[];
    className?: string | undefined;
}): JSX.Element {
    const { menuList, className } = props;
    const [focusedTab, setFocusedTab] = useState(-1);
    const history = useHistory();
    const location = useLocation();

    const keyup = (evt: KeyboardEvent): void => {
        const target = evt.target as HTMLElement;
        if (!target.className.split(' ').includes('menu-item')) {
            setFocusedTab(-1);
        }
    };

    useEffect(() => {
        document.addEventListener('keyup', keyup);
        history.listen(() => {
            setFocusedTab(-1);
        });
        return (): void => document.removeEventListener('keyup', keyup);
    });
    const createMenu = (
        menulist: MenuProp[],
        depth = 0
    ): (JSX.Element | null)[] => {
        return menulist.map((menu: MenuProp, i) => {
            let anchor;
            switch (true) {
                case menu.external:
                    anchor = (
                        <a
                            className='menu-item'
                            target='_blank'
                            rel='noopener noreferrer'
                            href={menu.path}
                        >
                            {menu.name}
                        </a>
                    );
                    break;
                case !menu.external && menu.path === location.pathname:
                    anchor = (
                        <span className='active menu-item'>{menu.name}</span>
                    );
                    break;
                case !menu.external && menu.path !== undefined:
                    anchor = (
                        <Link className='menu-item' to={String(menu.path)}>
                            {menu.name}
                        </Link>
                    );
                    break;
                default:
                    anchor = <span className='menu-item'>{menu.name}</span>;
            }
            const childNode = menu.childNode ? (
                <ul>{createMenu(menu.childNode, depth + 1)}</ul>
            ) : null;
            return (
                // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                <li
                    key={`menu-${className}-${menu.name}`}
                    tabIndex={depth === 0 ? 0 : -1}
                    className={`menu-item ${focusedTab === i ? 'focused' : ''}`}
                    onFocus={(): void => setFocusedTab(i)}
                    onMouseOver={(): void => setFocusedTab(i)}
                    onMouseOut={(): void => {
                        if (i > 0) {
                            setFocusedTab(-1);
                        }
                    }}
                >
                    {anchor}
                    {childNode}
                </li>
            );
        });
    };
    return <ul className={`menu ${className}`}>{createMenu(menuList)}</ul>;
}
