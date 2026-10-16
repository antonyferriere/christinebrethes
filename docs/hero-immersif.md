# Hero immersif — 15 octobre 2026

Six scènes issues des dossiers Drive fournis, dans l’ordre :

| Asset | Dossier | Source |
| --- | --- | --- |
| christine-ecoute | Christine - IA | Image ChatGPT 15 oct. 2026, 14_24_14-7.png |
| espace-accueil | Illustrations | Image ChatGPT 15 oct. 2026, 15_01_03-1.png |
| chemin-elan | Illustrations | Image ChatGPT 15 oct. 2026, 15_01_23-4.png |
| christine-partage | Christine - IA | Image ChatGPT 15 oct. 2026, 14_24_13-4.png |
| pleine-conscience | Illustrations | Image ChatGPT 15 oct. 2026, 15_01_26-7.png |
| horizon | Illustrations | Image ChatGPT 15 oct. 2026, 15_01_24-5.png |

WebP qualité 82, trois largeurs : 480, 800 et 1440 px (1122 px pour les portraits, sans agrandissement des sources). Les suffixes 1440 des portraits désignent la variante haute résolution ; leurs descripteurs HTML utilisent la largeur réelle 1122. Total des 18 fichiers : environ 2 Mo. Image initiale : 30 à 125 Ko. Les autres scènes ne sont chargées qu’à leur première activation ; la transition attend leur décodage.

Les textes du hero sont conservés, y compris la signature et le lien vers les accompagnements. Fondu ivoire horizontal sur ordinateur/tablette, vertical sur mobile. Hauteur minimale : écran disponible sous l’en-tête mesuré. Sur les petits écrans ou en cas de texte agrandi, le contenu peut prolonger le hero : aucun texte ni bouton n’est tronqué pour imposer une hauteur fixe.

Transition d’opacité de 1,8 s, changement après 7,5 s. Pause et sélection manuelle accessibles au clavier. L’automatisme s’arrête hors écran, dans un onglet masqué et avec la préférence de réduction des animations. Première scène disponible sans JavaScript.

## Vérification

- `npm run check` : 15 tests réussis.
- Chromium automatisé : 360×800, 390×844, 768×1024, 1280×720, 1440×900 et 1920×1080 ; captures inspectées sur mobile, tablette et ordinateur.
- Aucun débordement horizontal ni erreur JavaScript sur ces six résolutions.
- Défilement automatique, pause pendant plus d’un cycle, sélection et décodage des six images vérifiés.
- Réduction des animations : première image maintenue ; sans JavaScript : première image affichée et commandes masquées.
- Une vérification sur appareils physiques reste distincte de ces tests Chromium.

## Évolution du 15 octobre au soir

Le chemin végétal est remplacé par le sentier côtier fourni. Le bouton lecture/pause est supprimé. La sélection d’un repère relance le délai automatique ; aucune pause persistante. Le défilement reste actif avec la préférence de réduction des animations, mais les transitions sont alors instantanées. Suspension conservée lorsque le hero est hors écran ou l’onglet masqué.
