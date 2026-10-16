# Console Chrome — 14 octobre 2026

## Correctifs

- **Erreur MIME de contact.mjs** : la réponse HTTPS actuelle de `scripts/main.js` importe `contact.js`, et les deux scripts répondent en `text/javascript`. La capture utilise encore un ancien import. Les URL du script principal, de son import contact et de la feuille de style portent désormais une version calculée sur leur contenu pour contourner les caches anciens. Les règles MIME et de revalidation sont conservées.
- **Image différée / dimensions** : les attributs de la feuille de la section Approche correspondent désormais au fichier (96 × 108 px). Le CSS réserve explicitement son ratio 8/9 avant chargement, pour un affichage de 80 × 90 px.

## Messages non reproduits dans les réponses actuelles du site

- **Permissions-Policy** : les quatre directives publicitaires de la capture (`attribution-reporting`, `private-aggregation`, `join-ad-interest-group`, `run-ad-auction`) sont absentes du dépôt. Aucun en-tête Permissions-Policy n’était présent sur la réponse HTTPS de l’accueil lors du contrôle. Une extension, un proxy ou une ancienne réponse peut en être à l’origine ; la capture seule ne permet pas de l’attribuer précisément.
- **Violation unload dans inspector…js** : ce script et cet écouteur ne figurent pas dans le code livré. Vérifier la provenance du script dans Network / Initiator avec les extensions désactivées. Ne pas autoriser unload simplement pour masquer ce message.
- **Suggestion Ctrl+I / IA** : message d’interface de Chrome DevTools, pas du site. Le lien « Don’t show again » permet de le masquer.
- **Non sécurisé** : la requête HTTPS effectuée pendant ce contrôle a réussi sans désactiver la validation TLS. Cela ne constitue pas un audit du certificat dans le navigateur de l’utilisateur ; consulter Security si l’indicateur persiste dans un profil vierge.

## Vérification et suite

Build et 15 tests automatisés validés, dont un contrôle de la version commune des assets sur toutes les pages et l’import de contact. Le fichier WebP a été inspecté pour vérifier ses dimensions. Pas de contrôle interactif Chrome réalisé dans cet environnement.

Après intégration de `dev` dans `preprod` et déploiement, ouvrir le site dans un profil Chrome invité sans extensions, puis actualiser. Si les messages externes persistent, relever l’URL complète du script `inspector` et les en-têtes de la requête document dans Network pour identifier leur source.
