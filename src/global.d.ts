interface Window {
    ga: ga;
    gapi: gapi;
    _mNHandle: _mNHandle;
    _mNDetails: _mNDetails;
}

declare module 'react-router-ga' {
    export default function Analytics({ children }: ReactNode): JSX.Element;
}

declare module 'react-detect-offline' {
    export function Offline({ children }: ReactNode): JSX.Element;
    export function Online({ children }: ReactNode): JSX.Element;
}

declare module 'react-image-webp/dist/utils' {
    export const isWebpSupported: () => boolean;
}

declare module 'react-ad-block-detect' {
    export default function AdBlockDetect({ children }: ReactNode): JSX.Element;
}
