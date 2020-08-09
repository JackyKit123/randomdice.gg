import React, { useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { sanitize } from 'dompurify';

export default function ConvertEmbed({
    htmlString,
}: {
    htmlString: string;
}): JSX.Element {
    useEffect(() => {
        const eles = Array.from(
            document.getElementsByClassName('youtube-embed')
        ) as HTMLElement[];
        const container = document.querySelector('.main > .content');
        const resizeIframe = (): void => {
            if (eles && container) {
                eles.forEach(ele => {
                    // eslint-disable-next-line no-param-reassign
                    ele.style.height = `${((container.clientWidth - 40) * 9) /
                        16}px`;
                });
            }
        };
        resizeIframe();
        window.addEventListener('resize', resizeIframe);
        return (): void => window.removeEventListener('resize', resizeIframe);
    }, [htmlString]);

    const youtubeLinkRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?‌[\w?‌=]*)?/g;

    let convertingString = sanitize(htmlString);
    Array.from(htmlString.matchAll(youtubeLinkRegex)).forEach(match => {
        convertingString = htmlString.replace(
            match[0],
            `https://youtube.com/embed/${match[1]}`
        );
    });

    return (
        <>
            {ReactHtmlParser(
                convertingString
                    .replace(
                        /<figure class="media"><oembed url="/g,
                        '<iframe title="YouTube Video" width="100%" class="youtube-embed" src="'
                    )
                    .replace(
                        /"><\/oembed><\/figure>/g,
                        '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                    )
            )}
        </>
    );
}
