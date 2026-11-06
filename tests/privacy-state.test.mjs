import test from 'node:test';
import assert from 'node:assert/strict';
import { privacyConfig } from '../src/data/privacy-config.mjs';
import { readConsent, makeConsent, deniedState } from '../src/scripts/consent-state.js';
test('configuration désactivée sans identifiant, preview et debug exclus de production',()=>{
 assert.equal(privacyConfig({}).id,'');
 assert.equal(privacyConfig({GA_MEASUREMENT_ID:'G-fake'}).id,'');
 assert.equal(privacyConfig({CONSENT_PREVIEW:'true'},true).preview,false);
 assert.equal(privacyConfig({ANALYTICS_ENV:'development',GA_DEV_MEASUREMENT_ID:'G-ABC1234567',GA_DEBUG:'true'},true).id,'');
 assert.equal(privacyConfig({ANALYTICS_ENV:'development',GA_DEV_MEASUREMENT_ID:'G-ABC1234567'}).id,'G-ABC1234567');
});
test('refus et acceptation durent six mois, expiration et corruption refusées',()=>{
 const now=Date.UTC(2026,0,6);
 for(const accepted of [true,false]){const choice=makeConsent(accepted,now);const storage={getItem:()=>JSON.stringify(choice)};assert.equal(choice.expires,Date.UTC(2026,6,6));assert.equal(readConsent(storage,now).analytics,accepted);assert.equal(readConsent(storage,choice.expires),null);choice.expires+=1;assert.equal(readConsent(storage,now),null);}
 assert.equal(readConsent({getItem:()=>'{broken'},now),null);
 assert.ok(Object.values(deniedState).every(value=>value==='denied'));
});
