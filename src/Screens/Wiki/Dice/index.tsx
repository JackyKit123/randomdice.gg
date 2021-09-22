/* eslint-disable react/jsx-indent */
import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';
import Dice from 'Components/Dice';
import GoogleAds from 'Components/AdUnit';
import useReplaceAnchorWithHistory from 'Misc/useReplaceAnchorWithHistory';
import useRootStateSelector from 'Redux';

import { fetchWiki } from 'Firebase';
import PageWrapper from 'Components/PageWrapper';

export default function DiceMechanic(): JSX.Element {
  const { hash } = useLocation();
  const { dice, firebaseError } = useRootStateSelector('fetchFirebaseReducer');
  const [mechanics, setMechanics] = useState<
    (
      | {
          id: number;
          name: string;
          detail: string;
        }
      | 'ad'
    )[]
  >();

  const wrapperRef = useRef<HTMLDivElement>(null);
  useReplaceAnchorWithHistory(wrapperRef, [dice]);

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
  }, [mechanics, hash]);

  useEffect(() => {
    if (dice?.length && !mechanics?.includes('ad')) {
      const tmp = dice.map(die => ({
        id: die.id,
        name: die.name,
        detail: die.detail,
      })) as (
        | {
            id: number;
            name: string;
            detail: string;
          }
        | 'ad'
      )[];
      tmp.splice(Math.min(Math.floor(dice.length / 2), 10), 0, 'ad');
      setMechanics(tmp);
    }
  }, [dice]);

  return (
    <PageWrapper
      isContentReady={!!(dice?.length && mechanics)}
      error={firebaseError}
      retryFn={fetchWiki}
      title='Dice Mechanics'
      className='wiki dice-mechanics'
      description='A wiki with Random Dice game information. Basic introductions, tips and tricks and more!'
    >
      <p className='intro'>
        This page will inform you about the basic workings of all dice in the
        game. In game level ups generally increase the base attack and special
        attack of all dice. The amount of dots a dice has is commonly referred
        to as pips. Therefore a 6 dot dice is called a 6 pip dice. For dice
        value statistic, you can visit{' '}
        <Link to='/calculator/stat'>Dice Stat Calculator</Link>.
      </p>
      <section ref={wrapperRef}>
        {mechanics?.map(die =>
          die === 'ad' ? (
            <Fragment key='ad'>
              <GoogleAds unitId='8891384324' />
            </Fragment>
          ) : (
            <Fragment key={die.id}>
              <hr className='divisor' />
              <div className='row' id={die.name}>
                <h3>{die.name}</h3>
                <Dice die={die.id} />
                {ReactHtmlParser(sanitize(die.detail))}
              </div>
            </Fragment>
          )
        )}
      </section>
    </PageWrapper>
  );
}
