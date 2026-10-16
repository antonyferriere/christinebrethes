import { initializeContact } from './contact.js';

document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 1200px)').addEventListener('change', closeMenu);

const motion = matchMedia('(prefers-reduced-motion: reduce)');
let observer;
function initializeReveals() {
  observer?.disconnect();
  const sections = document.querySelectorAll('.section-heading, .principles article, .steps article');
  sections.forEach((section) => section.classList.remove('reveal-ready', 'is-visible'));
  if (motion.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('is-visible');
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.08 });
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top > window.innerHeight) {
      section.classList.add('reveal-ready');
      observer.observe(section);
    }
  });
}
initializeReveals();
motion.addEventListener('change', initializeReveals);
initializeContact();

// Only the homepage owns a carousel. Deferred images never block the first scene.
const hero = document.querySelector('[data-hero-carousel]');
if (hero) {
  const header = document.querySelector('.site-header');
  const measureHeader = () => hero.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
  measureHeader();
  new ResizeObserver(measureHeader).observe(header);
  const slides = [...hero.querySelectorAll('.hero-scene')];
  const controls = hero.querySelector('.hero-controls');
  const dots = [...controls.querySelectorAll('[data-slide]')];
  let index = 0, timer, visible = true, request = 0;
  const load = async (i) => {
    const img = slides[i].querySelector('img');
    if (img.dataset.src) {
      img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
      delete img.dataset.src;
    }
    await img.decode();
  };
  const schedule = () => {
    clearTimeout(timer);
    if (visible && !document.hidden) timer = setTimeout(() => show((index + 1) % slides.length), 7500);
  };
  const show = async (next) => {
    const token = ++request;
    clearTimeout(timer);
    try { await load(next); } catch { schedule(); return; }
    if (token !== request) return;
    slides[index].classList.remove('is-active');
    index = next;
    slides[index].classList.add('is-active');
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    schedule();
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  document.addEventListener('visibilitychange', schedule);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }).observe(hero);
  controls.hidden = false;
  schedule();
}

// A single animation frame per scroll; reduced motion keeps every image still.
const depthLayers = [...document.querySelectorAll('.hero-scenes, .page-hero-background')];
let depthFrame = 0;
function paintDepth() {
  depthFrame = 0;
  depthLayers.forEach(layer => {
    const rect = layer.parentElement.getBoundingClientRect();
    const offset = motion.matches ? 0 : Math.min(36, Math.max(-36, -rect.top * .09));
    layer.style.setProperty('--depth-y', `${offset.toFixed(2)}px`);
  });
}
function requestDepth() {
  if (!depthFrame) depthFrame = requestAnimationFrame(paintDepth);
}
window.addEventListener('scroll', requestDepth, { passive: true });
window.addEventListener('resize', requestDepth, { passive: true });
motion.addEventListener('change', requestDepth);
paintDepth();
