import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faTimes,
    faUserCircle,
    faSignOutAlt,
    faUserEdit,
    faEdit,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faPatreon } from '@fortawesome/free-brands-svg-icons';
import Menu from 'Components/Menu';
import { loginDiscord, loginPatreon, logout } from 'Firebase/auth';
import { menu } from 'Router';
import useRootStateSelector from 'Redux';
import PopUp from 'Components/PopUp';
import { OPEN_POPUP, CLOSE_POPUP } from 'Redux/PopUp Overlay/types';
import { AuthActions } from 'Redux/authReducer';

export default function Header(): JSX.Element {
    const dispatch = useDispatch();
    const history = useHistory();
    const { auth, userData, error } = useRootStateSelector('authReducer');
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [scrolled, setScrolled] = useState(true);
    const [menuToggle, setMenuToggle] = useState(false);
    const [typingUsername, setTypingUsername] = useState<number>(0);
    const [resizing, setResizing] = useState(false);
    const [accountLinked, setAccountLinked] = useState(
        Object.keys(userData ? userData['linked-account'] : [''])
    );

    useEffect(() => {
        const unlisten = history.listen(() => setMenuToggle(false));
        function scrollHandler(): void {
            if (
                document.body.clientHeight -
                    window.innerHeight -
                    window.scrollY >
                    120 &&
                window.scrollY > 0
            ) {
                setScrolled(true);
            } else if (window.scrollY === 0) setScrolled(false);
        }
        let timeout = 0;
        function resizeHandler(): void {
            clearTimeout(timeout);
            setResizing(true);
            timeout = window.setTimeout((): void => setResizing(false), 400);
        }

        window.addEventListener('scroll', scrollHandler);
        window.addEventListener('resize', resizeHandler);
        return (): void => {
            unlisten();
            window.removeEventListener('resize', resizeHandler);
            window.removeEventListener('scroll', scrollHandler);
        };
    }, []);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (auth && auth !== 'awaiting auth state') {
            dispatch({ type: CLOSE_POPUP });
            const userDataRef = firebase.database().ref(`users/${auth.uid}`);
            const listener = userDataRef.on('value', snapshot => {
                const val = snapshot.val();
                if (val) {
                    setAccountLinked(Object.keys(val['linked-account']));
                }
            });
            return (): void => userDataRef.off('value', listener);
        }
    }, [auth]);

    return (
        <header className={scrolled ? 'scroll' : ''}>
            <PopUp popUpTarget='login'>
                <h3>Login</h3>
                <span>
                    Only Discord Login and Patreon Login are supported at the
                    current moment. You may not need to login to use this
                    website. There is no hidden content requiring a login.
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
            </PopUp>
            {auth && auth !== 'awaiting auth state' ? (
                <>
                    <PopUp popUpTarget='profile'>
                        <h3>Profile</h3>
                        <span>
                            You can update your Displayed Name and link other
                            account to your profile here. Keep in mind that the
                            accounts should be associated with the same email
                            address in this account.
                        </span>
                        <div className='profile-and-name'>
                            <figure>
                                <img
                                    src={auth.photoURL || ''}
                                    alt='Profile pic'
                                />
                            </figure>
                            <label htmlFor='display-name'>
                                <span>Update your display name:</span>
                                <input
                                    defaultValue={auth.displayName || ''}
                                    onChange={(evt): void => {
                                        evt.persist();
                                        clearTimeout(typingUsername);
                                        setTypingUsername(
                                            window.setTimeout(async (): Promise<
                                                void
                                            > => {
                                                setUpdatingProfile(true);
                                                try {
                                                    await auth.updateProfile({
                                                        displayName:
                                                            evt.target.value,
                                                    });
                                                    dispatch({
                                                        type:
                                                            AuthActions.AuthSuccessAction,
                                                        payload: {
                                                            auth,
                                                            userData,
                                                        },
                                                    });
                                                } catch (err) {
                                                    dispatch({
                                                        type:
                                                            AuthActions.AuthError,
                                                        payload: {
                                                            error: err,
                                                        },
                                                    });
                                                } finally {
                                                    setUpdatingProfile(false);
                                                }
                                            }, 500)
                                        );
                                    }}
                                />
                            </label>
                            <label htmlFor='profile-pic'>
                                <span>Update your profile picture:</span>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={async (evt): Promise<void> => {
                                        setUpdatingProfile(true);
                                        try {
                                            if (evt.target.files) {
                                                const pfpRef = firebase
                                                    .storage()
                                                    .ref(
                                                        `Users/${auth.uid}/avatar`
                                                    );
                                                await pfpRef.put(
                                                    evt.target.files[0],
                                                    {
                                                        cacheControl:
                                                            'public,max-age=31536000',
                                                    }
                                                );
                                                const url = await pfpRef.getDownloadURL();
                                                await auth.updateProfile({
                                                    photoURL: url,
                                                });
                                            }
                                            dispatch({
                                                type:
                                                    AuthActions.AuthSuccessAction,
                                                payload: {
                                                    auth,
                                                    userData,
                                                },
                                            });
                                        } catch (err) {
                                            dispatch({
                                                type: AuthActions.AuthError,
                                                payload: {
                                                    error: err,
                                                },
                                            });
                                        } finally {
                                            setUpdatingProfile(false);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <hr className='divisor' />
                        {accountLinked.length ? (
                            <>
                                <h3>Account Linked</h3>
                                <div className='oauth'>
                                    {accountLinked.includes('discord') ? (
                                        <span className='discord'>
                                            <FontAwesomeIcon icon={faDiscord} />
                                        </span>
                                    ) : null}
                                    {accountLinked.includes('patreon') ? (
                                        <span className='patreon'>
                                            <FontAwesomeIcon icon={faPatreon} />
                                        </span>
                                    ) : null}
                                </div>
                            </>
                        ) : null}
                        <hr className='divisor' />
                        <h3>Linkable Accounts</h3>
                        <div className='oauth'>
                            {!accountLinked.includes('discord') ? (
                                <button
                                    aria-label='link discord'
                                    className='discord'
                                    type='button'
                                    onClick={(): void =>
                                        loginDiscord(dispatch, true)
                                    }
                                >
                                    <FontAwesomeIcon icon={faDiscord} />
                                </button>
                            ) : null}
                            {!accountLinked.includes('patreon') ? (
                                <button
                                    aria-label='link patreon'
                                    className='patreon'
                                    type='button'
                                    onClick={(): Promise<void> =>
                                        loginPatreon(dispatch, true)
                                    }
                                >
                                    <FontAwesomeIcon icon={faPatreon} />
                                </button>
                            ) : null}
                        </div>
                        {updatingProfile ? (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className='loading'
                            />
                        ) : (
                            error && (
                                <span className='error'>{String(error)}</span>
                            )
                        )}
                    </PopUp>
                    <PopUp
                        popUpTarget='confirm-logout'
                        className='confirm-logout'
                    >
                        <h3>Please Confirm</h3>
                        <p>Are you sure you want to logout?</p>
                        <button
                            type='button'
                            className='confirm'
                            onClick={(): void => {
                                logout();
                                dispatch({ type: CLOSE_POPUP });
                            }}
                        >
                            Yes
                        </button>
                    </PopUp>
                </>
            ) : null}
            <div className='container'>
                <div className='topHeaderBar headerBar'>
                    <div className='container'>
                        {auth && auth !== 'awaiting auth state' ? (
                            <>
                                {userData?.editor ? (
                                    <span className='dashboard'>
                                        <Link to='/dashboard'>
                                            <FontAwesomeIcon icon={faEdit} />{' '}
                                            <span className='text'>
                                                Dashboard
                                            </span>
                                        </Link>
                                    </span>
                                ) : null}
                                {auth.photoURL ? (
                                    <figure>
                                        <img
                                            src={auth.photoURL}
                                            alt='profile pic'
                                        />
                                    </figure>
                                ) : null}
                                <span className='user'>
                                    Welcome, {auth.displayName}!
                                </span>
                                <button
                                    aria-label='edit profile'
                                    type='button'
                                    className='update'
                                    onClick={(): void => {
                                        dispatch({
                                            type: OPEN_POPUP,
                                            payload: 'profile',
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserEdit} />
                                    <span className='text'>Edit Profile</span>
                                </button>
                                <button
                                    aria-label='logout'
                                    type='button'
                                    className='logout'
                                    onClick={(): void => {
                                        dispatch({
                                            type: OPEN_POPUP,
                                            payload: 'confirm-logout',
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} />{' '}
                                    <span className='text'>LOGOUT</span>
                                </button>
                            </>
                        ) : (
                            auth === null && (
                                <button
                                    aria-label='login'
                                    type='button'
                                    className='login'
                                    onClick={(): void => {
                                        dispatch({
                                            type: OPEN_POPUP,
                                            payload: 'login',
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserCircle} />{' '}
                                    LOGIN
                                </button>
                            )
                        )}
                    </div>
                </div>
                <div className='lowHeaderBar headerBar'>
                    <div className='container'>
                        <Menu
                            menuList={menu}
                            className={`${menuToggle ? 'open' : ''} ${
                                resizing ? 'resizing' : ''
                            }`}
                        />
                        <button
                            aria-label='toggle mobile menu'
                            type='button'
                            className='toggleMenu'
                            onClick={(): void => setMenuToggle(!menuToggle)}
                        >
                            <FontAwesomeIcon
                                icon={menuToggle ? faTimes : faBars}
                            />
                        </button>
                    </div>
                </div>
            </div>
            <div className='header-placeholder' />
        </header>
    );
}
