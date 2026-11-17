// A disclosure keeps ordinary links and native Tab navigation (not an ARIA menu).
export function initializeSubmenu(navigation) {
  const item = navigation.querySelector('.nav-disclosure');
  if (!item) return () => {};
  const toggle = item.querySelector('.submenu-toggle');
  const panel = item.querySelector('.nav-submenu');
  const desktop = matchMedia('(min-width: 1200px)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const controller = new AbortController();
  const listen = (target, type, handler) => target.addEventListener(type, handler, { signal: controller.signal });
  let open = false, timer;
  function setOpen(value) {
    clearTimeout(timer);
    open = value;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Masquer les offres Accompagnements' : 'Afficher les offres Accompagnements');
    item.classList.toggle('is-expanded', open);
    panel.inert = !open;
  }
  listen(toggle, 'click', () => setOpen(!open));
  listen(item, 'pointerenter', (event) => {
    if (desktop.matches && hover.matches && event.pointerType === 'mouse') setOpen(true);
  });
  listen(item, 'pointerleave', () => {
    if (desktop.matches && !item.contains(document.activeElement)) timer = setTimeout(() => setOpen(false), 160);
  });
  listen(item, 'focusin', () => clearTimeout(timer));
  listen(item, 'focusout', (event) => {
    if (!item.contains(event.relatedTarget)) setOpen(false);
  });
  listen(toggle, 'keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      panel.querySelector('a').focus();
    }
  });
  listen(item, 'keydown', (event) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      toggle.focus();
    }
  });
  listen(document, 'keydown', (event) => {
    // A hover-open panel must also close when focus is elsewhere on the page.
    if (event.key === 'Escape' && open) setOpen(false);
  });
  listen(document, 'click', (event) => {
    if (!item.contains(event.target)) setOpen(false);
  });
  listen(desktop, 'change', () => setOpen(false));
  listen(window, 'pageshow', () => setOpen(false));
  setOpen(false);
  const close = () => setOpen(false);
  close.destroy = () => { setOpen(false); controller.abort(); panel.inert = false; };
  return close;
}

/** Non-modal disclosure: native Tab order, no focus trap or document scroll lock.
 * Returns a disposer so previews can remount the header without duplicate listeners.
 */
export function initializeNavigation(root = document) {
  const header = root.querySelector('.site-header');
  if (!header) return () => {};
  const menu = header.querySelector('.menu-toggle');
  const navigation = header.querySelector('#navigation');
  const inner = header.querySelector('.header-inner');
  const label = menu.querySelector('.menu-toggle-label');
  const desktop = matchMedia('(min-width: 1200px)');
  const closeSubmenu = initializeSubmenu(navigation);
  const controller = new AbortController();
  const listen = (target, type, handler, options = {}) =>
    target.addEventListener(type, handler, { ...options, signal: controller.signal });
  let open = false;

  function setOpen(value, restoreFocus = false) {
    open = value && !desktop.matches;
    if (restoreFocus) menu.focus();
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    label.textContent = open ? 'Fermer' : 'Menu';
    navigation.classList.toggle('is-open', open);
    navigation.inert = !desktop.matches && !open;
    if (!open) closeSubmenu();
  }
  listen(menu, 'click', () => setOpen(!open));
  listen(navigation, 'click', event => {
    if (event.target.closest('a')) setOpen(false, !desktop.matches);
  });
  listen(document, 'keydown', event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  listen(document, 'click', event => {
    if (!header.contains(event.target)) setOpen(false, navigation.contains(document.activeElement));
  });
  // Close before the next element outside the panel can be obscured by it.
  listen(header, 'focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });
  listen(desktop, 'change', () => {
    const focused = document.activeElement;
    if (desktop.matches && focused === menu) navigation.querySelector('a').focus();
    setOpen(false, !desktop.matches && navigation.contains(focused));
  });
  const updateSurface = () => {
    document.documentElement.classList.toggle('header-scrolled', window.scrollY > 16);
  };
  const measure = () => {
    // Observe the bar, never the expanding mobile panel.
    document.documentElement.style.setProperty('--header-height', `${inner.getBoundingClientRect().height}px`);
  };
  listen(window, 'scroll', updateSurface, { passive: true });
  listen(window, 'pageshow', () => {
    setOpen(false, !desktop.matches && navigation.contains(document.activeElement));
    updateSurface();
    measure();
  });
  header.classList.add('navigation-ready');
  setOpen(false);
  const observer = new ResizeObserver(measure);
  observer.observe(inner);
  measure();
  updateSurface();
  return () => {
    controller.abort();
    observer.disconnect();
    closeSubmenu.destroy?.();
    navigation.inert = false;
    navigation.classList.remove('is-open');
    header.classList.remove('navigation-ready');
    menu.setAttribute('aria-expanded', 'false');
    document.documentElement.style.removeProperty('--header-height');
  };
}
