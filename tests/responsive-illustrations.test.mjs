import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { editorialSection } from '../src/components/editorial-section.mjs';
import { offers } from '../src/data/offers.mjs';
import about from '../src/data/about.mjs';
import { pageImage } from '../src/components/page-hero.mjs';
import { pageImages } from '../src/data/page-images.mjs';
import { homePage } from '../src/pages/home.mjs';

function checkCandidates(img) {
  const srcset = img.match(/(?:data-)?srcset="([^"]+)"/)?.[1];
  assert.ok(srcset, img);
  const candidates = srcset.split(',').map(candidate => candidate.trim().split(' '));
  assert.equal(candidates.length, 3, img);
  assert.deepEqual(candidates.slice(0, 2).map(([, width]) => width), ['480w', '800w']);
  assert.ok(Number.parseInt(candidates[2][1]) >= 1122, img);
  for (const [url, width] of candidates) {
    assert.ok(existsSync('public' + url), url);
    assert.ok(url.endsWith('-' + Number.parseInt(width) + '.webp'), url);
  }
  assert.match(img, / sizes="[^"]+"/);
}

test('illustrations éditoriales : variantes disponibles et tailles adaptées au layout', () => {
  for (const page of [...offers, about]) {
    for (const section of page.sections) {
      const layout = section.presentation?.layout;
      const html = editorialSection(section, 0);
      for (const [, type, img] of html.matchAll(/<div class="(editorial-illustration|editorial-card-image)">(<img[^>]+>)/g)) {
        checkCandidates(img);
        assert.match(img, /loading="lazy"/);
        if (type === 'editorial-illustration' && layout === 'split') {
          assert.match(img, /sizes="\(min-width: 840px\) 800px,/);
        } else if (type === 'editorial-card-image') {
          assert.ok(img.includes(layout === 'domains' ? '(min-width: 768px) 50vw' : '(min-width: 768px) 34vw'), img);
        }
      }
    }
  }
});

test('heroes et offres : variantes et prise en compte du recadrage', () => {
  for (const name of Object.keys(pageImages)) {
    const hero = pageImage(name, { priority: true });
    const card = pageImage(name, { card: true });
    const related = pageImage(name, { card: true, related: true });
    for (const img of [hero, card, related]) checkCandidates(img);
    assert.match(hero, /fetchpriority="high" loading="eager"/);
    assert.match(card, /loading="lazy"/);
    assert.notEqual(card.match(/sizes="([^"]+)"/)[1], related.match(/sizes="([^"]+)"/)[1]);
  }
  const home = homePage();
  const responsive = [...home.matchAll(/<img\b[^>]*(?:data-)?srcset="[^"]+"[^>]*>/g)].map(match => match[0]);
  assert.ok(responsive.length >= 12);
  for (const img of responsive) checkCandidates(img);
  assert.equal((home.match(/data-srcset="/g) ?? []).length, 5);
  assert.match(home, /sizes="\(min-width: 840px\) 800px,/);
});
