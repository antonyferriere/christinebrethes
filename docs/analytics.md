# GLOBAL-03 — Mise en service Analytics

Site statique multipage, sans routeur SPA. Un page_view explicite par document, send_page_view désactivé dans config. Un futur routeur peut émettre cb:navigation après changement du pathname. Les événements contact_click, phone_click, email_click et booking_click ne contiennent ni libellé, ni destination, ni coordonnées. Les chemins sont limités à une liste publique ; query string, fragment et referrer sont exclus. Aucun envoi de formulaire serveur n'existe actuellement : ne pas déclarer un mailto comme soumission réussie. Le hook cb:contact-success est réservé à une future confirmation serveur.

## Activation

1. Fusionner GLOBAL-04 (interface) et GLOBAL-03 (service), résoudre les imports communs une seule fois. Sans interface, aucun consentement neuf n'est obtenu et GA reste inactif.
2. Créer/configurer la propriété GA4. Désactiver **toutes les mesures améliorées** du flux (pages automatiques/history, liens sortants, formulaires, recherche, défilement, etc.) : seuls les événements explicites du service sont prévus. Ne pas activer Google Signals, User-ID, publicité ou collecte de données fournies par l'utilisateur. Vérifier les durées de conservation dans la propriété et faire valider l'information confidentialité.
3. Fournir GA_MEASUREMENT_ID=G-… au processus Node lors de `npm run build`. `.env.example` documente les variables mais le build ne charge pas automatiquement `.env`. Exemple local : `GA_MEASUREMENT_ID=G-VOTREID npm run build` (remplacer par le vrai identifiant, ne pas conserver cet exemple). Dans GitHub Actions, renseigner la variable GA_MEASUREMENT_ID de l’environnement PROD (et les variables de test dans PREPROD). Les workflows la transmettent déjà au build.
4. Déployer uniquement après autorisation. Le build autorise conditionnellement les domaines nécessaires dans la CSP Apache. Sans identifiant valide (G- suivi de 10 caractères alphanumériques majuscules), aucun chargement ni élargissement de CSP.

## Préproduction et recette

Utiliser ANALYTICS_ENV=development, GA_DEV_MEASUREMENT_ID avec une propriété de test réelle et GA_DEBUG=true. Production ignore ces options. CONSENT_PREVIEW=true teste l'interface sans identifiant et sans requête Google.

Dans le réseau du navigateur, filtrer googletagmanager / google-analytics : aucune requête avant choix ni après refus. Accepter : un seul script et un page_view ; contrôler DebugView puis les quatre clics. Inspecter les payloads : pas de query, fragment, email, téléphone, texte libre ou URL de destination. Retirer depuis Gestion des cookies : ga-disable immédiat, suppression des cookies _ga/_gid/_gat accessibles sur chemins et domaines, rechargement local sans Google. Recharger et tester un autre onglet. Expirer le choix en préproduction et vérifier le retour au refus. Publicité toujours denied dans les quatre états Consent Mode v2.

Le navigateur local étant bloqué dans l'environnement d'exécution, ces contrôles réseau réels et DebugView restent à effectuer avec l'identifiant réel. Les tests Node couvrent les commandes, l'absence d'injection avant consentement, l'unicité et la révocation simulées. Aucun identifiant fictif n'est livré actif.

Sources vérifiées : https://developers.google.com/tag-platform/security/guides/consent ; https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi .
