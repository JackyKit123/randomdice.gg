import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'reset-css';
import './App.less';
import Header from './Header & Footer/header';
import Footer from './Header & Footer/footer';
import Homepage from './Homepage/homepage';

export default function App(): JSX.Element {
    const [height, setHeight] = useState(0);
    window.addEventListener('resize', () => setHeight(window.innerHeight));
    return (
        <div style={{ height }}>
            <Router>
                <Header />
                <Switch>
                    <Route path='/' component={Homepage} />
                    {/* <Route component={NoMatch} /> */}
                </Switch>
                <Footer />
            </Router>
        </div>
    );
}
