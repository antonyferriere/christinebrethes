import test from 'node:test';
import assert from 'node:assert/strict';
import { referencesSection } from '../src/components/references.mjs';
import { references } from '../src/data/references.mjs';
test('references : aucune attribution ni logo sans double validation',()=>{
 assert.equal(referencesSection(),'');
 const item={...references[0], relationship:'<validation de test>',contentApproved:true};
 assert.equal(referencesSection([item]),'');
 item.logoAuthorized=true;
 assert.match(referencesSection([item]), /&lt;validation de test&gt;/);
 item.relationship='';assert.equal(referencesSection([item]),'');
});
