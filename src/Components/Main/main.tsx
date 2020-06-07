import React from 'react';
import { Offline, Online } from 'react-detect-offline';
import './main.less';

export default function Main(props: {
    title: string;
    className?: string;
    content: JSX.Element;
}): JSX.Element {
    const { title, className, content } = props;
    return (
        <main className={className}>
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
            <div className='main'>
                <div className='container'>
                    <div className='content'>{content}</div>
                </div>
            </div>
        </main>
    );
}
