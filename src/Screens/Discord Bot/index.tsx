import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'Redux/store';
import { fetchDiscordCommands } from 'Firebase';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';
import './bot.less';
import Main from 'Components/Main';
import Error from 'Components/Error';
import LoadingScreen from 'Components/Loading';

export default function discordBot(): JSX.Element {
    const dispatch = useDispatch();
    const { commands, error } = useSelector(
        (state: RootState) => state.fetchDiscordBotCommandsReducer
    );

    let jsx;

    if (commands) {
        jsx = (
            <>
                <h3>randomdice.gg Discord Bot</h3>
                <figure>
                    <img
                        src='https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FBot%20Banner.png?alt=media&token=65c62668-2925-46ed-b4b7-c426c1a04a14'
                        alt='discord bot banner'
                    />
                </figure>
                <p>
                    Introducing a discord Bot that can sync the website data
                    onto your discord server!
                </p>
                <a
                    href='https://discord.com/oauth2/authorize?client_id=723917706641801316&permissions=355393&scope=bot'
                    rel='noopener noreferrer'
                    target='_blank'
                >
                    Click Here to Invite the bot to your server.
                </a>
                <hr className='divisor' />
                <h3>List of commands</h3>
                <p>
                    Here is a list of available commands. This is only for
                    reference, execute <span className='command'>.gg help</span>{' '}
                    in discord for the latest and accurate version.
                </p>
                {commands.map(categories => (
                    <Fragment key={categories.category}>
                        <h4>{categories.category}</h4>
                        <ul className='command-list'>
                            {categories.commands.map(command => (
                                <li key={command.command}>
                                    <span className='command'>
                                        {command.command}
                                    </span>
                                    <span className='description'>
                                        {command.description.replace(
                                            '<@!723917706641801316>',
                                            '@randomdice.gg'
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
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
                    fetchDiscordCommands(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }

    return (
        <Main title='Discord Bot' className='discord-bot'>
            {jsx}
        </Main>
    );
}
