/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firebase from 'firebase/app';
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
    const { user } = useSelector((state: RootState) => state.authReducer);
    const [adFree, setAdFree] = useState<true | null>(null);

    useEffect(() => {
        if (user) {
            const ref = firebase.database().ref(`/users/${user.uid}`);
            (async (): Promise<void> => {
                const data = (await ref.once('value')).val();
                if (data && data['patreon-tier']) {
                    setAdFree(true);
                }
            })();
        }
    }, [user]);

    useEffect(() => {
        try {
            if (provider === 'Media.net') {
                // eslint-disable-next-line func-names
                window._mNHandle.queue.push(function() {
                    window._mNDetails.loadTag(unitId, dimension, unitId);
                });
            } else if (provider === 'Google') {
                const element = document.getElementsByTagName('script')[0];
                const scriptTag = document.createElement('script');
                scriptTag.id = 'google-ads-sdk';
                scriptTag.src =
                    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
                // eslint-disable-next-line no-unused-expressions
                element.parentNode?.insertBefore(scriptTag, element);
                scriptTag.onload = (): void => {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                };
            }
        } catch (err) {
            //
        }
    }, [adFree]);

    if (adFree) {
        return null;
    }

    return (
        <div
            className={`ad-container ${adFree ? 'hide' : ''}`}
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
                    <h6 className='sponsor'>Sponsor</h6>
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
                </div>
            )}
        </div>
    );
}
