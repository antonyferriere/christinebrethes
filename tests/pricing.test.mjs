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
  assert.deepEqual(offerPrices['coaching-professionnel'].entries,
    [discovery, coachingSession, ...coachingPrograms.entries]);
  assert.equal(offerPrices['coaching-professionnel'].title, 'Coaching individuel');
  assert.equal(offerPrices['coaching-professionnel'].entries.length, 5);
  assert.match(offerPrices['coaching-professionnel'].introduction, /Un premier échange offert et sans engagement afin de déterminer le parcours qui vous correspond/);
  assert.deepEqual(coachingPrograms.entries.map(({ name, duration, price }) =>
    [name, duration, price]), [
    ['Coaching Déclic', '3 séances · 2 mois', 210],
    ['Coaching Élan', '6 séances · 3 mois', 400],
    ['Coaching Transformation', '8 séances · 4 mois', 500],
  ]);
  for (const program of coachingPrograms.entries) assert.ok(program.description.length > 50);
  assert.equal(coachingPrograms.entries[0].startNewRow, true);
  assert.ok(coachingPrograms.entries.slice(1).every(entry => !entry.startNewRow));
});

test('pleine conscience : séance individuelle en premier et deux durées d’ateliers TTC', () => {
  assert.deepEqual(offerPrices['pleine-conscience'].entries, [meditationSession, meditationWorkshop]);
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
  assert.match(page, /id="tarifs-coaching-professionnel" class="section editorial-composition editorial-pricing/);
  assert.equal((page.match(/id="tarifs-coaching-professionnel"/g) || []).length, 1);
  assert.match(page, /href="\/tarifs\/"/);
  assert.doesNotMatch(page, /Parcours Ancrage|programmes-integratifs|coaching et méditation de pleine conscience, à construire/);
  assert.equal((page.match(/<h3>Coaching (Déclic|Élan|Transformation)<\/h3>/g) || []).length, 3);
  assert.match(page, /class="editorial-block editorial-price-card is-row-start">\s*<div><h3>Coaching Déclic<\/h3>/);
  const pricing = page.match(/<section id="tarifs-coaching-professionnel"[\s\S]*?<\/section>/)?.[0];
  assert.ok(pricing, 'La grille Coaching individuel est présente');
  assert.deepEqual([...pricing.matchAll(/<article class="editorial-block editorial-price-card[^"]*">\s*<div><h3>([^<]+)<\/h3>/g)].map(match => match[1]),
    ['Premier échange découverte', 'Séance individuelle', 'Coaching Déclic', 'Coaching Élan', 'Coaching Transformation']);
});

test('page Pleine conscience : ateliers en une carte, tarifs et visio explicites', () => {
  const page = html('accompagnements/pleine-conscience');
  assert.match(page, /editorial-price-card is-featured/);
  const pricesSection = page.match(/<section id="tarifs-pleine-conscience"[\s\S]*?<\/section>/)?.[0];
  assert.ok(pricesSection);
  assert.deepEqual([...pricesSection.matchAll(/<article class="editorial-block editorial-price-card[^"]*">\s*<div><h3>([^<]+)<\/h3>/g)].map(match => match[1]), ['Séance individuelle', 'Ateliers collectifs']);
  for (const value of ['25–35 €','25 € TTC','35 € TTC','1 h 30','60 €','présentiel ou en visioconférence']) assert.ok(page.includes(value), value);
  assert.equal((page.match(/<p class="pricing-amount">25–35 €/g) || []).length, 1);
  assert.doesNotMatch(page, /Cycle de 5 séances|275 €|350 €|programmes-integratifs/);
});

test('page Tarifs : programme de coaching dans sa rubrique et Santé & Travail sans hybride', () => {
  const page = html('tarifs');
  for (const value of ['60 €','25–35 €','75 €','210 €','400 €','500 €','Déclic','Élan','Transformation','Offert','Champhol','24 heures','Un accompagnement complémentaire','sur devis']) assert.ok(page.includes(value),value);
  assert.match(page, /href="https:\/\/www\.crenolibre\.fr\/prendre-rdv\/166171_brethes-christine"/);
  assert.match(page, /href="\/tarifs\/" aria-current="page"/);
  assert.equal((page.match(/id="tarifs-coaching-professionnel"/g) || []).length, 1);
  assert.doesNotMatch(page, /id="tarifs-sante-travail"|id="programmes-coaching"/);
  assert.deepEqual([...page.matchAll(/<section id="tarifs-coaching-professionnel"[\s\S]*?<\/section>/g)].map(match => (match[0].match(/class="editorial-block editorial-price-card/g) || []).length), [5]);
  const meditationIndex = page.indexOf('<section id="tarifs-pleine-conscience"');
  const coachingIndex = page.indexOf('<section id="tarifs-coaching-professionnel"');
  assert.ok(meditationIndex >= 0 && coachingIndex > meditationIndex, 'Pleine conscience précède Coaching');
  assert.match(page, /<section id="tarifs-pleine-conscience" class="section editorial-composition editorial-pricing editorial-tone-paper"/);
  assert.match(page, /<section id="tarifs-coaching-professionnel" class="section editorial-composition editorial-pricing editorial-tone-ivory"/);
  assert.match(page, /class="editorial-block editorial-price-card is-row-start">\s*<div><h3>Coaching Déclic<\/h3>/);
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


test('toutes les grilles gardent trois emplacements par ligne sur desktop', () => {
  const css = readFileSync('dist/styles/site.css', 'utf8');
  assert.match(css, /@media \(min-width: 960px\)\s*\{\s*\.editorial-pricing \.editorial-price-grid\s*\{\s*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);/);
  assert.doesNotMatch(css, /\.editorial-pricing \.editorial-price-grid:has\(/);
  assert.match(css, /@media \(min-width: 960px\)[\s\S]*?\.editorial-pricing \.editorial-price-card\.is-row-start\s*\{\s*grid-column:\s*1;/);
  assert.doesNotMatch(css, /border:\s*1px solid var\(--color-outline\);\s*border-radius:\s*var\(--radius-card\);\s*\}\s*\.editorial-tone-paper\.editorial-pricing/);
  assert.match(css, /\.editorial-pricing \.pricing-description\s*\{[^}]*margin: 0;/);
  for (const [path, amount] of [
    ['accompagnements/coaching-professionnel', 5],
    ['accompagnements/sante-travail', 2],
    ['accompagnements/pleine-conscience', 2],
  ]) {
    const page = html(path);
    const section = page.match(/<section id="tarifs-[^"]+" class="section editorial-composition editorial-pricing[^"]*"[^>]*>[\s\S]*?<\/section>/)?.[0];
    assert.ok(section, path);
    assert.equal((section.match(/class="editorial-block editorial-price-card/g) || []).length, amount, path);
  }
});
