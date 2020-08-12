import React from 'react';
import { useDispatch } from 'react-redux';
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
import * as ga from '../../Misc/customGaEvent';
import './share.less';
import { OPEN_POPUP } from '../../Misc/Redux Storage/PopUp Overlay/types';

import PopUp from '../PopUp Overlay/popup';

export default function ShareButtons({ name }: { name: string }): JSX.Element {
    const dispatch = useDispatch();
    return (
        <div className='share'>
            <PopUp popUpTarget='copied'>
                <h3>Copied</h3>
                <span>The url has been copied to your clipboard.</span>
            </PopUp>
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
            <button
                name='other'
                aria-label='Share'
                type='button'
                onClick={async (): Promise<void> => {
                    if (navigator.share === undefined) {
                        await navigator.clipboard.writeText(
                            window.location.href
                        );
                        dispatch({ type: OPEN_POPUP, payload: 'copied' });
                    } else {
                        ga.share();
                        navigator.share({
                            title: name,
                            text: name,
                            url: window.location.href,
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
