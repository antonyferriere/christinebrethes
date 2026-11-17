// Match author areas without tying collapsed cards to an expanded neighbour.
for (const grid of document.querySelectorAll('.review-grid')) {
  const profiles = [...grid.querySelectorAll('.review-profile')];
  const alignProfiles = () => {
    const height = Math.max(0, ...profiles.map(profile => profile.getBoundingClientRect().height));
    grid.style.setProperty('--review-person-height', `${height}px`);
  };
  alignProfiles();
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(alignProfiles);
    profiles.forEach(profile => observer.observe(profile));
  }

  for (const disclosure of grid.querySelectorAll('.review-disclosure')) {
    disclosure.querySelector('blockquote').addEventListener('click', event => {
      // Keep text selection and any future links usable.
      if (!disclosure.open || event.target.closest('a, button') || !window.getSelection().isCollapsed) return;
      disclosure.open = false;
      disclosure.querySelector('summary').focus({ preventScroll: true });
    });
  }
}
