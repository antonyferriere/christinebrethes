import test from 'node:test';
import assert from 'node:assert/strict';
import { externalLinks } from '../src/components/external-links.mjs';
const site = 'https://christinebrethes.fr';
test('external web links open safely in a new tab; local and contact links keep their behavior', () => {
  for (const href of ['https://www.linkedin.com/in/christinebrethes/', 'https://www.crenolibre.fr/prendre-rdv/166171_brethes-christine', '//external.example/page', 'http://external.example']) {
    const result = externalLinks(`<a href="${href}" target="_self" rel="nofollow opener">Lien</a>`, site);
    assert.match(result, /target="_blank"/);
    assert.match(result, /rel="nofollow noopener noreferrer"/);
    assert.equal(externalLinks(result, site), result);
  }
  for (const href of ['/', '/contact/', '#contenu', site + '/a-propos/', 'mailto:contact@christinebrethes.fr', 'tel:+33781659698']) {
    const html = `<a href="${href}">Lien</a>`;
    assert.equal(externalLinks(html, site), html);
  }
});
