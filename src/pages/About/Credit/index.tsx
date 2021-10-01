import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { fetchCredit } from 'misc/firebase';
import PageWrapper from '@components/PageWrapper';
import useRootStateSelector from '@redux';

export default function Credit(): JSX.Element {
  const { credit, firebaseError } = useRootStateSelector(
    'fetchFirebaseReducer'
  );

  return (
    <PageWrapper
      isContentReady={!!credit.length}
      error={firebaseError}
      retryFn={fetchCredit}
      title='Credit'
      className='credit'
      disallowAd
    >
      {credit?.map(crd => (
        <Fragment key={crd.id}>
          <h3>{crd.category}</h3>
          {crd.people.map(person => (
            <div key={person.id}>
              <span>
                {person.role} : {person.name}
              </span>
              <figure>
                <img src={person.img} alt={person.name} />
              </figure>
            </div>
          ))}
        </Fragment>
      ))}
      <h3>
        <Link to='/about/patreon'>Patreon Supporters</Link>
      </h3>
      <h3>The Community</h3>
      <div>
        <p>Last but not least, everyone of you.</p>
        <p>
          Anyone is welcome to join us into making this website better, if you
          want to contribute content, or if you are a web developer, and you
          want to help us, please do not hesitate to contact JackyKit.
        </p>
      </div>
    </PageWrapper>
  );
}
