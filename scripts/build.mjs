import { pageHero } from '../src/components/page-hero.mjs';
import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
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
// Une nouvelle URL invalide aussi les anciens caches qui ignoraient no-cache.
const browserScripts = await Promise.all(['main.js', 'contact.js'].map(name => readFile(resolve(root, 'src/scripts', name), 'utf8')));
const css = await Promise.all(['tokens', 'base', 'components', 'pages', 'responsive', 'hero', 'page-hero'].map(name => readFile(resolve(root, `src/styles/${name}.css`), 'utf8')));
const assetVersion = createHash('sha256').update(JSON.stringify([...browserScripts, ...css])).digest('hex').slice(0, 16);
const pages = [
  { path: '/', title: 'Coaching santé-travail à Paris, Chartres et en visio', description: 'Retrouver sa place, son rythme et sa capacité d’agir avec Christine Brethes. Coaching professionnel, santé-travail et pleine conscience.', body: homePage(), home: true },
  { path: '/accompagnements/', title: 'Les accompagnements', description: 'Quatre accompagnements pour votre parcours : coaching professionnel, santé-travail, pleine conscience et interventions en organisations.', body: `${pageHero('accompagnements', `<p class="eyebrow">Trouver votre point d’appui</p><h1>Votre parcours.<br><em>Notre point de départ.</em></h1><p class="lede">Une approche personnalisée pour traverser les transitions et retrouver une manière durable d’avancer.</p>`)}<section class="section container">${sectionHeading('Quatre accompagnements', 'De quoi avez-vous besoin aujourd’hui ?')}${offerCards()}</section>${closing()}` },
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
  await writeFile(resolve(directory, 'index.html'), layout({ ...page, assetVersion }));
}
await writeFile(resolve(dist, '404.html'), layout({ assetVersion, path: '/404/', title: 'Page introuvable', description: 'Retrouvez les accompagnements de Christine Brethes.', body: `<section class="container page-hero compact"><p class="eyebrow">Page introuvable</p><h1>Retrouvons le chemin.</h1><p>Cette page n’existe pas ou a changé d’adresse.</p>${button('Revenir à l’accueil', '/')}</section>` }));
await mkdir(resolve(dist, 'styles'), { recursive: true });
await writeFile(resolve(dist, 'styles/site.css'), css.join('\n'));
await cp(resolve(root, 'src/scripts'), resolve(dist, 'scripts'), { recursive: true });
await writeFile(resolve(dist, 'scripts/main.js'), browserScripts[0].replace("'./contact.js'", `'./contact.js?v=${assetVersion}'`));
await writeFile(resolve(dist, 'robots.txt'), site.productionReady ? `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(({path})=>`<url><loc>${site.domain}${path}</loc></url>`).join('')}</urlset>\n`);
console.log(`${pages.length} pages + page 404 générées dans dist/ — ${site.productionReady ? 'production' : 'présentation non indexable'}.`);
