# Navigation — Ancrage & reprise d’élan

## Audit et choix

Le header était commun aux pages mais défini dans layout.mjs ; le comportement mobile et le scroll se trouvaient dans main.js, le sous-menu dans navigation.js. Les règles de navigation se superposaient dans components.css, responsive.css et navigation.css. Le CTA devenait une icône seule sur téléphone. Le mode sans JavaScript pouvait superposer le menu au contenu.

Le header utilise désormais une surface papier opaque pour garantir le contraste sur toutes les photographies, un accent terracotta pour le lien courant et le CTA, le vert forêt/sauge pour les interactions, et Source Sans 3. Le logo et le monogramme officiels sont conservés. La hauteur ne se réduit pas au scroll ; seule une ombre légère apparaît.

À moins de 1200 px, panneau déroulant non modal sous la barre : liens de 48 px, sous-menu de prestations, défilement interne si nécessaire et CTA textuel toujours visible. Ce seuil conserve l'espace nécessaire aux cinq destinations, au bouton de sous-menu, au logo et au CTA. Il reste à confirmer visuellement à toutes les largeurs demandées. Le document n'est jamais verrouillé. Tab reste natif, Échap ferme, le focus revient au déclencheur lorsqu'il risquerait de devenir masqué. Quitter le header au clavier ferme le panneau. Une faible hauteur de viewport rend le header sticky pour limiter l'occultation au zoom.

Sans JavaScript (ou si le module échoue à charger), les liens sont visibles dans le flux et les boutons de disclosure masqués. L'amélioration n'est activée qu'après initialisation du contrôleur.

## Architecture

- src/data/site.mjs : destinations principales et configuration rendez-vous existantes.
- src/data/navigation.mjs : arbre unique incluant les trois prestations.
- src/components/site-header.mjs : identité, commande mobile et CTA.
- src/components/site-navigation.mjs : rendu des liens et états actifs desktop/mobile.
- src/components/layout.mjs : appelle siteHeader pour toutes les pages, y compris la 404.
- src/scripts/navigation.js : interactions, inert, focus, scroll, ResizeObserver et disposer.
- src/scripts/navigation-init.js : état initial de la surface au scroll.
- src/styles/navigation.css : propriétaire des styles de navigation.
- tests/site-header.test.mjs : rendu, destinations et comportements du contrôleur.
- tests/navigation.test.mjs : tests existants du sous-menu conservés.

Pas de nouvelle dépendance. Les pages, textes éditoriaux et illustrations ne sont pas modifiés. Les règles existantes de composition des hero sont conservées. L'animation de transition interpage est retirée du header pour privilégier une navigation stable.

## Vérification

La CI de PR exécute node --check, npm run build et node --test tests/*.test.mjs. Premier passage CI réussi : syntaxe, génération et suite de tests ; le résultat du dernier commit est indiqué dans la PR. Les tests de contrôleur utilisent une simulation DOM : ils ne remplacent pas une recette navigateur.

L'aperçu local existant a été consulté avant modification. Aucun serveur de la branche modifiée ne peut être lancé dans la session sans terminal ; pas de capture après ni de validation visuelle revendiquée. Les PDF de synthèse et questionnaire joints ne sont pas lisibles ici sans accès aux fichiers ; les choix s'appuient sur le brief fourni, docs/sources-et-design.md, les tokens et les assets existants.

À vérifier sur le build de cette branche :
- 320, 375, 390, 430, 768, 1024, 1280, 1440 et 1920 px, et la frontière 1199/1200.
- Toutes les pages principales, lien actif et sous-menu au clavier/souris/tactile.
- Zoom 200 % et 400 %, portrait/paysage, menu long et focus toujours visible.
- Scroll, ancres et lien d'évitement, retour arrière, réduction des animations.
- Lecteurs d'écran NVDA/VoiceOver, contraste effectif et absence de débordement.
- Coexistence avec l'interface de consentement et les autres éléments superposés.

Le CTA conserve l'URL Crenolibre configurée ; site.booking.available reste false. La disponibilité réelle des créneaux reste à confirmer, sans changement de configuration ni réservation effectuée.
