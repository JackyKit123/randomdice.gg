import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import firebase, { FirebaseError } from 'firebase/app';
import { useLocation, Link } from 'react-router-dom';
import * as auth from 'Firebase/auth';
import Main from 'Components/Main';
import LoadingScreen from 'Components/Loading';
import NoMatch from 'Screens/NoMatch';
import { menu } from 'Router';
import { OPEN_POPUP } from 'Redux/PopUp Overlay/types';
import useRootStateSelector from 'Redux';

export default function Dashboard(props: {
    className?: string;
    children?: ReactNode;
}): JSX.Element {
    const location = useLocation();
    const dispatch = useDispatch();
    const database = firebase.database();
    const { className, children } = props;
    const { user, error } = useRootStateSelector('authReducer');
    const { data } = useRootStateSelector('fetchUserDataReducer');
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
                setSessionExpired(
                    (err as FirebaseError).code === 'PERMISSION_DENIED'
                );
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
                    href={`https://randomdice.gg${location.pathname}`}
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
