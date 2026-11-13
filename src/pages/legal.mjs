import { privacyConfig } from '../data/privacy-config.mjs';
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
  const analytics = Boolean(privacyConfig(process.env, site.productionReady || process.argv.includes('--production') || process.env.NODE_ENV === 'production').id);
  return `<section class="container page-hero compact"><p class="eyebrow">Respecter votre confiance</p><h1>Confidentialité</h1></section>
<div class="container reading-section legal">
  <h2>Une consultation sans suivi publicitaire</h2>
  <p>${analytics ? 'Google Analytics peut mesurer la fréquentation des pages et les clics de contact uniquement après votre accord. Aucun suivi publicitaire n’est activé.' : 'Aucun outil facultatif de mesure d’audience ni traceur publicitaire n’est actif.'} Les polices et images sont hébergées avec le site. Aucun contenu LinkedIn ou Crenolibre n’est chargé automatiquement.</p>
  <h2>Vos choix de cookies</h2>
  <p>La mesure d’audience est refusée par défaut. Le choix est enregistré localement pendant six mois, que vous acceptiez ou refusiez. Le lien « Gestion des cookies » en pied de page permet de modifier ou retirer votre accord. Le refus ne limite pas l’accès au site. En cas de retrait, le suivi est arrêté et les cookies Analytics accessibles sont supprimés.</p>
  ${analytics ? '<p>Google Analytics (Google Ireland Limited) utilise notamment des cookies _ga et _ga_… pour mesurer les visites. Les événements du site excluent les paramètres d’URL, les coordonnées et le contenu de vos échanges. La durée des cookies est limitée à 180 jours ; le choix de consentement est renouvelé à six mois. Le service reçoit nécessairement des informations techniques de connexion. Pour toute question sur les données de mesure d’audience, vous pouvez contacter Christine aux coordonnées indiquées ci-dessous.</p>' : ''}
  <h2>Hébergement</h2>
  <p>Le site est hébergé par OVH SAS, 2 rue Kellermann, 59100 Roubaix, France. Lors d’une visite, le serveur reçoit des informations techniques, notamment votre adresse IP et la page demandée, pour afficher le site. Les journaux techniques peuvent servir au diagnostic des erreurs et à la sécurité du site.</p>
  <h2>Le contact par email</h2>
  <p>Vous pouvez écrire à <a href="mailto:${site.email}">${site.email}</a>. Les liens email ouvrent votre messagerie ; l’envoi intervient lorsque vous le confirmez dans celle-ci. Le site ne propose pas de formulaire de contact et ne transmet aucun message au serveur du site. Ne transmettez pas d’informations médicales détaillées.</p>
  <h2>Les services externes</h2>
  <p>Crenolibre est la seule plateforme prévue pour la prise de rendez-vous en ligne. Si vous suivez un lien vers Crenolibre ou LinkedIn, les conditions et la politique de confidentialité du service concerné s’appliquent.</p>
  <h2>Demandes de contact et rendez-vous</h2>
  <p>Christine BRETHES est responsable du traitement des informations que vous lui confiez. Elle utilise votre nom, votre téléphone, votre adresse e-mail et le contenu de vos échanges pour vous répondre et organiser les rendez-vous. Elle utilise Gmail pour la correspondance et les pièces jointes, Crenolibre et Google Agenda pour les rendez-vous, et Zoom pour les séances à distance et le partage d’écran.</p>
  <p>Lorsque vous la contactez en vue d’un accompagnement, ces échanges servent à préparer le contrat à votre demande. Pour les autres questions, Christine utilise vos coordonnées dans son intérêt légitime à répondre aux messages reçus.</p>
  <h2>Suivi de votre accompagnement</h2>
  <p>Pour assurer le suivi prévu dans votre contrat, Christine prend des notes sur les séances, les protocoles et les exercices réalisés. Ces notes sont le plus souvent sur papier. Les documents Word sont stockés dans Google Drive. Christine n’utilise pas de logiciel de suivi et ne partage pas le contenu de vos séances avec d’autres professionnels ou organismes dans le cadre de votre accompagnement.</p>
  <p>Les questions de santé sont généralement abordées à l’oral. Des informations de santé peuvent toutefois figurer dans les notes, les e-mails ou les pièces jointes. Évitez d’envoyer un document médical par e-mail. Vous pouvez interroger Christine sur les informations qu’elle a conservées à votre sujet.</p>
  <h2>Durées de conservation</h2>
  <ul><li>Demande de contact sans accompagnement : un an.</li><li>Échanges et dossier de suivi : habituellement deux à trois ans après la fin de l’accompagnement.</li></ul>
  <h2>Prestataires techniques</h2>
  <p>Selon les services utilisés, les prestataires de messagerie, d’agenda, de réservation, de visioconférence ou de stockage traitent les données nécessaires à leur fonctionnement. Pour toute question sur les destinataires de vos données ou les garanties applicables à un éventuel transfert hors de l’Espace économique européen, écrivez à <a href="mailto:${site.email}">${site.email}</a>.</p>
  <h2>Vos droits sur vos données</h2>
  <p>Dans les conditions prévues par le règlement général sur la protection des données (RGPD), vous disposez de droits d’accès, de rectification, d’effacement, de limitation du traitement, d’opposition et de portabilité de vos données. Leur application dépend du traitement concerné et de sa base légale.</p>
  <p>Lorsqu’un traitement repose sur votre consentement, vous pouvez le retirer à tout moment, sans remettre en cause la licéité du traitement effectué avant ce retrait.</p>
  <p>Pour exercer vos droits, adressez votre demande à <a href="mailto:${site.email}">${site.email}</a>, en précisant le droit concerné et les éléments permettant d’identifier votre demande.</p>
  <h2>Réclamation auprès de la CNIL</h2>
  <p>Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous pouvez introduire une réclamation auprès de la Commission nationale de l’informatique et des libertés (CNIL), via <a href="https://www.cnil.fr/fr/plaintes">son service de réclamation</a>.</p>
  <h2>Évolutions du site</h2>
  <p>Toute évolution des traitements, notamment un formulaire ou un contenu intégré, nécessitera une mise à jour de cette page et, si nécessaire, une gestion des choix de confidentialité.</p>
</div>`;
}
