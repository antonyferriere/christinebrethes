import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { editorialSection } from '../src/components/editorial-section.mjs';
import { escape } from '../src/components/ui.mjs';
import mindfulness from '../src/data/offers/pleine-conscience.mjs';

const section = mindfulness.sections.find(item => item.presentation?.layout === 'benefits');

test('les bienfaits sont trois listes illustrées de quatre éléments, sans cartes ni liens', () => {
  const html = editorialSection(section, 0);
  assert.match(html, /editorial-benefits editorial-tone-paper/);
  const groups = [...html.matchAll(/<div class="benefit-group"><h3>([^<]+)<\/h3><ul class="benefit-list" role="list">([\s\S]*?)<\/ul><\/div>/g)];
  assert.equal(groups.length, 3);
  assert.doesNotMatch(html, /editorial-image-card|offer-grid|<img\b|<a\b|<details\b/);
  const icons = new Set();
  for (const [index, group] of groups.entries()) {
    const data = section.blocks[index];
    assert.equal(group[1], escape(data.title));
    const items = [...group[2].matchAll(/<li class="benefit-item">([\s\S]*?)<\/li>/g)];
    assert.equal(items.length, 4);
    for (const [itemIndex, item] of items.entries()) {
      const benefit = data.cards[itemIndex];
      assert.ok(item[1].includes('<h4 class="benefit-title">' + escape(benefit.title) + '</h4><p>' + escape(benefit.text) + '</p>'));
      assert.match(item[1], /<span class="benefit-icon" aria-hidden="true"><svg[^>]*aria-hidden="true" focusable="false">/);
      const svg = item[1].match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
      assert.ok(svg?.[1]);
      icons.add(svg[1]);
    }
  }
  assert.equal(icons.size, 12);
  for (const paragraph of section.paragraphs) assert.ok(html.includes('<p>' + escape(paragraph) + '</p>'));
  for (const paragraph of section.after) assert.ok(html.includes('<div class="editorial-after"><p>' + escape(paragraph) + '</p>'));
});

test('la liste des bienfaits passe de une à deux colonnes sans largeur imposée au texte', () => {
  const css = readFileSync(new URL('../src/styles/pages.css', import.meta.url), 'utf8');
  assert.match(css, /\.editorial-benefits \.benefit-list\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /@media \(min-width: 600px\)\s*\{\s*\.editorial-benefits \.benefit-list\s*\{\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(css, /\.editorial-benefits \.benefit-group\s*\{[^}]*border-top:/);
});
