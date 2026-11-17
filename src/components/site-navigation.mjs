import { navigationItems } from '../data/navigation.mjs';
import { escape } from './ui.mjs';

export function navigationLink({ href, label, children }, path) {
  const current = path === href ? ' aria-current="page"' : '';
  const section = children?.some(item => item.href === path) ? ' class="is-current-section"' : '';
  return `<a href="${escape(href)}"${current}${section}>${escape(label)}</a>`;
}

export function siteNavigation(path) {
  return `<nav id="navigation" aria-label="Navigation principale"><ul>${navigationItems.map(item => {
    if (!item.children) return `<li>${navigationLink(item, path)}</li>`;
    return `<li class="nav-disclosure"><div class="nav-disclosure-heading">${navigationLink(item, path)}<button class="submenu-toggle" type="button" aria-expanded="false" aria-controls="${item.id}-submenu" aria-label="Afficher les offres Accompagnements"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 9 6 6 6-6"/></svg></button></div><ul id="${item.id}-submenu" class="nav-submenu">${item.children.map(child => `<li>${navigationLink(child, path)}</li>`).join('')}</ul></li>`;
  }).join('')}</ul></nav>`;
}
