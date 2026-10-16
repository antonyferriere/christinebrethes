import { site } from '../data/site.mjs';
const paths = {
 location: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 5 9 8 9-8"/>',
 phone: '<path d="m5 3 4 4-2 3c2 4 3 5 7 7l3-2 4 4c-2 5-7 2-11-1S0 6 5 3Z"/>',
 linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.1M11 17v-7M11 13c0-4 6-4 6 0v4"/>',
 calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18M7 15h3M14 15h3"/>',
};
export function contactDetails() {
 const entries = [['location', 'Paris & Chartres · Visio', ''], ['email', site.email, `mailto:${site.email}`], ['phone', site.phone, `tel:${site.phoneLink}`], ['linkedin', 'Retrouver Christine sur LinkedIn', site.linkedin], ['calendar', 'Prendre rendez-vous avec Christine', site.booking.url]];
 return `<ul class="contact-details">${entries.map(([icon,label,url]) => `<li><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${paths[icon]}</svg>${url ? `<a href="${url}">${label}</a>` : `<span>${label}</span>`}</li>`).join('')}</ul>`;
}
