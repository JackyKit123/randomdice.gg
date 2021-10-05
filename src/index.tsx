import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'array-flat-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@redux/store';
import App from 'pages/App';
import * as serviceWorker from './serviceWorker';
import swConfig from './swConfig';
import 'styles';

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register(swConfig);
