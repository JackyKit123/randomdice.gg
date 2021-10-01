import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPatreon } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { fetchPatreon } from 'misc/firebase';
import PageWrapper from '@components/PageWrapper';
import useRootStateSelector from '@redux';

export default function PatreonIntro(): JSX.Element {
  const { patreon_list: list, firebaseError } = useRootStateSelector(
    'fetchFirebaseReducer'
  );
  const highestTier = list?.sort((a, b) => b.tier - a.tier)[0]?.tier || 1;
  const tierList = new Array(highestTier)
    .fill(highestTier)
    .map((e, i) => e - i);

  return (
    <PageWrapper
      isContentReady={!!list.length}
      error={firebaseError}
      retryFn={fetchPatreon}
      title='Patreon'
      className='patreon'
      disallowAd
    >
      <div className='patreon-icon'>
        <div className='container'>
          <FontAwesomeIcon icon={faPatreon} />
        </div>
      </div>
      <p>
        This website is served for free to the community but it does not run for
        free. If you appreciate what we are doing, feel free to drop a support.
        In return, you can enjoy benefits like ad free browsing. Or a dedicated
        page for you to leave your message to the community.
      </p>
      <p>
        You can become a patreon at{' '}
        <a
          href='https://www.patreon.com/RandomDiceCommunityWebsite'
          target='_blank'
          rel='noreferrer noopener'
        >
          https://www.patreon.com/RandomDiceCommunityWebsite
        </a>
        .
      </p>
      <hr className='divisor' />
      {tierList.map(tier => (
        <Fragment key={tier}>
          <h3>Tier {tier} Supporters</h3>
          {list
            ?.filter(patron => patron.tier === tier)
            .map(patron => (
              <div key={patron.id}>
                <span>{patron.name}</span>
                <figure>
                  <img
                    src={
                      patron.img ||
                      'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/v1498102829/oul9xkady63xqqn3iw7c.png'
                    }
                    alt={`icon of ${patron.name}`}
                  />
                </figure>
                {tier >= 2 ? (
                  <div>
                    <Link to={`/about/patreon/${patron.name}`}>
                      Message from {patron.name}
                    </Link>
                  </div>
                ) : null}
              </div>
            ))}
        </Fragment>
      ))}
    </PageWrapper>
  );
}
