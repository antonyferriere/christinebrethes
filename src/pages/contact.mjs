import { button } from '../components/ui.mjs';
import { site } from '../data/site.mjs';
import { pageHero } from '../components/page-hero.mjs';
import { contactDetails } from '../components/contact-details.mjs';
export function contactPage() {
 return pageHero('contact', `<p class="eyebrow">Entrons en contact</p><h1>Tout commence <em>par un échange.</em></h1><p class="lede">Pour un accompagnement individuel, une intervention ou un partenariat, imaginons ensemble de nouvelles perspectives.</p>${contactDetails({ includeBooking: false })}${button('Prendre rendez-vous avec Christine', site.booking.url)}`);
}
