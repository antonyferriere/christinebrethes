import { siteHeader } from './site-header.mjs';
import { privacyConfig } from '../data/privacy-config.mjs';
import { needsSection } from './sections.mjs';
import { closing } from './sections.mjs';
import { externalLinks } from './external-links.mjs';
import { contactDetails } from './contact-details.mjs';
import { site, offerPath } from '../data/site.mjs';
import { offers } from '../data/offers.mjs';
import { escape } from './ui.mjs';

function footer() {
  return `<footer class="site-footer"><div class="container footer-grid"><div><a class="footer-brand" href="/">Christine Brethes</a><p>Coach santé-travail<br>Instructrice méditation de pleine conscience</p><p class="signature">${site.tagline}</p></div>
  <div><h2>Vous accompagner</h2><ul>${offers.map((o) => `<li><a href="${offerPath(o)}">${escape(o.title)}</a></li>`).join('')}</ul></div>
  <div><h2>Restons en lien</h2>${contactDetails()}</div></div>
  <div class="container footer-bottom"><span>© ${new Date().getFullYear()} Christine BRETHES</span><div><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a><button type="button" class="cookie-settings" data-cookie-settings>Gestion des cookies</button></div></div></footer>`;
}
export function layout({ title, description, path, body, home = false, assetVersion = '' }) {
  const privacy = privacyConfig(process.env, site.productionReady || process.argv.includes('--production') || process.env.NODE_ENV === 'production');
  if (path !== '/') {
    body += needsSection();
  }
  const canonical = site.productionReady ? `<link rel="canonical" href="${site.domain}${path}">` : '';
  const schema = { '@context': 'https://schema.org', '@type': 'Person', name: site.name, jobTitle: 'Coach santé-travail et instructrice méditation de pleine conscience', sameAs: [site.linkedin] };
  return externalLinks(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} | Christine BRETHES</title><meta name="description" content="${escape(description)}"><meta name="robots" content="${site.productionReady ? 'index, follow' : 'noindex, nofollow'}">${canonical}
  <meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}">${site.productionReady ? `<meta property="og:url" content="${site.domain}${path}"><meta property="og:image" content="${site.domain}/assets/christine-800.webp">` : ''}
  <meta name="site-privacy" data-ga-id="${privacy.id}" data-preview="${privacy.preview}" data-debug="${privacy.debug}"><meta name="theme-color" content="#f3ebe0"><link rel="icon" href="/assets/favicon.png"><link rel="preload" href="/fonts/lora-400.woff" as="font" type="font/woff" crossorigin><link rel="preload" href="/fonts/source-sans-3-400.woff" as="font" type="font/woff" crossorigin><link rel="stylesheet" href="/styles/site.css?v=${escape(assetVersion)}"><script src="/scripts/navigation-init.js?v=${escape(assetVersion)}"></script><script type="module" src="/scripts/main.js?v=${escape(assetVersion)}"></script><script type="application/ld+json">${JSON.stringify(schema)}</script></head>
  <body class="${home ? 'home ' : ''}${home || body.includes('immersive-page-hero') ? 'has-immersive-hero' : 'standard-page'}">${siteHeader(path)}<main id="contenu" tabindex="-1">${body}${path === "/contact/" ? "" : closing()}</main>${footer()}</body></html>`, site.domain);
}
