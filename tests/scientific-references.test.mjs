import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scientificReferences } from '../src/data/scientific-references.mjs';
test('trois publications documentées, uniquement sur la page méditation',()=>{
 const html=readFileSync('dist/accompagnements/pleine-conscience/index.html','utf8');
 assert.equal(scientificReferences.length,3);
 for(const r of scientificReferences){assert.match(r.doi,/^10\./);assert.ok(r.authors&&r.journal&&r.year);assert.ok(html.includes('https://doi.org/'+r.doi));}
 assert.ok(!readFileSync('dist/index.html','utf8').includes('scientific-references'));
});
