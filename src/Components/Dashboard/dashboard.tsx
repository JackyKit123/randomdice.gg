import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useLocation, Link } from 'react-router-dom';
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
    const location = useLocation();
    const { className, children } = props;
    const selector = useSelector((state: RootState) => state);
    const { user, error } = selector.authReducer;
    const { data } = selector.fetchUserDataReducer;
    const [authorized, setAuthorized] = useState<'loading' | boolean>(
        'loading'
    );

    useEffect(() => {
        if (user !== 'awaiting auth state') {
            if (user === null) {
                setAuthorized(false);
            } else if (data) {
                if (data.editor) {
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                }
            }
        }
    }, [user, data]);

    if (authorized === 'loading' || error) {
        return (
            <Main title='Loading...'>
                <LoadingScreen />
            </Main>
        );
    }
    if (!authorized) {
        return <NoMatch title='401 Unauthorized' />;
    }
    return (
        <main>
            <Helmet>
                <title>Dashboard</title>
                <link
                    rel='canonical'
                    href={`https://${process.env.REACT_APP_DOMAIN}${location.pathname}`}
                />
                <meta name='robots' content='noindex' />
            </Helmet>
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
                    <hr className='divisor' />
                    {children || (
                        <>
                            <h3>Dashboard</h3>
                            <p>
                                This is the homepage of the dashboard, click on
                                any item above in the navigation menu to begin
                                editing.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
