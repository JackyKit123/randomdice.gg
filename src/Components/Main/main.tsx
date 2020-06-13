/* eslint-disable no-underscore-dangle */
import React, { ReactNode, useEffect } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import AdBlockDetect from 'react-ad-block-detect';
import './main.less';

export default function Main(props: {
    title: string;
    className?: string;
    children: ReactNode;
}): JSX.Element {
    const { title, className, children } = props;
    useEffect(() => {
        try {
            // eslint-disable-next-line func-names
            window._mNHandle.queue.push(function() {
                window._mNDetails.loadTag('521838365', '970x90', '521838365');
            });
        } catch (err) {
            //
        }
    }, []);

    return (
        <main>
            <Offline>
                <div
                    className={`banner offline ${
                        isWebpSupported() ? '' : 'noWebp'
                    }`}
                >
                    <div className='title-container'>
                        <h2 className='title'>{title}</h2>
                    </div>
                    <span>
                        You are currently offline, please check your connection,
                        content of this website will continue to be served.
                    </span>
                </div>
            </Offline>
            <Online>
                <div className={`banner ${isWebpSupported() ? '' : 'noWebp'}`}>
                    <div className='title-container'>
                        <h2 className='title'>{title}</h2>
                    </div>
                </div>
            </Online>
            <div className={`main ${className}`}>
                <div className='ad-container'>
                    <div id='521838365'>
                        <AdBlockDetect>
                            <span className='ad-block-warning'>
                                If you can see this message, that most likely
                                means that you have an Ad Blocker running. We
                                rely on advertising to keep this website alive!
                                We kindly ask you to disable your AdBlock. Or if
                                you want Ad free browsing, you can support us on{' '}
                                <a
                                    href='https://www.patreon.com/RandomDiceCommunityWebsite'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Patreon
                                </a>
                                .
                            </span>
                        </AdBlockDetect>
                    </div>
                </div>
                <div className='content'>{children}</div>
            </div>
        </main>
    );
}
