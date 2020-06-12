interface Window {
    gapi: gapi;
    _mNHandle: _mNHandle;
    _mNDetails: _mNDetails;
}

declare module 'react-router-ga' {
    const Analytics: any;
    export default Analytics;
}

declare module 'react-detect-offline' {
    export const Offline: any;
    export const Online: any;
}

declare module 'react-image-webp/dist/utils' {
    export const isWebpSupported: () => boolean;
}
