import React, { ReactNode } from 'react';
import { Offline, Online } from 'react-detect-offline';
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
                <div className='banner offline'>
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
                <div className='banner'>
                    <div className='title-container'>
                        <h2 className='title'>{title}</h2>
                    </div>
                </div>
            </Online>
            <div className={`main ${className}`}>
                <AdUnit
                    provider='Google'
                    unitId='3944820222'
                    dimension='mobile'
                    style={{ display: 'block' }}
                />
                <div className='content'>{children}</div>
            </div>
        </main>
    );
}
