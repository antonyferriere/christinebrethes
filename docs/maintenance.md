# Modifier le site

**État de la livraison publique :** email, téléphone et URL Crenolibre sont absents de `site.mjs`. Le contact passe par LinkedIn. Le formulaire de préparation d’email est masqué jusqu’à configuration autorisée. Les mentions ci-dessous concernant l’email et Crenolibre décrivent le fonctionnement prévu après configuration.


Après chaque modification : `npm run check`, puis `npm run preview` et vérification visuelle. Travail sur `dev` ; ne pas fusionner dans `main` ni déployer sans validation.

## 1. Textes

Les textes d’accueil sont dans `src/pages/home.mjs`, ceux de présentation dans `about.mjs`, ceux de contact dans `contact.mjs`. Les sections communes sont dans `src/components/sections.mjs`. Le cadre légal est dans `src/pages/legal.mjs`.

Ces fichiers retournent du HTML ; garder les balises et modifier les paragraphes. Utiliser des apostrophes typographiques dans les chaînes délimitées par apostrophes JavaScript, ou échapper les apostrophes droites. Ne pas recopier de texte médical privé ou provisoire depuis les sources.

## 2. Offres

Modifier `src/data/offers.mjs`. Chaque offre possède `slug`, `title`, `eyebrow`, `summary`, `intro`, `situations`, `goals`, `steps`, `modalities`, `faq`. Le slug détermine l’URL, donc éviter de le changer après publication sans redirection.

Le gabarit `src/pages/offer.mjs` génère chaque page. Le quatrième accompagnement est à `/entreprises-organisations/`. Pour ajouter une cinquième offre, choisir également sa photographie dans `offerCards()` et adapter la grille si nécessaire.

## 3. Photographies

Remplacer les trois versions d’un même nom dans `public/assets/` : `-480.webp`, `-800.webp`, `-1200.webp`. Les portraits sont au ratio 4:5 (480×600, 800×1000, 1200×1500), les autres au ratio 4:3. Préserver les traits, vérifier les cadrages avant export et supprimer les métadonnées privées.

Le composant `photo()` fournit `srcset`, dimensions, texte alternatif et chargement différé. L’image du hero utilise une priorité haute. Mettre à jour le texte alternatif si le contenu change. Les décorations ont un texte alternatif vide.

## 4. Couleurs et typographies

`src/styles/tokens.css` centralise les couleurs, espacements, rayons, ombres et durées. Les états des composants sont dans `components.css` et les changements de layout dans `responsive.css`.

La terracotta de marque est conservée comme référence ; la teinte d’action est plus foncée pour conserver un contraste suffisant. Ne pas utiliser l’olive clair pour de petits textes sur ivoire. Les polices et licences sont dans `public/fonts/`, leurs déclarations dans `base.css`.

## 5. LinkedIn

Éditer `src/data/linkedin.mjs`. Les sections sont activables indépendamment via `linkedinSettings`. Aucun appel réseau LinkedIn au chargement.

Recommandation :

```js
{
  author: 'Nom validé', role: 'Fonction vérifiée', text: 'Citation autorisée',
  source: 'URL exacte de la source', visible: true, authorized: true
}
```

Une recommandation apparaît seulement si `visible` et `authorized` sont vrais et la section activée. Vérifier l’authenticité et l’accord avant ajout.

Publication :

```js
{
  title: 'Titre éditorial fidèle', excerpt: 'Résumé validé',
  date: '2026-10-13', topic: 'Thématique',
  url: 'URL exacte du post', image: '', visible: true
}
```

Un visuel peut être ajouté sous `/assets/` avec autorisation. La sélection manuelle ne nécessite ni API ni cookies. Si une intégration officielle est souhaitée ultérieurement, utiliser le code fourni par LinkedIn pour un post public, après action du visiteur ; adapter alors la politique de confidentialité et la CSP. L’API automatique n’a pas été retenue : autorisations et maintenance sans utilité pour cette version.

## 6. Coordonnées et réservation

`src/data/site.mjs` centralise le nom, téléphone, email, domaine et profil Crenolibre. Les boutons actuels ouvrent `/rendez-vous/` qui explique la situation et propose un contact direct.

Après réactivation et test du profil Crenolibre : passer `booking.available` à `true`, actualiser `checkedOn`, reconstruire puis vérifier le parcours complet. Ne pas inventer de créneaux ni de tarifs.

Quand Google Workspace est effectivement opérationnel, remplacer l’adresse Gmail après un test réel de réception. Le formulaire reste un préparateur d’email ; une transmission serveur serait une évolution distincte à concevoir et tester.

## Prévisualisation et hébergement

`npm run build` produit `dist/`. `npm run preview` sert uniquement ce dossier sur `localhost:4173`. Le serveur est local, sans authentification ni fonction d’envoi.

Sur OVH, après validation, copier le contenu de `dist/` dans la racine web configurée. Vérifier HTTPS, erreurs 404, en-têtes Apache, polices, liens et indexation. Ne pas copier `src/`, les sources privées ou des secrets sur l’hébergement.
