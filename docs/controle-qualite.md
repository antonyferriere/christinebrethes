# Contrôles de livraison — 13 octobre 2026

**État de la livraison publique :** email, téléphone et URL Crenolibre sont absents de `site.mjs`. Le contact passe par LinkedIn. Le formulaire de préparation d’email est masqué jusqu’à configuration autorisée. Les mentions ci-dessous concernant l’email et Crenolibre décrivent le fonctionnement prévu après configuration.


## Résultats réellement obtenus

- `npm run build` : 11 pages et une page 404 générées, sans dépendance npm.
- `npm test` : 8 tests réussis (structure/métadonnées, liens/ressources, email encodé, réservation indisponible, LinkedIn vide et indépendant, garde de production, contrastes, absence de chargement tiers).
- Images : 22 fichiers vérifiés par décodage Pillow. Un export vide détecté pendant le contrôle a été régénéré, puis validé.
- HTML : tous les identifiants uniques, toutes les associations label/champ présentes, H1 unique, alt et dimensions des images.
- JavaScript : syntaxe contrôlée avec `node --check` ; fonctions de composition d’email testées avec caractères accentués, paramètres spéciaux et entrées invalides.
- Liens internes et ressources : aucune cible absente, aucun href `#` vide, variantes srcset existantes.
- Contrastes : paires de textes et actions testées à un ratio minimal de 4,5:1. Les ornements de marque n’ont pas vocation à porter de l’information.
- Dépendances : aucune. Pas de script de suivi, iframe ni police externe.
- Volume du build : environ 2,5 Mo sur disque (toutes pages et variantes incluses, pas le poids d’une seule navigation). JavaScript total inférieur à 12 Ko non compressés.
- Source : composants, données, pages, styles et comportements séparés ; informations de contact et offres centralisées ; README et guide de maintenance.

## Limites à ne pas confondre avec des validations

Le navigateur requis par le workflow de cet environnement n’était pas disponible. Aucun serveur d’aperçu improvisé n’a été lancé, aucune capture d’écran n’a été produite. Le rendu mobile/tablette/desktop, le comportement réel du menu et du formulaire, les erreurs console et les performances perceptives ne sont pas validés par ces tests statiques.

Les tests de contrastes, attributs et structure ne constituent pas un audit WCAG complet. Aucun score Lighthouse ni Core Web Vitals mesuré n’est annoncé.

Crenolibre a été lu, mais la réservation y est indisponible. Le formulaire prépare un email ; aucune réception n’a été testée. Les intégrations ne sont donc pas présentées comme un parcours transactionnel validé de bout en bout.

La matrice de vérification restante et les conditions de production sont dans `validation-production.md`.
