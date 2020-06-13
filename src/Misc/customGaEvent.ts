// eslint-disable-next-line import/prefer-default-export
export const installEvent = {
    handler: (): void =>
        window.ga('send', 'event', 'PWA Install', 'appinstalled'),
    mountListener: (): void =>
        window.addEventListener('appinstalled', installEvent.handler),
    unmountListener: (): void =>
        window.removeEventListener('appinstalled', installEvent.handler),
};
