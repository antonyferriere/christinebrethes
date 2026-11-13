import { escape } from './ui.mjs';
import { references } from '../data/references.mjs';
export function referencesSection(items = references) {
  const approved = items.filter(item => item.contentApproved === true && item.relationship.trim());
  if (!approved.length) return '';
  return `<section class="section container references-section"><h2>Références et partenaires</h2><ul class="references-grid">${approved.map(item => `<li>${item.logo && item.logoAuthorized ? `<img src="${escape(item.logo)}" width="${item.width}" height="${item.height}" alt="${escape(item.organization)}" loading="lazy" decoding="async">` : ''}<h3>${escape(item.organization)}</h3><p>${escape(item.relationship)}</p>${item.date ? `<p>${escape(item.date)}</p>` : ''}</li>`).join('')}</ul></section>`;
}
