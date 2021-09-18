import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NoMatch from 'Screens/NoMatch';

export default function LoginCallback(): JSX.Element {
    const root = document.getElementById('root') as HTMLDivElement;
    root.style.display = 'none';
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const { pathname } = location;

    switch (pathname) {
        case '/discord_login':
            {
                const query = {
                    code: params.get('code'),
                    error: params.get('error_description'),
                };
                localStorage.setItem('discord_oauth', JSON.stringify(query));
            }
            break;
        case '/patreon_login':
            {
                const code = params.get('code');
                const query = {
                    code,
                    error: code === null ? 'Authentication Uncompleted' : null,
                };
                localStorage.setItem('patreon_oauth', JSON.stringify(query));
            }
            break;
        default:
            break;
    }

    window.close();
    useEffect(() => {
        root.style.display = 'block';
    }, []);
    return <NoMatch />;
}
