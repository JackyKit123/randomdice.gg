export default {
    onUpdate: async (
        registration: ServiceWorkerRegistration
    ): Promise<void> => {
        await registration.unregister();
        window.location.reload(true);
    },
};
