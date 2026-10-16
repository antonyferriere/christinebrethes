import { pageImages } from '../data/page-images.mjs';
import { escape } from './ui.mjs';
export function pageImage(name, { priority = false, card = false } = {}) {
  const [widths, width, height, imageName = name] = pageImages[name];
  const base = name === 'pleine-conscience' ? '/assets/hero/' : '/assets/pages/';
  return `<img class="photo${name === 'a-propos' ? ' portrait-warm' : ''}" src="${base}${imageName}-${widths.at(-1)}.webp" srcset="${widths.map(w => `${base}${imageName}-${w}.webp ${w}w`).join(', ')}" sizes="${card ? '(min-width: 1200px) 23vw, (min-width: 600px) 45vw, 90vw' : '(max-width: 699px) 100vw, 65vw'}" width="${width}" height="${height}" alt="" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
}
export function pageHero(name, content, breadcrumb = '') {
  return `<section class="page-hero immersive-page-hero" data-page-image="${escape(name)}"><div class="page-hero-background" aria-hidden="true">${pageImage(name, { priority: true })}</div><div class="container page-hero-inner">${breadcrumb}<div class="page-hero-copy">${content}</div></div></section>`;
}
