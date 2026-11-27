import test from 'node:test';
import assert from 'node:assert/strict';
import { bindCardAction, bindDisclosureCard } from '../src/scripts/card-actions.js';

function setup() {
  let click, selected = false, marked = false;
  const card = {
    ownerDocument: { getSelection: () => ({ isCollapsed: !selected }) },
    setAttribute: name => { marked = name === 'data-card-action'; },
    addEventListener: (type, handler) => { assert.equal(type, 'click'); click = handler; }
  };
  return { card, click: (options = {}) => click({ button: 0, target: { closest: () => false }, ...options }),
    select: () => { selected = true; }, marked: () => marked };
}

test('whole-card actions run once and preserve native interactive controls and selection', () => {
  const state = setup();
  let count = 0;
  bindCardAction(state.card, () => count++);
  assert.equal(state.marked(), true);
  state.click();
  state.click({ target: { closest: () => true } });
  state.click({ defaultPrevented: true });
  state.click({ button: 1 });
  state.select();
  state.click();
  assert.equal(count, 1);
});

test('disclosure opens and closes independently via the full card', () => {
  const first = setup(), second = setup();
  let focused = false;
  const a = { open: false, querySelector: () => ({ focus: () => { focused = true; } }) };
  const b = { open: false };
  bindDisclosureCard(first.card, a);
  bindDisclosureCard(second.card, b);
  first.click();
  assert.equal(a.open, true);
  assert.equal(b.open, false);
  first.click();
  assert.equal(a.open, false);
  assert.equal(focused, true);
});
