import { useHistory } from 'react-router-dom';

export default function replaceAnchorWithHistory(
    history: ReturnType<typeof useHistory>
): () => void {
    const navigationHandler = (evt: MouseEvent): void => {
        const target = evt.target as HTMLElement | null;
        const targetLink = target?.closest('a')?.getAttribute('href');
        if (!targetLink) return;
        evt.preventDefault();
        history.push(targetLink);
    };
    const anchors = document.querySelectorAll('.content a') as NodeListOf<
        HTMLAnchorElement
    >;
    anchors.forEach(a => a.addEventListener('click', navigationHandler));
    return (): void =>
        anchors.forEach(a => a.removeEventListener('click', navigationHandler));
}
