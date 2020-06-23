/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';
import { detected } from 'adblockdetect';
import './ad.less';
import { RootState } from '../../Misc/Redux Storage/store';

export default function AdUnit({
    unitId,
    dimension,
}: {
    unitId: string;
    dimension: string;
}): JSX.Element {
    const { user } = useSelector((state: RootState) => state.authReducer);
    const [adFree, setAdFree] = useState(false);

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
                </div>
            )}
        </div>
    );
}
