/* eslint-disable no-underscore-dangle */
import React, { ReactNode, useEffect } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { isWebpSupported } from 'react-image-webp/dist/utils';
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
                window._mNDetails.loadTag('219055766', '970x90', '219055766');
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
                <div id='219055766' className='ad-container' />
                <div className='content'>{children}</div>
            </div>
        </main>
    );
}
