/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { createEffect } from 'solid-js';
import { Router } from '@solidjs/router';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

function setOGPMetaTags(): void {
  const title = 'MakeCamelTypes from JSON samples';
  const description = 'MakeCamelTypes from JSON samples';
  const imageUrl = 'https://make-camel-type.vercel.app/images/ogp.png';
  const pageUrl = window.location.href;

  document.title = title;

  const metaTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: pageUrl },
  ];

  metaTags.forEach(metaTag => {
    const tag = document.createElement('meta');
    tag.setAttribute('property', metaTag.property);
    tag.setAttribute('content', metaTag.content);
    document.head.appendChild(tag);
  });
}

render(() => {
  createEffect(setOGPMetaTags);

  return (
    <Router>
      <App />
    </Router>
  );
}, root!);
