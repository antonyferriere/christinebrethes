import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeAnalytics, safePath, interaction } from '../src/scripts/analytics.js';
import { CONSENT_EVENT, CONSENT_KEY, makeConsent } from '../src/scripts/consent-state.js';
function environment(id) {
 const values=new Map(); const appends=[]; const events=new Map(); let reloads=0;
 globalThis.window=new EventTarget();
 window.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 globalThis.location={origin:'https://example.test',pathname:'/contact/',hostname:'example.test',search:'?email=private@example.test',hash:'#secret',reload:()=>reloads++};
 globalThis.document={cookie:'',querySelector:()=>({dataset:{gaId:id}}),createElement:()=>({}),head:{append:node=>appends.push(node)},getElementById:()=>({remove(){}}),addEventListener:(name,callback)=>events.set(name,callback)};
 const choose=analytics=>{values.set(CONSENT_KEY,JSON.stringify(makeConsent(analytics)));window.dispatchEvent(new Event(CONSENT_EVENT));};
 return {appends,events,choose,reloads:()=>reloads};
}
test('aucune librairie Google sans identifiant ou sans consentement',()=>{
 let env=environment('');initializeAnalytics();env.choose(true);assert.equal(env.appends.length,0);
 env=environment('G-ABC1234567');initializeAnalytics();assert.equal(env.appends.length,0);env.choose(false);assert.equal(env.appends.length,0);
});
test('acceptation unique, événements sans URL sensible, révocation immédiate',()=>{
 const env=environment('G-ABC1234567');initializeAnalytics();env.choose(true);env.choose(true);
 assert.equal(env.appends.length,1);
 let commands=window.dataLayer.map(item=>Array.from(item));
 assert.equal(commands.filter(c=>c[0]==='event'&&c[1]==='page_view').length,1);
 env.events.get('click')({target:{closest:()=>({href:'mailto:private@example.test?body=secret'})}});
 commands=window.dataLayer.map(item=>Array.from(item));
 assert.equal(commands.at(-1)[1],'email_click');assert.ok(!JSON.stringify(commands).includes('private'));assert.ok(!JSON.stringify(commands).includes('secret'));
 assert.equal(commands.find(c=>c[0]==='consent'&&c[1]==='update')[2].ad_storage,'denied');
 env.choose(false);assert.equal(window['ga-disable-G-ABC1234567'],true);assert.equal(env.reloads(),1);assert.equal(window.dataLayer.length,0);
 env.events.get('click')({target:{closest:()=>({href:'tel:+33123456789'})}});assert.equal(window.dataLayer.length,0);
});
test('chemins inconnus et événements non prévus exclus',()=>{
 assert.equal(safePath('/person/private@example.test'),'/404/');
 assert.equal(interaction(new URL('https://external.test/?email=x'),'https://example.test'),null);
});
