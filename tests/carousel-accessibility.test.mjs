import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
// Execute the real carousel block against a minimal DOM and clock.
test('carrousel : le survol et le focus préservent la minuterie, le mouvement réduit la suspend', () => {
  const source = readFileSync('src/scripts/main.js', 'utf8');
  const hero = new EventTarget();
  const controls = { querySelectorAll: () => [] };
  hero.querySelector = () => controls;
  hero.querySelectorAll = () => [];
  hero.contains = () => false;
  const motion = new EventTarget();
  motion.matches = true;
  let activeTimer;
  const context = {
    document: { querySelector: () => hero, hidden: false, addEventListener() {} },
    motion,
    setTimeout: callback => (activeTimer = callback),
    clearTimeout: timer => { if (timer === activeTimer) activeTimer = undefined; },
    IntersectionObserver: class { observe() {} }
  };
  vm.runInNewContext(source.slice(source.indexOf('const hero ='), source.indexOf('// A single animation frame')), context);
  assert.equal(activeTimer, undefined);
  motion.matches = false;
  motion.dispatchEvent(new Event('change'));
  const initialTimer = activeTimer;
  assert.equal(typeof initialTimer, 'function');
  for (const name of ['mouseenter', 'focusin', 'mouseleave', 'focusout']) {
    hero.dispatchEvent(new Event(name));
    assert.equal(activeTimer, initialTimer, name);
  }
  motion.matches = true;
  motion.dispatchEvent(new Event('change'));
  assert.equal(activeTimer, undefined);
});

test('organisations : reprise après glissement, molette et barre native, respect du clavier et du mouvement réduit', () => {
  const handlers = new Map();
  const motionHandlers = new Map();
  let scheduled = 0;
  let enterViewport;
  let resume;
  let captured = 0;
  const windowHandlers = new Map();
  const item = { offsetLeft: 100, cloneNode: () => ({ setAttribute() {} }) };
  const track = {
    children: [item], firstElementChild: { offsetLeft: 0 }, scrollLeft: 0,
    prepend() {}, append() {},
    addEventListener: (name, handler) => handlers.set(name, handler),
    classList: { add() {}, remove() {} }, setPointerCapture() { captured++; },
    matches: () => true, clientTop: 0, clientHeight: 100,
    getBoundingClientRect: () => ({ top: 0 })
  };
  const section = { querySelector: () => track };
  const motion = { matches: false, addEventListener: (name, handler) => motionHandlers.set(name, handler) };
  const context = {
    document: { querySelectorAll: () => [section], addEventListener() {}, hidden: false, activeElement: null },
    window: { addEventListener: (name, handler) => windowHandlers.set(name, handler) },
    setTimeout: callback => { resume = callback; return 1; },
    clearTimeout: () => { resume = null; },
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
  handlers.get('blur')();
  assert.equal(scheduled, 1);
  const pointer = { pointerType: 'mouse', button: 0, clientX: 20, clientY: 20, pointerId: 1, preventDefault() {} };
  handlers.get('pointerenter')(pointer);
  handlers.get('pointerdown')(pointer);
  assert.equal(scheduled, 0);
  resume(); // A held drag must never restart.
  assert.equal(scheduled, 0);
  handlers.get('pointermove')({ clientX: 10 });
  windowHandlers.get('pointerup')();
  resume();
  assert.equal(scheduled, 1); // Pointer remains over the card.
  assert.equal(captured, 1);
  handlers.get('pointerdown')({ ...pointer, clientY: 105 });
  assert.equal(captured, 1); // Native scrollbar is not captured/prevented.
  windowHandlers.get('pointerup')();
  resume();
  assert.equal(scheduled, 1);
  track.scrollLeft += 10; // A native scrollbar event without pointerdown.
  handlers.get('scroll')();
  assert.equal(scheduled, 0);
  resume();
  assert.equal(scheduled, 1);
  handlers.get('wheel')();
  assert.equal(scheduled, 0);
  resume();
  assert.equal(scheduled, 1);
  handlers.get('pointerdown')({ ...pointer, pointerType: 'touch' });
  windowHandlers.get('pointerup')();
  handlers.get('scroll')(); // Touch inertia postpones the restart.
  assert.equal(scheduled, 0);
  resume();
  assert.equal(scheduled, 1);
  motion.matches = true;
  motionHandlers.get('change')();
  handlers.get('wheel')();
  resume();
  assert.equal(scheduled, 0);
});
