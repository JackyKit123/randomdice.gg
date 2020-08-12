import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
            <Helmet>
                <title>Loading...</title>
            </Helmet>
            <h3>Loading...</h3>
            <div className='loading-animation'>
                <img
                    src='https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/Dice%20Images%2FTime.png?alt=media&token=863fd294-d0b7-4af1-bcca-797ae50dcca2'
                    alt='Time Dice'
                />
                <img
                    src='https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FClock.png?alt=media&token=ebf5ec16-192d-4bde-b86c-c99d9f24ed3d'
                    alt='Clock'
                />
                <img
                    src='https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FClock%20Hand.png?alt=media&token=3f46eced-baf8-40a5-94a4-224e08a170d0'
                    alt='ClockHand'
                />
            </div>
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
