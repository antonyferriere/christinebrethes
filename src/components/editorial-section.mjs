import { escape, button, list, faq, arrow } from './ui.mjs';
import { site } from '../data/site.mjs';

export const paragraphs = (items = [], emphasis) => items.map((text, index) =>
  `<p${index === emphasis ? ' class="editorial-emphasis"' : ''}>${escape(text)}</p>`).join('');
export const actions = (items = [], variant = '') => items.length ? `<div class="editorial-actions">${items.map(({ label, audience }) => button(label, audience === 'organisation' ? '/contact/?profil=organisation' : audience === 'contact' ? '/contact/' : site.booking.url || '/contact/', variant)).join('')}</div>` : '';

function blockTitle(title, presentation) {
  if (presentation?.layout !== 'narrative' || !title.includes(' — ')) return escape(title);
  const separator = title.indexOf(' — ');
  return `<span class="editorial-title-primary">${escape(title.slice(0, separator))}</span><span class="sr-only"> — </span><span class="editorial-title-secondary">${escape(title.slice(separator + 3))}</span>`;
}

function sectionContent(section, presentation) {
  const renderBody = block => `${paragraphs(block.paragraphs)}${block.items ? list(block.items) : ''}`;
  const blocks = (section.blocks || []).map((block, index, all) => {
    if (presentation?.layout === 'domains') {
      if (presentation.notes?.includes(index)) return '';
      const note = presentation.notes?.includes(index + 1) ? all[index + 1] : null;
      const image = presentation.images?.[index];
      return `<article class="editorial-block editorial-domain-card offer-card">${image ? cardImage(image) : ''}<div class="editorial-card-body offer-content"><h3>${escape(block.title)}</h3>${paragraphs(block.paragraphs?.slice(0, 2))}<details class="domain-disclosure"><summary class="text-link">Découvrir ${arrow}<span class="sr-only"> : ${escape(block.title)}</span></summary><div class="domain-detail"><h3 data-domain-title>${escape(block.title)}</h3>${renderBody(block)}${note ? `<footer class="care-note"><h3>${escape(note.title)}</h3>${renderBody(note)}</footer>` : ''}</div></details></div></article>`;
    }
    if (presentation?.layout === 'cards') {
      const image = presentation.images?.[index];
      return `<article class="editorial-block editorial-image-card">${image ? cardImage(image) : ''}<div class="editorial-card-body"><h3>${blockTitle(block.title, presentation)}</h3>${renderBody(block)}</div></article>`;
    }
    return `<article${presentation ? ' class="editorial-block"' : ''}><h3>${blockTitle(block.title, presentation)}</h3>${presentation ? '<div>' : ''}${renderBody(block)}${presentation ? '</div>' : ''}</article>`;
  }).join('');
  return `${paragraphs(section.paragraphs, presentation?.emphasis)}${section.items ? list(section.items) : ''}${blocks ? (presentation ? `<div class="editorial-blocks">${blocks}</div>` : blocks) : ''}${section.faq ? faq(section.faq) : ''}${section.after ? (presentation ? `<div class="editorial-after">${paragraphs(section.after)}</div>` : paragraphs(section.after)) : ''}${actions(section.actions, presentation?.layout === 'frame' ? 'button-outline' : '')}`;
}

function cardImage(name) {
  return `<div class="editorial-card-image"><img src="/assets/${escape(name)}-800.webp" srcset="/assets/${escape(name)}-480.webp 480w, /assets/${escape(name)}-800.webp 800w" sizes="(min-width: 1440px) 600px, (min-width: 768px) 46vw, 92vw" width="800" height="450" alt="" loading="lazy" decoding="async"></div>`;
}

function illustration(name) {
  // Atmosphere images repeat no information from the text, so they are decorative.
  return `<div class="editorial-illustration"><img src="/assets/${escape(name)}-800.webp" srcset="/assets/${escape(name)}-480.webp 480w, /assets/${escape(name)}-800.webp 800w, /assets/${escape(name)}-1200.webp 1200w" sizes="(min-width: 1200px) 420px, (min-width: 840px) 35vw, calc(100vw - 40px)" width="800" height="600" alt="" loading="lazy" decoding="async"></div>`;
}

function pricingCards(pricing) {
  return pricing.entries.map(entry => {
    const ranged = entry.priceRange != null;
    const amount = ranged
      ? `${escape(entry.priceRange.min)}–${escape(entry.priceRange.max)} €`
      : entry.price == null ? 'Offert' : `${escape(entry.price)} €`;
    const formats = entry.formats?.length
      ? `<ul class="pricing-format-list" aria-label="Tarifs par durée">${entry.formats.map(format =>
          `<li><span>${escape(format.duration)}</span><span>${escape(format.price)} € TTC</span></li>`).join('')}</ul>`
      : '';
    return `<article class="editorial-block editorial-price-card">
      <div><h3>${escape(entry.name)}</h3><p class="pricing-duration">${escape(entry.duration)}</p></div>
      <p class="pricing-amount">${amount}${ranged || entry.price != null ? '<span class="pricing-tax">TTC</span>' : ''}</p>
      <p class="pricing-description">${escape(entry.description)}</p>
      ${formats}
    </article>`;
  }).join('');
}

export function editorialSection(section, index) {
  const heading = `${section.eyebrow ? `<p class="eyebrow">${escape(section.eyebrow)}</p>` : ''}<h2>${escape(section.title)}</h2>`;
  const presentation = section.presentation;
  if (!presentation) {
    return `<section class="section${index % 2 ? ' tinted' : ''}"><div class="container editorial-section">${heading}<div class="prose">${sectionContent(section)}</div></div></section>`;
  }
  const { layout = 'split', tone = 'paper', image } = presentation;
  const sectionClass = `section editorial-composition editorial-${escape(layout)} editorial-tone-${escape(tone)}`;
  if (layout === 'pricing') {
    const pricing = section.pricing;
    const headingId = escape(section.id || 'pricing');
    const primary = pricing.primary ? button(pricing.primary.text, pricing.primary.href) : '';
    const secondary = pricing.secondary ? `<a class="text-link" href="${escape(pricing.secondary.href)}">${escape(pricing.secondary.text)} ${arrow}</a>` : '';
    return `<section id="${headingId}" class="${sectionClass}" aria-labelledby="${headingId}-title">
      <div class="container editorial-composition-inner">
        <div class="editorial-heading">${heading.replace('<h2>', `<h2 id="${headingId}-title">`)}${paragraphs(section.paragraphs)}</div>
        <div class="editorial-copy">
          <div class="editorial-blocks editorial-price-grid">${pricingCards(pricing)}</div>
          <p class="pricing-note">${escape(pricing.note)}</p>
          <div class="editorial-actions pricing-actions">${primary}${secondary}</div>
        </div>
      </div>
    </section>`;
  }
  if (layout === 'split') {
    return `<section class="${sectionClass}${image ? ' editorial-has-image' : ''}"><div class="container editorial-composition-inner"><div class="editorial-copy"><div class="editorial-heading">${heading}</div>${sectionContent(section, presentation)}</div>${image ? illustration(image) : ''}</div></section>`;
  }
  if (layout === 'frame') {
    const introduction = paragraphs(section.paragraphs, presentation.emphasis);
    const remaining = { ...section, paragraphs: [] };
    return `<section class="${sectionClass}"><div class="container editorial-composition-inner"><div class="editorial-heading">${heading}${introduction}</div><div class="editorial-copy">${sectionContent(remaining, presentation)}</div></div></section>`;
  }
  return `<section class="${sectionClass}"><div class="container editorial-composition-inner"><div class="editorial-heading">${heading}${image ? illustration(image) : ''}</div><div class="editorial-copy">${sectionContent(section, presentation)}</div></div></section>`;
}
