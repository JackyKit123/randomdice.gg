/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { detected } from 'adblockdetect';
import './ad.less';

export default function AdUnit({ unitId }: { unitId: string }): JSX.Element {
    useEffect(() => {
        try {
            // eslint-disable-next-line func-names
            window._mNHandle.queue.push(function() {
                window._mNDetails.loadTag(unitId, '970x90', unitId);
            });
        } catch (err) {
            //
        }
    }, []);

    return (
        <div className='ad-container'>
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
                </div>
            )}
        </div>
    );
}
