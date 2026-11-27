import test from 'node:test';
import assert from 'node:assert/strict';
import { editorialPage } from '../src/pages/editorial.mjs';
import { editorialSection } from '../src/components/editorial-section.mjs';
import { offers } from '../src/data/offers.mjs';
import about from '../src/data/about.mjs';

const withoutPresentation = page => JSON.parse(JSON.stringify(page, (key, value) => key === 'presentation' ? undefined : value));
const text = html => html.replace(/>\s+</g, '><').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const links = html => [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0].replace(/ class="[^"]*"/g, ''));

test('les compositions conservent tous les textes, titres, liens et le hero', () => {
  for (const page of [...offers, about]) {
    const baseline = editorialPage(withoutPresentation(page));
    // Exclude the repeated preview and disclosure control; compare the complete detail text.
    const composed = editorialPage(page)
      .replace(/<div class="editorial-card-body offer-content"><h3>[\s\S]*?<div class="domain-detail">/g, '<div>')
      .replace(/<div class="career-step" aria-hidden="true">\d+<\/div>/g, '')
      .replace(/<summary class="career-toggle">[\s\S]*?<\/summary>/g, '');
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

test('Mon parcours : quatre chapitres indépendants, repliés par défaut et texte intégral conservé', () => {
  const section = about.sections.find(item => item.title === 'Mon parcours');
  const html = editorialSection(section, 0);
  assert.match(html, /class="section career-section"/);
  assert.match(html, /<ol class="career-timeline" role="list">/);
  const chapters = [...html.matchAll(/<article class="career-entry">([\s\S]*?)<\/article>/g)];
  assert.equal(chapters.length, 4);
  assert.equal((html.match(/<details class="career-disclosure">/g) || []).length, 4);
  assert.doesNotMatch(html, /<details[^>]*\bopen\b/);
  assert.doesNotMatch(html, /<details[^>]*\bname=/);
  for (const [index, chapter] of chapters.entries()) {
    const [preview, rest] = chapter[1].split('<details class="career-disclosure">');
    assert.equal((preview.match(/<p>/g) || []).length, 1);
    assert.equal((rest.match(/<p>/g) || []).length, section.blocks[index].paragraphs.length - 1);
    assert.match(rest, /<summary class="career-toggle">/);
    assert.match(rest, /Lire la suite/);
    assert.match(rest, /Réduire/);
    assert.match(rest, /class="review-toggle"/);
  }
  assert.equal(text(html.replace(/<div class="career-step" aria-hidden="true">\d+<\/div>/g, '').replace(/<summary[^>]*>[\s\S]*?<\/summary>/g, '')),
    text(editorialSection({...section, presentation: undefined}, 0)));
});
