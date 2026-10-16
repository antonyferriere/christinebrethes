# Déploiement et diagnostic de la préproduction

La branche `preprod` est déployée vers https://christinebrethes.antonyferriere.fr/.
Le lancement manuel doit également cibler `preprod`. Les autres branches ne sont pas déployées.

Le workflow utilise Ubuntu 24.04, Node.js 24 et des actions compatibles Node 24,
figées par SHA. Il construit et teste le site avant transfert. Un déploiement en
cours n'est pas interrompu par un nouveau push afin d'éviter un transfert partiel.
Le transfert FTPS reste une synchronisation de fichiers, pas une publication atomique.

## Configuration de l'environnement GitHub PREPROD

- Serveur FTPS : `trigone.o2switch.net`, configuré dans le workflow. Ce nom figure
  dans les noms autorisés du certificat présenté dans le journal du 14 octobre 2026.
  Le secret historique `FTP_HOST` n’est plus utilisé pour cette préproduction.
- `FTP_USERNAME`, `FTP_PASSWORD` : compte limité au site.
- `FTP_PORT` : port FTPS explicite, 21 par défaut.
- `FTP_DIR` : `/` pour ce compte FTP, dont la racine correspond au site. Saisir
  uniquement le slash `/`, sans guillemets, ni antislash `\`. Pour un sous-dossier,
  utiliser un chemin non vide terminé par `/`, par exemple `/www/`.

Dans GitHub : **Settings → Environments → PREPROD → Environment secrets**, modifier
`FTP_DIR`. Si le secret est défini au niveau du dépôt et non de l’environnement,
le modifier dans **Settings → Secrets and variables → Actions**. Un secret de même
nom dans `PREPROD` prend la priorité.

Après intégration du correctif de `dev` dans `preprod`, lancer le workflow sur
`preprod` (ou laisser le push le déclencher). Relancer uniquement l’ancien job
conserverait l’ancienne version du workflow qui refusait `/`.

Le serveur doit accepter FTPS explicite et présenter un certificat valide. Le
workflow utilise `security: strict` ; corriger le nom du serveur ou son certificat
si la connexion échoue. Ne pas repasser en FTP non chiffré ou désactiver TLS.
L'inventaire `.ftp-deploy-sync-state.json` est conservé pour la synchronisation
mais son accès HTTP est interdit par `.htaccess`.

## Vérification après transfert

Le workflow exécute :

```sh
node scripts/verify-deployment.mjs https://christinebrethes.antonyferriere.fr/
```

Ce contrôle utilise le `dist/` du build courant. Il vérifie la redirection HTTP,
TLS, les types MIME, la CSP, la revalidation du cache, les réponses 404 et la
protection de l'inventaire FTP. Il compare aussi les octets de toutes les pages,
feuilles CSS, modules JS et polices avec le build. Un ancien fichier, un mauvais
dossier cible ou une injection dans le HTML fait échouer le job, même si le
transfert FTP a réussi. Il ne remplace pas un test des interactions en navigateur.

## Console du navigateur

Le site utilise des polices locales ; il ne charge ni Google Fonts ni script
`inspector`. Ne pas élargir la CSP pour ces ressources. Si elles apparaissent,
retester dans un profil vierge sans extensions ni outils de prévisualisation.
Dans Network, examiner l'initiateur et l'URL de la ressource en erreur.

Le code navigateur importe `contact.js`, pas `contact.mjs`. Si l'ancien nom
apparaît encore, vider le cache du site puis recharger. Les fichiers HTML/CSS/JS
non versionnés sont désormais servis avec `Cache-Control: no-cache,
must-revalidate`. Une réponse précédemment mise en cache peut nécessiter ce
premier rechargement forcé ; purger aussi le cache de l'hébergeur s'il en utilise un.

L'avertissement « active content with certificate errors » ne signifie pas que
le certificat de la page est invalide : identifier la ressource concernée dans
Security/Network et corriger son origine. Ne pas accepter d'exception de certificat.

Références : [checkout](https://github.com/actions/checkout),
[setup-node](https://github.com/actions/setup-node),
[FTP Deploy](https://github.com/SamKirkland/FTP-Deploy-Action).

## Erreur FTPS ERR_TLS_CERT_ALTNAME_INVALID

Cette erreur se produit avant le transfert lorsque le nom de connexion ne figure
pas dans le certificat TLS du serveur. Le journal du 14 octobre 2026 présente un
certificat couvrant notamment `trigone.o2switch.net` ; le workflow utilise désormais
ce nom directement au lieu de l’alias contenu dans `FTP_HOST`.

Le protocole reste `ftps` avec `security: strict`. Les identifiants, le port et
`FTP_DIR` restent issus des secrets de l’environnement PREPROD. Aucun transfert
FTP n’a été exécuté pendant cette correction ; le prochain déploiement vérifiera
la connexion et l’authentification réelles. En cas de migration d’hébergement,
actualiser le nom du serveur avec celui indiqué par o2switch.

Référence : [configuration FTP o2switch](https://faq.o2switch.fr/guides/configuration-logiciel/filezilla/).
