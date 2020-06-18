import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Analytics from 'react-router-ga';
import Header from './Header & Footer/header';
import Footer from './Header & Footer/footer';
import mapRouter from './Router/router';
import * as ga from '../Misc/customGaEvent';
import fetchResponseForm from '../Misc/Redux Storage/Google API Fetch Response Form/fetchData';
import fetchFirebase from '../Misc/Firebase/fetchData';
import { menu } from '../Misc/menuConfig';
import './App.less';
import ToTop from '../Components/To Top/btn';

export default function App(): JSX.Element {
    const dispatch = useDispatch();

    useEffect(() => {
        fetchResponseForm(dispatch, true);
        fetchFirebase(dispatch);
        ga.installEvent.mountListener();
    }, []);

    return (
        <Router>
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
