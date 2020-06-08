import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './Misc/Redux Storage/store';
import App from './Screens/App';
import * as serviceWorker from './serviceWorker';
import swConfig from './swConfig';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.register(swConfig);
