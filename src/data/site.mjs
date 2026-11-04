export const site = {
  name: 'Christine BRETHES',
  profession: 'Coach santé-travail · Pleine conscience',
  tagline: 'Cultiver l’équilibre, retrouver son élan',
  // Coordonnées publiques validées par Christine.
  domain: 'https://christinebrethes.fr',
  email: 'contact@christinebrethes.fr',
  phone: '07 81 65 96 98',
  phoneLink: '+33781659698',
  linkedin: 'https://www.linkedin.com/in/christinebrethes/',
  booking: {
    url: 'https://www.crenolibre.fr/prendre-rdv/166171_brethes-christine',
    available: false,
    checkedOn: '2026-10-15',
  },
  // Laisser false jusqu’à validation des mentions légales, du domaine et des parcours.
  productionReady: false,
};
export const navigation = [
  ['/', 'Accueil'], ['/accompagnements/', 'Accompagnements'],
  ['/a-propos/', 'À propos'], ['/entreprises-organisations/', 'Organisations'], ['/contact/', 'Contact'],
];
export const offerPath = (offer) => offer.slug === 'entreprises-organisations'
  ? '/entreprises-organisations/' : `/accompagnements/${offer.slug}/`;
