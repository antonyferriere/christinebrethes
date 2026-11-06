import test from 'node:test';
import assert from 'node:assert/strict';
import { consentMarkup } from '../src/scripts/consent-ui.js';
import { readFileSync } from 'node:fs';
test('une seule finalité, boutons symétriques, aucun choix précoché',()=>{
 const html=consentMarkup(true);
 assert.match(html,/class="button" data-consent="no">Tout refuser/);
 assert.match(html,/class="button" data-consent="yes">Tout accepter/);
 assert.doesNotMatch(html,/checked|Personnaliser/);
 assert.match(consentMarkup(true,true),/retirer cet accord/);
});
test('sans finalité active, aucun faux consentement ; accès footer permanent',()=>{
 const html=consentMarkup(false);assert.doesNotMatch(html,/data-consent="/);assert.match(html,/Aucun outil facultatif/);
 for(const p of ['index.html','contact/index.html'])assert.match(readFileSync('dist/'+p,'utf8'),/data-cookie-settings>Gestion des cookies/);
});
