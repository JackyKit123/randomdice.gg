import firebase from 'firebase/app';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    projectId: 'random-dice-web',
    databaseURL: 'https://random-dice-web.firebaseio.com/',
    authDomain: 'random-dice-web.firebaseapp.com',
};

export default (): firebase.app.App => firebase.initializeApp(config);
