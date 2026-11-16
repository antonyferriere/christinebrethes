import test from 'node:test';
import assert from 'node:assert/strict';
import { linkedinSections } from '../src/components/sections.mjs';
import { recommendations } from '../src/data/linkedin.mjs';

test('Les témoignages longs sont repliés par défaut avec une ouverture native accessible', () => {
  const html = linkedinSections({ recommendations: true, publications: false });
  assert.equal((html.match(/<details class="review-disclosure">/g) || []).length, 3);
  assert.equal((html.match(/<summary>/g) || []).length, 3);
  assert.equal((html.match(/<blockquote>/g) || []).length, 3);
  assert.equal((html.match(/Lire la suite/g) || []).length, 3);
  assert.equal((html.match(/class="review-less">Réduire/g) || []).length, 3);
  for (const review of recommendations) {
    assert.ok(html.includes(review.author));
    assert.ok(html.includes(review.text.split(/\n\n/)[0].slice(0, 28)));
  }
});

test('Les témoignages courts restent visibles et les contenus sont échappés', () => {
  const html = linkedinSections(
    { recommendations: true, publications: false },
    [{ author: 'Test', role: 'Coach', text: '<script>alert("x")</script>', source: 'https://www.linkedin.com/', visible: true, authorized: true }],
    []
  );
  assert.doesNotMatch(html, /<details/);
  assert.match(html, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});
