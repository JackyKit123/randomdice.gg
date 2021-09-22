import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function useReplaceAnchorWithHistory(
  ref: React.RefObject<HTMLElement>,
  deps: unknown[]
): void {
  const history = useHistory();

  useEffect(() => {
    const navigationHandler = (evt: MouseEvent): void => {
      const target = evt.target as HTMLElement | null;
      const targetLink = target?.closest('a')?.getAttribute('href');
      if (!targetLink) return;
      evt.preventDefault();
      history.push(targetLink);
    };
    const anchors =
      (ref?.current?.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>) ??
      [];
    anchors.forEach(a => a.addEventListener('click', navigationHandler));
    return (): void =>
      anchors.forEach(a => a.removeEventListener('click', navigationHandler));
  }, deps);
}
