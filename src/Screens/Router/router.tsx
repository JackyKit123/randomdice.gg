import React, { FunctionComponent, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Menu } from '../../Misc/menuConfig';
import Main from '../../Components/Main/main';
import Loading from '../../Components/Loading/loading';

const mapRouter = (
    rootMenu: Menu[]
): (JSX.Element | FunctionComponent<Route> | null)[] => {
    const mapThis = (
        menu: Menu[]
    ): (JSX.Element | FunctionComponent<Route> | null)[] =>
        menu
            .map(item => {
                if (item.childNode) {
                    if (item.component) {
                        return mapThis(item.childNode).concat(item.component);
                    }
                    return mapThis(item.childNode);
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
    return mapThis(rootMenu).concat(
        <Route
            key='Route-path-404'
            component={lazy(() => import('../NoMatch/NoMatch'))}
            status={404}
        />
    );
};

export default function router(menu: Menu[]): JSX.Element {
    return (
        <Suspense
            fallback={
                <Main title='Loading...'>
                    <Loading />
                </Main>
            }
        >
            <Switch>{mapRouter(menu)}</Switch>
        </Suspense>
    );
}
