import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Analytics from 'react-router-ga';
import { fetchDecks, fetchDices, initGAPI, fetchAlts } from './Misc/fetchData';
import Header from './Header & Footer/header';
import Footer from './Header & Footer/footer';
import mapRouter from './Router/router';
import { menu } from './Misc/menuConfig';
import 'reset-css';
import './App.less';

export default function App(): JSX.Element {
    const dispatch = useDispatch();
    fetchDecks(dispatch);
    fetchDices(dispatch);
    fetchAlts(dispatch);
    initGAPI(dispatch);

    return (
        <Router>
            <Analytics
                id={process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || ''}
            >
                <Header />
                {mapRouter(menu)}
                <Footer />
            </Analytics>
        </Router>
    );
}
