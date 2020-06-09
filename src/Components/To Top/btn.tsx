import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './to-top.less';

export default function ToTop(): JSX.Element {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        function scrollHandler(): void {
            setScrolled(window.scrollY > 50);
        }
        scrollHandler();
        window.addEventListener('scroll', scrollHandler);
        return (): void => window.removeEventListener('scroll', scrollHandler);
    });

    return (
        <button
            id='to-top'
            type='button'
            className={scrolled ? 'scroll' : ''}
            onClick={(): void => {
                window.scrollTo({
                    top: 0,
                    left: window.scrollX,
                    behavior: 'smooth',
                });
            }}
        >
            <FontAwesomeIcon icon={faChevronUp} />
        </button>
    );
}
