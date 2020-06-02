import React from 'react';
import './main.less';

export default function Main(props: {
    title: string;
    className?: string;
    content: JSX.Element;
}): JSX.Element {
    const { title, className, content } = props;
    return (
        <main className={className}>
            <div className='banner'>
                <div className='title-container'>
                    <h2 className='title'>{title}</h2>
                </div>
            </div>
            <div className='main'>
                <div className='container'>
                    <div className='content'>{content}</div>
                </div>
            </div>
        </main>
    );
}
