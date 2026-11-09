import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const paths=['','accompagnements','a-propos','contact','mentions-legales','confidentialite','accompagnements/coaching-professionnel','accompagnements/sante-travail','accompagnements/pleine-conscience','entreprises-organisations'];
test('quatre accompagnements uniques, avant closing ou footer',()=>{for(const p of paths){const html=readFileSync(`dist/${p?p+'/':''}index.html`,'utf8');assert.equal((html.match(/<p class="eyebrow">Quatre accompagnements/g)||[]).length,p===''?0:1,p);if(p){const i=html.indexOf('<p class="eyebrow">Quatre accompagnements');const end=html.indexOf('<section class="closing">',i);assert.equal((html.slice(i,end<0?html.indexOf('</main>'):end).match(/class="offer-card"/g)||[]).length,4,p);}}});
