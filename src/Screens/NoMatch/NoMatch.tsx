import React from 'react';
import Main from '../../Components/Main/main';

export default function NoMatch(): JSX.Element {
    return (
        <Main
            title='404 Not found'
            content={
                <h2>
                    This page is assassinated by assassin dice, Please return to
                    the previous page.
                </h2>
            }
        />
    );
}
