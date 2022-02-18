[![randomdice.gg](https://raw.githubusercontent.com/JackyKit123/randomdice.gg/master/public/android-chrome-192x192.png)](https://randomdice.gg/)

# [randomdice.gg](https://randomdice.gg/)

[![Discord](https://img.shields.io/discord/804222694488932362.svg?logo=discord&label=)](https://discord.randomdice.gg/)

# About

randomdice.gg is a resourceful website for [Random Dice](https://www.111percent.net/)! Sporting 
Interactive Deck Builders, dice calculators, game tips and more. The site was created and now 
maintainedby the best players in the game community, with many useful resources to help succeed 
in Random Dice.

# Contributing
**PRs are welcome!**

It's recommended that you join the [randomdice.gg discord](https://discord.randomdice.gg/) first to talk to JackyKit about the 
changes you wish to make first.

# Development

## Prerequisites
 - NodeJS 10 + npm
 - Yarn package manager `npm i -g yarn`

## Installing dependencies

```bash
yarn
cd functions
npm i
cd ..
cd randomdice.gg-discord-bot
npm i
```

## Setting up Environment Variables

Create a `.env.development.local` file and include the following variables otherwise the web app will not work.

`REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY_HERE`

Create your own api key for development purposes via the [Google Cloud Platform](https://console.cloud.google.com/apis/credentials)

## Yarn scripts

*to be run in the project directory*

### `yarn start`

Starts the development server accessible at [http://localhost:3000](http://localhost:3000). <br/>
This page will automatically reload upon edits to the code

### `yarn build`

Builds the site to the `build` folder for deployment<br />
Read the [deployment documentation](https://facebook.github.io/create-react-app/docs/deployment) for more information.

*note: tests do not exist and the project has been ejected*

# Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). <br/>
To learn React, check out the [React documentation](https://reactjs.org/).
