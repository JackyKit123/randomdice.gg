import React, { Fragment, useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useLocation } from 'react-router-dom';

import GoogleAds from 'components/AdUnit';
import useRootStateSelector from '@redux';
import replaceTextWithImgTag from 'misc/replaceTextWithImg';

import { fetchWiki, fetchDices } from 'misc/firebase';
import { WikiContent } from 'types/database';
import PageWrapper from 'components/PageWrapper';

export default function BoxGuide(): JSX.Element {
  const {
    dice,
    wiki: { box },
    firebaseError,
  } = useRootStateSelector('fetchFirebaseReducer');
  const [boxInfo, setBoxInfo] = useState<WikiContent['box']>();
  const { hash } = useLocation();

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
  }, [boxInfo, hash]);

  useEffect(() => {
    if (!box.find(b => b.img === 'ad')) {
      box.splice(Math.min(Math.floor(box.length / 2), 10), 0, {
        id: -1,
        name: 'ad',
        img: 'ad',
        contain: 'ad',
        from: 'ad',
      });
      setBoxInfo(box);
    }
  }, [box]);

  return (
    <PageWrapper
      isContentReady={!!(dice.length && boxInfo?.length)}
      error={firebaseError}
      retryFn={(dispatch): void => {
        fetchDices(dispatch);
        fetchWiki(dispatch);
      }}
      title='Box Guide'
      className='wiki box-guide'
      description='A wiki with Random Dice game information. Basic introductions, tips and tricks and more!'
    >
      <p>
        In this page you will find list of box in the game. Where they are
        obtained from and the reward they give.
      </p>
      <section>
        {boxInfo?.map(b =>
          b.img === 'ad' ? (
            <Fragment key='ad'>
              <GoogleAds unitId='8891384324' />
            </Fragment>
          ) : (
            <Fragment key={b.name}>
              <hr className='divisor' />
              <div id={b.name}>
                <h3>{b.name}</h3>
                <figure>
                  <img src={b.img} alt={b.name} />
                </figure>
                <p>Obtained from: {b.from}</p>
                <p>
                  Contains:{' '}
                  {ReactHtmlParser(replaceTextWithImgTag(b.contain, dice))}
                </p>
              </div>
            </Fragment>
          )
        )}
      </section>
    </PageWrapper>
  );
}
