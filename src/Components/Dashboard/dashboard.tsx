import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import firebase from 'firebase/app';
import { useLocation, Link } from 'react-router-dom';
import * as auth from '../../Misc/Firebase/auth';
import { RootState } from '../../Misc/Redux Storage/store';
import Main from '../Main/main';
import LoadingScreen from '../Loading/loading';
import NoMatch from '../../Screens/NoMatch/NoMatch';
import { menu } from '../../Misc/menuConfig';
import './dashboard.less';
import { OPEN_POPUP } from '../../Misc/Redux Storage/PopUp Overlay/types';

export default function Dashboard(props: {
    className?: string;
    children?: ReactNode;
}): JSX.Element {
    const location = useLocation();
    const dispatch = useDispatch();
    const database = firebase.database();
    const { className, children } = props;
    const selector = useSelector((state: RootState) => state);
    const { user, error } = selector.authReducer;
    const { data } = selector.fetchUserDataReducer;
    const [authorized, setAuthorized] = useState<'loading' | boolean>(
        'loading'
    );
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        const checkSessionValid = async (): Promise<void> => {
            try {
                setSessionExpired(false);
                await database.ref('/auth_test').set(0);
            } catch (err) {
                setSessionExpired(err.code === 'PERMISSION_DENIED');
            }
        };
        checkSessionValid();
    }, [children, authorized]);

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
                    {sessionExpired ? (
                        <>
                            <h3 className='session-expired-warning'>
                                Your login session has expired. Edits will not
                                be saved, relog to continue editing.
                            </h3>
                            <button
                                type='button'
                                onClick={async (): Promise<void> => {
                                    await auth.logout();
                                    dispatch({
                                        type: OPEN_POPUP,
                                        payload: 'login',
                                    });
                                }}
                            >
                                Relog Now
                            </button>
                            <hr className='divisor' />
                        </>
                    ) : null}
                    <nav className='menu'>
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
                    </nav>
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
