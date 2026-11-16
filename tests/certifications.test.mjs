import test from 'node:test';
import assert from 'node:assert/strict';
import { certificationsSection } from '../src/components/certifications.mjs';
import { certifications } from '../src/data/certifications.mjs';
test('certifications : aucune attribution ni logo sans double validation',()=>{
 assert.equal((certificationsSection().match(/<li>/g) || []).length, 5);
 const item={...certifications[0], title:'<validation de test>',contentApproved:true,logoAuthorized:false};
 assert.equal(certificationsSection([item]),'');
 item.logoAuthorized=true;
 assert.match(certificationsSection([item]), /&lt;validation de test&gt;/);
 item.title='';assert.equal(certificationsSection([item]),'');
});

test('certifications : ordre antichronologique sans modifier la source', () => {
  const input = [...certifications].reverse();
  const snapshot = JSON.stringify(input);
  const html = certificationsSection(input);
  const years = [...html.matchAll(/class="certification-date">([^<]*)/g)].map(match => match[1]);
  assert.deepEqual(years, ['2026', '2022', '2019', '2007', '2006']);
  assert.equal(JSON.stringify(input), snapshot);
  assert.doesNotMatch(html, /data-carousel|organization-controls/);
});
