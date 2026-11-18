import { editorialSection, paragraphs, actions } from '../components/editorial-section.mjs';
import { scientificReferencesSection } from '../components/scientific-references.mjs';
import { pageHero } from '../components/page-hero.mjs';
import { escape } from '../components/ui.mjs';
import { pricingSection, coachingProgramsSection } from '../components/pricing.mjs';
const pricingPlacement = {
  'coaching-professionnel': 'Un accompagnement adapté à votre situation',
  'sante-travail': 'Un accompagnement personnalisé, respectueux de votre rythme',
  'pleine-conscience': 'Des formats adaptés à vos besoins',
};

export function editorialPage(page) {
  const breadcrumb = page.slug === 'a-propos' ? '' : `<nav class="container breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><a href="/accompagnements/">Accompagnements</a><span aria-hidden="true">/</span><span>${escape(page.title)}</span></nav>`;
  return `<div class="editorial-page">${pageHero(page.slug, `<p class="eyebrow">${escape(page.eyebrow)}</p><h1${page.heroLines ? ' class="hero-title-lines"' : ''}>${page.heroLines ? page.heroLines.map((line, i) => `<span${i === 1 ? ' class="accent"' : ''}>${escape(line)}</span>`).join('') : escape(page.title)}</h1><p class="lede">${escape(page.summary)}</p>${paragraphs(page.heroParagraphs)}${actions(page.heroActions)}`, breadcrumb)}${page.sections.filter(section => section.enabled !== false).map(section => editorialSection(section) + (pricingPlacement[page.slug] === section.title ? pricingSection(page.slug) + (page.slug === 'coaching-professionnel' ? coachingProgramsSection() : '') : '')).join('')}${page.slug === 'pleine-conscience' ? scientificReferencesSection() : ''}</div>`;
}
