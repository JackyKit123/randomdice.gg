import React from 'react';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    RedditShareButton,
    RedditIcon,
} from 'react-share';
import './share.less';

export default function ShareButtons({ name }: { name: string }): JSX.Element {
    return (
        <div className='share'>
            <h4>Share This</h4>
            <FacebookShareButton url={window.location.href} quote={name}>
                <FacebookIcon round />
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href} title={name}>
                <TwitterIcon round />
            </TwitterShareButton>
            <RedditShareButton url={window.location.href} title={name}>
                <RedditIcon round />
            </RedditShareButton>
        </div>
    );
}
