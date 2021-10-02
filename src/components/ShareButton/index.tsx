import React, { useContext } from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  RedditShareButton,
  RedditIcon,
} from 'react-share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import * as ga from 'misc/customGaEvent';
import { popupContext } from 'components/PopUp';

function CopiedNotification(): JSX.Element {
  return (
    <div className='share'>
      <h3>Copied</h3>
      <span>The url has been copied to your clipboard.</span>
    </div>
  );
}

export default function ShareButtons(props: {
  name: string;
  url?: string;
}): JSX.Element {
  const { name, url } = props;
  const { openPopup } = useContext(popupContext);

  return (
    <div className='share'>
      <h4>Share this page</h4>
      <FacebookShareButton
        url={url || window.location.href}
        quote={name}
        onClick={(): void => {
          ga.share();
        }}
      >
        <FacebookIcon round />
      </FacebookShareButton>
      <TwitterShareButton
        url={url || window.location.href}
        title={name}
        onClick={(): void => {
          ga.share();
        }}
      >
        <TwitterIcon round />
      </TwitterShareButton>
      <RedditShareButton
        url={url || window.location.href}
        title={name}
        onClick={(): void => {
          ga.share();
        }}
      >
        <RedditIcon round />
      </RedditShareButton>
      <button
        name='other'
        aria-label='Share'
        type='button'
        onClick={async (): Promise<void> => {
          ga.share();
          if (navigator.share === undefined) {
            await navigator.clipboard.writeText(url || window.location.href);
            openPopup(<CopiedNotification />);
          } else {
            navigator.share({
              title: name,
              text: name,
              url: url || window.location.href,
            });
          }
        }}
      >
        <FontAwesomeIcon
          icon={navigator.share === undefined ? faCopy : faShareAlt}
        />
      </button>
    </div>
  );
}
