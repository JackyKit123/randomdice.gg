/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import publicIp from 'public-ip';
import { detected } from 'adblockdetect';
import filter from './adFilter.json';
import './ad.less';

export default function AdUnit({
    unitId,
    dimension,
}: {
    unitId: string;
    dimension: string;
}): JSX.Element {
    const [userIP, setUserIP] = useState('');

    useEffect(() => {
        try {
            (async (): Promise<void> => {
                try {
                    const ip = await publicIp.v4();
                    setUserIP(ip);
                } catch (err) {
                    //
                }

                try {
                    const ip = await publicIp.v4();
                    setUserIP(ip);
                } catch (err) {
                    //
                }
            })();

            // eslint-disable-next-line func-names
            window._mNHandle.queue.push(function() {
                window._mNDetails.loadTag(unitId, dimension, unitId);
            });
        } catch (err) {
            //
        }
    }, []);

    return (
        <div
            className={`ad-container ${filter.includes(userIP) ? 'hide' : ''}`}
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
                </div>
            )}
        </div>
    );
}
