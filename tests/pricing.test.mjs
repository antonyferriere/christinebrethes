import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { offerPrices, coachingSession, discovery, pricingTerms } from '../src/data/pricing.mjs';
const html = path => readFileSync(`dist/${path}/index.html`, 'utf8');

test('prix finaux TTC centralisés et identiques entre les offres', () => {
  assert.equal(coachingSession.price, 75);
  assert.equal(discovery.price, null);
  assert.equal(offerPrices['sante-travail'].entries[0], discovery);
  assert.equal(offerPrices['sante-travail'].entries[1], coachingSession);
  assert.equal(offerPrices['coaching-professionnel'].entries[2].price, 350);
  assert.deepEqual(offerPrices['pleine-conscience'].entries.map(item => item.price), [60, 275, 25]);
});

test('page tarifs complète, accessible et réservations proposées', () => {
  const page = html('tarifs');
  for (const amount of ['60 €', '275 €', '25 €', '75 €', '350 €']) assert.ok(page.includes(amount), amount);
  for (const phrase of ['30 minutes', 'Offert', 'Prix finaux TTC', 'sur devis', 'Champhol', '24 heures', '6 mois', 'Un accompagnement complémentaire']) assert.ok(page.includes(phrase), phrase);
  assert.match(page, /href="https:\/\/www\.crenolibre\.fr\/prendre-rdv\/166171_brethes-christine"/);
  assert.match(page, /href="\/tarifs\/" aria-current="page"/);
  assert.equal(pricingTerms.length, 5);
});

test('les trois offres présentent les montants applicables', () => {
  const meditation = html('accompagnements/pleine-conscience');
  const coaching = html('accompagnements/coaching-professionnel');
  const health = html('accompagnements/sante-travail');
  for (const page of [meditation, coaching, health]) {
    assert.match(page, /href="\/tarifs\/"/);
    assert.match(page, /Prix finaux TTC/);
  }
  assert.match(meditation, /25 €/);
  assert.match(meditation, /275 €/);
  assert.match(coaching, /350 €/);
  assert.match(health, /75 €/);
  assert.match(health, /Offert/);
  assert.doesNotMatch(health, /350 €/);
});

test('liens vers les tarifs sur accueil et contact, devis organisations', () => {
  assert.match(html(''), /Consulter les tarifs/);
  assert.match(html('contact'), /Consulter les tarifs/);
  assert.match(html('entreprises-organisations'), /sur devis/);
});
