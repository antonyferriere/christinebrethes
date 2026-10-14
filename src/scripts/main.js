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
