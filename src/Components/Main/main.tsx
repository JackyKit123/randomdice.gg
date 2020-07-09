import React, { useState, useEffect, ReactNode } from 'react';
import AdUnit from '../Ad Unit/ad';
import './main.less';

export default function Main(props: {
    title: string;
    className?: string;
    children: ReactNode;
}): JSX.Element {
    const { title, className, children } = props;
    const [online, setOnline] = useState(navigator.onLine);

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
                <AdUnit
                    provider='Google'
                    unitId='3944820222'
                    dimension='mobile'
                    style={{ display: 'block' }}
                />
                <div className='content'>{children}</div>
            </div>
        </main>
    );
}
