export function prepareEmail(values, recipient) {
  const name = String(values.name ?? '').trim();
  const email = String(values.email ?? '').trim();
  const message = String(values.message ?? '').trim();
  const organization = String(values.organization ?? '').trim();
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Merci de renseigner votre nom, une adresse email valide et votre demande.');
  }
  if (name.length > 100 || email.length > 200 || organization.length > 160 || message.length > 2000) {
    throw new Error('Votre message dépasse la longueur prévue. Merci de le raccourcir.');
  }
  const subject = values.profile === 'organisation' ? 'Projet d’intervention — organisation' : 'Demande d’accompagnement individuel';
  const body = `Bonjour Christine,\n\n${message}\n\n${name}\n${email}${organization ? `\nOrganisation : ${organization}` : ''}`;
  return { body, subject, href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
export function initializeContact() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const profile = document.querySelector('#profile');
  if (new URLSearchParams(location.search).get('profil') === 'organisation') profile.value = 'organisation';
  const status = document.querySelector('#form-status');
  const draft = document.querySelector('#email-draft');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const email = prepareEmail(Object.fromEntries(new FormData(form)), form.dataset.email);
      draft.value = `Objet : ${email.subject}\n\n${email.body}`;
      document.querySelector('#message-fallback').hidden = false;
      status.textContent = 'Votre email est préparé. Votre messagerie va s’ouvrir : relisez-le puis envoyez-le. Aucun message n’a été envoyé par le site.';
      window.location.href = email.href;
    } catch (error) {
      status.textContent = error.message;
    }
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(draft.value);
      status.textContent = 'Message copié. Collez-le dans votre messagerie, puis envoyez-le à Christine.';
    } catch {
      draft.focus();
      draft.select();
      status.textContent = 'Sélectionnez et copiez le texte, puis collez-le dans votre messagerie.';
    }
  });
}
