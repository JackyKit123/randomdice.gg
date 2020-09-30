import React, { Fragment } from 'react';
import './bot.less';
import Main from '../../Components/Main/main';

export default function discordBot(): JSX.Element {
    const commandList = [
        {
            category: 'Sync Data (require `MANAGE_CHANNEL` permission)',
            commands: [
                {
                    command: '.gg register <guide|news|list> #channel',
                    description:
                        'Register channel to sync data from the website, the channel should be a standalone channel, do not sync multiple categories of data into the same channel. ".gg register list" will return a list of registered channels.',
                },
                {
                    command: '.gg unregister <guide|news>',
                    description:
                        'Unregister the channel registered from `.gg register`',
                },
                {
                    command: '.gg postnow <guide|news>',
                    description:
                        'Force syncing data from the website into your registered channels',
                },
            ],
        },
        {
            category: 'Information',
            commands: [
                {
                    command: '.gg dice <Dice Name> [--class=?] [--level=?]',
                    description:
                        'Show information about the dice, alias for arguments `-c=?` `-l=?`',
                },
                {
                    command: '.gg deck <PvP|Co-op|Crew> [page#]',
                    description:
                        'Show the deck list, optional parameter to select the initial page',
                },
                {
                    command: '.gg guide <Guide Name|list>',
                    description:
                        'Show the detail guide for a certain guide. ".gg register list" will return a list of guides\' name.',
                },
                {
                    command: '.gg boss <Boss Name>',
                    description: 'Show information about the boss.',
                },
                {
                    command: '.gg randomtip',
                    description: 'Show you a random tip',
                },
            ],
        },
        {
            category: 'Other Commands',
            commands: [
                {
                    command: '.gg ping',
                    description:
                        'Ping the bot (only available in DM or as `ADMINISTRATOR`)',
                },
                {
                    command: '.gg website [/path]',
                    description: 'Send link to website, with optional path',
                },
                {
                    command: '.gg app',
                    description: 'Send link to Google Play App',
                },
                {
                    command: '.gg contact',
                    description:
                        'Send contact information for the developer of this bot or the community website.',
                },
                {
                    command: '.gg support',
                    description:
                        'Send information about ways to support randomdice.gg',
                },
            ],
        },
    ];

    return (
        <Main title='Discord Bot' className='discord-bot'>
            <h3>randomdice.gg Discord Bot</h3>
            <figure>
                <img
                    src='https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FBot%20Banner.png?alt=media&token=65c62668-2925-46ed-b4b7-c426c1a04a14'
                    alt='discord bot banner'
                />
            </figure>
            <p>
                Introducing a discord Bot that can sync the website data onto
                your discord server!
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
                reference, execute <span className='command'>.gg help</span> in
                discord for the latest and accurate version.
            </p>
            {commandList.map(categories => (
                <Fragment key={categories.category}>
                    <h4>{categories.category}</h4>
                    <ul className='command-list'>
                        {categories.commands.map(command => (
                            <li key={command.command}>
                                <span className='command'>
                                    {command.command}
                                </span>
                                <span className='description'>
                                    {command.description}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Fragment>
            ))}
        </Main>
    );
}
