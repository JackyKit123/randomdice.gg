import * as admin from 'firebase-admin';

export default function init(): admin.app.App {
    return admin.apps.length
        ? admin.app()
        : admin.initializeApp({
              serviceAccountId: 'random-dice-web@appspot.gserviceaccount.com',
              databaseURL: 'https://random-dice-web.firebaseio.com/',
              databaseAuthVariableOverride: {
                  uid: 'my-service-worker',
              },
          });
}
