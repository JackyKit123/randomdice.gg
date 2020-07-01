import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/storage';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    projectId: 'random-dice-web',
    databaseURL: 'https://random-dice-web.firebaseio.com/',
    authDomain: 'random-dice-web.firebaseapp.com',
    storageBucket: 'random-dice-web.appspot.com',
};

export default (): firebase.app.App => firebase.initializeApp(config);
