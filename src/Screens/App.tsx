import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Analytics from 'react-router-ga';
import Header from 'Components/Header & Footer/header';
import Footer from 'Components/Header & Footer/footer';
import mapRouter from 'Router';
import * as ga from 'Misc/customGaEvent';
import loadGAPI from 'Redux/Google API/init';
import fetchFirebase from 'Firebase';
import { authStateDispatch } from 'Firebase/auth';
import { menu } from 'Router/menu';
import './App.less';
import ToTop from 'Components/To Top';

export default function App(): JSX.Element {
    const dispatch = useDispatch();

    useEffect(() => {
        loadGAPI(dispatch);
        fetchFirebase(dispatch);
        authStateDispatch(dispatch);
        ga.installEvent.mountListener();
    }, []);

    return (
        <Router>
            <Helmet>
                <title>Random Dice</title>
                <meta property='og:title' content='Random Dice Community Web' />
                <meta
                    name='og:description'
                    content='A resourceful website for Random Dice! Interactive Deck Builders, dice calculators, game tips and more. Created by the best players in the game community, with many useful resources to help you succeed in the game.'
                />
                <meta name='author' content='JackyKit' />
                <meta
                    name='description'
                    content='A resourceful website for Random Dice! Interactive Deck Builders, dice calculators, game tips and more. Created by the best players in the game community, with many useful resources to help you succeed in the game.'
                />
            </Helmet>
            <Analytics
                id={process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || ''}
            >
                <Header />
                {mapRouter(menu)}
                <ToTop />
                <Footer />
            </Analytics>
        </Router>
    );
}
