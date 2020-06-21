import React, { useLayoutEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Main from '../Main/main';
import LoadingScreen from '../Loading/loading';

export default function DiscordLoginCallback(): JSX.Element {
    const location = useLocation();
    const history = useHistory();

    useLayoutEffect(() => {
        const params = new URLSearchParams(location.search);
        const res = {
            code: params.get('code'),
            error: params.get('error'),
            errorDesc: params.get('error_description'),
        };

        if (window.opener && window.name === 'Discord Login') {
            window.opener.dispatchEvent(
                new CustomEvent('discord_login_callback', {
                    detail: res,
                })
            );
            window.close();
        } else {
            history.push('/404');
        }
    });
    return (
        <Main title='Loading...'>
            <LoadingScreen />
        </Main>
    );
}
