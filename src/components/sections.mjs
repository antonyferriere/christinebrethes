import { offers } from '../data/offers.mjs';
import { site, offerPath } from '../data/site.mjs';
import { linkedinSettings, recommendations, publications } from '../data/linkedin.mjs';
import { escape, button, photo, arrow, sectionHeading } from './ui.mjs';
export function offerCards(exclude = '') {
  const pictures = ['allee', 'christine-parcours', 'jardin', 'cabinet'];
  return `<div class="offer-grid">${offers.map((o, i) => o.slug === exclude ? '' : `<article class="offer-card"><a href="${offerPath(o)}" class="offer-image" tabindex="-1" aria-hidden="true">${photo(pictures[i], '', { sizes: '(min-width: 1200px) 23vw, (min-width: 600px) 45vw, 90vw' })}<span class="offer-number">0${i + 1}</span></a><div class="offer-content"><p class="eyebrow">${i === 3 ? 'Pour les organisations' : 'Pour les particuliers'}</p><h3><a href="${offerPath(o)}">${escape(o.title)}</a></h3><p>${escape(o.summary)}</p><a class="text-link" href="${offerPath(o)}">Découvrir ${arrow}<span class="sr-only"> : ${escape(o.title)}</span></a></div></article>`).join('')}</div>`;
}
export function closing() {
  return `<section class="closing"><div class="container closing-grid"><div><p class="eyebrow">Le premier pas</p><h2>Et si nous prenions<br>le temps d’en parler ?</h2><p>Une question, une transition, un besoin d’accompagnement.<br>Commençons simplement par un échange.</p></div><div class="closing-actions">${button('Prendre rendez-vous', '/rendez-vous/')}<a class="text-link" href="/contact/?profil=organisation">Vous représentez une organisation ? ${arrow}</a></div></div></section>`;
}
export function places() {
  return `<section class="section places container"><div class="places-photo">${photo('cabinet', 'Le cabinet parisien : fauteuil vert et espace d’échange lumineux')}</div><div>${sectionHeading('Un cadre pour vous', 'Proche de vous.<br>À votre rythme.', 'Un espace d’écoute pour prendre du recul, clarifier ce qui compte et avancer pas à pas.')}<div class="place-list"><div><span>01</span><div><h3>À Paris</h3><p>En cabinet, dans un cadre accueillant.</p></div></div><div><span>02</span><div><h3>À Chartres</h3><p>En présentiel, sur rendez-vous.</p></div></div><div><span>03</span><div><h3>Où que vous soyez</h3><p>En visioconférence, avec la même qualité d’écoute.</p></div></div></div><a class="text-link" href="/contact/">Les modalités pratiques ${arrow}</a></div></section>`;
}
export function linkedinSections() {
  const reviews = linkedinSettings.recommendations ? recommendations.filter((r) => r.visible && r.authorized) : [];
  const posts = linkedinSettings.publications ? publications.filter((p) => p.visible) : [];
  return `${reviews.length ? `<section class="container section">${sectionHeading('Regards partagés', 'Ils témoignent de mon accompagnement')}<div class="review-grid">${reviews.map((r) => `<figure class="review"><blockquote>${escape(r.text)}</blockquote><figcaption>${escape(r.author)}${r.role ? ` · ${escape(r.role)}` : ''} <a href="${escape(r.source)}">Lire sur LinkedIn ↗</a></figcaption></figure>`).join('')}</div><a class="text-link" href="${site.linkedin}">Voir le profil LinkedIn de Christine ↗</a></section>` : ''}${posts.length ? `<section class="container section">${sectionHeading('Au fil des idées', 'Actualités & réflexions')}<div class="post-grid">${posts.map((p) => `<article class="post">${p.image ? `<img src="${escape(p.image)}" alt="" loading="lazy" width="600" height="400">` : ''}<p class="eyebrow">${escape(p.topic)} · <time datetime="${escape(p.date)}">${escape(p.date)}</time></p><h3>${escape(p.title)}</h3><p>${escape(p.excerpt)}</p><a class="text-link" href="${escape(p.url)}">Lire sur LinkedIn ↗</a></article>`).join('')}</div></section>` : ''}`;
}
