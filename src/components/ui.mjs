export const escape = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));
export const arrow = '<span aria-hidden="true">↗</span>';
export function button(label, href, variant = '') {
  return `<a class="button ${variant}" href="${escape(href)}">${escape(label)} ${arrow}</a>`;
}
export function photo(name, alt, { priority = false, sizes = '(min-width: 840px) 45vw, 100vw', className = '' } = {}) {
  const portrait = name.startsWith('christine');
  return `<span class="photo-depth"><img class="photo ${className}" src="/assets/${name}-800.webp" srcset="/assets/${name}-480.webp 480w, /assets/${name}-800.webp 800w, /assets/${name}-1200.webp 1200w" sizes="${sizes}" width="800" height="${portrait ? 1000 : 600}" alt="${escape(alt)}" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async"></span>`;
}
export function sectionHeading(kicker, title, text = '') {
  return `<div class="section-heading"><p class="eyebrow">${escape(kicker)}</p><h2>${title}</h2>${text ? `<p class="lede">${escape(text)}</p>` : ''}</div>`;
}
export function list(items, className = 'check-list') {
  return `<ul class="${className}">${items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>`;
}
export function faq(items) {
  return `<div class="faq">${items.map(({ question, answer }) => `<details><summary>${escape(question)}<span aria-hidden="true">+</span></summary><p>${escape(answer)}</p></details>`).join('')}</div>`;
}
