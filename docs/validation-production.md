# Validations avant publication

**État de la livraison publique :** email, téléphone et URL Crenolibre sont absents de `site.mjs`. Le contact passe par LinkedIn. Le formulaire de préparation d’email est masqué jusqu’à configuration autorisée. Les mentions ci-dessous concernant l’email et Crenolibre décrivent le fonctionnement prévu après configuration.


Le code est livré sur dev. Aucune fusion main, aucun déploiement public.

| Sujet | État | Action restante |
| --- | --- | --- |
| Site et quatre offres | Développés et buildés | Relecture de Christine, validation artistique |
| Domaine christinebrethes.fr | Choix validé le 8 octobre | Vérifier enregistrement, DNS, HTTPS et hébergement effectif |
| Crenolibre | Profil identifié, réservation indisponible | Réactiver côté Christine et tester jusqu’à la confirmation avec un scénario autorisé |
| Contact B2B | Préparation d’email fonctionnelle dans le code | Tester avec une vraie messagerie ; décider si un envoi serveur est souhaité |
| Email du domaine | Choix validé, activation non constatée | Configurer et tester la réception avant remplacement du Gmail |
| Mentions légales | Page de travail structurée | Renseigner statut, adresse, immatriculation, directeur de publication, hébergeur, médiation et conditions applicables |
| Confidentialité | Description exacte de la version statique | Formaliser traitement des emails, prestataires, durée et droits avec Christine |
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
