import test from 'node:test';
import assert from 'node:assert/strict';
import { siteHeader } from '../src/components/site-header.mjs';
import { navigationItems } from '../src/data/navigation.mjs';
import { initializeNavigation } from '../src/scripts/navigation.js';

test('shared header keeps all destinations and identifies exactly the current page', () => {
  const items = navigationItems.flatMap(item => [item, ...(item.children || [])]);
  for (const current of items) {
    const html = siteHeader(current.href);
    assert.equal((html.match(/<nav /g) || []).length, 1);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
    assert.ok(html.includes(`href="${current.href}" aria-current="page"`));
    for (const item of items) assert.ok(html.includes(`href="${item.href}"`));
    assert.match(html, /aria-controls="navigation"/);
    assert.match(html, /aria-controls="accompagnements-submenu"/);
    assert.match(html, /class="booking-short" aria-hidden="true">Rendez-vous/);
  }
  assert.doesNotMatch(siteHeader('/404/'), /aria-current/);
  assert.match(siteHeader('/accompagnements/sante-travail/'), /class="is-current-section"/);
});

function fixture(t) {
  class Element extends EventTarget {
    constructor() {
      super(); this.attrs = {}; this.children = []; this.classes = new Set();
      this.classList = {
        add: name => this.classes.add(name), remove: name => this.classes.delete(name),
        toggle: (name, value) => value ? this.classes.add(name) : this.classes.delete(name),
      };
      this.style = { setProperty() {}, removeProperty() {} };
    }
    querySelector(selector) { return this.selectors?.[selector] || null; }
    contains(target) { return target === this || this.children.some(child => child.contains(target)); }
    setAttribute(name, value) { this.attrs[name] = value; }
    focus() { doc.activeElement = this; }
    getBoundingClientRect() { return { height: 84 }; }
    emit(type, props = {}) { const event = new Event(type, { cancelable: true }); Object.assign(event, props); this.dispatchEvent(event); return event; }
  }
  const doc = new Element(), win = new Element(), header = new Element(), menu = new Element();
  const nav = new Element(), inner = new Element(), label = new Element(), first = new Element();
  const desktop = new Element();
  desktop.matches = false;
  doc.documentElement = new Element(); win.scrollY = 0;
  doc.selectors = { '.site-header': header };
  header.selectors = { '.menu-toggle': menu, '#navigation': nav, '.header-inner': inner };
  menu.selectors = { '.menu-toggle-label': label };
  nav.selectors = { a: first };
  nav.children = [first]; header.children = [menu, nav, inner];
  let disconnected = false;
  const originals = Object.fromEntries(['document', 'window', 'matchMedia', 'ResizeObserver'].map(key => [key, globalThis[key]]));
  Object.assign(globalThis, {
    document: doc, window: win, matchMedia: () => desktop,
    ResizeObserver: class { observe() {} disconnect() { disconnected = true; } },
  });
  t.after(() => {
    for (const [key, value] of Object.entries(originals)) {
      if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
    }
  });
  const destroy = initializeNavigation();
  return { doc, win, header, menu, nav, first, desktop, destroy, disconnected: () => disconnected };
}

test('mobile closes with Escape, outside click and focus leaving without trapping Tab', t => {
  const f = fixture(t);
  assert.equal(f.nav.inert, true);
  f.menu.focus(); f.menu.emit('click');
  assert.equal(f.menu.attrs['aria-expanded'], 'true');
  assert.equal(f.doc.activeElement, f.menu);
  assert.equal(f.nav.inert, false);
  f.first.focus(); f.doc.emit('keydown', { key: 'Escape' });
  assert.equal(f.doc.activeElement, f.menu);
  assert.equal(f.nav.inert, true);
  f.menu.emit('click'); f.header.emit('focusout', { relatedTarget: {} });
  assert.equal(f.menu.attrs['aria-expanded'], 'false');
  f.menu.emit('click'); f.doc.emit('click');
  assert.equal(f.nav.inert, true);
  f.destroy();
});

test('breakpoint changes preserve a visible focus and reset mobile state', t => {
  const f = fixture(t);
  f.menu.focus(); f.desktop.matches = true; f.desktop.emit('change');
  assert.equal(f.doc.activeElement, f.first);
  assert.equal(f.nav.inert, false);
  f.desktop.matches = false; f.desktop.emit('change');
  assert.equal(f.doc.activeElement, f.menu);
  assert.equal(f.nav.inert, true);
  f.destroy();
});

test('link activation, bfcache restoration and disposal leave no stale state', t => {
  const f = fixture(t);
  f.first.closest = () => f.first;
  f.menu.emit('click');
  const click = new Event('click');
  Object.defineProperty(click, 'target', { value: f.first });
  f.nav.dispatchEvent(click);
  assert.equal(f.nav.inert, true);
  f.menu.emit('click');
  f.win.emit('pageshow');
  assert.equal(f.nav.inert, true);
  f.destroy();
  assert.equal(f.nav.inert, false);
  assert.equal(f.disconnected(), true);
  f.menu.emit('click');
  assert.equal(f.menu.attrs['aria-expanded'], 'false');
  assert.equal(f.header.classes.has('navigation-ready'), false);
});
