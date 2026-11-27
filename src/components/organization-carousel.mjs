import { escape } from './ui.mjs';

export function organizationCarousel(id, title, items) {
  if (!items.length) return '';
  const cards = items.map(item => `<li><div class="offer-card organization-logo">
    <img src="${escape(item.logo)}" alt="${escape(item.organization)}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async">
  </div></li>`).join('');
  return `<section class="section tinted organization-section" data-carousel aria-labelledby="${id}-title"><div class="container">
    <div class="organization-heading"><h2 id="${id}-title">${escape(title)}</h2></div>
    <div class="organization-viewport"><ul class="organization-track" tabindex="0" aria-labelledby="${id}-title">${cards}</ul></div>
  </div></section>`;
}
