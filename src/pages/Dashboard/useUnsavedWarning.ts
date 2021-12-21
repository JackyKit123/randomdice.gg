import { useEffect } from 'react';

export default function useUnsavedWarning(unsavedCondition: boolean): void {
  return useEffect(() => {
    // eslint-disable-next-line consistent-return
    window.onbeforeunload = function unloadWarning(): string | void {
      if (unsavedCondition) {
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    return (): void => {
      window.onbeforeunload = null;
    };
  }, [unsavedCondition]);
}
