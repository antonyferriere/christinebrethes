import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { editorialSection } from '../src/components/editorial-section.mjs';
import { offers } from '../src/data/offers.mjs';
import about from '../src/data/about.mjs';

test('chaque carte éditoriale illustrée possède un visuel local responsive', () => {
  for (const page of [...offers, about]) {
    for (const section of page.sections.filter(section => section.presentation?.layout === 'cards' && section.presentation.images)) {
      assert.equal(section.presentation.images.length, section.blocks.length);
      for (const name of section.presentation.images) {
        for (const size of [480, 800]) assert.ok(existsSync(`public/assets/${name}-${size}.webp`));
      }
      const html = editorialSection(section, 0);
      assert.equal((html.match(/class="editorial-card-image"/g) || []).length, section.blocks.length);
      assert.match(html, /loading="lazy"/);
    }
  }
});

test('les trois publics de pleine conscience gardent leurs titres en deux parties dans des cartes sans image', () => {
  const page = offers.find(page => page.slug === 'pleine-conscience');
  const section = page.sections.find(section => section.title === "À qui s'adresse mon accompagnement ?");
  assert.equal(section.presentation.layout, 'cards');
  const html = editorialSection(section);
  const cards = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, 3);
  cards.forEach(([card], index) => {
    const [primary, secondary] = section.blocks[index].title.split(' — ');
    assert.ok(card.includes(`<span class="editorial-title-primary">${primary}</span>`));
    assert.ok(card.includes(`<span class="editorial-title-secondary">${secondary}</span>`));
    assert.doesNotMatch(card, /<img\b|editorial-card-image/);
  });
});

test('les notes des domaines sont rattachées au pied des cartes correspondantes', () => {
  const page = offers.find(page => page.slug === 'entreprises-organisations');
  const section = page.sections.find(section => section.presentation?.layout === 'domains');
  const html = editorialSection(section, 0);
  const cards = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.equal(cards.length, 4);
  assert.match(cards[0], /<footer class="care-note"><h3>Prévention et organisation du travail<\/h3>/);
  assert.match(cards[2], /<footer class="care-note"><h3>Une pratique respectueuse de chacun<\/h3>/);
  assert.equal((html.match(/class="care-note"/g) || []).length, 2);
});
