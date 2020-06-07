import React, { useState, useEffect } from 'react';
import loading from './loading.gif';
import './loading.less';

export default function Loading(): JSX.Element {
    const [loadingTime, setLoadingTime] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingTime(loadingTime + 10);
        }, 10000);
        return (): void => window.clearTimeout(timer);
    }, []);
    return (
        <>
            <h3>Loading...</h3>
            <img alt='Loading' className='loading' src={loading} />
            {loadingTime >= 10 ? (
                <h4 className='warning'>
                    You seem to be stuck loading.{' '}
                    <button
                        type='button'
                        onClick={(): void => window.location.reload()}
                    >
                        Click Here to refresh
                    </button>
                    If the problem persists, please report it.
                </h4>
            ) : null}
        </>
    );
}
