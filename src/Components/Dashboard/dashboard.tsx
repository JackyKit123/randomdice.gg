import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../Misc/Redux Storage/store';
import Main from '../Main/main';
import LoadingScreen from '../Loading/loading';
import NoMatch from '../../Screens/NoMatch/NoMatch';
import { menu } from '../../Misc/menuConfig';
import './dashboard.less';

export default function Dashboard(props: {
    className?: string;
    children?: ReactNode;
}): JSX.Element {
    const { className, children } = props;
    const selector = useSelector((state: RootState) => state);
    const { user } = selector.authReducer;
    const { data } = selector.fetchUserDataReducer;
    const [authorized, setAuthorized] = useState<'loading' | boolean>(
        'loading'
    );

    useEffect(() => {
        const timeout = setTimeout(() => setAuthorized(false), 10000);
        if (user && data?.editor) {
            setAuthorized(true);
            clearTimeout(timeout);
        }
        return (): void => clearTimeout(timeout);
    });

    if (authorized === 'loading') {
        return (
            <Main title='Loading...'>
                <LoadingScreen />
            </Main>
        );
    }

    if (authorized) {
        return (
            <main>
                <div className={`dashboard ${className}`}>
                    <div className='content'>
                        <div className='menu'>
                            {menu
                                .find(item => item.name === 'Dashboard')
                                ?.childNode?.map(item =>
                                    item.name ? (
                                        <Link
                                            to={item.path || ''}
                                            key={`${item.name}${item.path}`}
                                        >
                                            {item.name}
                                        </Link>
                                    ) : null
                                )}
                        </div>
                        <div className='divisor' />
                        {children}
                    </div>
                </div>
            </main>
        );
    }
    return <NoMatch title='401 Unauthorized' />;
}
