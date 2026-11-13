import { pageImage } from './page-hero.mjs';
import { offers } from '../data/offers.mjs';
import { site, offerPath } from '../data/site.mjs';
import { linkedinSettings, recommendations, publications } from '../data/linkedin.mjs';
import { escape, button, photo, arrow, sectionHeading } from './ui.mjs';
export function offerCards(exclude = '') {
  return `<div class="offer-grid">${offers.map((o, i) => o.slug === exclude ? '' : `<article class="offer-card"><a href="${offerPath(o)}" class="offer-image" tabindex="-1" aria-hidden="true">${pageImage(o.slug, { card: true })}</a><div class="offer-content"><h3><a href="${offerPath(o)}">${escape(o.title)}</a></h3><p>${escape(o.summary)}</p><a class="text-link" href="${offerPath(o)}">Découvrir ${arrow}<span class="sr-only"> : ${escape(o.title)}</span></a></div></article>`).join('')}</div>`;
}
export function closing() {
  return `<section class="closing"><div class="container closing-grid"><div><p class="eyebrow">Le premier pas</p><h2>Et si nous prenions le temps d’en parler ?</h2><p>Un questionnement, une transition, un besoin d’accompagnement.<br>Commençons simplement par un échange</p></div><div class="closing-actions">${button('Prendre rendez-vous', site.booking.url || '/contact/')}<a class="text-link" href="/contact/?profil=organisation">Vous représentez une organisation ? ${arrow}</a></div></div></section>`;
}
export function places() {
  return `<section class="section places container"><div class="places-photo">${photo('cabinet-bureau', 'Une estampe murale représentant un paysage arboré dans le cabinet parisien')}</div><div>${sectionHeading('Un cadre pour vous', 'Proche de vous. À votre rythme.', 'Un espace d’écoute pour prendre du recul, clarifier ce qui compte et avancer pas à pas.')}<div class="place-list"><div><span>01</span><div><h3>À Paris</h3><p>En cabinet, dans un cadre accueillant.</p></div></div><div><span>02</span><div><h3>À Chartres</h3><p>En présentiel, sur rendez-vous.</p></div></div><div><span>03</span><div><h3>Où que vous soyez</h3><p>En visioconférence, avec la même qualité d’écoute.</p></div></div></div><a class="button button-outline" href="/contact/">Les modalités pratiques ${arrow}</a></div></section>`;
}
export function linkedinSections(settings = linkedinSettings, reviewsData = recommendations, postsData = publications) {
  const reviews = settings.recommendations ? reviewsData.filter((r) => r.visible && r.authorized) : [];
  const posts = settings.publications ? postsData.filter((p) => p.visible) : [];
  const cards = reviews.map(r => `<figure class="offer-card review">
    <figcaption class="review-person">
      <a class="text-link review-profile" href="${escape(r.source)}">
        ${r.portrait ? `<img src="${escape(r.portrait)}" alt="" width="64" height="64" loading="lazy" decoding="async">` : ''}
        <span class="review-identity"><span>${escape(r.author)}</span>${r.role ? `<span class="review-role">${escape(r.role)}</span>` : ''}</span>
      </a>
    </figcaption>
    <blockquote>${r.text.split(/\n\n/).map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}</blockquote>
  </figure>`).join('');
  return `${reviews.length ? `<section class="section tinted testimonials"><div class="container">
    ${sectionHeading('Regards partagés', 'Ils témoignent de mon accompagnement')}
    <div class="review-grid">${cards}</div>
    <div class="review-link"><a class="button button-outline" href="${site.linkedin}">Voir le profil LinkedIn de Christine ↗</a></div>
  </div></section>` : ''}${posts.length ? `<section class="container section">${sectionHeading('Au fil des idées', 'Actualités & réflexions')}<div class="post-grid">${posts.map((p) => `<article class="post">${p.image ? `<img src="${escape(p.image)}" alt="" loading="lazy" width="600" height="400">` : ''}<p class="eyebrow">${escape(p.topic)} · <time datetime="${escape(p.date)}">${escape(p.date)}</time></p><h3>${escape(p.title)}</h3><p>${escape(p.excerpt)}</p><a class="text-link" href="${escape(p.url)}">Lire sur LinkedIn ↗</a></article>`).join('')}</div></section>` : ''}`;
}

export function needsSection() {
 return `<section class="section container">${sectionHeading('Quatre accompagnements', 'Quel nouvel élan souhaitez-vous donner à vos projets ?')}${offerCards()}</section>`;
}
