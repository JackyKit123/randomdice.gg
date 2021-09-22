import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CLOSE_POPUP } from 'Redux/PopUp Overlay/types';
import useRootStateSelector from 'Redux';

export default function PopUp({
    children,
    popUpTarget,
    className,
}: {
    children: React.ReactNode;
    popUpTarget: string;
    className?: string;
}): JSX.Element | null {
    const dispatch = useDispatch();
    const { name } = useRootStateSelector('popupReducer');
    const overlayRef = useRef(null as HTMLDivElement | null);

    useEffect(() => {
        if (name) {
            document.body.classList.add('popup-opened');
            if (overlayRef.current) {
                overlayRef.current.focus();
            }
        } else {
            document.body.classList.remove('popup-opened');
        }
    }, [name]);

    useEffect(
        () => (): void => {
            dispatch({ type: CLOSE_POPUP });
        },
        []
    );

    if (popUpTarget !== name) {
        return null;
    }

    return (
        <div
            className='popup-overlay'
            role='button'
            tabIndex={0}
            onClick={(evt): void => {
                const target = evt.target as HTMLDivElement;
                if (target.classList.contains('popup-overlay')) {
                    dispatch({ type: CLOSE_POPUP });
                }
            }}
            onKeyUp={(evt): void => {
                if (evt.key === 'Escape') {
                    dispatch({ type: CLOSE_POPUP });
                }
            }}
        >
            <div className='popup'>
                <div
                    className={`${className || ''} container`}
                    ref={overlayRef}
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    tabIndex={0}
                >
                    {children}
                    <button
                        type='button'
                        className='close'
                        onClick={(): void => {
                            dispatch({ type: CLOSE_POPUP });
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
