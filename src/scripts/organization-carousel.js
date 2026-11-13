for (const section of document.querySelectorAll('[data-carousel]')) {
  const track = section.querySelector('.organization-track');
  const items = Array.from(track.children);
  const controls = section.querySelector('.organization-controls');
  const play = controls.querySelector('[data-play]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !motion.matches;
  let visible = false;
  let frame = 0;
  let last = 0;
  let position = 0;
  let period = 0;
  let dragging = null;
  let hovering = false;
  let touching = false;

  function copies() {
    return items.map(item => {
      const clone = item.cloneNode(true);
      clone.inert = true;
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });
  }
  track.prepend(...copies());
  track.append(...copies());

  function measure() {
    const previous = period;
    period = items[0].offsetLeft - track.firstElementChild.offsetLeft;
    if (period) track.scrollLeft = previous ? track.scrollLeft / previous * period : period;
    position = track.scrollLeft;
  }
  new ResizeObserver(measure).observe(track);
  measure();

  function wrap() {
    if (!period) return;
    if (track.scrollLeft < 1) track.scrollLeft += period;
    else if (track.scrollLeft >= 2 * period) track.scrollLeft -= period;
    else if (frame) return;
    position = track.scrollLeft;
  }
  track.addEventListener('scroll', wrap, { passive: true });
  function tick(now) {
    const elapsed = last ? Math.min(now - last, 64) : 0;
    last = now;
    // Keep fractional pixels between frames even on displays that round scrollLeft.
    position += elapsed * .018;
    track.scrollLeft = position;
    frame = requestAnimationFrame(tick);
  }
  // Scroll events also fire during autoplay; preserve its sub-pixel remainder.
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    play.textContent = playing ? 'Ⅱ' : '▶';
    play.setAttribute('aria-label', playing ? 'Mettre le défilement en pause' : 'Démarrer le défilement');
    if (visible && playing && !document.hidden && !hovering && !touching && !dragging && document.activeElement !== track) {
      position = track.scrollLeft;
      frame = requestAnimationFrame(tick);
    }
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(section);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => { playing = !motion.matches; sync(); });
  play.addEventListener('click', () => { playing = !playing; sync(); });
  for (const [selector, direction] of [['[data-prev]', -1], ['[data-next]', 1]]) {
    controls.querySelector(selector).addEventListener('click', () => {
      playing = false;
      sync();
      track.scrollBy({ left: direction * period / items.length, behavior: motion.matches ? 'instant' : 'smooth' });
    });
  }
  track.addEventListener('focus', sync);
  track.addEventListener('blur', () => requestAnimationFrame(sync));
  track.addEventListener('pointerenter', event => { hovering = event.pointerType === 'mouse'; sync(); });
  track.addEventListener('pointerleave', () => { hovering = false; sync(); });
  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') { touching = true; sync(); return; }
    if (event.button !== 0) return;
    dragging = { x: event.clientX, left: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
    track.classList.add('dragging');
    event.preventDefault();
    sync();
  });
  track.addEventListener('dragstart', event => event.preventDefault());
  track.addEventListener('pointermove', event => {
    if (dragging && period) {
      const delta = dragging.left + dragging.x - event.clientX;
      track.scrollLeft = period + ((delta % period) + period) % period;
    }
  });
  function release() {
    dragging = null;
    touching = false;
    track.classList.remove('dragging');
    sync();
  }
  track.addEventListener('pointerup', release);
  track.addEventListener('pointercancel', release);
  track.addEventListener('lostpointercapture', release);
  controls.hidden = false;
  sync();
}
