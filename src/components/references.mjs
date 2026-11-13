import { organizationCarousel } from './organization-carousel.mjs';
import { references } from '../data/references.mjs';
export function referencesSection(items = references) {
  const approved = items.filter(item => item.contentApproved === true && item.relationship.trim());
  return organizationCarousel('references', 'Références et partenaires', approved, 'relationship');
}
