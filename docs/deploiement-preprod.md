# Déploiement et diagnostic de la préproduction

La branche `preprod` est déployée vers https://christinebrethes.antonyferriere.fr/.
Le lancement manuel doit également cibler `preprod`. Les autres branches ne sont pas déployées.

Le workflow utilise Ubuntu 24.04, Node.js 24 et des actions compatibles Node 24,
figées par SHA. Il construit et teste le site avant transfert. Un déploiement en
cours n'est pas interrompu par un nouveau push afin d'éviter un transfert partiel.
Le transfert FTPS reste une synchronisation de fichiers, pas une publication atomique.

## Configuration de l'environnement GitHub PREPROD

- `FTP_HOST` : nom du serveur FTPS couvert par son certificat TLS.
- `FTP_USERNAME`, `FTP_PASSWORD` : compte limité au site.
- `FTP_PORT` : port FTPS explicite, 21 par défaut.
- `FTP_DIR` : dossier dédié à ce site, terminé par `/`, non vide et différent de `/`.

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
