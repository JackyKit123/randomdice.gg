import Loading from 'Components/Loading';
import Main from 'Components/Main';
import Error from 'Components/Error';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

interface Props {
    isContentReady?: boolean;
    error?: unknown;
    retryFn?: (dispatch: ReturnType<typeof useDispatch>) => void;
    title: string;
    description?: string;
    className?: string;
    children: React.ReactNode;
    disallowAd?: boolean;
}

export default function PageWrapper({
    title,
    description,
    isContentReady = true,
    error,
    retryFn = (): void => window.location.reload(),
    className,
    children,
    disallowAd,
}: Props): JSX.Element {
    const location = useLocation();
    const dispatch = useDispatch();

    let renderElement: React.ReactNode;
    if (error) {
        renderElement = (
            <Error error={error} retryFn={(): void => retryFn(dispatch)} />
        );
    } else if (isContentReady) {
        renderElement = children;
    } else {
        renderElement = <Loading />;
    }

    return (
        <Main title={title} className={className} disallowAd={disallowAd}>
            <Helmet>
                <title>Random Dice | {title}</title>
                <meta property='og:title' content='Random Dice Arena Draft' />
                <meta name='og:description' content={description} />
                <meta name='description' content={description} />
                <meta name='robots' content='follow' />
                <meta
                    property='og:url'
                    content={`https://randomdice.gg${location.pathname}`}
                />
                <link
                    rel='canonical'
                    href={`https://randomdice.gg${location.pathname}`}
                />
            </Helmet>
            {renderElement}
        </Main>
    );
}
