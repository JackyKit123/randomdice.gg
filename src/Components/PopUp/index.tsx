import React, {
  useRef,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';

interface PopupContext {
  openPopup: Dispatch<SetStateAction<ReactNode>>;
  closePopup: () => void;
}

export const popupContext = createContext<PopupContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  openPopup: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  closePopup: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export default function PopupProvider({
  children,
}: ProviderProps): JSX.Element | null {
  const [popupContent, openPopup] = useState<ReactNode>(null);
  const closePopup = (): void => {
    openPopup(null);
  };
  const overlayRef = useRef(null as HTMLDivElement | null);
  const history = useHistory();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (popupContent) {
      document.body.classList.add('popup-opened');
      if (overlayRef.current) {
        overlayRef.current.focus();
      }
      const unblock = history.block();
      return unblock;
    }
    document.body.classList.remove('popup-opened');
  }, [popupContent]);

  useEffect(() => {
    const unlisten = history.listen(() => closePopup());
    return unlisten;
  }, [history]);

  return (
    <popupContext.Provider value={{ openPopup, closePopup }}>
      {popupContent && (
        <div
          className='popup-overlay'
          role='button'
          tabIndex={0}
          onClick={(evt): void => {
            const target = evt.target as HTMLDivElement;
            if (target.classList.contains('popup-overlay')) {
              closePopup();
            }
          }}
          onKeyUp={(evt): void => {
            if (evt.key === 'Escape') {
              closePopup();
            }
          }}
        >
          <div className='popup'>
            <div
              className='container'
              ref={overlayRef}
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
            >
              {popupContent}
              <button
                type='button'
                className='close'
                onClick={(): void => closePopup()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </popupContext.Provider>
  );
}

export { ConfirmedSubmitNotification } from './components';
