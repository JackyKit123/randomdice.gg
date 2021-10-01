export const installEvent = {
  handler: (): void =>
    window.ga('send', 'event', 'PWA Install', 'appinstalled'),
  mountListener: (): void =>
    window.addEventListener('appinstalled', installEvent.handler),
  unmountListener: (): void =>
    window.removeEventListener('appinstalled', installEvent.handler),
};

export const auth = {
  login: (uid: string): void => {
    window.ga('set', 'userId', uid);
    window.ga('send', 'event', 'User Login', 'login');
  },
};

export const share = (): void =>
  window.ga('send', 'event', 'Social Media Share', 'share');

export const adblocked = (): void =>
  window.ga('send', 'event', 'Ad Blocked Browsing', 'adblocked');

export const navDiscord = (): void =>
  window.ga('send', 'event', 'Discord Link Clicked', 'click');
