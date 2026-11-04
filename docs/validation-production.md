# Validations avant publication

**État des coordonnées :** contact@christinebrethes.fr et 07 81 65 96 98 sont configurés. Christine BRETHES est la responsable de publication ; OVH SAS, 2 rue Kellermann, 59100 Roubaix, France, est l’hébergeur confirmé. Aucun formulaire n’est actuellement affiché. Les informations administratives et les traitements incomplets restent à valider.


Le code est livré sur dev. Aucune fusion main, aucun déploiement public.

| Sujet | État | Action restante |
| --- | --- | --- |
| Site et quatre offres | Développés et buildés | Relecture de Christine, validation artistique |
| Domaine christinebrethes.fr | Choix validé le 8 octobre | Vérifier enregistrement, DNS, HTTPS et hébergement effectif |
| Crenolibre | Profil identifié, réservation indisponible | Réactiver côté Christine et tester jusqu’à la confirmation avec un scénario autorisé |
| Contact B2B | Liens directs email et téléphone ; aucun formulaire affiché | Tester l’ouverture de la messagerie et la réception |
| Email du domaine | Adresse confirmée et configurée | Vérifier l’activation et la réception réelle |
| Mentions légales | Publication, contacts et identité/adresse OVH renseignés | Confirmer statut, raison sociale éventuelle, adresse professionnelle, immatriculation, mentions fiscales applicables, coordonnées téléphoniques de l’hébergeur, médiation et conditions applicables |
| Confidentialité | Contact pour les droits, rappel RGPD et recours CNIL ajoutés | Confirmer responsable du traitement, données, finalités, bases légales, durées, destinataires, messagerie, transferts éventuels et journaux techniques OVH |
| Certifications | Intitulé coach certifiée repris des supports actuels | Confirmer les intitulés précis ; aucune QVT/MBSR/MBCT supplémentaire annoncée |
| Tarifs, adresses, horaires | Aucun détail incertain publié | Confirmer avant enrichissement des pages |
| LinkedIn | Composants prêts, données vides | Sélection vérifiée et autorisée de recommandations/publications |
| Photos et marque | Assets du projet utilisés | Validation des droits de diffusion et des cadrages par le propriétaire |
| Responsive, clavier, console | Code préparé, navigateur non disponible | Exécuter la matrice de contrôle ci-dessous |

## Matrice navigateur à exécuter

- 360×800, 390×844 : menu ouvert/fermé, Échap, CTA, absence de débordement, formulaire et recadrages.
- 768×1024 et 1024×768 : réorganisation des colonnes, typographie, menus et images.
- 1280×800 et 1440×900 : navigation complète, composition du hero, bas de page et détails des offres.
- Zoom 200 %, clavier seul, focus visibles, sans JavaScript, préférence reduced-motion.
- Parcours B2C : accueil → offre → rendez-vous → appel/email ; après réactivation, réservation réelle avec consentement approprié.
- Parcours B2B : accueil → organisations → contact prérempli → brouillon d’email → envoi volontaire et réception vérifiée.
- État vide des deux sections LinkedIn, puis contenu réel autorisé.
- Console, 404, réseaux, images, mesures Lighthouse/Core Web Vitals après service HTTP réel.

Une fois tous les points traités : passer `productionReady` à `true` dans `src/data/site.mjs`, exécuter `node scripts/build.mjs --production`, `npm test` (adapter le test de garde qui cible la préversion), vérifier sitemap/canonical/Open Graph et obtenir la validation avant publication.

Le booléen est un garde-fou de processus, pas un contrôle juridique automatique. Ne pas le modifier pour contourner les validations manquantes.

## Références pour les droits RGPD

- [CNIL — chapitre III du RGPD](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3) : droits applicables selon les traitements et retrait du consentement (article 13).
- [CNIL — réclamations](https://www.cnil.fr/fr/plaintes).

Ces ajouts ne valent pas validation complète des pages : aucune base légale, durée de conservation ou donnée administrative inconnue n’a été attribuée.
