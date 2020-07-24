import React from 'react';
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
import * as ga from '../../Misc/customGaEvent';
import './share.less';

export default function ShareButtons({ name }: { name: string }): JSX.Element {
    return (
        <div className='share'>
            <h4>Share This</h4>
            <FacebookShareButton
                url={window.location.href}
                quote={name}
                onClick={(): void => {
                    ga.share();
                }}
            >
                <FacebookIcon round />
            </FacebookShareButton>
            <TwitterShareButton
                url={window.location.href}
                title={name}
                onClick={(): void => {
                    ga.share();
                }}
            >
                <TwitterIcon round />
            </TwitterShareButton>
            <RedditShareButton
                url={window.location.href}
                title={name}
                onClick={(): void => {
                    ga.share();
                }}
            >
                <RedditIcon round />
            </RedditShareButton>
            {navigator.share === undefined ? null : (
                <button
                    name='other'
                    aria-label='Share'
                    type='button'
                    onClick={(): void => {
                        ga.share();
                        navigator.share({
                            title: name,
                            url: window.location.href,
                        });
                    }}
                >
                    <FontAwesomeIcon icon={faShareAlt} />
                </button>
            )}
        </div>
    );
}
