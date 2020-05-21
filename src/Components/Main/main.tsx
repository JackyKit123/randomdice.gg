import React from 'react';
import Banner from '../Banner/banner';
import './main.less';

export default function Main({
    title,
    content,
}: {
    title: string;
    content: JSX.Element;
}): JSX.Element {
    return (
        <main>
            <Banner title={title} />
            <div className='main'>
                <div className='container'>
                    <div className='content'>{content}</div>
                </div>
            </div>
        </main>
    );
}
