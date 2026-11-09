import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const paths=['','accompagnements','a-propos','contact','mentions-legales','confidentialite','accompagnements/coaching-professionnel','accompagnements/sante-travail','accompagnements/pleine-conscience','entreprises-organisations'];
test('closing unique, reference accueil, immédiatement avant footer',()=>{for(const p of paths){const html=readFileSync(`dist/${p ? p+'/' : ''}index.html`,'utf8');assert.equal((html.match(/class="closing"/g)||[]).length,p==='contact'?0:1,p);if(p!=='contact'){assert.match(html,/Commençons simplement par un échange/);assert.match(html,/<section class="closing">[\s\S]*<\/section><\/main><footer/);}}});
