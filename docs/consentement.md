# GLOBAL-04 — Consentement

Une seule finalité facultative : mesure d'audience, donc pas de bouton Personnaliser artificiel. Acceptation et refus de même importance visuelle et même nombre de clics. Aucune case précochée. Choix local cb-consent-v1 pendant six mois calendaires ; données corrompues, futures ou expirées ignorées. Les quatre états Consent Mode v2 sont définis dans le contrat commun, publicité toujours refusée. Le gestionnaire n'importe jamais Analytics : événement cb:consent, lecture partagée et stockage synchronisent les deux modules sans circularité.

Sans identifiant GA valide, aucun affichage automatique. Le bouton footer reste disponible et explique qu'aucun outil facultatif n'est actif. CONSENT_PREVIEW=true permet de tester le dialogue sans GA en préproduction (ignoré avec NODE_ENV=production, --production ou productionReady). En exploitation, configurer GA_MEASUREMENT_ID dans les variables GitHub de l'environnement de déploiement ; transmission au build déjà préparée. Identifiants de test : ANALYTICS_ENV=development et GA_DEV_MEASUREMENT_ID. Le fichier .env.example n'est pas chargé automatiquement.

## Recette avant activation

- Sans configuration : pas de dialogue automatique ni requête Google ; Gestion des cookies reste accessible.
- Preview : tester Tab, Shift+Tab, Entrée, Escape et retour du focus ; contrôles natifs du dialog, fond inerte. Vérifier mobile/tablette/ordinateur.
- Refus : aucune requête Analytics, choix conservé après navigation et six mois.
- Accord : avec GLOBAL-03 et propriété de test, script uniquement après clic et un page_view.
- Retrait depuis le footer : choix refusé, purge cookies GA accessibles, arrêt immédiat et rechargement sans script par GLOBAL-03. Vérifier aussi un autre onglet et un choix expiré.
- Sans stockage disponible, le choix s'applique à la page courante ; il sera demandé à nouveau sur une autre page.

Les scénarios de stockage/configuration et le markup sont testés automatiquement. La navigation clavier réelle, le rendu responsive, la purge dans un navigateur réel et le réseau Google restent à vérifier : Chromium ne démarre pas dans l'environnement d'exécution. Aucun test visuel n'est déclaré réussi.

## Validation Christine

Valider identité et coordonnées du responsable, durées de conservation des demandes/messages et journaux d'hébergement, configuration effective de la propriété GA, destinataires, transferts et garanties. La page Confidentialité adapte l'information à la présence effective d'un identifiant et signale les points encore à valider. Ne pas considérer cette préparation comme une certification juridique de conformité.

## Fusion

GLOBAL-04 et GLOBAL-03 partent toutes deux de dev et embarquent le même contrat consent-state.js, privacy-config.mjs, .env.example et test privacy-state. Conserver une seule version commune, les deux imports main.js et la modification CSP propre à GLOBAL-03. Fusion recommandée : GLOBAL-04 puis GLOBAL-03. Ne renseigner l'identifiant public qu'après recette conjointe et validation.

Sources : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi ; https://www.cnil.fr/fr/cnil-direct/question/cookies-si-jai-refuse-ses-cookies-un-site-web-peut-il-me-redemander-de-les ; https://developers.google.com/tag-platform/security/guides/consent .
