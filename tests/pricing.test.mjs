import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { offerPrices, hybridPrograms, coachingSession, discovery, meditationWorkshop, pricingTerms } from '../src/data/pricing.mjs';
import meditation from '../src/data/offers/pleine-conscience.mjs';
import health from '../src/data/offers/sante-travail.mjs';

const html = path => readFileSync(`dist/${path}/index.html`, 'utf8');

test('prix TTC des séances et des deux formats d’ateliers', () => {
  assert.equal(coachingSession.price, 75);
  assert.equal(discovery.price, null);
  assert.deepEqual(offerPrices['coaching-professionnel'].entries.map(item => item.price), [null, 75]);
  assert.deepEqual(offerPrices['sante-travail'].entries.map(item => item.price), [null, 75]);
  assert.equal(offerPrices['pleine-conscience'].entries.length, 2);
  assert.equal(offerPrices['pleine-conscience'].entries[1], meditationWorkshop);
  assert.deepEqual(meditationWorkshop.priceRange, { min: 25, max: 35 });
  assert.deepEqual(meditationWorkshop.formats.map(({ duration, price }) => [duration, price]),
    [['1 h', 25], ['1 h 30', 35]]);
  assert.match(meditationWorkshop.description, /présentiel ou en visioconférence/);
  assert.deepEqual(hybridPrograms.entries.map(item => [item.price, item.duration]), [[400, '6 séances sur 3 mois'], [500, '8 séances sur 4 mois']]);
});

test('les deux sections demandées passent sur fond ivoire', () => {
  const frame = health.sections.find(item => item.eyebrow === 'Le cadre');
  const formats = meditation.sections.find(item => item.title === 'Des formats adaptés à vos besoins');
  assert.equal(frame.presentation.tone, 'ivory');
  assert.equal(formats.presentation.tone, 'ivory');
});

test('la page tarifs utilise le composant éditorial partagé', () => {
  const page = html('tarifs');
  for (const phrase of ['60 €', '25–35 €', '1 h', '1 h 30', '25 € TTC', '35 € TTC', 'présentiel ou en visioconférence', '75 €', '400 €', '500 €', '30 minutes', 'Offert', 'sur devis', 'Champhol', '24 heures', 'Programmes personnalisés', 'Un accompagnement complémentaire']) {
    assert.ok(page.includes(phrase), phrase);
  }
  assert.match(page, /editorial-composition editorial-pricing editorial-tone-ivory/);
  assert.match(page, /editorial-composition editorial-pricing editorial-tone-sage/);
  assert.match(page, /Parcours Élan/);
  assert.match(page, /Parcours Ancrage/);
  assert.match(page, /href="https:\/\/www\.crenolibre\.fr\/prendre-rdv\/166171_brethes-christine"/);
  assert.match(page, /href="\/tarifs\/" aria-current="page"/);
  assert.equal(pricingTerms.length, 5);
  assert.doesNotMatch(page, /Cycle de 5 séances|275 €|350 €|valables pendant 6 mois/);
});

test('les offres individuelles présentent les prix actualisés', () => {
  const mindfulness = html('accompagnements/pleine-conscience');
  const coaching = html('accompagnements/coaching-professionnel');
  const healthHtml = html('accompagnements/sante-travail');
  for (const page of [mindfulness, coaching, healthHtml]) {
    assert.match(page, /href="\/tarifs\/"/);
    assert.match(page, /prix finaux TTC/i);
    assert.match(page, /editorial-pricing/);
  }
  assert.match(mindfulness, /25–35 €/);
  assert.match(mindfulness, /25 € TTC/);
  assert.match(mindfulness, /35 € TTC/);
  assert.match(mindfulness, /1 h 30/);
  assert.match(mindfulness, /présentiel ou en visioconférence/);
  assert.equal((mindfulness.match(/<p class="pricing-amount">25–35 €/g) || []).length, 1);
  assert.match(coaching, /400 €/);
  assert.match(coaching, /500 €/);
  assert.match(healthHtml, /75 €/);
  assert.match(healthHtml, /Offert/);
  assert.match(healthHtml, /programmes-integratifs/);
  for (const page of [mindfulness, coaching, healthHtml]) assert.doesNotMatch(page, /Cycle de 5 séances|275 €|350 €/);
});

test('accueil et contact conservent les liens, organisations sur devis', () => {
  assert.match(html(''), /Consulter les tarifs/);
  assert.match(html('contact'), /Consulter les tarifs/);
  assert.match(html('entreprises-organisations'), /sur devis/);
});
