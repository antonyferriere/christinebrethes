import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
// Execute the real carousel block against a minimal DOM and clock.
test('carrousel : reduced motion, pause utilisateur, focus et survol stoppent la minuterie',()=>{
 const source=readFileSync('src/scripts/main.js','utf8');
 const handlers=new Map();const heroHandlers=new Map();const motionHandlers=new Map();let scheduled=0;
 const pause={setAttribute(){},addEventListener:(n,f)=>handlers.set(n,f)};
 const controls={querySelector:()=>pause,querySelectorAll:()=>[],hidden:true};
 const hero={querySelector:()=>controls,querySelectorAll:()=>[],addEventListener:(n,f)=>heroHandlers.set(n,f),contains:()=>false};
 const motion={matches:true,addEventListener:(n,f)=>motionHandlers.set(n,f)};
 const context={document:{querySelector:()=>hero,hidden:false,addEventListener(){}},motion,setTimeout:()=>++scheduled,clearTimeout:()=>{scheduled=0;},IntersectionObserver:class{observe(){}},console};
 vm.runInNewContext(source.slice(source.indexOf('const hero ='),source.indexOf('// A single animation frame')),context);
 assert.equal(scheduled,0);
 motion.matches=false;motionHandlers.get('change')();assert.equal(scheduled,1);
 handlers.get('click')();assert.equal(scheduled,0);
 handlers.get('click')();assert.equal(scheduled,1);
 heroHandlers.get('focusin')();assert.equal(scheduled,0);
 heroHandlers.get('focusout')({relatedTarget:null});assert.equal(scheduled,1);
 heroHandlers.get('mouseenter')();assert.equal(scheduled,0);
 heroHandlers.get('mouseleave')();assert.equal(scheduled,1);
});
