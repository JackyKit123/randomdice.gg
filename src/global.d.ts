/* eslint-disable @typescript-eslint/no-explicit-any */

interface Window {
    ga: ga;
    gapi: gapi;
    _mNHandle: _mNHandle;
    _mNDetails: _mNDetails;
    medianet_versionId: any;
    adsbygoogle: adsbygoogle;
}

declare module 'react-router-ga' {
    export default function Analytics({ children }: ReactNode): JSX.Element;
}

declare module 'adblockdetect' {
    export const detected: () => boolean;
}

declare module '@ckeditor/ckeditor5-react' {
    const CKEditor: any;
    export default CKEditor;
}

declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditor: any;
    export default ClassicEditor;
}
