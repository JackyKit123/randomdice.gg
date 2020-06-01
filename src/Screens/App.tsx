import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchDecks, fetchDices, initGAPI } from './Misc/fetchData';
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
    initGAPI(dispatch);
    return (
        <Router>
            <Header />
            <Switch>{mapRouter(menu)}</Switch>
            <Footer />
        </Router>
    );
}
