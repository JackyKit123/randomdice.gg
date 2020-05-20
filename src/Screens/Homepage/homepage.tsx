import React from 'react';
import Banner from './banner';
import './homepage.less';

export default function Homepage(): JSX.Element {
    return (
        <div>
            <Banner />
            <div className='main'>JackyKit was here</div>
        </div>
    );
}
