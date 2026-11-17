import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/scripts/testimonials.js', import.meta.url), 'utf8');
function setup() {
  const heights = [45, 62, 80];
  let resize, click, minimum, focused = false, selected = false;
  const disclosure = {
    open: true,
    querySelector: selector => selector === 'blockquote'
      ? { addEventListener: (_, handler) => { click = handler; } }
      : { focus: () => { focused = true; } }
  };
  const grid = {
    querySelectorAll: selector => selector === '.review-profile'
      ? heights.map((_, i) => ({ getBoundingClientRect: () => ({ height: heights[i] }) }))
      : [disclosure],
    style: { setProperty: (_, value) => { minimum = value; } }
  };
  class ResizeObserver { constructor(handler) { resize = handler; } observe() {} }
  runInNewContext(source, {
    document: { querySelectorAll: () => [grid] }, ResizeObserver,
    window: { ResizeObserver, getSelection: () => ({ isCollapsed: !selected }) }
  });
  return { heights, disclosure, resize: () => resize(), minimum: () => minimum,
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
