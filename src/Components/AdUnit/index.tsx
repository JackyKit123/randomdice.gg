/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';

import 'firebase/database';
import { detected } from 'adblockdetect';
import useRootStateSelector from 'Redux';
import { adblocked } from 'Misc/customGaEvent';

export default function GoogleAds({
    unitId,
    noHrDivisor,
}: {
    unitId: string;
    noHrDivisor?: true;
}): JSX.Element | null {
    const { userData, auth } = useRootStateSelector('authReducer');

    useEffect(() => {
        if (auth === 'awaiting auth state') {
            return;
        }

        if (
            (auth === null || (userData && !userData['patreon-tier'])) &&
            !(auth && process.env.REACT_APP_ADS_EXCLUSION?.includes(auth.uid))
        ) {
            document.body.setAttribute('ads-free', 'false');
            if (detected()) {
                adblocked();
            }
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch {
                //
            }
        } else {
            document.body.setAttribute('ads-free', 'true');
        }
    }, [auth, userData]);

    if (
        (userData && userData['patreon-tier']) ||
        (auth &&
            auth !== 'awaiting auth state' &&
            process.env.REACT_APP_ADS_EXCLUSION?.includes(auth.uid))
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
                    {noHrDivisor ? null : <hr className='divisor' />}
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
