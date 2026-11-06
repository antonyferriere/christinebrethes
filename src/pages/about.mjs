import { editorialPage } from './editorial.mjs';
import about from '../data/about.mjs';
import { certificationsSection } from '../components/certifications.mjs';
export function aboutPage() {
  // Unconfirmed claims are not republished as qualifications.
  const page = {...about, sections: about.sections.filter(section => section.eyebrow !== 'Formations & certifications')};
  const content = editorialPage(page);
  if (!content.includes('<section class="closing">')) return content + certificationsSection();
  return content.replace('<section class="closing">', certificationsSection() + '<section class="closing">');
}
