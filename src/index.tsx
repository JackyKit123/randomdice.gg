import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'array-flat-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as FilterProvider } from 'Components/Filter';
import { store } from 'Redux/store';
import App from 'Screens/App';
import * as serviceWorker from './serviceWorker';
import swConfig from './swConfig';
import 'Styles';

ReactDOM.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <FilterProvider>
                <App />
            </FilterProvider>
        </ReduxProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.register(swConfig);
