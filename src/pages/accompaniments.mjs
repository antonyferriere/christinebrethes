import { offers } from '../data/offers.mjs';
import { offerPath } from '../data/site.mjs';
import { pageHero, pageImage } from '../components/page-hero.mjs';
import { escape, button } from '../components/ui.mjs';
import { closing } from '../components/sections.mjs';

const previews = {
  'coaching-professionnel': {
    title: 'Coaching professionnel & transitions de carrière',
    heading: 'Redonner une direction à votre parcours',
    paragraphs: [
      'Une recherche d’emploi qui se prolonge, une envie de reconversion, un poste dans lequel vous ne vous reconnaissez plus…',
      'Certaines étapes invitent à prendre du recul avant d’opérer des choix.',
      'Dans le cadre d’une alliance de travail et en co-construction, je vous accompagne pour faire le point sur votre parcours, vos aspirations et vos compétences afin de construire un projet réaliste et qui vous ressemble.',
    ],
  },
  'sante-travail': {
    title: 'Santé & Travail',
    heading: 'Reprendre, en tenant compte de ce qui a changé',
    paragraphs: [
      'La maladie chronique, un burn-out ou une fatigue persistante peuvent modifier le rapport au travail, au corps et à l’avenir.',
      'Reprendre une activité soulève alors des questions très concrètes : de quelles ressources disposez-vous aujourd’hui ? Quel rythme envisager ? Comment retrouver confiance ?',
      'Je vous propose un espace pour explorer ces questions et préparer l’avenir, en tenant compte de votre énergie, de votre environnement et de ce qui compte pour vous.',
    ],
  },
};
export function accompanimentsPage() {
  return `${pageHero('accompagnements', '<h1>Votre parcours est unique.<br><em>Votre accompagnement aussi.</em></h1><p class="lede">Une approche intégrative, personnalisée et sur mesure, qui relie santé, travail et équilibre de vie pour accompagner vos transitions, développer vos ressources et ouvrir de nouvelles perspectives.</p>')}${closing()}`;
}
