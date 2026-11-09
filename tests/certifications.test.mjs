import test from 'node:test';
import assert from 'node:assert/strict';
import { certificationsSection } from '../src/components/certifications.mjs';
import { certifications } from '../src/data/certifications.mjs';
test('certifications : aucune attribution ni logo sans double validation',()=>{
 assert.equal(certificationsSection(),'');
 const item={...certifications[0], title:'<validation de test>',contentApproved:true};
 assert.equal(certificationsSection([item]),'');
 item.logoAuthorized=true;
 assert.match(certificationsSection([item]), /&lt;validation de test&gt;/);
 item.title='';assert.equal(certificationsSection([item]),'');
});
