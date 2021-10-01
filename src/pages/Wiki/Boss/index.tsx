import React, { Fragment, useEffect, useState } from 'react';

import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import { useLocation } from 'react-router-dom';
import GoogleAds from '@components/AdUnit';
import useRootStateSelector from '@redux';

import { fetchWiki } from 'misc/firebase';
import { WikiContent } from 'types/database';
import PageWrapper from '@components/PageWrapper';

export default function BossGuide(): JSX.Element {
  const { hash } = useLocation();
  const [bossInfo, setBossInfo] = useState<WikiContent['boss']>();
  const {
    wiki: { boss },
    firebaseError,
  } = useRootStateSelector('fetchFirebaseReducer');

  useEffect(() => {
    if (!boss.find(b => b.img === 'ad')) {
      boss.splice(Math.min(Math.floor(boss.length / 2), 10), 0, {
        id: -1,
        name: 'ad',
        img: 'ad',
        desc: 'ad',
      });
      setBossInfo(boss);
    }
  }, [boss]);

  useEffect(() => {
    const target = document.getElementById(decodeURI(hash).replace(/^#/, ''));
    if (target) {
      target.scrollIntoView();
      setTimeout(
        () =>
          window.scroll({
            top: window.scrollY - 90,
          }),
        0
      );
    }
  }, [bossInfo, hash]);

  return (
    <PageWrapper
      isContentReady={!!bossInfo?.length}
      error={firebaseError}
      retryFn={fetchWiki}
      title='Boss Mechanics'
      className='boss-guide'
      description='A wiki with Random Dice game information. Basic introductions, tips and tricks and more!'
    >
      <p>On here you will find information about Game Boss.</p>
      <p>
        First thing you can notice when the boss is appearing in the field (PvP
        only), it will do an animation which lasts for a few seconds where
        Blizzard can Apply Slowness effects and Spike/Landmine can damage the
        boss before it goes to the starting point. Boss Health points increases
        per waves, and in PvP mode, the mobs on board that are not killed will
        contribute to the increment of the boss health. So try not to overwhelm
        your board with too many mobs.
      </p>
      <section className='boss-list'>
        {bossInfo?.map(b =>
          b.img === 'ad' ? (
            <Fragment key='ad'>
              <GoogleAds unitId='8891384324' />
            </Fragment>
          ) : (
            <Fragment key={b.name}>
              <hr className='divisor' />
              <div className='b' id={b.name}>
                <figure>
                  <img src={b.img} alt={b.name} />
                </figure>
                <h3>{b.name}</h3>
                {ReactHtmlParser(sanitize(b.desc))}
              </div>
            </Fragment>
          )
        )}
      </section>
    </PageWrapper>
  );
}
