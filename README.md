# Christine BRETHES — Ancrage & reprise d’élan

Site vitrine statique de Christine BRETHES, coach certifiée santé-travail et instructrice en méditation de pleine conscience. Version de présentation sur **dev** ; la branche **preprod** dispose d’un déploiement automatique FTPS, sans modification de main.

## Démarrer

Prérequis : Node.js 22 ou ultérieur. Aucune dépendance à installer.

```sh
git clone --branch dev https://github.com/antonyferriere/christinebrethes.git
cd christinebrethes
npm run build
npm test
npm run preview
```

Ouvrir **http://localhost:4173**. `Ctrl+C` arrête l’aperçu. Après modification, relancer `npm run build`, puis actualiser la page. Ne pas ouvrir directement le fichier HTML avec `file://` : les liens partent de la racine du serveur.

`npm run check` reconstruit le site et exécute les tests. Le dossier `dist/` est généré, non versionné.

## Ce qui est livré

- Accueil : portrait authentique, ornements de marque, présentation des quatre offres, approche, parcours, cabinet et appels à l’action.
- Index des accompagnements et quatre pages détaillées : coaching professionnel, santé-travail, méditation de pleine conscience, entreprises & organisations.
- À propos, contact, rendez-vous, mentions légales, confidentialité et page 404.
- Navigation mobile avec fermeture par Échap, navigation clavier et lien d’évitement.
- Photographies et ornements WebP, trois tailles photographiques (480/800/1200), polices locales Lora/Source Sans 3.
- Révélations au défilement et mouvement botanique discret, avec respect des préférences de réduction des animations.
- Composants et données LinkedIn indépendants, masqués lorsqu’ils sont vides. Aucun témoignage inventé.
- Métadonnées, sitemap, robots et données structurées. Préversion en `noindex`.

## État des conversions

La version publique livrée utilise **LinkedIn comme contact provisoire**. Email, téléphone et URL de réservation ne figurent pas dans la configuration publique, leur transfert ayant été bloqué par le contrôle automatique. Aucune donnée privée des documents de travail n’est incluse dans la documentation.

Le composant de préparation d’email est conservé, mais masqué tant que `site.email` est vide. Il prépare un brouillon dans la messagerie du visiteur ; il n’envoie rien au serveur. Renseigner les coordonnées autorisées dans `src/data/site.mjs` pour l’activer, puis vérifier le parcours.

La réservation en ligne n’est pas activée. La page rendez-vous oriente vers LinkedIn sans annoncer de créneau disponible.

## Organisation

```text
src/
  components/    Gabarit commun, cartes, sections et petits composants HTML
  data/          Offres, coordonnées, configuration et contenu LinkedIn
  pages/         Contenu et composition des pages
  scripts/       Menu, animations et préparation d’email
  styles/        Tokens, bases, composants, pages et adaptation responsive
public/
  assets/        Photos et éléments de marque optimisés
  fonts/         Polices locales et licences
scripts/
  build.mjs      Génération du HTML, CSS, sitemap et configuration Apache
  preview.mjs    Serveur local réservé au développement
tests/          Contrôles ciblés Node.js
docs/           Sources, maintenance et validations
```

## Choix techniques

HTML sémantique, CSS natif et JavaScript natif. Un petit script Node assemble des gabarits et des données au build : cela évite de dupliquer navigation, pied de page et pages d’offres sans imposer de framework. Le HTML généré contient tous les contenus ; la lecture et les liens ne nécessitent pas JavaScript.

**Dépendances npm : aucune**, en production comme au build et aux tests. Node n’est pas nécessaire sur l’hébergement. Pas de React, Astro, framework CSS, bibliothèque Material UI ou SDK tiers. Les interactions demandées sont couvertes par les API natives.

Les principes Material Design 3 sont adaptés à l’identité : hiérarchie d’actions, tokens, surfaces, états, zones tactiles, layouts compact/medium/expanded/large (600/840/1200 px). Cela ne constitue pas une certification d’accessibilité.

Le dossier `dist/` est prévu pour un hébergement statique à la racine, compatible avec les langages pris en charge par OVH Starter. `.htaccess` prévoit la page 404, la désactivation du listing et des en-têtes de sécurité. Leur application exacte doit être vérifiée sur l’hébergement retenu.

## Vérification et limites

Build réussi, 8 tests automatisés réussis, validation des images et contrôle des labels/IDs HTML. Voir [le rapport qualité](docs/controle-qualite.md).

Le rendu visuel dans un navigateur, les interactions réelles sur appareils, les Core Web Vitals et la console restent à vérifier : le navigateur requis par l’environnement n’était pas disponible. Aucune capture ni score Lighthouse n’est revendiqué.

## Avant toute mise en ligne

Voir [les validations de production](docs/validation-production.md). Le site ne doit pas être publié en l’état : mentions légales incomplètes, réservation indisponible et contrôle navigateur restant. `node scripts/build.mjs --production` refuse de générer une version de production tant que `site.productionReady` reste `false`. Le déploiement de préproduction est décrit dans [le guide de déploiement](docs/deploiement-preprod.md). Il conserve le blocage de publication en production et le mode non indexable.

- [Guide de modification](docs/maintenance.md)
- [Audit éditorial](docs/audit-editorial.md)
- [Sources et choix graphiques](docs/sources-et-design.md)
