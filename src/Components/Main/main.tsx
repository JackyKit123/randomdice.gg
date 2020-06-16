import React, { ReactNode } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import AdUnit from '../Ad Unit/ad';
import './main.less';

export default function Main(props: {
    title: string;
    className?: string;
    children: ReactNode;
}): JSX.Element {
    const { title, className, children } = props;

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
                <AdUnit unitId='521838365' dimension='970x90' />
                <AdUnit unitId='431667212' dimension='300x250' />
                <div className='content'>{children}</div>
            </div>
        </main>
    );
}
