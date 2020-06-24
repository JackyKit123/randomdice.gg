import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import { RootState } from '../../Misc/Redux Storage/store';
import Main from '../Main/main';
import LoadingScreen from '../Loading/loading';
import NoMatch from '../../Screens/NoMatch/NoMatch';
import './dashboard.less';

export default function Dashboard(props: {
    className?: string;
    children?: ReactNode;
}): JSX.Element {
    const { className, children } = props;
    const { user } = useSelector((state: RootState) => state.authReducer);
    const [authorized, setAuthorized] = useState<'loading' | boolean>(
        'loading'
    );
    const database = firebase.database();

    useEffect(() => {
        if (user) {
            (async (): Promise<void> => {
                const userData = (
                    await database.ref(`/users/${user.uid}`).once('value')
                ).val();
                if (userData.editor) {
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                }
            })();
        }
    }, [user]);

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
                        <Link to='/dashboard/decks'>Update Decks</Link>
                        <div className='divisor' />
                        {children}
                    </div>
                </div>
            </main>
        );
    }
    return <NoMatch title='401 Unauthorized' />;
}
