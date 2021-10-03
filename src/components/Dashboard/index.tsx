import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import firebase, { FirebaseError } from 'firebase/app';
import { useLocation, Link } from 'react-router-dom';
import { logout } from 'misc/firebase/auth';
import Main from 'components/Main';
import LoadingScreen from 'components/Loading';
import NoMatch from 'pages/NoMatch';
import { menu } from 'router';
import useRootStateSelector from '@redux';
import { popupContext } from 'components/PopUp';
import { LoginPopup } from 'components/PopUp/components';

interface Props {
  className?: string;
  children?: ReactNode;
  isDataReady?: boolean;
}

export default function Dashboard({
  className,
  children,
  isDataReady = true,
}: Props): JSX.Element {
  const location = useLocation();
  const { openPopup } = useContext(popupContext);
  const database = firebase.database();
  const { auth, userData, error } = useRootStateSelector('authReducer');
  const [authorized, setAuthorized] = useState<'loading' | boolean>('loading');
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const checkSessionValid = async (): Promise<void> => {
      try {
        setSessionExpired(false);
        await database.ref('/auth_test').set(0);
      } catch (err) {
        setSessionExpired((err as FirebaseError).code === 'PERMISSION_DENIED');
      }
    };
    checkSessionValid();
  }, [children, authorized]);

  useEffect(() => {
    if (auth !== 'awaiting auth state') {
      if (auth === null) {
        setAuthorized(false);
      } else if (userData) {
        if (userData.editor) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      }
    }
  }, [auth, userData]);

  if (auth === 'awaiting auth state') {
    return (
      <Main title='Loading...'>
        <LoadingScreen />
      </Main>
    );
  }
  if (!authorized || error) {
    return <NoMatch title='401 Unauthorized' />;
  }
  return (
    <main>
      <Helmet>
        <title>Dashboard</title>
        <link
          rel='canonical'
          href={`https://randomdice.gg${location.pathname}`}
        />
        <meta name='robots' content='noindex' />
      </Helmet>
      <div className={`dashboard ${className}`}>
        <div className='content'>
          {sessionExpired ? (
            <>
              <h3 className='session-expired-warning'>
                Your login session has expired. Edits will not be saved, relog
                to continue editing.
              </h3>
              <button
                type='button'
                onClick={async (): Promise<void> => {
                  await logout();
                  openPopup(<LoginPopup />);
                }}
              >
                Relog Now
              </button>
              <hr className='divisor' />
            </>
          ) : null}
          <nav className='menu'>
            {menu
              .find(item => item.name === 'Dashboard')
              ?.childNode?.map(item =>
                item.name ? (
                  <Link to={item.path || ''} key={`${item.name}${item.path}`}>
                    {item.name}
                  </Link>
                ) : null
              )}
          </nav>
          <hr className='divisor' />
          {!isDataReady ? (
            <LoadingScreen />
          ) : (
            children || (
              <>
                <h3>Dashboard</h3>
                <p>
                  This is the homepage of the dashboard, click on any item above
                  in the navigation menu to begin editing.
                </p>
              </>
            )
          )}
        </div>
      </div>
    </main>
  );
}

export { default as TextInput } from './Input/TextInput';
export { default as Dropdown } from './Input/Dropdown';
export { default as NumberInput } from './Input/NumberInput';
export { default as SubmitButton } from './Input/SubmitButton';
export { default as Image } from './Input/Image';
export { default as Selector } from './Selector';
