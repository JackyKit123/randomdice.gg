import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Menu as MenuProp } from '../../Misc/menuConfig';

export default function Menu(props: {
    menuList: MenuProp[];
    className?: string | undefined;
    style?: React.CSSProperties;
}): JSX.Element {
    const { menuList, className, style } = props;
    const [focusedTab, setFocusedTab] = useState(-1);
    const history = useHistory();
    const location = useLocation();

    const keyup = (evt: KeyboardEvent): void => {
        const target = evt.target as HTMLElement;
        if (!target.classList.contains('menu-item')) {
            setFocusedTab(-1);
        }
    };

    useEffect(() => {
        document.addEventListener('keyup', keyup);
        const unlisten = history.listen(() => setFocusedTab(-1));
        return (): void => {
            unlisten();
            document.removeEventListener('keyup', keyup);
        };
    }, []);
    const createMenu = (
        menulist: MenuProp[],
        depth = 0
    ): (JSX.Element | null)[] => {
        return menulist.map((menu: MenuProp, i) => {
            if (menu.excludeFromMenu) {
                return null;
            }
            let anchor;
            switch (true) {
                case menu.path === location.pathname:
                    anchor = (
                        <span className='active menu-item'>{menu.name}</span>
                    );
                    break;
                case menu.path !== undefined:
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
                <nav>{createMenu(menu.childNode, depth + 1)}</nav>
            ) : null;
            return (
                // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                <div
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
                </div>
            );
        });
    };
    return (
        <nav className={`menu ${className}`} style={style}>
            {createMenu(menuList)}
        </nav>
    );
}
