import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { editorialSection } from '../src/components/editorial-section.mjs';
import page from '../src/data/offers/entreprises-organisations.mjs';
import { escape } from '../src/components/ui.mjs';

test('four domain cards expose only their title and first two paragraphs before disclosure', () => {
  const section = page.sections.find(s => s.presentation?.layout === 'domains');
  const html = editorialSection(section, 2);
  const cards = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map(m => m[1]);
  const blocks = section.blocks.filter((_, index) => !section.presentation.notes.includes(index));
  assert.equal(cards.length, 4);
  cards.forEach((card, index) => {
    const preview = card.split('<details')[0];
    assert.equal((preview.match(/<p>/g) || []).length, 2);
    assert.ok(preview.includes(escape(blocks[index].title)));
    for (const paragraph of blocks[index].paragraphs.slice(0, 2)) assert.ok(preview.includes(escape(paragraph)));
    assert.ok(!preview.includes('<ul'));
    for (const paragraph of blocks[index].paragraphs) assert.ok(card.includes(escape(paragraph)));
    for (const item of blocks[index].items) assert.ok(card.includes(escape(item)));
    assert.match(card, /<summary class="text-link">Découvrir /);
    assert.match(card, /loading="lazy"/);
  });
  for (const image of section.presentation.images.filter(Boolean)) {
    for (const size of [480, 800]) assert.ok(existsSync(`public/assets/${image}-${size}.webp`));
  }
});
