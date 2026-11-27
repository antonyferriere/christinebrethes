// Match resting card areas without tying their heights to an expanded neighbour.
for (const grid of document.querySelectorAll('.review-grid')) {
  const profiles = [...grid.querySelectorAll('.review-profile')];
  const shortQuotes = [...grid.querySelectorAll('.review > blockquote')];
  const alignProfiles = () => {
    const height = Math.max(0, ...profiles.map(profile => profile.getBoundingClientRect().height));
    grid.style.setProperty('--review-person-height', `${height}px`);
    // Direct blockquotes are complete short reviews; expanded quotes are excluded.
    const shortHeight = Math.max(0, ...shortQuotes.map(quote => quote.getBoundingClientRect().height));
    grid.style.setProperty('--review-short-height', `${shortHeight}px`);
  };
  alignProfiles();
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(alignProfiles);
    [...profiles, ...shortQuotes].forEach(element => observer.observe(element));
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
