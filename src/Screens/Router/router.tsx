import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
import NoMatch from '../NoMatch/NoMatch';
import PrivacyPolicy from '../Legal/privacyPolicy';
import Terms from '../Legal/terms';
import { Menu } from '../Misc/menuConfig';

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
    return mapThis(rootMenu)
        .concat(<Route path='/about/privacy' exact component={PrivacyPolicy} />)
        .concat(<Route path='/about/terms' exact component={Terms} />)
        .concat(<Route key='Router-path-404' component={NoMatch} />);
};

export default mapRouter;
