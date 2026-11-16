import { escape, button, list, faq } from './ui.mjs';
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
  const blocks = (section.blocks || []).map((block, index) => `<article${presentation ? ` class="editorial-block${presentation.notes?.includes(index) ? ' editorial-note' : ''}"` : ''}><h3>${blockTitle(block.title, presentation)}</h3>${presentation ? '<div>' : ''}${paragraphs(block.paragraphs)}${block.items ? list(block.items) : ''}${presentation ? '</div>' : ''}</article>`).join('');
  return `${paragraphs(section.paragraphs, presentation?.emphasis)}${section.items ? list(section.items) : ''}${blocks ? (presentation ? `<div class="editorial-blocks">${blocks}</div>` : blocks) : ''}${section.faq ? faq(section.faq) : ''}${section.after ? (presentation ? `<div class="editorial-after">${paragraphs(section.after)}</div>` : paragraphs(section.after)) : ''}${actions(section.actions, presentation?.layout === 'frame' ? 'button-outline' : '')}`;
}

function illustration(name) {
  // Atmosphere images repeat no information from the text, so they are decorative.
  return `<div class="editorial-illustration"><img src="/assets/${escape(name)}-800.webp" srcset="/assets/${escape(name)}-480.webp 480w, /assets/${escape(name)}-800.webp 800w, /assets/${escape(name)}-1200.webp 1200w" sizes="(min-width: 1200px) 420px, (min-width: 840px) 35vw, calc(100vw - 40px)" width="800" height="600" alt="" loading="lazy" decoding="async"></div>`;
}

export function editorialSection(section, index) {
  const heading = `${section.eyebrow ? `<p class="eyebrow">${escape(section.eyebrow)}</p>` : ''}<h2>${escape(section.title)}</h2>`;
  const presentation = section.presentation;
  if (!presentation) {
    return `<section class="section${index % 2 ? ' tinted' : ''}"><div class="container editorial-section">${heading}<div class="prose">${sectionContent(section)}</div></div></section>`;
  }
  const { layout = 'split', tone = 'paper', image } = presentation;
  const sectionClass = `section editorial-composition editorial-${escape(layout)} editorial-tone-${escape(tone)}`;
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
