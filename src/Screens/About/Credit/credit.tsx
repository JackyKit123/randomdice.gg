import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import './credit.less';
import { RootState } from '../../../Misc/Redux Storage/store';
import { fetchCredit } from '../../../Misc/Firebase/fetchData';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';

export default function Credit(): JSX.Element {
    const dispatch = useDispatch();
    const { credit, error } = useSelector(
        (state: RootState) => state.fetchCreditReducer
    );

    let jsx;
    if (credit) {
        jsx = (
            <>
                {credit.map(crd => (
                    <Fragment key={crd.id}>
                        <h3>{crd.category}</h3>
                        {crd.people.map(person => (
                            <div key={person.id}>
                                <span>
                                    {person.role} : {person.name}
                                </span>
                                <figure>
                                    <img src={person.img} alt={person.name} />
                                </figure>
                            </div>
                        ))}
                    </Fragment>
                ))}
                <h3>
                    <Link to='/about/patreon'>Patreon Supporters</Link>
                </h3>
                <h3>The Community</h3>
                <div>
                    <p>Last but not least, everyone of you.</p>
                    <p>
                        Anyone is welcome to join us into making this website
                        better, if you want to contribute content, or if you are
                        a web developer, and you want to help us, please do not
                        hesitate to contact JackyKit.
                    </p>
                </div>
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    fetchCredit(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title='Credit' className='credit' disallowAd>
            {jsx}
        </Main>
    );
}
