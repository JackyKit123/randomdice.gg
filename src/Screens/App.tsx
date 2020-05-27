import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'reset-css';
import './App.less';
import { useDispatch } from 'react-redux';
import { fetchDecks, fetchDices } from './fetchData';
import Header from './Header & Footer/header';
import Footer from './Header & Footer/footer';
import NoMatch from './NoMatch/NoMatch';
import { menu as menuConfig, Menu } from './menuConfig';

const mapRouter = (
    menu: Menu[]
): (JSX.Element | FunctionComponent<Route> | null)[] =>
    menu
        .map(item => {
            if (item.childNode) {
                if (item.component) {
                    return [...mapRouter(item.childNode), item.component];
                }
                return mapRouter(item.childNode);
            }
            if (item.component) {
                return (
                    <Route
                        key={`Route-path-${item.path}`}
                        exact
                        path={item.path}
                        component={item.component}
                    />
                );
            }
            return null;
        })
        .flat();

export default function App(): JSX.Element {
    const dispatch = useDispatch();
    fetchDecks(dispatch);
    fetchDices(dispatch);
    return (
        <Router>
            <Header />
            <Switch>
                {mapRouter(menuConfig)}
                <Route component={NoMatch} />
            </Switch>
            <Footer />
        </Router>
    );
}
