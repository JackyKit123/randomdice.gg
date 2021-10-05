import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Main from 'components/Main';
import ErrorDisplay from 'components/Error';
import mapRouter from 'router';
import * as ga from 'misc/customGaEvent';
import loadGAPI from '@redux/Google API/init';
import fetchFirebase from 'misc/firebase';
import { authStateDispatch } from 'misc/firebase/auth';
import { menu } from 'router/menu';
import ToTop from 'components/ToTop';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider as FilterProvider } from 'components/Filter';
import PopupProvider from 'components/PopUp';
import Analytics from 'react-router-ga';
import { BrowserRouter as Router } from 'react-router-dom';

export default function App(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    loadGAPI(dispatch);
    fetchFirebase(dispatch);
    authStateDispatch(dispatch);
    ga.installEvent.mountListener();
  }, []);

  return (
    <ErrorBoundary
      fallbackRender={({ error }): JSX.Element => (
        <Main title='Oops, something went wrong'>
          <ErrorDisplay error={error} />
        </Main>
      )}
    >
      <Router>
        <Analytics
          id={process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID || ''}
        >
          <FilterProvider>
            <PopupProvider>
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
              <Header />
              {mapRouter(menu)}
              <ToTop />
              <Footer />
            </PopupProvider>
          </FilterProvider>
        </Analytics>
      </Router>
    </ErrorBoundary>
  );
}
