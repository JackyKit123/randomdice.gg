import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

export default function(): void {
    ReactGA.initialize(
        process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || ''
    );

    const history = createBrowserHistory();

    history.listen(location => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
}
