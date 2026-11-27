import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/scripts/testimonials.js', import.meta.url), 'utf8');
function setup() {
  const heights = [45, 62, 80];
  const shortHeights = [132, 95];
  let resize, click, focused = false, selected = false;
  const properties = {};
  const disclosure = {
    open: true,
    querySelector: selector => selector === 'blockquote'
      ? { addEventListener: (_, handler) => { click = handler; } }
      : { focus: () => { focused = true; } }
  };
  const grid = {
    querySelectorAll: selector => selector === '.review-profile'
      ? heights.map((_, i) => ({ getBoundingClientRect: () => ({ height: heights[i] }) }))
      : selector === '.review > blockquote'
        ? shortHeights.map((_, i) => ({ getBoundingClientRect: () => ({ height: shortHeights[i] }) }))
        : [disclosure],
    style: { setProperty: (name, value) => { properties[name] = value; } }
  };
  class ResizeObserver { constructor(handler) { resize = handler; } observe() {} }
  runInNewContext(source, {
    document: { querySelectorAll: () => [grid] }, ResizeObserver,
    window: { ResizeObserver, getSelection: () => ({ isCollapsed: !selected }) }
  });
  return { heights, shortHeights, disclosure, resize: () => resize(), minimum: () => properties['--review-person-height'],
    shortMinimum: () => properties['--review-short-height'],
    click: (link = false) => click({ target: { closest: () => link } }),
    select: () => { selected = true; }, focused: () => focused };
}

test('author heights stay equal after resizing, independently of disclosure state', () => {
  const state = setup();
  assert.equal(state.minimum(), '80px');
  state.heights[2] = 50;
  state.resize();
  assert.equal(state.minimum(), '62px');
  assert.equal(state.disclosure.open, true);
});

test('clicking expanded text collapses it and restores summary focus, preserving selection and links', () => {
  const state = setup();
  state.click(true);
  assert.equal(state.disclosure.open, true);
  state.click();
  assert.equal(state.disclosure.open, false);
  assert.equal(state.focused(), true);
  state.disclosure.open = true;
  state.select();
  state.click();
  assert.equal(state.disclosure.open, true);
});

test('short reviews contribute their natural height independently of expanded reviews', () => {
  const state = setup();
  assert.equal(state.shortMinimum(), '132px');
  state.shortHeights[0] = 180;
  state.resize();
  assert.equal(state.shortMinimum(), '180px');
  state.shortHeights[0] = 70;
  state.disclosure.open = false;
  state.resize();
  assert.equal(state.shortMinimum(), '95px');
});
