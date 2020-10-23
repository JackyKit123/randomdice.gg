import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import { RootState } from '../../../Misc/Redux Storage/store';
import './guide.less';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { fetchWiki } from '../../../Misc/Firebase/fetchData';

export default function BasicGuideMenu(): JSX.Element {
    const dispatch = useDispatch();
    const { wiki, error } = useSelector(
        (state: RootState) => state.fetchWikiReducer
    );

    let jsx;
    if (wiki?.tips) {
        jsx = (
            <>
                <p>
                    Here you will find the articles for some tips and trick in
                    this game.
                </p>
                <section>
                    {['Beginners', 'Intermediate', 'Advanced'].map(level => (
                        <Fragment key={level}>
                            <h3>{level} Guide</h3>
                            <ul>
                                {wiki.tips
                                    .filter(tip => tip.level === level)
                                    .map(tip => (
                                        <li key={tip.id}>
                                            <Link
                                                to={`/wiki/guide/${tip.title}`}
                                            >
                                                {tip.title}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </Fragment>
                    ))}
                </section>
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    fetchWiki(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title='Basic Guides and Tips' className='wiki guide'>
            <Helmet>
                <title>Random Dice Wiki</title>
            </Helmet>
            {jsx}
        </Main>
    );
}
