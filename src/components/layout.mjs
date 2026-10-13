import { site, navigation, offerPath } from '../data/site.mjs';
import { offers } from '../data/offers.mjs';
import { escape, button } from './ui.mjs';

function header(path) {
  return `<a class="skip-link" href="#contenu">Aller au contenu</a>
  <header class="site-header"><div class="header-inner">
    <a class="brand" href="/" aria-label="Christine BRETHES — Accueil"><img src="/assets/logo.webp" width="300" height="91" alt="Christine BRETHES, coaching, santé et travail, pleine conscience"></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation">Menu <span aria-hidden="true">☰</span></button>
    <nav id="navigation" aria-label="Navigation principale"><ul>${navigation.map(([url, label]) => `<li><a href="${url}"${path === url || (url === '/accompagnements/' && path.startsWith(url)) ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}</ul>${button('Prendre rendez-vous', '/rendez-vous/', 'button-small')}</nav>
  </div></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="container footer-grid"><div><a class="footer-brand" href="/">Christine Brethes</a><p>Coach santé-travail<br>Instructrice en méditation de pleine conscience</p><p class="signature">${site.tagline}</p></div>
  <div><h2>Vous accompagner</h2><ul>${offers.map((o) => `<li><a href="${offerPath(o)}">${escape(o.title)}</a></li>`).join('')}</ul></div>
  <div><h2>Restons en lien</h2><ul><li>Paris · Chartres · Visioconférence</li>${site.phoneLink ? `<li><a href="tel:${site.phoneLink}">${site.phone}</a></li>` : ''}${site.email ? `<li><a href="mailto:${site.email}">${site.email}</a></li>` : ''}<li><a href="${site.linkedin}">Le profil LinkedIn de Christine ↗</a></li></ul></div></div>
  <div class="container footer-bottom"><span>© ${new Date().getFullYear()} Christine BRETHES</span><div><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a></div></div></footer>`;
}
export function layout({ title, description, path, body, home = false }) {
  const canonical = site.productionReady ? `<link rel="canonical" href="${site.domain}${path}">` : '';
  const schema = { '@context': 'https://schema.org', '@type': 'Person', name: site.name, jobTitle: 'Coach santé-travail et instructrice en méditation de pleine conscience', sameAs: [site.linkedin] };
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} | Christine BRETHES</title><meta name="description" content="${escape(description)}"><meta name="robots" content="${site.productionReady ? 'index, follow' : 'noindex, nofollow'}">${canonical}
  <meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}">${site.productionReady ? `<meta property="og:url" content="${site.domain}${path}"><meta property="og:image" content="${site.domain}/assets/christine-800.webp">` : ''}
  <meta name="theme-color" content="#f3ebe0"><link rel="icon" href="/assets/favicon.png"><link rel="preload" href="/fonts/lora-400.woff" as="font" type="font/woff" crossorigin><link rel="preload" href="/fonts/source-sans-3-400.woff" as="font" type="font/woff" crossorigin><link rel="stylesheet" href="/styles/site.css"><script type="module" src="/scripts/main.js"></script><script type="application/ld+json">${JSON.stringify(schema)}</script></head>
  <body${home ? ' class="home"' : ''}>${header(path)}<main id="contenu" tabindex="-1">${body}</main>${footer()}</body></html>`;
}
