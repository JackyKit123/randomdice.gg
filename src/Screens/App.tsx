import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'reset-css';
import './App.less';
import { useDispatch } from 'react-redux';
import { fetchDecks, fetchDices } from './fetchData';
import Header from './Header & Footer/header';
import Footer from './Header & Footer/footer';
import NoMatch from './NoMatch/NoMatch';
import { menu } from './menuConfig';

export default function App(): JSX.Element {
    const dispatch = useDispatch();
    fetchDecks(dispatch);
    fetchDices(dispatch);
    return (
        <Router>
            <Header />
            <Switch>
                {menu.map(item => (
                    <Route
                        key={`Route-path-${item.path}`}
                        exact
                        path={item.path}
                        component={item.component}
                    />
                ))}
                <Route component={NoMatch} />
            </Switch>
            <Footer />
        </Router>
    );
}
