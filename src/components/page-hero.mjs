import { pageImages } from '../data/page-images.mjs';
import { escape } from './ui.mjs';
export function pageImage(name, { priority = false, card = false, related = false } = {}) {
  const [widths, width, height, imageName = name] = pageImages[name];
  const base = name === 'pleine-conscience' ? '/assets/hero/' : '/assets/pages/';
  // Account for cover and the 1.12 / 1.18 parallax scale, not just the grid width.
  const cardSizes = related
    ? '(min-width: 1440px) 500px, (min-width: 1200px) 35vw, (min-width: 600px) max(54vw, 350px), max(110vw, 350px)'
    : '(min-width: 1440px) 370px, (min-width: 1200px) max(27vw, 350px), (min-width: 600px) max(54vw, 350px), max(110vw, 350px)';
  const heroSizes = '(min-width: 700px) max(73vw, 700px), max(112vw, 570px)';
  return `<img class="photo${name === 'a-propos' ? ' portrait-warm' : ''}" src="${base}${imageName}-${widths.at(-1)}.webp" srcset="${widths.map(w => `${base}${imageName}-${w}.webp ${w}w`).join(', ')}" sizes="${card ? cardSizes : heroSizes}" width="${width}" height="${height}" alt="" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
}
export function pageHero(name, content, breadcrumb = '') {
  return `<section class="page-hero immersive-page-hero" data-page-image="${escape(name)}"><div class="page-hero-background" aria-hidden="true">${pageImage(name, { priority: true })}</div><div class="container page-hero-inner">${breadcrumb}<div class="page-hero-copy">${content}</div></div></section>`;
}
