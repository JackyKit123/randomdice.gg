import React, { useState, useEffect } from 'react';
import loading from './loading.gif';
import './loading.less';

export default function Loading(props: {
    fnDispatch?: () => void;
}): JSX.Element {
    const { fnDispatch } = props;
    const [loadingTime, setLoadingTime] = useState(0);
    useEffect(() => {
        if (fnDispatch) {
            fnDispatch();
        }
        const timer = setTimeout(() => {
            setLoadingTime(loadingTime + 1);
        }, 1000);
        return (): void => window.clearTimeout(timer);
    }, [loadingTime]);
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
