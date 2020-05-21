import React from 'react';
import './banner.less';

export default function Banner({ title }: { title: string }): JSX.Element {
    return (
        <div className='banner'>
            <div className='title-container'>
                <h2 className='title'>{title}</h2>
            </div>
        </div>
    );
}
