import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'reset-css';
import './App.less';
import { useDispatch } from 'react-redux';
import { fetchDecks, fetchDices } from './fetchData';
import Header from './Header & Footer/header';
import Footer from './Header & Footer/footer';
import NoMatch from './NoMatch/NoMatch';
import { menu } from './menuConfig';

const screens: {
    path: string;
    component: FunctionComponent;
}[] = [];
Object.values(menu).forEach(item => {
    if ('component' in item) {
        screens.push({
            path: item.path,
            component: item.component,
        });
    }
});

export default function App(): JSX.Element {
    const dispatch = useDispatch();
    fetchDecks(dispatch);
    fetchDices(dispatch);
    return (
        <Router>
            <Header />
            <Switch>
                {screens.map(item => (
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
