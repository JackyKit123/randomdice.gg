import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
    const selector = useSelector((state: RootState) => state);
    const { user } = selector.authReducer;
    const { data } = selector.fetchUserDataReducer;
    const [authorized, setAuthorized] = useState<'loading' | boolean>(
        'loading'
    );

    useEffect(() => {
        if (user && data) {
            if (data.editor) {
                setAuthorized(true);
            } else {
                setAuthorized(false);
            }
        }
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
                        <Link to='/dashboard/deck'>Update Deck List</Link>
                        <Link to='/dashboard/guide'>
                            Update Written Decks Guide
                        </Link>
                        <div className='divisor' />
                        {children}
                    </div>
                </div>
            </main>
        );
    }
    return <NoMatch title='401 Unauthorized' />;
}
