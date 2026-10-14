import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout } from '../src/components/layout.mjs';
import { sectionHeading, button } from '../src/components/ui.mjs';
import { offerCards, closing } from '../src/components/sections.mjs';
import { homePage } from '../src/pages/home.mjs';
import { aboutPage } from '../src/pages/about.mjs';
import { contactPage, bookingPage } from '../src/pages/contact.mjs';
import { offerPage } from '../src/pages/offer.mjs';
import { legalPage, privacyPage } from '../src/pages/legal.mjs';
import { offers } from '../src/data/offers.mjs';
import { site, offerPath } from '../src/data/site.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
if (process.argv.includes('--production') && !site.productionReady) {
  throw new Error('Publication bloquée : renseigner les validations dans docs/validation-production.md, puis activer productionReady.');
}
const pages = [
  { path: '/', title: 'Coaching santé-travail à Paris, Chartres et en visio', description: 'Retrouver sa place, son rythme et sa capacité d’agir avec Christine Brethes. Coaching professionnel, santé-travail et pleine conscience.', body: homePage(), home: true },
  { path: '/accompagnements/', title: 'Les accompagnements', description: 'Quatre accompagnements pour votre parcours : coaching professionnel, santé-travail, pleine conscience et interventions en organisations.', body: `<section class="container page-hero compact"><p class="eyebrow">Trouver votre point d’appui</p><h1>Votre parcours.<br><em>Notre point de départ.</em></h1><p class="lede">Une approche personnalisée pour traverser les transitions et retrouver une manière durable d’avancer.</p></section><section class="section container">${sectionHeading('Quatre accompagnements', 'De quoi avez-vous besoin aujourd’hui ?')}${offerCards()}</section>${closing()}` },
  { path: '/a-propos/', title: 'À propos de Christine Brethes', description: 'Découvrez le parcours et l’approche intégrative de Christine Brethes, coach professionnelle certifiée et instructrice en pleine conscience.', body: aboutPage() },
  { path: '/contact/', title: 'Contacter Christine', description: 'Contactez Christine Brethes pour un accompagnement à Paris, Chartres ou en visio, une intervention ou un partenariat.', body: contactPage() },
  { path: '/rendez-vous/', title: 'Organiser votre rendez-vous', description: 'Contactez Christine Brethes pour organiser votre rendez-vous en cabinet ou en visioconférence.', body: bookingPage() },
  { path: '/mentions-legales/', title: 'Mentions légales', description: 'Informations légales du site de Christine Brethes. Version de présentation à compléter avant publication.', body: legalPage() },
  { path: '/confidentialite/', title: 'Confidentialité', description: 'Informations sur la confidentialité, le formulaire de préparation d’email et les liens externes du site de Christine Brethes.', body: privacyPage() },
  ...offers.map((offer) => ({ path: offerPath(offer), title: offer.title, description: offer.summary, body: offerPage(offer) })),
];
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, 'public'), dist, { recursive: true });
for (const page of pages) {
  const directory = resolve(dist, `.${page.path}`);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), layout(page));
}
await writeFile(resolve(dist, '404.html'), layout({ path: '/404/', title: 'Page introuvable', description: 'Retrouvez les accompagnements de Christine Brethes.', body: `<section class="container page-hero compact"><p class="eyebrow">Page introuvable</p><h1>Retrouvons le chemin.</h1><p>Cette page n’existe pas ou a changé d’adresse.</p>${button('Revenir à l’accueil', '/')}</section>` }));
await mkdir(resolve(dist, 'styles'), { recursive: true });
const css = await Promise.all(['tokens', 'base', 'components', 'pages', 'responsive'].map((name) => readFile(resolve(root, `src/styles/${name}.css`), 'utf8')));
await writeFile(resolve(dist, 'styles/site.css'), css.join('\n'));
await cp(resolve(root, 'src/scripts'), resolve(dist, 'scripts'), { recursive: true });
await writeFile(resolve(dist, 'robots.txt'), site.productionReady ? `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(({path})=>`<url><loc>${site.domain}${path}</loc></url>`).join('')}</urlset>\n`);
await writeFile(resolve(dist, '.htaccess'), `Options -Indexes\nDirectoryIndex index.html\nErrorDocument 404 /404.html\n<IfModule mod_rewrite.c>\nRewriteEngine On\nRewriteCond %{HTTPS} !=on\nRewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]\n</IfModule>\n<IfModule mod_mime.c>\nAddType text/javascript .js .mjs\n</IfModule>\n<IfModule mod_headers.c>\nHeader always set X-Content-Type-Options "nosniff"\nHeader always set Referrer-Policy "strict-origin-when-cross-origin"\nHeader always set Content-Security-Policy "default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'"\n</IfModule>\n`);
console.log(`${pages.length} pages + page 404 générées dans dist/ — ${site.productionReady ? 'production' : 'présentation non indexable'}.`);
