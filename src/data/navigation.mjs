import { navigation } from './site.mjs';

// One tree renders both layouts; the public navigation export remains compatible.
export const navigationItems = navigation.map(([href, label]) => ({
  href, label,
  ...(href === '/accompagnements/' ? {
    id: 'accompagnements',
    children: [
      { href: '/accompagnements/coaching-professionnel/', label: 'Coaching & transitions de carrière' },
      { href: '/accompagnements/sante-travail/', label: 'Santé & Travail' },
      { href: '/accompagnements/pleine-conscience/', label: 'Méditation de pleine conscience' },
    ],
  } : {}),
}));
