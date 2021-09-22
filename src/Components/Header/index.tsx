import React, { useState, useEffect, useContext } from 'react';
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
import { popupContext } from 'Components/PopUp';
import { AuthActions } from 'Redux/authReducer';
import {
    ConfirmedSubmitNotification,
    LoginPopup,
} from 'Components/PopUp/components';

function ProfilePopup(): JSX.Element {
    const dispatch = useDispatch();
    const { auth, userData, error } = useRootStateSelector('authReducer');
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [typingUsername, setTypingUsername] = useState<number>(0);
    const [accountLinked, setAccountLinked] = useState(
        Object.keys(userData ? userData['linked-account'] : [''])
    );

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (auth && auth !== 'awaiting auth state') {
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

    if (!auth || auth === 'awaiting auth state') {
        return <></>;
    }

    return (
        <>
            <h3>Profile</h3>
            <span>
                You can update your Displayed Name and link other account to
                your profile here. Keep in mind that the accounts should be
                associated with the same email address in this account.
            </span>
            <div className='profile-and-name'>
                <figure>
                    <img src={auth.photoURL || ''} alt='Profile pic' />
                </figure>
                <label htmlFor='display-name'>
                    <span>Update your display name:</span>
                    <input
                        defaultValue={auth.displayName || ''}
                        onChange={(evt): void => {
                            evt.persist();
                            clearTimeout(typingUsername);
                            setTypingUsername(
                                window.setTimeout(async (): Promise<void> => {
                                    setUpdatingProfile(true);
                                    try {
                                        await auth.updateProfile({
                                            displayName: evt.target.value,
                                        });
                                        dispatch({
                                            type: AuthActions.AuthSuccessAction,
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
                                        .ref(`Users/${auth.uid}/avatar`);
                                    await pfpRef.put(evt.target.files[0], {
                                        cacheControl: 'public,max-age=31536000',
                                    });
                                    const url = await pfpRef.getDownloadURL();
                                    await auth.updateProfile({
                                        photoURL: url,
                                    });
                                }
                                dispatch({
                                    type: AuthActions.AuthSuccessAction,
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
                        onClick={(): void => loginDiscord(dispatch, true)}
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
                <FontAwesomeIcon icon={faSpinner} className='loading' />
            ) : (
                error && <span className='error'>{String(error)}</span>
            )}
        </>
    );
}

export default function Header(): JSX.Element {
    const history = useHistory();
    const { auth, userData } = useRootStateSelector('authReducer');
    const { openPopup, closePopup } = useContext(popupContext);
    const [scrolled, setScrolled] = useState(true);
    const [menuToggle, setMenuToggle] = useState(false);
    const [resizing, setResizing] = useState(false);

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

    useEffect(() => {
        if (auth && auth !== 'awaiting auth state') closePopup();
    }, [auth]);

    return (
        <header className={scrolled ? 'scroll' : ''}>
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
                                    onClick={(): void =>
                                        openPopup(<ProfilePopup />)
                                    }
                                >
                                    <FontAwesomeIcon icon={faUserEdit} />
                                    <span className='text'>Edit Profile</span>
                                </button>
                                <button
                                    aria-label='logout'
                                    type='button'
                                    onClick={(): void =>
                                        openPopup(
                                            <ConfirmedSubmitNotification
                                                promptText='Are you sure you want to logout?'
                                                confirmHandler={logout}
                                            />
                                        )
                                    }
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
                                    onClick={(): void =>
                                        openPopup(<LoginPopup />)
                                    }
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
