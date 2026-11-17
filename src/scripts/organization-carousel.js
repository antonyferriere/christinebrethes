for (const section of document.querySelectorAll('[data-carousel]')) {
  const track = section.querySelector('.organization-track');
  const items = Array.from(track.children);
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
  let interacting = false;
  let resumeTimer = 0;
  let keyboardFocus = false;

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
  track.addEventListener('scroll', () => {
    // Native scrollbar movements may arrive without a pointer event on the track.
    if (!keyboardFocus && Math.abs(track.scrollLeft - position) > 1) pauseOnInteraction();
    wrap();
    if (interacting) resumeAfterInteraction();
  }, { passive: true });
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
    if (visible && playing && !document.hidden && !hovering && !touching && !dragging && !interacting && !keyboardFocus) {
      position = track.scrollLeft;
      frame = requestAnimationFrame(tick);
    }
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(section);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => { playing = !motion.matches; sync(); });
  function resumeAfterInteraction() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      if (dragging || touching) return;
      interacting = false;
      // Resume even if the pointer still rests on the card or scrollbar.
      hovering = false;
      sync();
    }, 1500);
  }
  function pauseOnInteraction() {
    interacting = true;
    sync();
    resumeAfterInteraction();
  }
  track.addEventListener('focus', () => {
    keyboardFocus = track.matches(':focus-visible');
    sync();
  });
  track.addEventListener('keydown', () => { keyboardFocus = true; sync(); });
  track.addEventListener('blur', () => { keyboardFocus = false; sync(); });
  track.addEventListener('wheel', () => {
    keyboardFocus = false;
    pauseOnInteraction();
  }, { passive: true });
  track.addEventListener('pointerenter', event => { hovering = event.pointerType === 'mouse'; sync(); });
  track.addEventListener('pointerleave', () => { hovering = false; sync(); });
  track.addEventListener('pointerdown', event => {
    keyboardFocus = false;
    pauseOnInteraction();
    if (event.pointerType !== 'mouse') { touching = true; sync(); return; }
    if (event.button !== 0) return;
    // Leave the native scrollbar in control when it is the pointer target.
    const bounds = track.getBoundingClientRect();
    if (event.clientY >= bounds.top + track.clientTop + track.clientHeight) return;
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
    if (interacting) resumeAfterInteraction();
    sync();
  }
  window.addEventListener('pointerup', release);
  track.addEventListener('pointercancel', release);
  track.addEventListener('lostpointercapture', release);
  sync();
}
