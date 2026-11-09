import { scientificReferencesSection } from '../components/scientific-references.mjs';
import { pageHero } from '../components/page-hero.mjs';
import { escape, button, list, faq } from '../components/ui.mjs';
import { site } from '../data/site.mjs';

const paragraphs = (items = []) => items.map(text => `<p>${escape(text)}</p>`).join('');
const actions = (items = []) => items.length ? `<div class="editorial-actions">${items.map(({ label, audience }) => button(label, audience === 'organisation' ? '/contact/?profil=organisation' : audience === 'contact' ? '/contact/' : site.booking.url || '/contact/')).join('')}</div>` : '';
function sectionContent(section) {
  return `${paragraphs(section.paragraphs)}${section.items ? list(section.items) : ''}${(section.blocks || []).map(block => `<article><h3>${escape(block.title)}</h3>${paragraphs(block.paragraphs)}${block.items ? list(block.items) : ''}</article>`).join('')}${section.faq ? faq(section.faq) : ''}${paragraphs(section.after)}${actions(section.actions)}`;
}
export function editorialPage(page) {
  const breadcrumb = page.slug === 'a-propos' ? '' : `<nav class="container breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><a href="/accompagnements/">Accompagnements</a><span aria-hidden="true">/</span><span>${escape(page.title)}</span></nav>`;
  return `<div class="editorial-page">${pageHero(page.slug, `<p class="eyebrow">${escape(page.eyebrow)}</p><h1${page.heroLines ? ' class="hero-title-lines"' : ''}>${page.heroLines ? page.heroLines.map((line, i) => `<span${i === 1 ? ' class="accent"' : ''}>${escape(line)}</span>`).join('') : escape(page.title)}</h1><p class="lede">${escape(page.summary)}</p>${paragraphs(page.heroParagraphs)}${actions(page.heroActions)}`, breadcrumb)}${page.sections.filter(section => section.enabled !== false).map((section, index) => `<section class="section${index % 2 ? ' tinted' : ''}"><div class="container editorial-section">${section.eyebrow ? `<p class="eyebrow">${escape(section.eyebrow)}</p>` : ''}<h2>${escape(section.title)}</h2><div class="prose">${sectionContent(section)}</div></div></section>`).join('')}${page.slug === 'pleine-conscience' ? scientificReferencesSection() : ''}</div>`;
}
