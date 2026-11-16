import test from 'node:test';
import assert from 'node:assert/strict';
import { editorialPage } from '../src/pages/editorial.mjs';
import { editorialSection } from '../src/components/editorial-section.mjs';
import { offers } from '../src/data/offers.mjs';
import about from '../src/data/about.mjs';

const withoutPresentation = page => JSON.parse(JSON.stringify(page, (key, value) => key === 'presentation' ? undefined : value));
const text = html => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const links = html => [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0].replace(/ class="[^"]*"/g, ''));

test('les compositions conservent tous les textes, titres, liens et le hero', () => {
  for (const page of [...offers, about]) {
    const baseline = editorialPage(withoutPresentation(page));
    const composed = editorialPage(page);
    assert.equal(text(composed), text(baseline), page.slug);
    assert.deepEqual(links(composed), links(baseline), page.slug);
    assert.deepEqual(composed.match(/<h[123]\b[^>]*>[\s\S]*?<\/h[123]>/g).map(text), baseline.match(/<h[123]\b[^>]*>[\s\S]*?<\/h[123]>/g).map(text), page.slug);
    assert.equal(composed.slice(0, composed.indexOf('</section>')), baseline.slice(0, baseline.indexOf('</section>')), page.slug);
  }
});

test('une section sans présentation garde son balisage historique', () => {
  const section = { title: 'Titre', paragraphs: ['Introduction'], blocks: [{ title: 'Bloc', paragraphs: ['Texte'] }], after: ['Suite'] };
  assert.equal(editorialSection(section, 0), '<section class="section"><div class="container editorial-section"><h2>Titre</h2><div class="prose"><p>Introduction</p><article><h3>Bloc</h3><p>Texte</p></article><p>Suite</p></div></div></section>');
});
