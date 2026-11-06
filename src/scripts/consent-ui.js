import { currentConsent, saveConsent, readPrivacyConfig } from './consent-state.js';
export function consentMarkup(active, accepted = false) {
  return `<h2 id="cookie-title">Vos choix de confidentialité</h2><p id="cookie-description">${active ? 'Avec votre accord, Google Analytics mesure la fréquentation des pages et les clics de contact pour améliorer le site. Aucun suivi publicitaire n’est activé. Vous pouvez refuser sans limiter votre accès au site.' : 'Aucun outil facultatif de mesure d’audience n’est actif sur ce site. Aucun accord n’est nécessaire pour le consulter.'}</p>${active ? `<p>Votre choix, accord ou refus, est conservé six mois sur cet appareil. Vous pouvez le modifier à tout moment depuis « Gestion des cookies ».</p><p>${accepted ? 'Votre choix actuel : mesure d’audience acceptée. « Tout refuser » permet de retirer cet accord.' : 'La mesure d’audience est désactivée tant que vous ne l’acceptez pas.'}</p><div class="consent-actions"><button type="button" class="button" data-consent="no">Tout refuser</button><button type="button" class="button" data-consent="yes">Tout accepter</button></div>` : ''}<p><a href="/confidentialite/">Lire la politique de confidentialité</a></p><button class="consent-close" type="button" data-consent-close>Fermer sans modifier mon choix</button>`;
}
export function initializeConsent() {
  const config = readPrivacyConfig();
  const active = Boolean(config.id || config.preview);
  const dialog = document.createElement('dialog');
  dialog.className = 'consent-dialog';
  dialog.setAttribute('aria-labelledby', 'cookie-title');
  dialog.setAttribute('aria-describedby', 'cookie-description');
  document.body.append(dialog);
  let trigger;
  function open(button) {
    trigger = button;
    dialog.innerHTML = consentMarkup(active, currentConsent()?.analytics === true);
    if (!dialog.open) dialog.showModal();
  }
  dialog.addEventListener('click', event => {
    const choice = event.target.closest('[data-consent]');
    if (choice && active) { saveConsent(choice.dataset.consent === 'yes'); dialog.close(); }
    if (event.target.closest('[data-consent-close]')) dialog.close();
  });
  dialog.addEventListener('close', () => trigger?.focus());
  // Native dialog handles Escape, focus containment and inert background.
  document.querySelectorAll('[data-cookie-settings]').forEach(button => {
    button.addEventListener('click', () => open(button));
  });
  if (active && !currentConsent()) open();
}
if (typeof document !== 'undefined') initializeConsent();
