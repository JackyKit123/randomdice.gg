import React from 'react';
import { useHistory } from 'react-router-dom';
import Main from '../../Components/Main/main';
import Dice from '../../Components/Dice/dice';
import Effect from './effect.webp';
import './nomatch.less';

export default function NoMatch(): JSX.Element {
    const history = useHistory();
    return (
        <>
            <Main
                title='404 Not found'
                className='NoMatch'
                content={
                    <>
                        <img
                            id='assassin-cross'
                            alt='assassinate effect'
                            src={Effect}
                        />
                        <Dice dice='Assassin' />
                        <h3>This page is assassinated.</h3>
                        <div>
                            <button type='button' onClick={history.goBack}>
                                Click Here to return to the previous page.
                            </button>
                        </div>
                        or
                        <div>
                            <button
                                type='button'
                                onClick={(): void => history.push('/')}
                            >
                                Click Here to return to Homepage.
                            </button>
                        </div>
                    </>
                }
            />
        </>
    );
}
