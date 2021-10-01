import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'array-flat-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as FilterProvider } from 'Components/Filter';
import PopupProvider from 'Components/PopUp';
import Analytics from 'react-router-ga';
import { store } from 'Redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
import App from 'Screens/App';
import * as serviceWorker from './serviceWorker';
import swConfig from './swConfig';
import 'styles';

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Router>
        <Analytics
          id={process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || ''}
        >
          <FilterProvider>
            <PopupProvider>
              <App />
            </PopupProvider>
          </FilterProvider>
        </Analytics>
      </Router>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register(swConfig);
