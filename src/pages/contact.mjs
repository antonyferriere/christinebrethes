import { pageHero } from '../components/page-hero.mjs';
import { contactDetails } from '../components/contact-details.mjs';
export function contactPage() {
 return `${pageHero('contact', `<p class="eyebrow">Entrons en contact</p><h1>Tout commence <em>par un échange.</em></h1><p class="lede">Pour un accompagnement individuel, une intervention ou un partenariat, parlons de ce dont vous avez besoin.</p>${contactDetails()}`)}`;
}
