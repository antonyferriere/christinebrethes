# Rapport des correctifs de la page d’accueil — 14 octobre 2026

Branche : `dev`. Source : « correction site internet Page Accueil.odt » de Christine.

## Bilan

11 correctifs traités, chacun dans un commit distinct. 2 demandes en attente de précisions ou de choix de photos. Le présent rapport fait l’objet d’un commit documentaire séparé.

## Correctifs traités

| N° | Correctif | État | Commit |
| --- | --- | --- | --- |
| 1 | remplacer la promesse principale | Traité | [`cf35949`](https://github.com/antonyferriere/christinebrethes/commit/cf35949) |
| 2 | retirer la feuille du portrait principal | Traité | [`a7e3bb5`](https://github.com/antonyferriere/christinebrethes/commit/a7e3bb5) |
| 3 | actualiser la légende du portrait principal | Traité | [`ed34e5a`](https://github.com/antonyferriere/christinebrethes/commit/ed34e5a) |
| 4 | reprendre la présentation professionnelle de Christine | Traité | [`02e499e`](https://github.com/antonyferriere/christinebrethes/commit/02e499e) |
| 5 | simplifier le titre des accompagnements | Traité | [`9bf693c`](https://github.com/antonyferriere/christinebrethes/commit/9bf693c) |
| 6 | présenter l’approche et la philosophie intégratives | Traité | [`5720705`](https://github.com/antonyferriere/christinebrethes/commit/5720705) |
| 7 | compléter le titre Faisons connaissance | Traité | [`ead097c`](https://github.com/antonyferriere/christinebrethes/commit/ead097c) |
| 8 | actualiser le texte Faisons connaissance | Traité | [`89610ae`](https://github.com/antonyferriere/christinebrethes/commit/89610ae) |
| 9 | remplacer la signature du second portrait | Traité | [`2f0df21`](https://github.com/antonyferriere/christinebrethes/commit/2f0df21) |
| 10 | afficher la conviction de Christine sur le paysage | Traité | [`42c3148`](https://github.com/antonyferriere/christinebrethes/commit/42c3148) |
| 11 | réduire légèrement le titre Un cadre pour vous | Traité | [`ce8587c`](https://github.com/antonyferriere/christinebrethes/commit/ce8587c) |

Les textes demandés ont été repris, avec restitution des espaces absents entre certains mots du document et harmonisation des apostrophes typographiques. La suppression du paragraphe « Vous êtes bien plus qu’un parcours professionnel » apparaît deux fois dans le document ; elle est traitée une seule fois dans le correctif de l’approche.

Détails de présentation :

- Promesse : « Cultiver l’équilibre. Retrouver sa place. Reprendre son élan. »
- La feuille du portrait principal et ses règles CSS devenues inutiles ont été retirées.
- L’intitulé, le titre et l’introduction des accompagnements sont remplacés par « Un accompagnement sur mesure et une vision à 360°. »
- La nouvelle conviction est présentée dans une citation HTML, avec une taille de texte adaptative adaptée à sa longueur ; le paysage est conservé.
- « Proche de vous. À votre rythme. » est réduit d’environ 10 % sur l’accueil : de 2–3 rem à 1,8–2,7 rem, avec adaptation à la largeur d’écran.

## Demandes non traitées

| Demande | Motif | Pour la finaliser |
| --- | --- | --- |
| Changer les photos des offres 01, 02, 03 et 04 | Aucune nouvelle photographie ni indication de remplacement par offre dans le document ODT, qui ne contient aucune image intégrée. Les éléments de marque joints ne définissent pas ces remplacements. Les quatre photos actuelles sont conservées. | Fournir ou choisir une photo pour chaque offre : coaching professionnel, santé-travail, méditation de pleine conscience, entreprises et organisations. |
| Discuter du maintien ou du remplacement du portrait de « Faisons connaissance » | Le document demande une discussion et ne désigne pas de nouveau portrait. Le portrait actuel est conservé ; sa légende est corrigée. | Confirmer le maintien du portrait ou fournir le portrait retenu. |

## Vérifications

- `npm run check` : génération des 12 pages réussie, 14 tests sur 14 réussis.
- Les tests existants contrôlent notamment les liens internes, les images et variantes responsive, les métadonnées, certains contrastes et les protections de la préversion.
- `git diff --check` : aucune erreur d’espacement.
- Contrôle visuel mobile/ordinateur non réalisé : Chromium est absent et sa tentative d’installation a échoué (archive téléchargée invalide). Le rendu des nouveaux paragraphes et de la citation reste à vérifier dans un navigateur.

Périmètre : accueil et styles associés, sans modification de `main` ni déclenchement manuel d’un déploiement.

## Livraison GitHub

Autorisation explicite de publication confirmée par Antony le 14 octobre 2026. Les 11 commits de correctifs et le commit documentaire sont destinés à `dev` du dépôt `antonyferriere/christinebrethes`.

La branche distante avait reçu le commit `3e9d82f` entre-temps ; les correctifs ont été replacés au-dessus de cette version sans conflit et les 14 tests ont été rejoués avec succès. Les changements distants sont conservés. Le workflow de déploiement cible `preprod` et n’est pas déclenché par ce push sur `dev`.
