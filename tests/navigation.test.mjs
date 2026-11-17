import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeSubmenu } from '../src/scripts/navigation.js';

function fixture() {
  class Element {
    constructor() { this.handlers = {}; this.attrs = {}; this.classes = new Set(); this.classList = { toggle: (name, value) => value ? this.classes.add(name) : this.classes.delete(name) }; }
    addEventListener(name, handler) { (this.handlers[name] ||= []).push(handler); }
    emit(name, event = {}) { for (const handler of this.handlers[name] || []) handler(event); }
    setAttribute(name, value) { this.attrs[name] = value; }
    contains(target) { return target === this || this.children?.includes(target); }
    focus() { document.activeElement = this; }
  }
  const item = new Element(), toggle = new Element(), panel = new Element(), link = new Element();
  const doc = new Element(), win = new Element(), desktop = new Element(), hover = new Element();
  desktop.matches = hover.matches = true;
  item.children = [toggle, panel, link];
  item.querySelector = selector => selector === '.submenu-toggle' ? toggle : panel;
  panel.querySelector = () => link;
  globalThis.document = doc;
  globalThis.window = win;
  globalThis.matchMedia = query => query.includes('min-width') ? desktop : hover;
  const close = initializeSubmenu({ querySelector: () => item });
  const expanded = () => toggle.attrs['aria-expanded'];
  return { item, toggle, panel, link, doc, win, desktop, hover, close, expanded };
}

test('disclosure opens independently, Escape returns focus and stops propagation', () => {
  const f = fixture();
  assert.equal(f.expanded(), 'false');
  assert.equal(f.panel.inert, true);
  f.toggle.emit('click');
  assert.equal(f.expanded(), 'true');
  assert.equal(f.panel.inert, false);
  let stopped = false;
  f.item.emit('keydown', { key: 'Escape', preventDefault() {}, stopPropagation() { stopped = true; } });
  assert.equal(f.expanded(), 'false');
  assert.equal(f.doc.activeElement, f.toggle);
  assert.equal(stopped, true);
});

test('ArrowDown reaches first offer; leaving focus and outside click close it', () => {
  const f = fixture();
  f.toggle.emit('keydown', { key: 'ArrowDown', preventDefault() {} });
  assert.equal(f.doc.activeElement, f.link);
  f.item.emit('focusout', { relatedTarget: f.link });
  assert.equal(f.expanded(), 'true');
  f.item.emit('focusout', { relatedTarget: {} });
  assert.equal(f.expanded(), 'false');
  f.toggle.emit('click');
  f.doc.emit('click', { target: f.link });
  assert.equal(f.expanded(), 'true');
  f.doc.emit('click', { target: {} });
  assert.equal(f.expanded(), 'false');
});

test('desktop mouse hover opens; touch and mobile hover do not', () => {
  const f = fixture();
  f.item.emit('pointerenter', { pointerType: 'touch' });
  assert.equal(f.expanded(), 'false');
  f.item.emit('pointerenter', { pointerType: 'mouse' });
  assert.equal(f.expanded(), 'true');
  f.desktop.matches = false;
  f.desktop.emit('change');
  f.item.emit('pointerenter', { pointerType: 'mouse' });
  assert.equal(f.expanded(), 'false');
  f.toggle.emit('click');
  assert.equal(f.expanded(), 'true');
  f.close();
  assert.equal(f.panel.inert, true);
});

test('hover bridge delay and focus protect the open panel', async () => {
  const f = fixture();
  f.item.emit('pointerenter', { pointerType: 'mouse' });
  f.item.emit('pointerleave');
  assert.equal(f.expanded(), 'true');
  f.item.emit('pointerenter', { pointerType: 'mouse' });
  await new Promise(resolve => setTimeout(resolve, 190));
  assert.equal(f.expanded(), 'true');
  f.link.focus();
  f.item.emit('pointerleave');
  await new Promise(resolve => setTimeout(resolve, 190));
  assert.equal(f.expanded(), 'true');
  f.doc.activeElement = null;
  f.item.emit('pointerleave');
  await new Promise(resolve => setTimeout(resolve, 190));
  assert.equal(f.expanded(), 'false');
  f.toggle.emit('click');
  f.win.emit('pageshow');
  assert.equal(f.expanded(), 'false');
});

test('Escape also dismisses a hover-open panel while focus is outside', () => {
  const f = fixture();
  f.item.emit('pointerenter', { pointerType: 'mouse' });
  f.doc.emit('keydown', { key: 'Escape' });
  assert.equal(f.expanded(), 'false');
  assert.equal(f.panel.inert, true);
});

test('closing a focused submenu never leaves focus in an inert panel', () => {
  const f = fixture();
  f.panel.children = [f.link];
  f.toggle.emit('click');
  f.link.focus();
  f.close();
  assert.equal(f.doc.activeElement, f.toggle);
  assert.equal(f.panel.inert, true);
  f.close.destroy();
});
