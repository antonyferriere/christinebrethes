import { escape } from './ui.mjs';
import { certifications } from '../data/certifications.mjs';

function certificationYear(item) {
  return Number(String(item.date || '').match(/\d{4}/)?.[0]) || 0;
}

export function certificationsSection(items = certifications) {
  const approved = items
    .filter(item => item.contentApproved === true && item.logoAuthorized === true && item.title.trim())
    .sort((left, right) => certificationYear(right) - certificationYear(left));
  if (!approved.length) return '';
  const entries = approved.map(item => `<li>
    <div class="certification-date">${escape(item.date || '')}</div>
    <article class="certification-entry">
      ${item.logo ? `<div class="organization-logo"><img src="${escape(item.logo)}" alt="" width="${item.width}" height="${item.height}" loading="lazy" decoding="async"></div>` : ''}
      <div class="certification-copy"><h3>${escape(item.organization)}</h3><p>${escape(item.title)}</p></div>
    </article>
  </li>`).join('');
  return `<section class="section certifications-section" aria-labelledby="certifications-title"><div class="container">
    <h2 id="certifications-title">Formations &amp; certifications</h2>
    <ol class="certification-timeline">${entries}</ol>
  </div></section>`;
}
