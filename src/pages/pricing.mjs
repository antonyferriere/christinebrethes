import { pageHero } from '../components/page-hero.mjs';
import { pricingSection, pricingProgramsSection, pricingPractical } from '../components/pricing.mjs';
import { button } from '../components/ui.mjs';
import { site } from '../data/site.mjs';

export function pricingPage() {
  const breadcrumb = '<nav class="container breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><span>Tarifs &amp; modalités</span></nav>';
  return `${pageHero('tarifs',
    '<p class="eyebrow">En toute transparence</p><h1>Tarifs &amp; <em>modalités</em></h1><p class="lede">Un accompagnement à votre rythme, avec des tarifs clairs pour avancer sereinement.</p>' +
    button('Prendre rendez-vous', site.booking.url || '/contact/'),
    breadcrumb)}
    ${pricingSection('pleine-conscience', { compact: false })}
    ${pricingSection('coaching-professionnel', { compact: false })}
    ${pricingSection('sante-travail', { compact: false })}
    ${pricingProgramsSection({ compact: false })}
    <section class="section pricing-organizations"><div class="container pricing-organizations-inner">
      <div><p class="eyebrow">Entreprises &amp; organisations</p><h2>Des interventions conçues avec vous</h2><p>Ateliers, coaching, conférences et accompagnements collectifs sont proposés sur devis, selon vos besoins, le format et les modalités de chaque intervention.</p></div>
      <div>${button('Parlons de votre projet', '/contact/?profil=organisation', 'button-outline')}</div>
    </div></section>
    ${pricingPractical()}`;
}
