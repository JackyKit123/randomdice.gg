import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';
import './header-footer.less';
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
import Menu from '../../Components/Menu/menu';
import * as auth from '../../Misc/Firebase/auth';
import { menu } from '../../Misc/menuConfig';
import { RootState } from '../../Misc/Redux Storage/store';
import PopUp from '../../Components/PopUp Overlay/popup';
import {
    OPEN_POPUP,
    CLOSE_POPUP,
} from '../../Misc/Redux Storage/PopUp Overlay/types';
import { ERROR } from '../../Misc/Redux Storage/Firebase Auth/types';

export default function Header(): JSX.Element {
    const dispatch = useDispatch();
    const history = useHistory();
    const selector = useSelector((state: RootState) => state);
    const { user, error } = selector.authReducer;
    const { data } = selector.fetchUserDataReducer;
    const [scrolled, setScrolled] = useState(true);
    const [menuToggle, setMenuToggle] = useState(false);
    const [typingUsername, setTypingUsername] = useState<number>(0);
    const [resizing, setResizing] = useState(false);
    const [accountLinked, setAccountLinked] = useState(
        Object.keys(data ? data['linked-account'] : [''])
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
        if (user && user !== 'awaiting auth state') {
            dispatch({ type: CLOSE_POPUP });
            const userData = firebase.database().ref(`users/${user.uid}`);
            const listener = userData.on('value', snapshot => {
                const val = snapshot.val();
                if (val) {
                    setAccountLinked(Object.keys(val['linked-account']));
                }
            });
            return (): void => userData.off('value', listener);
        }
    }, [user]);

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
                        onClick={(): void => auth.discord(dispatch)}
                    >
                        <FontAwesomeIcon icon={faDiscord} />
                    </button>
                    <button
                        aria-label='login with patreon'
                        className='patreon'
                        type='button'
                        onClick={(): Promise<void> => auth.patreon(dispatch)}
                    >
                        <FontAwesomeIcon icon={faPatreon} />
                    </button>
                </div>
                {error === 'Loading' ? (
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
                    <span className='error'>{error}</span>
                )}
            </PopUp>
            {user && user !== 'awaiting auth state' ? (
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
                                    src={user.photoURL || ''}
                                    alt='Profile pic'
                                />
                            </figure>
                            <label htmlFor='display-name'>
                                <span>Update your display name:</span>
                                <input
                                    defaultValue={user.displayName || ''}
                                    onChange={(evt): void => {
                                        evt.persist();
                                        clearTimeout(typingUsername);
                                        setTypingUsername(
                                            window.setTimeout(async (): Promise<
                                                void
                                            > => {
                                                dispatch({
                                                    type: ERROR,
                                                    payload: 'Loading',
                                                });
                                                try {
                                                    await user.updateProfile({
                                                        displayName:
                                                            evt.target.value,
                                                    });
                                                    dispatch({
                                                        type: ERROR,
                                                        payload: undefined,
                                                    });
                                                } catch (err) {
                                                    dispatch({
                                                        type: ERROR,
                                                        payload: err.message,
                                                    });
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
                                        dispatch({
                                            type: ERROR,
                                            payload: 'Loading',
                                        });
                                        try {
                                            if (evt.target.files) {
                                                const pfpRef = firebase
                                                    .storage()
                                                    .ref(
                                                        `Users/${user.uid}/avatar`
                                                    );
                                                await pfpRef.put(
                                                    evt.target.files[0],
                                                    {
                                                        cacheControl:
                                                            'public,max-age=31536000',
                                                    }
                                                );
                                                const url = await pfpRef.getDownloadURL();
                                                await user.updateProfile({
                                                    photoURL: url,
                                                });
                                            }
                                            dispatch({
                                                type: ERROR,
                                                payload: undefined,
                                            });
                                        } catch (err) {
                                            dispatch({
                                                type: ERROR,
                                                payload: err.message,
                                            });
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
                                        auth.discord(dispatch, true)
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
                                        auth.patreon(dispatch, true)
                                    }
                                >
                                    <FontAwesomeIcon icon={faPatreon} />
                                </button>
                            ) : null}
                        </div>
                        {error === 'Loading' ? (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className='loading'
                            />
                        ) : (
                            <span className='error'>{error}</span>
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
                                auth.logout();
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
                        {// eslint-disable-next-line no-nested-ternary
                        user && user !== 'awaiting auth state' ? (
                            <>
                                {data?.editor ? (
                                    <span className='dashboard'>
                                        <Link to='/dashboard'>
                                            <FontAwesomeIcon icon={faEdit} />{' '}
                                            <span className='text'>
                                                Dashboard
                                            </span>
                                        </Link>
                                    </span>
                                ) : null}
                                {user.photoURL ? (
                                    <figure>
                                        <img
                                            src={user.photoURL}
                                            alt='profile pic'
                                        />
                                    </figure>
                                ) : null}
                                <span className='user'>
                                    Welcome, {user.displayName}!
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
                        ) : user === 'awaiting auth state' ? null : (
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
                                <FontAwesomeIcon icon={faUserCircle} /> LOGIN
                            </button>
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
