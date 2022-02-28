import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import Dice from 'components/Dice';
import PageWrapper from 'components/PageWrapper';

export default function NoMatch(props: {
  title?: string;
  children?: ReactNode;
}): JSX.Element {
  const history = useHistory();
  const { title } = props;
  return (
    <PageWrapper
      title={title || '404 Not found'}
      className='NoMatch'
      disallowAd
    >
      <Helmet>
        <meta name='robots' content='noindex' />
      </Helmet>
      <img
        id='assassin-cross'
        alt='assassinate effect'
        src='https://firebasestorage.googleapis.com/v0/b/random-dice-web.appspot.com/o/General%20Images%2FAssassin%20Snipe.png?alt=media&token=4f38af19-31d3-4706-b5da-bd38a0b11809'
      />
      <Dice die='Assassin' />
      <h3>This page has been assassinated.</h3>
      <div>
        <button type='button' onClick={history.goBack}>
          Click Here to return to the previous page.
        </button>
      </div>
      or
      <div>
        <button type='button' onClick={(): void => history.push('/')}>
          Click Here to return to Homepage.
        </button>
      </div>
    </PageWrapper>
  );
}
