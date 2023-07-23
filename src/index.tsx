/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

// function setOGPMetaTags(): void {
//   const title = 'Your Page Title';
//   const description = 'Your page description';
//   const imageUrl = 'URL to your image';
//   const pageUrl = window.location.href;

//   document.title = title;

//   const metaTags = [
//     { property: 'og:title', content: title },
//     { property: 'og:description', content: description },
//     { property: 'og:image', content: imageUrl },
//     { property: 'og:url', content: pageUrl },
//     // 他のOGPメタタグも必要に応じて追加
//   ];

//   metaTags.forEach(metaTag => {
//     const tag = document.createElement('meta');
//     tag.setAttribute('property', metaTag.property);
//     tag.setAttribute('content', metaTag.content);
//     document.head.appendChild(tag);
//   });
// }

render(() => {
  // createEffect(setOGPMetaTags);
  return <App />;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
}, root!);
