// A disclosure keeps ordinary links and native Tab navigation (not an ARIA menu).
export function initializeSubmenu(navigation) {
  const item = navigation.querySelector('.nav-disclosure');
  if (!item) return () => {};
  const toggle = item.querySelector('.submenu-toggle');
  const panel = item.querySelector('.nav-submenu');
  const desktop = matchMedia('(min-width: 1200px)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const header = navigation.closest('.site-header');
  const headerRow = header.querySelector('.header-inner');
  let open = false, timer;
  function measureExtension() {
    const extension = desktop.matches
      ? Math.max(0, panel.getBoundingClientRect().bottom - headerRow.getBoundingClientRect().bottom)
      : 0;
    header.style.setProperty('--submenu-extension', `${Math.ceil(extension)}px`);
  }
  new ResizeObserver(measureExtension).observe(panel);
  new ResizeObserver(measureExtension).observe(headerRow);
  function setOpen(value) {
    clearTimeout(timer);
    // Mobile offers are always available; only desktop is a disclosure.
    open = !desktop.matches || value;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Masquer les offres Accompagnements' : 'Afficher les offres Accompagnements');
    item.classList.toggle('is-expanded', open);
    panel.inert = !open;
    measureExtension();
  }
  toggle.addEventListener('click', () => setOpen(!open));
  item.addEventListener('pointerenter', (event) => {
    if (desktop.matches && hover.matches && event.pointerType === 'mouse') setOpen(true);
  });
  item.addEventListener('pointerleave', () => {
    if (desktop.matches && !item.contains(document.activeElement)) timer = setTimeout(() => setOpen(false), 160);
  });
  item.addEventListener('focusin', () => clearTimeout(timer));
  item.addEventListener('focusout', (event) => {
    if (!item.contains(event.relatedTarget)) setOpen(false);
  });
  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      panel.querySelector('a').focus();
    }
  });
  item.addEventListener('keydown', (event) => {
    if (desktop.matches && event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    // A hover-open panel must also close when focus is elsewhere on the page.
    if (desktop.matches && event.key === 'Escape' && open) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!item.contains(event.target)) setOpen(false);
  });
  desktop.addEventListener('change', () => setOpen(false));
  window.addEventListener('pageshow', () => setOpen(false));
  setOpen(false);
  return () => setOpen(false);
}
