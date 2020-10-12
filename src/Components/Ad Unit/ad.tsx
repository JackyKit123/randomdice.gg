/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import 'firebase/database';
import { detected } from 'adblockdetect';
import './ad.less';
import { RootState } from '../../Misc/Redux Storage/store';
import { adblocked } from '../../Misc/customGaEvent';

export default function GoogleAds({
    unitId,
}: {
    unitId: string;
}): JSX.Element | null {
    const selector = useSelector((state: RootState) => state);
    const { data } = selector.fetchUserDataReducer;
    const { user, error } = selector.authReducer;
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (
            user !== 'awaiting auth state' &&
            !adLoaded &&
            (user === null || (data && !data['patreon-tier'])) &&
            !(user && process.env.REACT_APP_ADS_EXCLUSION?.includes(user.uid))
        ) {
            try {
                if (
                    !document.querySelector(
                        'script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"][data-ad-client="ca-pub-3031422008949072"]'
                    )
                ) {
                    if (detected()) {
                        adblocked();
                    }
                    const script = document.createElement('script');
                    script.src =
                        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
                    script.setAttribute(
                        'data-ad-client',
                        'ca-pub-3031422008949072'
                    );
                    script.async = true;
                    document.head.appendChild(script);
                    script.onload = (): void => {
                        (window.adsbygoogle = window.adsbygoogle || []).push(
                            {}
                        );
                    };
                } else {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
                setAdLoaded(true);
            } catch (err) {
                //
            }
        }
    }, [user, data]);

    if (
        (error && error !== 'Loading') ||
        (data && data['patreon-tier']) ||
        (user &&
            user !== 'awaiting auth state' &&
            process.env.REACT_APP_ADS_EXCLUSION?.includes(user.uid))
    ) {
        return null;
    }

    return (
        <div className={`ad-container ${detected() ? 'adblocked' : ''}`}>
            {detected() ? (
                <span>
                    If you can see this message, that most likely means that you
                    have an Ad Blocker running. We rely on advertising to keep
                    this website alive! We kindly ask you to disable your
                    AdBlock. Or if you want Ad free browsing, you can support us
                    on{' '}
                    <a
                        href='https://www.patreon.com/RandomDiceCommunityWebsite'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Patreon
                    </a>
                    .
                </span>
            ) : (
                <>
                    <hr className='divisor' />
                    <ins
                        className='adsbygoogle'
                        style={{ display: 'block' }}
                        data-ad-client='ca-pub-3031422008949072'
                        data-ad-slot={unitId}
                        data-ad-format='auto'
                        data-full-width-responsive='true'
                    />
                    <span className='label'>Advertisement</span>
                </>
            )}
        </div>
    );
}
