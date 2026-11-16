import { editorialSection, paragraphs, actions } from '../components/editorial-section.mjs';
import { scientificReferencesSection } from '../components/scientific-references.mjs';
import { pageHero } from '../components/page-hero.mjs';
import { escape } from '../components/ui.mjs';

export function editorialPage(page) {
  const breadcrumb = page.slug === 'a-propos' ? '' : `<nav class="container breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><a href="/accompagnements/">Accompagnements</a><span aria-hidden="true">/</span><span>${escape(page.title)}</span></nav>`;
  return `<div class="editorial-page">${pageHero(page.slug, `<p class="eyebrow">${escape(page.eyebrow)}</p><h1${page.heroLines ? ' class="hero-title-lines"' : ''}>${page.heroLines ? page.heroLines.map((line, i) => `<span${i === 1 ? ' class="accent"' : ''}>${escape(line)}</span>`).join('') : escape(page.title)}</h1><p class="lede">${escape(page.summary)}</p>${paragraphs(page.heroParagraphs)}${actions(page.heroActions)}`, breadcrumb)}${page.sections.filter(section => section.enabled !== false).map(editorialSection).join('')}${page.slug === 'pleine-conscience' ? scientificReferencesSection() : ''}</div>`;
}
