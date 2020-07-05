import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchPatreon } from '../../../Misc/Firebase/fetchData';
import './patreon.less';
import { RootState } from '../../../Misc/Redux Storage/store';

export default function PatreonProfile(): JSX.Element {
    const history = useHistory();
    const { name } = useParams();
    const dispatch = useDispatch();
    const { list, error } = useSelector(
        (state: RootState) => state.fetchPatreonListReducer
    );

    let jsx;
    if (list) {
        const patreon = list.find(patron => patron.name === name);
        if (!patreon) {
            history.push('/about/patreon');
        } else {
            jsx = (
                <>
                    <h3>Message from {patreon.name}</h3>
                    <figure className={patreon.img ? '' : 'no-icon'}>
                        <img
                            src={patreon.img}
                            alt={`Icon of ${patreon.name}`}
                        />
                    </figure>
                    <div className='message'>
                        {patreon[patreon.id]?.message ? (
                            ReactHtmlParser(
                                sanitize(patreon[patreon.id].message)
                            )
                        ) : (
                            <p>
                                {patreon.name} does not have a message to share
                                yet.
                            </p>
                        )}
                    </div>
                    <button
                        type='button'
                        onClick={(): void => history.push('/about/patreon')}
                    >
                        Back to Patreon Page
                    </button>
                </>
            );
        }
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
        <Main title={`Patreon Supporter ${name}`} className='patreon-profile'>
            {jsx}
        </Main>
    );
}
