import React from 'react';

export default function Error({
  error,
  retryFn = (): void => window.location.reload(),
}: {
  error: unknown;
  retryFn?: () => void;
}): JSX.Element {
  const errorMessage = (error as Error)?.message;
  return (
    <>
      <h3 className='error'>Oops! Something went wrong.</h3>
      {errorMessage && <h4 className='error error-message'>{errorMessage}</h4>}
      <button type='button' className='error-retry' onClick={retryFn}>
        Click Here to try again
      </button>
    </>
  );
}
