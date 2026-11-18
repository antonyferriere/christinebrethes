// Offres individuelles confirmées par Christine (novembre 2026).
// Les programmes hybrides à 400 / 500 € ont été proposés dans la conversation
// et restent à valider par Christine avant la mise en production.
export const discovery = {
  name: 'Premier échange découverte', duration: '30 minutes', price: null,
  description: 'Un temps offert, sans engagement, pour faire connaissance, comprendre vos attentes et vérifier si l’accompagnement vous convient.',
};
export const coachingSession = {
  name: 'Séance individuelle', duration: '1 heure', price: 75,
  description: 'Un espace pour prendre du recul, clarifier votre situation, identifier vos ressources et avancer vers des objectifs qui ont du sens.',
};
export const meditationSession = {
  name: 'Séance individuelle', duration: '1 heure', price: 60,
  description: 'Échanges et pratiques guidées pour découvrir, approfondir ou adapter la pleine conscience à votre quotidien.',
};
export const meditationWorkshop = {
  name: 'Atelier collectif', duration: '1 heure · par personne', price: 25,
  description: 'Une séance en petit groupe pour découvrir et pratiquer la méditation de pleine conscience.',
};
export const meditationLongWorkshop = {
  name: 'Atelier collectif', duration: '1 h 30 · par personne', price: 35,
  description: 'Un temps de pratique plus approfondi en petit groupe, adapté aux débutants comme aux pratiquants réguliers.',
};
export const hybridPrograms = {
  eyebrow: 'Programmes sur mesure',
  title: 'Des parcours pour avancer dans la durée',
  introduction: 'Des programmes intégrant coaching et méditation de pleine conscience, à construire selon votre situation et vos objectifs.',
  entries: [
    {
      name: 'Parcours Élan', duration: '6 séances sur 3 mois', price: 400,
      description: 'Pour amorcer un changement et développer des ressources en associant coaching et pleine conscience.',
    },
    {
      name: 'Parcours Ancrage', duration: '8 séances sur 4 mois', price: 500,
      description: 'Pour approfondir le travail dans la durée, à travers un accompagnement combinant coaching et pleine conscience.',
    },
  ],
  note: 'Le programme qui vous correspond, son contenu et ses modalités sont déterminés ensemble lors du premier échange découverte de 30 minutes, offert et sans engagement.',
};
export const offerPrices = {
  'pleine-conscience': {
    eyebrow: 'Pleine conscience', title: 'Séances et ateliers de méditation',
    introduction: 'Un accompagnement individuel ou collectif, accessible et adapté à votre expérience.',
    entries: [meditationSession, meditationWorkshop, meditationLongWorkshop],
  },
  'coaching-professionnel': {
    eyebrow: 'Coaching individuel', title: 'Tarifs du coaching individuel',
    introduction: 'Un premier échange offert pour faire connaissance, puis des séances adaptées à vos besoins.',
    entries: [discovery, coachingSession],
  },
  'sante-travail': {
    eyebrow: 'Santé & Travail', title: 'Tarifs des séances individuelles',
    introduction: 'Un premier échange offert et sans engagement, puis des séances individuelles de coaching.',
    entries: [discovery, coachingSession],
  },
};
export const pricingTerms = [
  {
    title: 'Lieux et visioconférence',
    text: 'Les séances individuelles sont proposées en présentiel à Paris et à Champhol, près de Chartres, ainsi qu’à distance en visioconférence.',
  },
  {
    title: 'Règlement',
    text: 'Les séances individuelles sont réglées à la séance. Les modalités de règlement des programmes sont précisées lors du premier échange.',
  },
  {
    title: 'Programmes personnalisés',
    text: 'Les programmes combinent coaching et méditation de pleine conscience. Leur contenu, leur rythme et leurs modalités sont adaptés à la situation de chaque personne.',
  },
  {
    title: 'Annulation ou report',
    text: 'Une séance peut être annulée ou reportée sans frais jusqu’à 24 heures avant le rendez-vous. Passé ce délai, la séance est due, sauf situation exceptionnelle.',
  },
  {
    title: 'Tarif adapté',
    text: 'Quelques possibilités de tarif adapté peuvent être proposées selon la situation. N’hésitez pas à contacter Christine pour en parler en toute simplicité et transparence.',
  },
];
export const careInformation = 'La méditation de pleine conscience et le coaching s’inscrivent dans une démarche d’accompagnement et de développement personnel. Ils ne constituent ni un acte médical ni une psychothérapie et ne se substituent pas à un diagnostic, un traitement ou un suivi auprès d’un professionnel de santé. En cas de maladie chronique ou de difficulté de santé, la pleine conscience intervient en complément du suivi assuré par vos professionnels de santé.';
