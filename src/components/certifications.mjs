import { escape } from './ui.mjs';
import { certifications } from '../data/certifications.mjs';
export function certificationsSection(items = certifications) {
  const approved = items.filter(item => item.contentApproved === true && item.logoAuthorized === true && item.title.trim());
  if (!approved.length) return '';
  return `<section class="section container certifications-section"><h2>Formations & certifications</h2><ul class="certifications-grid">${approved.map(item => `<li><img src="${escape(item.logo)}" width="${item.width}" height="${item.height}" alt="${escape(item.organization)}" loading="lazy" decoding="async"><h3>${escape(item.organization)}</h3><p>${escape(item.title)}</p>${item.date ? `<p>${escape(item.date)}</p>` : ''}</li>`).join('')}</ul></section>`;
}
