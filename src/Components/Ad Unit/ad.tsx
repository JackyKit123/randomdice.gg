/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'firebase/database';
import { detected } from 'adblockdetect';
import './ad.less';
import { RootState } from '../../Misc/Redux Storage/store';

export default function AdUnit({
    provider,
    unitId,
    dimension,
}: {
    provider: 'Google' | 'Media.net';
    unitId: string;
    dimension: string;
    style?: React.CSSProperties;
}): JSX.Element | null {
    const { data } = useSelector(
        (state: RootState) => state.fetchUserDataReducer
    );

    useEffect(() => {
        try {
            if (provider === 'Media.net') {
                if (
                    !document.querySelector(
                        'script[src="https://contextual.media.net/dmedianet.js?cid=8CU6HWIGD"]'
                    )
                ) {
                    window._mNHandle = window._mNHandle || {};
                    window._mNHandle.queue = window._mNHandle.queue || [];
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    window.medianet_versionId = '3121199';
                    const script = document.createElement('script');
                    script.src =
                        'https://contextual.media.net/dmedianet.js?cid=8CU6HWIGD';
                    script.async = true;
                    document.head.appendChild(script);
                    script.onload = (): void => {
                        // eslint-disable-next-line func-names
                        window._mNHandle.queue.push(function() {
                            window._mNDetails.loadTag(
                                unitId,
                                dimension,
                                unitId
                            );
                        });
                    };
                } else {
                    // eslint-disable-next-line func-names
                    window._mNHandle.queue.push(function() {
                        window._mNDetails.loadTag(unitId, dimension, unitId);
                    });
                }
            } else if (provider === 'Google') {
                if (
                    !document.querySelector(
                        'script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"][data-ad-client="ca-pub-3031422008949072"]'
                    )
                ) {
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
            }
        } catch (err) {
            //
        }
    }, []);

    if (data && data['patreon-tier']) {
        return null;
    }

    return (
        <div
            className={`ad-container ${
                // eslint-disable-next-line no-nested-ternary
                detected()
                    ? 'adblocked'
                    : provider === 'Google'
                    ? 'google'
                    : 'medianet'
            }`}
            data-dimension={dimension}
        >
            {detected() ? (
                <div className='ad-block-warning'>
                    <span>
                        If you can see this message, that most likely means that
                        you have an Ad Blocker running. We rely on advertising
                        to keep this website alive! We kindly ask you to disable
                        your AdBlock. Or if you want Ad free browsing, you can
                        support us on{' '}
                        <a
                            href='https://www.patreon.com/RandomDiceCommunityWebsite'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Patreon
                        </a>
                        .
                    </span>
                </div>
            ) : (
                <div id={unitId}>
                    {provider === 'Media.net' ? null : (
                        <ins
                            className='adsbygoogle'
                            style={{ display: 'block' }}
                            data-ad-client='ca-pub-3031422008949072'
                            data-ad-slot={unitId}
                            data-ad-format='auto'
                            data-full-width-responsive='true'
                        />
                    )}
                    <h6 className='label'>Advertisement</h6>
                </div>
            )}
        </div>
    );
}
