// Tarifs finaux TTC confirmés dans les échanges avec Christine, novembre 2026.
// Les futurs programmes hybrides Santé & Travail ne sont pas définis ni tarifés.
export const discovery = {
  name: 'Premier échange découverte',
  duration: '30 minutes',
  price: null,
  description: 'Un temps offert, sans engagement, pour faire connaissance, comprendre vos attentes et vérifier si l’accompagnement vous convient.',
};

export const coachingSession = {
  name: 'Séance individuelle',
  duration: '1 heure',
  price: 75,
  description: 'Un espace pour prendre du recul, clarifier votre situation, identifier vos ressources et avancer vers des objectifs qui ont du sens.',
};

export const coachingPrograms = {
  eyebrow: 'Coaching & transitions de carrière',
  title: 'Trois programmes pour avancer à votre rythme',
  introduction: 'Du premier déclic à une transformation plus profonde, choisissez un parcours en accord avec vos besoins et votre situation.',
  entries: [
    {
      name: 'Coaching Déclic',
      duration: '3 séances · 2 mois',
      price: 210,
      description: 'Prendre du recul, débloquer une situation et retrouver la clarté nécessaire pour passer à l’action.',
    },
    {
      name: 'Coaching Élan',
      duration: '6 séances · 3 mois',
      price: 400,
      description: 'Révéler son potentiel, lever ses freins et avancer avec confiance vers ses objectifs.',
    },
    {
      name: 'Coaching Transformation',
      duration: '8 séances · 4 mois',
      price: 500,
      description: 'Réinventer son avenir professionnel sans renoncer à l’essentiel : questionner sa trajectoire, redéfinir ses priorités et construire un projet aligné avec ses valeurs et ses ambitions.',
    },
  ],
  note: 'Tarifs finaux TTC par programme. Le rythme et les modalités pratiques sont précisés avec Christine lors du premier échange découverte de 30 minutes, offert et sans engagement.',
};

export const meditationSession = {
  name: 'Séance individuelle',
  duration: '1 heure',
  price: 60,
  description: 'Un accompagnement ponctuel pour découvrir, approfondir ou adapter la méditation de pleine conscience à votre quotidien.',
};

// Les deux formats sont proposés en présentiel et en visioconférence.
export const meditationWorkshop = {
  name: 'Ateliers collectifs',
  duration: '1 h ou 1 h 30 · par personne',
  priceRange: { min: 25, max: 35 },
  formats: [
    { duration: '1 h', price: 25 },
    { duration: '1 h 30', price: 35 },
  ],
  featured: true,
  description: 'Des pratiques guidées en petit groupe, en présentiel ou en visioconférence, accessibles aux débutants comme aux pratiquants réguliers.',
};

export const offerPrices = {
  'pleine-conscience': {
    eyebrow: 'Pleine conscience',
    title: 'Séances et ateliers de méditation',
    introduction: 'Les ateliers collectifs pour découvrir et pratiquer, ainsi que des séances individuelles ponctuelles.',
    entries: [meditationWorkshop, meditationSession],
  },
  'coaching-professionnel': {
    eyebrow: 'Coaching & transitions',
    title: 'Coaching individuel',
    introduction: 'Un premier échange offert et sans engagement afin de déterminer le parcours qui vous correspond.',
    entries: [discovery, coachingSession, ...coachingPrograms.entries],
    note: 'Prix finaux TTC. Les séances individuelles sont également proposées dans le cadre de Santé & Travail. Le rythme et les modalités des programmes sont définis avec Christine lors du premier échange.',
  },
  'sante-travail': {
    eyebrow: 'Santé & Travail',
    title: 'Tarifs des séances individuelles',
    introduction: 'Un premier échange offert et sans engagement, puis des séances individuelles de coaching.',
    entries: [discovery, coachingSession],
  },
};

export const pricingTerms = [
  {
    title: 'Lieux et visioconférence',
    text: 'Les séances individuelles sont proposées en présentiel à Paris et à Champhol, près de Chartres, ainsi qu’à distance en visioconférence. Les ateliers collectifs de méditation sont accessibles en présentiel ou en visioconférence, en formats de 1 h et 1 h 30.',
  },
  {
    title: 'Règlement',
    text: 'Les séances individuelles sont réglées à la séance. Les modalités de règlement des programmes de coaching sont précisées lors du premier échange.',
  },
  {
    title: 'Programmes de coaching',
    text: 'Les parcours Déclic, Élan et Transformation sont destinés à l’accompagnement des transitions de carrière. Leur nombre de séances, leur durée et leur tarif sont indiqués ci-dessus ; le rythme concret est défini avec Christine.',
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
