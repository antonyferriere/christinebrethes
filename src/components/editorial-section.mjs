import { readdirSync } from 'node:fs';
import { escape, button, list, faq, arrow } from './ui.mjs';
import { site } from '../data/site.mjs';

export const paragraphs = (items = [], emphasis, emphasizeQuotes = false) => items.map((text, index) =>
  `<p${index === emphasis || (emphasizeQuotes && text.startsWith('«') && text.endsWith('»')) ? ' class="editorial-emphasis"' : ''}>${escape(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')}</p>`).join('');
export const actions = (items = [], variant = '') => items.length ? `<div class="editorial-actions">${items.map(({ label, audience }) => button(label, audience === 'organisation' ? '/contact/?profil=organisation' : audience === 'contact' ? '/contact/' : site.booking.url || '/contact/', variant)).join('')}</div>` : '';

function blockTitle(title, presentation) {
  if (presentation?.layout !== 'narrative' || !title.includes(' — ')) return escape(title);
  const separator = title.indexOf(' — ');
  return `<span class="editorial-title-primary">${escape(title.slice(0, separator))}</span><span class="sr-only"> — </span><span class="editorial-title-secondary">${escape(title.slice(separator + 3))}</span>`;
}

// Decorative line icons in the editorial order of the three benefit groups.
const benefitIcons = [
  [
    '<path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M5 16h6a3 3 0 1 1-3 3"/>',
    '<path d="M12 2v2m7.1.9-1.4 1.4M22 10h-2M5 5l1.4 1.4M4 10H2M8 11a5 5 0 0 1 9-3"/><path d="M7 20h11a4 4 0 0 0 0-8 5 5 0 0 0-9-1 4.5 4.5 0 1 0-2 9Z"/>',
    '<circle cx="12" cy="12" r="4"/><path d="M8 3H4a1 1 0 0 0-1 1v4m13-5h4a1 1 0 0 1 1 1v4m0 8v4a1 1 0 0 1-1 1h-4m-8 0H4a1 1 0 0 1-1-1v-4"/>',
    '<path d="M20.8 8.6c0 3.9-8.8 9.4-8.8 9.4S3.2 12.5 3.2 8.6a4.6 4.6 0 0 1 8.8-2 4.6 4.6 0 0 1 8.8 2Z"/><path d="M8 11h2l1-2 2 4 1-2h2"/>',
  ],
  [
    '<path d="M2 12h4l3-7 4 14 3-7h6"/>',
    '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    '<path d="M20.8 14.2A9 9 0 0 1 9.8 3.2a9 9 0 1 0 11 11Z"/><path d="M18 3v4m-2-2h4"/>',
    '<path d="M20.8 8.6c0 3.9-8.8 10.4-8.8 10.4S3.2 12.5 3.2 8.6a4.6 4.6 0 0 1 8.8-2 4.6 4.6 0 0 1 8.8 2Z"/><path d="M2 12h5l2-3 3 5 2-2h8"/>',
  ],
  [
    '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/>',
    '<path d="M20 3C11 3 5 6 5 13a6 6 0 0 0 6 6c7 0 9-7 9-16ZM3 21l11-11"/>',
    '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ],
];

function benefitIcon(groupIndex, cardIndex) {
  const shape = benefitIcons[groupIndex]?.[cardIndex];
  if (!shape) return '';
  return `<span class="benefit-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shape}</svg></span>`;
}

function sectionContent(section, presentation) {
  const renderBody = block => `${paragraphs(block.paragraphs)}${block.items ? list(block.items) : ''}`;
  const cards = (section.blocks || []).map((block, index, all) => {
    if (block.cards) {
      const items = block.cards.map((card, cardIndex) => `<li class="benefit-item">${benefitIcon(index, cardIndex)}<div class="benefit-copy"><h4 class="benefit-title">${escape(card.title)}</h4><p>${escape(card.text)}</p></div></li>`).join('');
      return `<div class="benefit-group"><h3>${escape(block.title)}</h3><ul class="benefit-list" role="list">${items}</ul></div>`;
    }
    if (presentation?.layout === 'domains') {
      if (presentation.notes?.includes(index)) return '';
      const note = presentation.notes?.includes(index + 1) ? all[index + 1] : null;
      const image = presentation.images?.[index];
      return `<article class="editorial-block editorial-domain-card offer-card">${image ? cardImage(image, 'domains') : ''}<div class="editorial-card-body offer-content"><h3>${escape(block.title)}</h3>${paragraphs(block.paragraphs?.slice(0, 2))}<details class="domain-disclosure"><summary class="text-link">Découvrir ${arrow}<span class="sr-only"> : ${escape(block.title)}</span></summary><div class="domain-detail"><h3 data-domain-title>${escape(block.title)}</h3>${renderBody(block)}${note ? `<footer class="care-note"><h3>${escape(note.title)}</h3>${renderBody(note)}</footer>` : ''}</div></details></div></article>`;
    }
    if (presentation?.layout === 'cards') {
      const image = presentation.images?.[index];
      return `<article class="editorial-block editorial-image-card">${image ? cardImage(image) : ''}<div class="editorial-card-body"><h3>${blockTitle(block.title, presentation)}</h3>${renderBody(block)}</div></article>`;
    }
    return `<article${presentation ? ' class="editorial-block"' : ''}><h3>${blockTitle(block.title, presentation)}</h3>${presentation ? '<div>' : ''}${renderBody(block)}${presentation ? '</div>' : ''}</article>`;
  }).join('');
  const tools = section.tools;
  const toolsList = tools ? `<aside class="editorial-tools"><h3>${escape(tools.intro)}</h3>${list(tools.items)}</aside>` : '';
  const blocks = cards + toolsList;
  return `${paragraphs(section.paragraphs, presentation?.emphasis)}${section.items ? list(section.items) : ''}${blocks ? (presentation ? `<div class="editorial-blocks">${blocks}</div>` : blocks) : ''}${section.faq ? faq(section.faq) : ''}${section.after ? (presentation ? `<div class="editorial-after">${paragraphs(section.after)}</div>` : paragraphs(section.after)) : ''}${actions(section.actions, presentation?.layout === 'frame' ? 'button-outline' : '')}`;
}

// Discover actual WebP variants at build time instead of guessing the maximum
// resolution from the directory name. New illustrations can use any width.
function editorialSrcset(name) {
  const slash = name.lastIndexOf('/');
  const directory = name.slice(0, slash + 1);
  const prefix = name.slice(slash + 1) + '-';
  const widths = readdirSync(new URL('../../public/assets/' + directory, import.meta.url), { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.startsWith(prefix))
    .map(entry => entry.name.slice(prefix.length).match(/^([1-9]\d*)\.webp$/))
    .filter(Boolean)
    .map(match => Number(match[1]))
    .sort((a, b) => a - b);
  if (!widths.includes(800)) throw new Error('Missing editorial fallback: ' + name + '-800.webp');
  return widths.map(width => `/assets/${escape(name)}-${width}.webp ${width}w`).join(', ');
}
function cardImage(name, layout = 'cards') {
  // Two-column domains and three-column cards have different image slots.
  // Allow for the vertical overscan of the parallax crop.
  const sizes = layout === 'domains'
    ? '(min-width: 1440px) 680px, (min-width: 768px) 50vw, 100vw'
    : '(min-width: 1440px) 440px, (min-width: 768px) 34vw, 100vw';
  return `<div class="editorial-card-image"><img src="/assets/${escape(name)}-800.webp" srcset="${editorialSrcset(name)}" sizes="${sizes}" width="800" height="450" alt="" loading="lazy" decoding="async"></div>`;
}

function illustration(name, layout = 'split', alt = '') {
  // Desktop split images stretch with the text: cover can scale the source
  // well beyond the column width. Budget 800px before DPR is applied.
  const sizes = layout === 'split'
    ? '(min-width: 840px) 800px, (min-width: 600px) 92vw, calc(100vw - 40px)'
    : '(min-width: 1440px) 1280px, 92vw';
  return `<div class="editorial-illustration"><img src="/assets/${escape(name)}-800.webp" srcset="${editorialSrcset(name)}" sizes="${sizes}" width="800" height="600" alt="${escape(alt)}" loading="lazy" decoding="async"></div>`;
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
    return `<article class="editorial-block editorial-price-card${entry.featured ? ' is-featured' : ''}${entry.startNewRow ? ' is-row-start' : ''}">
      <div><h3>${escape(entry.name)}</h3><p class="pricing-duration">${escape(entry.duration)}</p></div>
      <p class="pricing-amount">${amount}${ranged || entry.price != null ? '<span class="pricing-tax">TTC</span>' : ''}</p>
      <p class="pricing-description">${escape(entry.description)}</p>
      ${formats}
    </article>`;
  }).join('');
}


function disclosureToggle(title) {
  return `<summary class="career-toggle"><span class="review-toggle"><span class="review-more">Lire la suite</span><span class="review-less">Réduire</span> <span aria-hidden="true">↘</span></span><span class="sr-only"> : ${escape(title)}</span></summary>`;
}

function careerSection(section) {
  const chapters = (section.blocks || []).map((block, index) => {
    const [first, ...remaining] = block.paragraphs || [];
    const detail = remaining.length || block.items ? `<details class="career-disclosure">
      ${disclosureToggle(block.title)}
      <div class="career-detail">${paragraphs(remaining)}${block.items ? list(block.items) : ''}</div>
    </details>` : '';
    return `<li>
      <div class="career-step" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>
      <article class="career-entry">
        <div class="career-copy"><h3>${escape(block.title)}</h3>${first === undefined ? '' : paragraphs([first])}${detail}</div>
      </article>
    </li>`;
  }).join('');
  return `<section class="section career-section" aria-labelledby="career-title"><div class="container">
    <h2 id="career-title">${escape(section.title)}</h2>${paragraphs(section.paragraphs)}
    <ol class="career-timeline" role="list">${chapters}</ol>
  </div></section>`;
}

export function editorialSection(section, index) {
  const heading = `${section.eyebrow ? `<p class="eyebrow">${escape(section.eyebrow)}</p>` : ''}<h2>${escape(section.title)}</h2>`;
  const presentation = section.presentation;
  if (presentation?.layout === 'career') return careerSection(section);
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
    if (presentation.previewParagraphs) {
      const preview = section.paragraphs.slice(0, presentation.previewParagraphs);
      const rest = section.paragraphs.slice(presentation.previewParagraphs);
      return `<section class="${sectionClass} editorial-has-image editorial-expandable">
        <article class="container editorial-composition-inner">
          <div class="editorial-copy"><div class="editorial-heading">${heading}</div>${paragraphs(preview, undefined, true)}</div>
          ${illustration(image, layout, presentation.imageAlt)}
          <details class="career-disclosure">${disclosureToggle(section.title)}
            <div class="editorial-copy">${paragraphs(rest, undefined, true)}</div>
          </details>
        </article>
      </section>`;
    }
    return `<section class="${sectionClass}${image ? ' editorial-has-image' : ''}"><div class="container editorial-composition-inner"><div class="editorial-copy"><div class="editorial-heading">${heading}</div>${sectionContent(section, presentation)}</div>${image ? illustration(image, layout) : ''}</div></section>`;
  }
  if (layout === 'frame') {
    const introduction = paragraphs(section.paragraphs, presentation.emphasis);
    const remaining = { ...section, paragraphs: [] };
    return `<section class="${sectionClass}"><div class="container editorial-composition-inner"><div class="editorial-heading">${heading}${introduction}</div><div class="editorial-copy">${sectionContent(remaining, presentation)}</div></div></section>`;
  }
  return `<section class="${sectionClass}"><div class="container editorial-composition-inner"><div class="editorial-heading">${heading}${image ? illustration(image, layout) : ''}</div><div class="editorial-copy">${sectionContent(section, presentation)}</div></div></section>`;
}
