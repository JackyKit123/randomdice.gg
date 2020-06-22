import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NoMatch from '../../Screens/NoMatch/NoMatch';

export default function DiscordLoginCallback(): JSX.Element {
    const root = document.getElementById('root') as HTMLDivElement;
    root.style.display = 'none';
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = {
        code: params.get('code'),
        error: params.get('error_description'),
    };
    localStorage.setItem('discord_oauth', JSON.stringify(query));
    window.close();
    useEffect(() => {
        root.style.display = 'block';
    });
    return <NoMatch />;
}
