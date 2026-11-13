import test from 'node:test';
import assert from 'node:assert/strict';
import { referencesSection } from '../src/components/references.mjs';
import { references } from '../src/data/references.mjs';
test('references : aucune attribution ni logo sans double validation',()=>{
 assert.equal((referencesSection().match(/<li>/g) || []).length, 6);
 const item={...references[0], relationship:'<validation de test>',contentApproved:true,logoAuthorized:false};
 assert.doesNotMatch(referencesSection([item]), /<img/);
 item.logoAuthorized=true;
 assert.match(referencesSection([item]), /<img/);
 assert.match(referencesSection([item]), /&lt;validation de test&gt;/);
 item.relationship='';assert.equal(referencesSection([item]),'');
});
