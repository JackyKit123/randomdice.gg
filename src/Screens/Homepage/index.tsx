import React, { useRef } from 'react';

import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import Menu from 'Components/Menu';
import { menu } from 'Router';
import useReplaceAnchorWithHistory from 'Misc/useReplaceAnchorWithHistory';
import useRootStateSelector from 'Redux';
import ConvertEmbed from 'Components/YoutubeEmbed';
import { navDiscord } from 'Misc/customGaEvent';
import PageWrapper from 'Components/PageWrapper';

export default function Homepage(): JSX.Element {
  const { news, firebaseError } = useRootStateSelector('fetchFirebaseReducer');

  const gameNewsSectionRef = useRef<HTMLDivElement>(null);
  const websiteNewsSectionRef = useRef<HTMLDivElement>(null);
  useReplaceAnchorWithHistory(gameNewsSectionRef, [news]);
  useReplaceAnchorWithHistory(websiteNewsSectionRef, [news]);

  return (
    <PageWrapper title='Random Dice Community Website' className='homepage'>
      <section>
        <div className='center-container'>
          <img alt='randomdice logo' src='android-chrome-192x192.png' />
        </div>
        <br />
        <h3>Welcome</h3>
        <p>
          Hello all, this is a Random Dice community created website. You will
          find useful resources for the game such as deck lists, calculators,
          and game tips. For your convenient, you can install this website onto
          your device for direct access. If you are using Android, you can
          install the website via{' '}
          <a
            href='https://play.google.com/store/apps/details?id=gg.randomdice.twa'
            target='_blank'
            rel='noopener noreferrer'
          >
            Google Play Store
          </a>{' '}
          otherwise, if you are using other platforms such as iOS, Windows or
          MacOS, you can refer to this{' '}
          <a
            href='https://medium.com/progressivewebapps/how-to-install-a-pwa-to-your-device-68a8d37fadc1'
            target='_blank'
            rel='noopener noreferrer'
          >
            Guide to install a Progressive Web App
          </a>
          .
        </p>
        <p>
          You are welcome to join the community in{' '}
          <a
            href='https://discord.randomdice.gg'
            target='_blank'
            rel='noopener noreferrer'
            onClick={navDiscord}
          >
            Discord
          </a>{' '}
          or on{' '}
          <a
            href='https://www.reddit.com/r/randomdice/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Reddit
          </a>
          . If you find any issues, please contact the webmaster through Discord
          on{' '}
          <a
            href='https://discordapp.com/users/195174308052467712'
            target='_blank'
            rel='noopener noreferrer'
          >
            JackyKit#0333
          </a>{' '}
          or by emailing{' '}
          <a href='mailto:admin@randomdice.gg'>admin@randomdice.gg</a> for any
          web related issue.
        </p>
      </section>
      <section className='news game' ref={gameNewsSectionRef}>
        <h3>Game News</h3>
        {/* eslint-disable-next-line no-nested-ternary */}
        {news ? (
          <ConvertEmbed htmlString={news.game} />
        ) : firebaseError ? (
          `Unable to load the latest news : ${firebaseError}`
        ) : (
          'Loading News...'
        )}
      </section>
      <section className='news website' ref={websiteNewsSectionRef}>
        <h3>Website News</h3>
        {/* eslint-disable-next-line no-nested-ternary */}
        {news
          ? ReactHtmlParser(sanitize(news.website))
          : firebaseError
          ? `Unable to load the latest news : ${firebaseError}`
          : 'Loading News...'}
      </section>
      <section>
        <h3>Menu</h3>
        <Menu menuList={menu} />
      </section>
    </PageWrapper>
  );
}
