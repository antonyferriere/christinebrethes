import { site } from '../data/site.mjs';

export function legalPage() {
  return `<section class="container page-hero compact"><p class="eyebrow">Informations du site</p><h1>Mentions légales</h1></section>
<div class="container reading-section legal">
  <p class="notice">Version de présentation : les informations administratives encore manquantes doivent être complétées et validées avant toute publication.</p>
  <h2>Édition du site</h2>
  <p>Christine BRETHES — Coaching santé-travail et méditation de pleine conscience.</p>
  <p>Responsable de publication : Christine BRETHES.</p>
  <p>Email : <a href="mailto:${site.email}">${site.email}</a><br>Téléphone : <a href="tel:${site.phoneLink}">${site.phone}</a>.</p>
  <p>Statut de l’activité, raison sociale éventuelle, adresse professionnelle, numéro d’immatriculation et mentions applicables : à confirmer avec l’éditrice.</p>
  <h2>Hébergement</h2>
  <p>OVH SAS<br>2 rue Kellermann<br>59100 Roubaix<br>France</p>
  <h2>Propriété intellectuelle</h2>
  <p>Les textes, photographies et éléments graphiques sont utilisés pour la présentation de l’activité de Christine BRETHES. Toute réutilisation doit faire l’objet d’une autorisation des titulaires des droits concernés.</p>
  <h2>Cadre des accompagnements</h2>
  <p>Les accompagnements présentés ne remplacent pas un suivi médical ou psychologique. Les modalités contractuelles, tarifs, conditions d’annulation et informations relatives à la médiation de la consommation seront précisés avant la mise en production.</p>
</div>`;
}

export function privacyPage() {
  return `<section class="container page-hero compact"><p class="eyebrow">Respecter votre confiance</p><h1>Confidentialité</h1></section>
<div class="container reading-section legal">
  <p class="notice">Version de présentation. Les informations relatives au traitement des données et des échanges restent à compléter et à valider avant publication.</p>
  <h2>Une consultation sans suivi publicitaire</h2>
  <p>Cette version du site n’utilise ni traceur publicitaire, ni outil de mesure d’audience, ni cookie applicatif. Les polices et images sont hébergées avec le site. Aucun contenu LinkedIn ou Crenolibre n’est chargé automatiquement.</p>
  <h2>Hébergement</h2>
  <p>Le site est hébergé par OVH SAS, 2 rue Kellermann, 59100 Roubaix, France. Les éventuelles données des journaux techniques, leurs finalités, leurs destinataires et leurs durées de conservation restent à confirmer.</p>
  <h2>Le contact par email</h2>
  <p>Vous pouvez écrire à <a href="mailto:${site.email}">${site.email}</a>. Les liens email ouvrent votre messagerie ; l’envoi intervient lorsque vous le confirmez dans celle-ci. Cette version du site ne propose pas de formulaire de contact et ne transmet aucun message au serveur du site. Ne transmettez pas d’informations médicales détaillées.</p>
  <h2>Les services externes</h2>
  <p>Si vous suivez un lien vers Crenolibre ou LinkedIn, leurs propres conditions et politiques de confidentialité s’appliquent.</p>
  <h2>Vos échanges avec Christine</h2>
  <p>Pour toute question relative à vos données, contactez Christine BRETHES à <a href="mailto:${site.email}">${site.email}</a> ou au <a href="tel:${site.phoneLink}">${site.phone}</a>.</p>
  <p>L’identité du responsable du traitement, les données concernées, les finalités, les bases légales, les durées de conservation, les destinataires et prestataires de messagerie, ainsi que les éventuels transferts hors de l’Union européenne restent à confirmer avec Christine.</p>
  <h2>Vos droits sur vos données</h2>
  <p>Dans les conditions prévues par le règlement général sur la protection des données (RGPD), vous disposez de droits d’accès, de rectification, d’effacement, de limitation du traitement, d’opposition et de portabilité de vos données. Leur application dépend du traitement concerné et de sa base légale.</p>
  <p>Lorsqu’un traitement repose sur votre consentement, vous pouvez le retirer à tout moment, sans remettre en cause la licéité du traitement effectué avant ce retrait.</p>
  <p>Pour exercer vos droits, adressez votre demande à <a href="mailto:${site.email}">${site.email}</a>, en précisant le droit concerné et les éléments permettant d’identifier votre demande.</p>
  <h2>Réclamation auprès de la CNIL</h2>
  <p>Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous pouvez introduire une réclamation auprès de la Commission nationale de l’informatique et des libertés (CNIL), via <a href="https://www.cnil.fr/fr/plaintes">son service de réclamation</a>.</p>
  <h2>Évolutions du site</h2>
  <p>La mise en place d’un formulaire, d’une mesure d’audience ou d’un contenu intégré nécessitera une mise à jour de cette page et, si nécessaire, une gestion des choix de confidentialité.</p>
</div>`;
}
