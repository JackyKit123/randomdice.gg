interface Window {
    ga: ga;
    gapi: gapi;
    _mNHandle: _mNHandle;
    _mNDetails: _mNDetails;
}

interface WindowEventMap {
    discord_login_callback: CustomEvent;
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

declare module 'adblockdetect' {
    export const detected: () => boolean;
}

declare module '@ckeditor/ckeditor5-react' {
    const CKEditor: any;
    export default CKEditor;
}

declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditor: ClassicEditor;
    export default ClassicEditor;
}
