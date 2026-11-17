import { site } from '../data/site.mjs';
import { escape } from './ui.mjs';
import { siteNavigation } from './site-navigation.mjs';

function navigationCTA() {
  return `<a class="button button-small header-booking" href="${escape(site.booking.url || '/contact/')}" aria-label="Prendre rendez-vous"><span class="booking-full">Prendre rendez-vous</span><span class="booking-short" aria-hidden="true">Rendez-vous</span></a>`;
}

export function siteHeader(path) {
  return `<a class="skip-link" href="#contenu">Aller au contenu</a>
  <header class="site-header"><div class="header-inner">
    <a class="brand" href="/" aria-label="Christine BRETHES — Accueil"><picture><source media="(max-width: 699px)" srcset="/assets/monogramme.webp"><img src="/assets/logo.webp" width="300" height="91" alt="Christine BRETHES, coaching, santé et travail, pleine conscience"></picture></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" aria-label="Ouvrir le menu"><span class="menu-toggle-icon" aria-hidden="true"></span><span class="menu-toggle-label">Menu</span></button>
    ${siteNavigation(path)}${navigationCTA()}
  </div></header>`;
}
