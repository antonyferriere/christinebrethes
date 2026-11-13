import { escape } from './ui.mjs';

export function organizationCarousel(id, title, items, field) {
  if (!items.length) return '';
  const cards = items.map(item => `<li><article class="offer-card">
    ${item.logo && item.logoAuthorized ? `<div class="organization-logo"><img src="${escape(item.logo)}" alt="" width="${item.width}" height="${item.height}" loading="lazy" decoding="async"></div>` : ''}
    <div class="offer-content">${item.date ? `<p class="eyebrow">${escape(item.date)}</p>` : ''}
      <h3>${escape(item.organization)}</h3><p>${escape(item[field])}</p>
    </div></article></li>`).join('');
  return `<section class="section tinted organization-section" data-carousel aria-labelledby="${id}-title"><div class="container">
    <div class="organization-heading"><h2 id="${id}-title">${escape(title)}</h2>
      <div class="organization-controls" hidden>
        <button type="button" data-prev aria-label="Carte précédente">←</button>
        <button type="button" data-play aria-label="Mettre le défilement en pause">Ⅱ</button>
        <button type="button" data-next aria-label="Carte suivante">→</button>
      </div></div>
    <ul class="organization-track" tabindex="0" aria-labelledby="${id}-title">${cards}</ul>
  </div></section>`;
}
