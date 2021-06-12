import firebase from 'firebase-admin';

export default function init(): firebase.app.App {
    return firebase.apps.length
        ? firebase.app()
        : firebase.initializeApp({
              serviceAccountId: 'random-dice-web@appspot.gserviceaccount.com',
              databaseURL: 'https://random-dice-web.firebaseio.com/',
              storageBucket: 'random-dice-web.appspot.com',
              databaseAuthVariableOverride: {
                  uid: 'my-service-worker',
              },
          });
}
