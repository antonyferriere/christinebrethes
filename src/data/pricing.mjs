// Source unique : tarifs finaux TTC validés par Christine en novembre 2026.
export const discovery = {
  name: 'Premier échange découverte', duration: '30 minutes', price: null,
  description: 'Un premier échange offert et sans engagement, pour faire connaissance, comprendre vos attentes et vérifier si mon accompagnement vous correspond.',
};
export const coachingSession = {
  name: 'Séance individuelle', duration: '1 heure', price: 75,
  description: 'Un espace pour prendre du recul, clarifier votre situation, identifier vos ressources et avancer vers des objectifs qui ont du sens pour vous.',
};
export const coachingCycle = {
  name: 'Cycle de 5 séances', duration: '5 séances', price: 350,
  description: 'Un parcours pour inscrire le travail dans la durée, avec des objectifs et un rythme définis ensemble.',
};
export const meditationSession = {
  name: 'Séance individuelle', duration: '1 heure', price: 60,
  description: 'Des temps d’échange et de pratique guidée pour découvrir, approfondir ou adapter la pleine conscience à votre quotidien.',
};
export const meditationCycle = {
  name: 'Cycle de 5 séances', duration: '5 séances', price: 275,
  description: 'Un parcours progressif pour installer la pratique et en expérimenter les bienfaits au quotidien.',
};
export const meditationWorkshop = {
  name: 'Atelier collectif', duration: '1 heure · par personne', price: 25,
  description: 'En petit groupe, une pratique guidée accessible aux débutants comme aux personnes expérimentées. Des ateliers thématiques peuvent aussi être proposés.',
};
export const offerPrices = {
  'pleine-conscience': {
    eyebrow: 'Pleine conscience', title: 'Séances et ateliers de méditation',
    introduction: 'Un accompagnement individuel ou collectif, accessible et adapté à votre expérience.',
    entries: [meditationSession, meditationCycle, meditationWorkshop],
  },
  'coaching-professionnel': {
    eyebrow: 'Coaching individuel', title: 'Tarifs du coaching individuel',
    introduction: 'Une séance ponctuelle ou un parcours pour avancer à votre rythme.',
    entries: [discovery, coachingSession, coachingCycle],
  },
  'sante-travail': {
    eyebrow: 'Santé & Travail', title: 'Tarifs des séances individuelles',
    introduction: 'Un premier échange offert puis des séances individuelles de coaching à 75 € TTC.',
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
    text: 'Le règlement s’effectue à la séance ou au début du parcours pour les forfaits de plusieurs séances.',
  },
  {
    title: 'Validité des parcours',
    text: 'Les parcours de 5 séances sont valables pendant 6 mois à compter de la date de la première séance.',
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
