import React from 'react';
import './error.less';

export default function Loading({
    error,
    retryFn,
}: {
    error: Error;
    retryFn: () => void;
}): JSX.Element {
    return (
        <>
            <h3 className='error'>Oops! Something went wrong.</h3>
            <h4 className='error error-message'>{error.message}</h4>
            <button type='button' className='error-retry' onClick={retryFn}>
                Click Here to try again
            </button>
        </>
    );
}
