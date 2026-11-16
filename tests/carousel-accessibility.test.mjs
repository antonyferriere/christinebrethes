import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
// Execute the real carousel block against a minimal DOM and clock.
test('carrousel : reduced motion, focus et survol stoppent la minuterie',()=>{
 const source=readFileSync('src/scripts/main.js','utf8');
 const heroHandlers=new Map();const motionHandlers=new Map();let scheduled=0;
 const controls={querySelectorAll:()=>[],hidden:true};
 const hero={querySelector:()=>controls,querySelectorAll:()=>[],addEventListener:(n,f)=>heroHandlers.set(n,f),contains:()=>false};
 const motion={matches:true,addEventListener:(n,f)=>motionHandlers.set(n,f)};
 const context={document:{querySelector:()=>hero,hidden:false,addEventListener(){}},motion,setTimeout:()=>++scheduled,clearTimeout:()=>{scheduled=0;},IntersectionObserver:class{observe(){}},console};
 vm.runInNewContext(source.slice(source.indexOf('const hero ='),source.indexOf('// A single animation frame')),context);
 assert.equal(scheduled,0);
 motion.matches=false;motionHandlers.get('change')();assert.equal(scheduled,1);
 heroHandlers.get('focusin')();assert.equal(scheduled,0);
 heroHandlers.get('focusout')({relatedTarget:null});assert.equal(scheduled,1);
 heroHandlers.get('mouseenter')();assert.equal(scheduled,0);
 heroHandlers.get('mouseleave')();assert.equal(scheduled,1);
});

test('organisations : défilement sans boutons et pause durable après interaction', () => {
  const handlers = new Map();
  const motionHandlers = new Map();
  let scheduled = 0;
  let enterViewport;
  const item = { offsetLeft: 100, cloneNode: () => ({ setAttribute() {} }) };
  const track = {
    children: [item], firstElementChild: { offsetLeft: 0 }, scrollLeft: 0,
    prepend() {}, append() {},
    addEventListener: (name, handler) => handlers.set(name, handler),
    classList: { add() {}, remove() {} }, setPointerCapture() {}
  };
  const section = { querySelector: () => track };
  const motion = { matches: false, addEventListener: (name, handler) => motionHandlers.set(name, handler) };
  const context = {
    document: { querySelectorAll: () => [section], addEventListener() {}, hidden: false, activeElement: null },
    matchMedia: () => motion,
    requestAnimationFrame: () => ++scheduled,
    cancelAnimationFrame: () => { scheduled = 0; },
    ResizeObserver: class { observe() {} },
    IntersectionObserver: class { constructor(callback) { enterViewport = callback; } observe() {} }
  };
  vm.runInNewContext(readFileSync('src/scripts/organization-carousel.js', 'utf8'), context);
  enterViewport([{ isIntersecting: true }]);
  assert.equal(scheduled, 1);
  handlers.get('focus')();
  assert.equal(scheduled, 0);
  motion.matches = true;
  motionHandlers.get('change')();
  motion.matches = false;
  motionHandlers.get('change')();
  assert.equal(scheduled, 0);
});
