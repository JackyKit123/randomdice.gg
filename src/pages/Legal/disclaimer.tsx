import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '@components/PageWrapper';

export default function Terms(): JSX.Element {
  return (
    <PageWrapper
      className='legal'
      title='Disclaimer for Random Dice Community Website'
      disallowAd
    >
      <p>
        If you require any more information or have any questions about our
        site&apos;s disclaimer, please feel free to contact us. Our Disclaimer
        was generated with the help of the{' '}
        <a
          href='https://www.disclaimergenerator.org/'
          rel='noopener noreferrer'
          target='_blank'
        >
          Disclaimer Generator
        </a>
      </p>

      <h2>Disclaimers for Random Dice Community Website</h2>

      <p>
        All the information on this website -{' '}
        <Link to='/'>https://randomdice.gg/</Link> - is published in good faith
        and for general information purpose only. Random Dice Community Website
        does not make any warranties about the completeness, reliability and
        accuracy of this information. Any action you take upon the information
        you find on this website (Random Dice Community Website), is strictly at
        your own risk. Random Dice Community Website will not be liable for any
        losses and/or damages in connection with the use of our website.
      </p>

      <p>
        From our website, you can visit other websites by following hyperlinks
        to such external sites. While we strive to provide only quality links to
        useful and ethical websites, we have no control over the content and
        nature of these sites. These links to other websites do not imply a
        recommendation for all the content found on these sites. Site owners and
        content may change without notice and may occur before we have the
        opportunity to remove a link which may have gone &apos;bad&apos;.
      </p>

      <p>
        Please be also aware that when you leave our website, other sites may
        have different privacy policies and terms which are beyond our control.
        Please be sure to check the Privacy Policies of these sites as well as
        their &quot;Terms of Service&quot; before engaging in any business or
        uploading any information. Our Privacy Policy was created by{' '}
        <a
          href='https://www.generateprivacypolicy.com/'
          rel='noopener noreferrer'
          target='_blank'
        >
          the Privacy Policy Generator
        </a>
        .
      </p>

      <h2>Consent</h2>

      <p>
        By using our website, you hereby consent to our disclaimer and agree to
        its terms.
      </p>

      <h2>Update</h2>

      <p>
        Should we update, amend or make any changes to this document, those
        changes will be prominently posted here.
      </p>
    </PageWrapper>
  );
}
