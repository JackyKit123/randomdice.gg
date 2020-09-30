import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { faPatreon } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import './patreon.less';
import { RootState } from '../../../Misc/Redux Storage/store';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchPatreon } from '../../../Misc/Firebase/fetchData';

export default function PatreonIntro(): JSX.Element {
    const dispatch = useDispatch();
    const { list, error } = useSelector(
        (state: RootState) => state.fetchPatreonListReducer
    );
    let jsx;
    if (list) {
        jsx = (
            <>
                <Helmet>
                    <meta name='robots' content='follow' />
                </Helmet>
                <div className='patreon-icon'>
                    <div className='container'>
                        <FontAwesomeIcon icon={faPatreon} />
                    </div>
                </div>
                <p>
                    This website is served for free to the community but it does
                    not run for free. If you appreciate what we are doing, feel
                    free to drop a support. In return, you can enjoy benefits
                    like ad free browsing. Or a dedicated page for you to leave
                    your message to the community.
                </p>
                <p>
                    You can become a patreon at{' '}
                    <a
                        href='https://www.patreon.com/RandomDiceCommunityWebsite'
                        target='_blank'
                        rel='noreferrer noopener'
                    >
                        https://www.patreon.com/RandomDiceCommunityWebsite
                    </a>
                    .
                </p>
                <hr className='divisor' />
                {[3, 2, 1].map(tier => (
                    <Fragment key={tier}>
                        <h3>Tier {tier} Supporters</h3>
                        {list
                            .filter(patron => patron.tier === tier)
                            .map(patron => (
                                <div key={patron.id}>
                                    <span>{patron.name}</span>
                                    <figure
                                        className={patron.img ? '' : 'no-icon'}
                                    >
                                        <img
                                            src={patron.img}
                                            alt={`icon of ${patron.name}`}
                                        />
                                    </figure>
                                    {tier >= 2 ? (
                                        <div>
                                            <Link
                                                to={`/about/patreon/${patron.name}`}
                                            >
                                                Message from {patron.name}
                                            </Link>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                    </Fragment>
                ))}
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    fetchPatreon(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title='Patreon' className='patreon' disallowAd>
            {jsx}
        </Main>
    );
}
