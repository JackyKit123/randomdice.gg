import * as React from 'react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Main from '../../../Components/Main/main';
import Error from '../../../Components/Error/error';
import LoadingScreen from '../../../Components/Loading/loading';
import ShareButton from '../../../Components/Social Media Share/share';
import ConvertEmbed from '../../../Components/Youtube Embed/embed';
import { fetchWiki } from '../../../Misc/Firebase/fetchData';
import replaceAnchorWithHistory from '../../../Misc/HTMLAnchorNavigation';
import { CLEAR_ERRORS } from '../../../Misc/Redux Storage/Fetch Firebase/types';
import { RootState } from '../../../Misc/Redux Storage/store';

export default function BasicGuide(): JSX.Element {
    const dispatch = useDispatch();
    const history = useHistory();
    const { title } = useParams<{ title: string }>();
    const { wiki, error } = useSelector(
        (state: RootState) => state.fetchWikiReducer
    );
    useEffect(() => {
        return replaceAnchorWithHistory(history);
    }, []);

    let jsx;
    if (wiki?.tips) {
        const guide = wiki.tips.find(
            tip => tip.title.toLowerCase() === title.toLowerCase()
        );
        if (!guide) {
            history.push('/wiki/guide');
        } else {
            jsx = (
                <>
                    <h3>{guide.title}</h3>
                    <ConvertEmbed htmlString={guide.content} />
                    <hr className='divisor' />
                    <ShareButton name={`Random Dice Guide (${guide.title})`} />
                    <button
                        type='button'
                        className='read-more'
                        onClick={(): void => history.push('/wiki/guide')}
                    >
                        Read More Guides
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
