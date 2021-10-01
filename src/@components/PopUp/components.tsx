import { faDiscord, faPatreon } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loginDiscord, loginPatreon } from 'misc/firebase/auth';
import React, { ReactNode, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import useRootStateSelector from '@redux';
import { popupContext } from '.';

interface ConfirmPromptProps {
  promptText: string;
  children?: ReactNode;
  confirmHandler: () => Promise<void> | void;
}

export function ConfirmedSubmitNotification({
  promptText,
  children,
  confirmHandler,
}: ConfirmPromptProps): JSX.Element {
  const { closePopup } = useContext(popupContext);

  return (
    <>
      <h3>Please Confirm</h3>
      <p>{promptText}</p>
      {children}
      <button
        type='button'
        className='confirm'
        onClick={async (): Promise<void> => {
          await confirmHandler();
          closePopup();
        }}
      >
        Yes
      </button>
    </>
  );
}

export function LoginPopup(): JSX.Element {
  const dispatch = useDispatch();
  const { auth, error } = useRootStateSelector('authReducer');

  return (
    <>
      <h3>Login</h3>
      <span>
        Only Discord Login and Patreon Login are supported at the current
        moment. You may not need to login to use this website. There is no
        hidden content requiring a login.
      </span>
      <span>
        By sining up, you agree to our{' '}
        <Link to='/about/terms' target='_blank'>
          Terms and Condition
        </Link>{' '}
        and{' '}
        <Link to='/about/privacy' target='_blank'>
          Privacy Policy
        </Link>
        .
      </span>
      <div className='oauth'>
        <button
          aria-label='login with discord'
          className='discord'
          type='button'
          onClick={(): void => loginDiscord(dispatch)}
        >
          <FontAwesomeIcon icon={faDiscord} />
        </button>
        <button
          aria-label='login with patreon'
          className='patreon'
          type='button'
          onClick={(): Promise<void> => loginPatreon(dispatch)}
        >
          <FontAwesomeIcon icon={faPatreon} />
        </button>
      </div>
      {auth === 'awaiting auth state' ? (
        <div className='loading-animation'>
          <img
            src='https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/Dice%20Images%2FTime?alt=media&token=5c459fc5-4059-4099-b93d-f4bc86debf6d'
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
      ) : (
        error && <span className='error'>{String(error)}</span>
      )}
    </>
  );
}
