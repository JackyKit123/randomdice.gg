export default {
    onUpdate: async (
        registration: ServiceWorkerRegistration
    ): Promise<void> => {
        if (registration.waiting) {
            registration.waiting.addEventListener('statechange', evt => {
                const { target } = evt;
                const { state } = (target as unknown) as { state: string };
                if (state === 'activated') {
                    window.location.reload(true);
                }
            });
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    },
};
