import { offerPrices, pricingTerms, careInformation } from '../data/pricing.mjs';
import { site } from '../data/site.mjs';
import { button, escape, arrow } from './ui.mjs';

function priceCard(entry) {
  const price = entry.price === null ? 'Offert' : `${entry.price} €`;
  return `<article class="pricing-card">
    <div class="pricing-card-top"><h3>${escape(entry.name)}</h3><p class="pricing-duration">${escape(entry.duration)}</p></div>
    <p class="pricing-amount">${price}${entry.price === null ? '' : '<span class="pricing-tax">TTC</span>'}</p>
    <p class="pricing-description">${escape(entry.description)}</p>
  </article>`;
}
export function pricingSection(slug, { compact = true } = {}) {
  const offer = offerPrices[slug];
  if (!offer) return '';
  const id = compact ? 'tarifs-individuels' : `tarifs-${slug}`;
  return `<section class="section pricing-section${compact ? ' pricing-section-compact' : ''}" aria-labelledby="${id}">
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">${escape(offer.eyebrow)}</p>
        <h2 id="${id}">${escape(offer.title)}</h2>
        <p class="lede">${escape(offer.introduction)}</p>
      </div>
      <div class="pricing-grid">${offer.entries.map(priceCard).join('')}</div>
      <p class="pricing-note">Prix finaux TTC.${offer.entries.some(entry => entry.name === 'Cycle de 5 séances') ? ' Les parcours de 5 séances sont valables 6 mois à compter de la première séance.' : ''}</p>
      <div class="pricing-actions">
        ${button('Prendre rendez-vous', site.booking.url || '/contact/')}
        ${compact
          ? `<a class="text-link" href="/tarifs/">Tous les tarifs et modalités ${arrow}</a>`
          : `<a class="text-link" href="/accompagnements/${escape(slug)}/">Découvrir cet accompagnement ${arrow}</a>`}
      </div>
    </div>
  </section>`;
}
export function pricingPractical() {
  return `<section class="section pricing-practical" aria-labelledby="pricing-practical-title"><div class="container">
    <div class="section-heading"><p class="eyebrow">Pour vous accompagner sereinement</p><h2 id="pricing-practical-title">Informations pratiques</h2></div>
    <div class="pricing-terms">${pricingTerms.map(item => `<article class="pricing-term"><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p></article>`).join('')}</div>
  </div></section>
  <aside class="container pricing-care-note care-note"><h2>Un accompagnement complémentaire</h2><p>${escape(careInformation)}</p></aside>`;
}
