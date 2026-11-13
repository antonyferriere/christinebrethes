import { privacyConfig } from '../data/privacy-config.mjs';
import { site } from '../data/site.mjs';

export function legalPage() {
  return `<section class="container page-hero compact"><p class="eyebrow">Informations du site</p><h1>Mentions légales</h1></section>
<div class="container reading-section legal">
  <h2>Édition du site</h2>
  <p>Christine BRETHES, entrepreneure individuelle (EI) au régime de la micro-entreprise.<br>Coaching santé-travail et méditation de pleine conscience.</p>
  <p>Responsable de publication : Christine BRETHES.</p>
  <p>Email : <a href="mailto:${site.email}">${site.email}</a><br>Téléphone : <a href="tel:${site.phoneLink}">${site.phone}</a>.</p>
  <p>Domiciliation professionnelle : 16 rue Liancourt, 75014 Paris, France.<br>SIREN : 847 560 489<br>SIRET : 847 560 489 00019</p>
  <h2>Hébergement</h2>
  <p>OVH SAS<br>2 rue Kellermann<br>59100 Roubaix, France<br>Téléphone : <a href="tel:1007">1007</a> depuis la France ou <a href="tel:+33972101007">+33 9 72 10 10 07</a> depuis l’étranger.</p>
  <h2>Propriété intellectuelle</h2>
  <p>Les textes, photographies et éléments graphiques sont utilisés pour la présentation de l’activité de Christine BRETHES. Toute réutilisation doit faire l’objet d’une autorisation des titulaires des droits concernés.</p>
  <h2>Cadre des accompagnements</h2>
  <p>Les accompagnements présentés ne remplacent pas un suivi médical ou psychologique. Un contrat individuel de coaching peut préciser l’objectif de l’accompagnement, le rythme des séances et les modalités du bilan. Pour connaître le tarif et les conditions de paiement, de report ou d’annulation applicables à votre accompagnement, contactez Christine avant de vous engager.</p>
  <h2>Réclamation et médiation de la consommation</h2>
  <p>Pour toute réclamation concernant un accompagnement, vous pouvez écrire à Christine BRETHES à <a href="mailto:${site.email}">${site.email}</a> ou à son adresse professionnelle. Christine BRETHES n’a pas encore adhéré à un dispositif de médiation de la consommation.</p>
</div>`;
}

export function privacyPage() {
  const analytics = Boolean(privacyConfig(process.env, site.productionReady || process.argv.includes('--production') || process.env.NODE_ENV === 'production').id);
  return `<section class="container page-hero compact"><p class="eyebrow">Respecter votre confiance</p><h1>Confidentialité</h1></section>
<div class="container reading-section legal">
  <p class="notice">Version de présentation. Les informations relatives au traitement des données et des échanges restent à compléter et à valider avant publication.</p>
  <h2>Une consultation sans suivi publicitaire</h2>
  <p>${analytics ? 'Google Analytics peut mesurer la fréquentation des pages et les clics de contact uniquement après votre accord. Aucun suivi publicitaire n’est activé.' : 'Aucun outil facultatif de mesure d’audience ni traceur publicitaire n’est actif.'} Les polices et images sont hébergées avec le site. Aucun contenu LinkedIn ou Crenolibre n’est chargé automatiquement.</p>
  <h2>Vos choix de cookies</h2>
  <p>La mesure d’audience est refusée par défaut. Le choix est enregistré localement pendant six mois, que vous acceptiez ou refusiez. Le lien « Gestion des cookies » en pied de page permet de modifier ou retirer votre accord. Le refus ne limite pas l’accès au site. En cas de retrait, le suivi est arrêté et les cookies Analytics accessibles sont supprimés.</p>
  ${analytics ? '<p>Google Analytics (Google Ireland Limited) utilise notamment des cookies _ga et _ga_… pour mesurer les visites. Les événements du site excluent les paramètres d’URL, les coordonnées et le contenu de vos échanges. La durée des cookies est limitée à 180 jours ; le choix de consentement est renouvelé à six mois. Le service reçoit nécessairement des informations techniques de connexion. Les paramètres de conservation dans la propriété Analytics, les destinataires et les garanties applicables aux éventuels transferts hors de l’Union européenne doivent être validés avant activation publique.</p>' : ''}
  <h2>Hébergement</h2>
  <p>Le site est hébergé par OVH SAS, 2 rue Kellermann, 59100 Roubaix, France. Les éventuelles données des journaux techniques, leurs finalités, leurs destinataires et leurs durées de conservation restent à confirmer.</p>
  <h2>Le contact par email</h2>
  <p>Vous pouvez écrire à <a href="mailto:${site.email}">${site.email}</a>. Les liens email ouvrent votre messagerie ; l’envoi intervient lorsque vous le confirmez dans celle-ci. Cette version du site ne propose pas de formulaire de contact et ne transmet aucun message au serveur du site. Ne transmettez pas d’informations médicales détaillées.</p>
  <h2>Les services externes</h2>
  <p>Crenolibre est la seule plateforme prévue pour la prise de rendez-vous en ligne. Si vous suivez un lien vers Crenolibre ou LinkedIn, les conditions et la politique de confidentialité du service concerné s’appliquent.</p>
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
  <p>Toute évolution des traitements, notamment un formulaire ou un contenu intégré, nécessitera une mise à jour de cette page et, si nécessaire, une gestion des choix de confidentialité.</p>
</div>`;
}
