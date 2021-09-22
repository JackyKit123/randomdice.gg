import React, { useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';

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
          ele.style.height = `${((container.clientWidth - 40) * 9) / 16}px`;
        });
      }
    };
    resizeIframe();
    window.addEventListener('resize', resizeIframe);
    return (): void => window.removeEventListener('resize', resizeIframe);
  }, [htmlString]);

  const youtubeLinkRegex = /<figure class="media"><oembed url="http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?[\w?=]*)?"><\/oembed><\/figure>/;

  let convertedString = htmlString;

  for (
    let matchArr = youtubeLinkRegex.exec(convertedString);
    matchArr !== null;

  ) {
    const [match, vid] = matchArr;
    convertedString = convertedString.replace(
      match,
      `<iframe title="YouTube Video" width="100%" class="youtube-embed" src="https://youtube.com/embed/${vid}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    );
    matchArr = youtubeLinkRegex.exec(convertedString);
  }
  return <>{ReactHtmlParser(convertedString)}</>;
}
