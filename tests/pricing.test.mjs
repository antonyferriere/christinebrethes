import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  discovery, coachingSession, coachingPrograms,
  meditationSession, meditationWorkshop, offerPrices, pricingTerms,
} from '../src/data/pricing.mjs';
import meditation from '../src/data/offers/pleine-conscience.mjs';
import health from '../src/data/offers/sante-travail.mjs';
import { site } from '../src/data/site.mjs';

const html = path => readFileSync(`dist/${path}/index.html`, 'utf8');

test('coaching : première rencontre offerte, séance à 75 € et trois programmes TTC', () => {
  assert.equal(discovery.price, null);
  assert.equal(discovery.duration, '30 minutes');
  assert.equal(coachingSession.price, 75);
  assert.equal(coachingSession.duration, '1 heure');
  assert.deepEqual(offerPrices['coaching-professionnel'].entries, [discovery, coachingSession]);
  assert.deepEqual(coachingPrograms.entries.map(({ name, duration, price }) =>
    [name, duration, price]), [
    ['Coaching Déclic', '3 séances · 2 mois', 210],
    ['Coaching Élan', '6 séances · 3 mois', 400],
    ['Coaching Transformation', '8 séances · 4 mois', 500],
  ]);
  for (const program of coachingPrograms.entries) assert.ok(program.description.length > 50);
});

test('pleine conscience : ateliers collectifs prioritaires et deux durées TTC', () => {
  assert.deepEqual(offerPrices['pleine-conscience'].entries, [meditationWorkshop, meditationSession]);
  assert.equal(meditationSession.price, 60);
  assert.equal(meditationWorkshop.featured, true);
  assert.deepEqual(meditationWorkshop.priceRange, { min: 25, max: 35 });
  assert.deepEqual(meditationWorkshop.formats.map(({ duration, price }) =>
    [duration, price]), [['1 h', 25], ['1 h 30', 35]]);
  assert.match(meditationWorkshop.description, /présentiel ou en visioconférence/);
  const formats = meditation.sections.find(section => section.title === 'Des formats adaptés à vos besoins');
  assert.equal(formats.presentation.tone, 'ivory');
  assert.deepEqual(formats.blocks.map(b => b.title), ['Séances individuelles', 'Ateliers collectifs', 'Interventions en entreprise']);
  assert.equal(formats.presentation.images.length, formats.blocks.length);
});

test('Santé & Travail : uniquement échange offert et séance 75 €, sans programme hybride tarifé', () => {
  assert.deepEqual(offerPrices['sante-travail'].entries, [discovery, coachingSession]);
  const frame = health.sections.find(section => section.eyebrow === 'Le cadre');
  assert.equal(frame.presentation.tone, 'ivory');
  const page = html('accompagnements/sante-travail');
  assert.match(page, /30 minutes/);
  assert.match(page, /Offert/);
  assert.match(page, /75 €/);
  assert.doesNotMatch(page, /programmes-coaching|programmes-integratifs|Coaching Déclic|Coaching Élan|Coaching Transformation|210 €|400 €|500 €/);
});

test('page Coaching : prix et descriptions des trois programmes dans les compositions éditoriales', () => {
  const page = html('accompagnements/coaching-professionnel');
  for (const value of ['Coaching Déclic','Coaching Élan','Coaching Transformation','210 €','400 €','500 €','3 séances · 2 mois','6 séances · 3 mois','8 séances · 4 mois']) {
    assert.ok(page.includes(value), value);
  }
  assert.match(page, /id="programmes-coaching" class="section editorial-composition editorial-pricing/);
  assert.match(page, /href="\/tarifs\/#programmes-coaching"/);
  assert.doesNotMatch(page, /Parcours Ancrage|programmes-integratifs|coaching et méditation de pleine conscience, à construire/);
  assert.equal((page.match(/<h3>Coaching (Déclic|Élan|Transformation)<\/h3>/g) || []).length, 3);
});

test('page Pleine conscience : ateliers en une carte, tarifs et visio explicites', () => {
  const page = html('accompagnements/pleine-conscience');
  assert.match(page, /editorial-price-card is-featured/);
  for (const value of ['25–35 €','25 € TTC','35 € TTC','1 h 30','60 €','présentiel ou en visioconférence']) assert.ok(page.includes(value), value);
  assert.equal((page.match(/<p class="pricing-amount">25–35 €/g) || []).length, 1);
  assert.doesNotMatch(page, /Cycle de 5 séances|275 €|350 €|programmes-integratifs/);
});

test('page Tarifs : programme de coaching dans sa rubrique et Santé & Travail sans hybride', () => {
  const page = html('tarifs');
  for (const value of ['60 €','25–35 €','75 €','210 €','400 €','500 €','Déclic','Élan','Transformation','Offert','Champhol','24 heures','Un accompagnement complémentaire','sur devis']) assert.ok(page.includes(value),value);
  assert.match(page, /href="https:\/\/www\.crenolibre\.fr\/prendre-rdv\/166171_brethes-christine"/);
  assert.match(page, /href="\/tarifs\/" aria-current="page"/);
  assert.equal((page.match(/id="programmes-coaching"/g)||[]).length,1);
  assert.ok(page.indexOf('id="programmes-coaching"') < page.indexOf('id="tarifs-sante-travail"'));
  assert.doesNotMatch(page, /Parcours Ancrage|Cycle de 5 séances|275 €|350 €|valables pendant 6 mois|programmes-integratifs/);
  assert.equal(pricingTerms.length,5);
  assert.match(pricingTerms[1].text, /programmes de coaching/);
  assert.match(pricingTerms[2].text, /transitions de carrière/);
});

test('liens et structure commerciale cohérents dans le site', () => {
  for (const page of [
    html('tarifs'),
    html('accompagnements/coaching-professionnel'),
    html('accompagnements/pleine-conscience'),
    html('accompagnements/sante-travail'),
  ]) {
    assert.match(page, /editorial-composition editorial-pricing/);
    assert.match(page, /href="\/tarifs\/"/);
    assert.match(page, new RegExp(site.booking.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(html(''), /Consulter les tarifs/);
  assert.match(html('contact'), /Consulter les tarifs/);
  assert.match(html('entreprises-organisations'), /sur devis/);
});
