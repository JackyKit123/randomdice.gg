import React, { useState, useEffect, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import GoogleAds from '../Ad Unit/ad';
import './main.less';

export default function Main(props: {
    title: string;
    className?: string;
    children: ReactNode;
}): JSX.Element {
    const { title, className, children } = props;
    const [online, setOnline] = useState(navigator.onLine);
    const location = useLocation();

    useEffect(() => {
        const updateOnlineState = (): void => setOnline(navigator.onLine);
        window.addEventListener('online', updateOnlineState);
        window.addEventListener('offline', updateOnlineState);
        return (): void => {
            window.removeEventListener('online', updateOnlineState);
            window.removeEventListener('offline', updateOnlineState);
        };
    }, []);

    return (
        <main>
            <Helmet>
                <meta
                    property='og:url'
                    content={`https://${process.env.REACT_APP_DOMAIN}${location.pathname}`}
                />
                <link
                    rel='canonical'
                    href={`https://${process.env.REACT_APP_DOMAIN}${location.pathname}`}
                />
            </Helmet>
            <div className={`banner ${!online ? 'offline' : ''}`}>
                <div className='title-container'>
                    <h2 className='title'>{title}</h2>
                </div>
                {!online ? (
                    <span>
                        You are currently offline, please check your connection,
                        content of this website will continue to be served.
                    </span>
                ) : null}
            </div>
            <div className={`main ${className}`}>
                <GoogleAds unitId='3944820222' />
                <div className='content'>{children}</div>
            </div>
        </main>
    );
}
