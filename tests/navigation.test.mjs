import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeSubmenu } from '../src/scripts/navigation.js';

function fixture(isDesktop = true) {
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
  desktop.matches = isDesktop;
  hover.matches = true;
  item.children = [toggle, panel, link];
  item.querySelector = selector => selector === '.submenu-toggle' ? toggle : panel;
  panel.querySelector = () => link;
  globalThis.document = doc;
  globalThis.window = win;
  globalThis.matchMedia = query => query.includes('min-width') ? desktop : hover;
  const header = new Element(), headerRow = new Element();
  header.style = { setProperty: (name, value) => { header.attrs[name] = value; } };
  header.querySelector = () => headerRow;
  panel.bottom = 240;
  panel.marginBottom = '0px';
  globalThis.getComputedStyle = element => ({ marginBottom: element.marginBottom });
  panel.getBoundingClientRect = () => ({ bottom: panel.bottom });
  headerRow.getBoundingClientRect = () => ({ bottom: 98 });
  const observers = [];
  globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
  };
  const close = initializeSubmenu({ querySelector: () => item, closest: () => header });
  const expanded = () => toggle.attrs['aria-expanded'];
  return { item, toggle, panel, link, doc, win, desktop, hover, close, expanded, header, observers };
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

test('desktop mouse hover opens; switching to mobile keeps offers expanded', () => {
  const f = fixture();
  f.item.emit('pointerenter', { pointerType: 'touch' });
  assert.equal(f.expanded(), 'false');
  f.item.emit('pointerenter', { pointerType: 'mouse' });
  assert.equal(f.expanded(), 'true');
  f.desktop.matches = false;
  f.desktop.emit('change');
  f.item.emit('pointerenter', { pointerType: 'mouse' });
  assert.equal(f.expanded(), 'true');
  f.close();
  assert.equal(f.panel.inert, false);
  f.desktop.matches = true;
  f.desktop.emit('change');
  assert.equal(f.expanded(), 'false');
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

test('mobile offers stay accessible after focus leaves, menu closes and page restores', () => {
  const f = fixture(false);
  assert.equal(f.expanded(), 'true');
  assert.equal(f.panel.inert, false);
  f.toggle.emit('click');
  f.item.emit('focusout', { relatedTarget: {} });
  f.doc.emit('click', { target: {} });
  f.close();
  f.win.emit('pageshow');
  assert.equal(f.expanded(), 'true');
  assert.equal(f.panel.inert, false);
});

test('mobile Escape bubbles to close the main navigation without focusing its hidden toggle', () => {
  const f = fixture(false);
  f.link.focus();
  f.item.emit('keydown', { key: 'Escape', preventDefault() { assert.fail('Escape must reach the main menu'); }, stopPropagation() { assert.fail('Escape must bubble'); } });
  f.doc.emit('keydown', { key: 'Escape' });
  assert.equal(f.doc.activeElement, f.link);
  assert.equal(f.panel.inert, false);
});

test('header extension follows submenu content size and resets on mobile', () => {
  const f = fixture();
  f.toggle.emit('click');
  assert.equal(f.header.attrs['--submenu-extension'], '142px');
  f.panel.bottom = 284;
  f.observers[0].callback();
  assert.equal(f.header.attrs['--submenu-extension'], '186px');
  f.desktop.matches = false;
  f.desktop.emit('change');
  assert.equal(f.header.attrs['--submenu-extension'], '0px');
  f.desktop.matches = true;
  f.desktop.emit('change');
  assert.equal(f.header.attrs['--submenu-extension'], '186px');
  assert.equal(f.expanded(), 'false');
});

test('header leaves the computed bottom margin below the submenu border', () => {
  const f = fixture();
  f.panel.marginBottom = '9.6px';
  f.toggle.emit('click');
  assert.equal(f.header.attrs['--submenu-extension'], '152px');
  f.panel.marginBottom = '20px';
  f.observers[0].callback();
  assert.equal(f.header.attrs['--submenu-extension'], '162px');
  f.desktop.matches = false;
  f.desktop.emit('change');
  assert.equal(f.header.attrs['--submenu-extension'], '0px');
});
