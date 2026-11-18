import { offerPrices, coachingPrograms, pricingTerms, careInformation } from '../data/pricing.mjs';
import { editorialSection } from './editorial-section.mjs';
import { site } from '../data/site.mjs';
import { escape } from './ui.mjs';

// Composition éditoriale réutilisée par les pages offres et Tarifs.
function editorialPriceBlock(offer, id, { compact = true, tone = 'ivory', secondary } = {}) {
  return editorialSection({
    id,
    eyebrow: offer.eyebrow,
    title: offer.title,
    paragraphs: [offer.introduction],
    presentation: { layout: 'pricing', tone },
    pricing: {
      entries: offer.entries,
      note: offer.note || 'Tous les prix affichés sont des prix finaux TTC.',
      primary: { text: 'Prendre rendez-vous', href: site.booking.url || '/contact/' },
      secondary: secondary ?? (compact
        ? { text: 'Tous les tarifs et modalités', href: '/tarifs/' }
        : null),
    },
  });
}

export function pricingSection(slug, { compact = true } = {}) {
  const offer = offerPrices[slug];
  if (!offer) return '';
  return editorialPriceBlock(offer, `tarifs-${slug}`, {
    compact, tone: compact ? 'sage' : 'ivory',
    secondary: compact
      ? { text: 'Tous les tarifs et modalités', href: '/tarifs/' }
      : { text: 'Découvrir cet accompagnement', href: `/accompagnements/${slug}/` },
  });
}

export function coachingProgramsSection({ compact = true } = {}) {
  return editorialPriceBlock(coachingPrograms, 'programmes-coaching', {
    compact, tone: compact ? 'paper' : 'sage',
    secondary: compact
      ? { text: 'Voir les tarifs et modalités', href: '/tarifs/#programmes-coaching' }
      : { text: 'Découvrir le coaching professionnel', href: '/accompagnements/coaching-professionnel/' },
  });
}

export function pricingPractical() {
  return `<section class="section pricing-practical" aria-labelledby="pricing-practical-title"><div class="container">
    <div class="section-heading"><p class="eyebrow">Pour vous accompagner sereinement</p><h2 id="pricing-practical-title">Informations pratiques</h2></div>
    <div class="pricing-terms">${pricingTerms.map(item => `<article class="pricing-term"><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p></article>`).join('')}</div>
  </div></section>
  <aside class="container pricing-care-note care-note"><h2>Un accompagnement complémentaire</h2><p>${escape(careInformation)}</p></aside>`;
}
