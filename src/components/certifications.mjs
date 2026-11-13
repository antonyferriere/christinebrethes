import { organizationCarousel } from './organization-carousel.mjs';
import { certifications } from '../data/certifications.mjs';
export function certificationsSection(items = certifications) {
  const approved = items.filter(item => item.contentApproved === true && item.logoAuthorized === true && item.title.trim());
  return organizationCarousel('certifications', 'Formations & certifications', approved, 'title');
}
