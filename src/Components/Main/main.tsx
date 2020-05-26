import React from 'react';
import Banner from '../Banner/banner';
import './main.less';

export default function Main(props: {
    title: string;
    className?: string;
    content: JSX.Element;
}): JSX.Element {
    const { title, className, content } = props;
    return (
        <main className={className}>
            <Banner title={title} />
            <div className='main'>
                <div className='container'>
                    <div className='content'>{content}</div>
                </div>
            </div>
        </main>
    );
}
