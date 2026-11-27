import { bindCardAction, bindDisclosureCard } from './card-actions.js';

// Native details keep every topic accessible if JavaScript is unavailable.
document.querySelectorAll('.domain-disclosure').forEach((disclosure, index) => {
  const card = disclosure.closest('.editorial-domain-card');
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) {
    bindDisclosureCard(card, disclosure);
    return;
  }
  const summary = disclosure.querySelector('summary');
  const content = disclosure.querySelector('.domain-detail');
  const dialog = document.createElement('dialog');
  dialog.className = 'domain-dialog';
  dialog.id = `domain-dialog-${index}`;
  const title = content.querySelector('[data-domain-title]');
  title.id = `${dialog.id}-title`;
  title.tabIndex = -1;
  dialog.setAttribute('aria-labelledby', title.id);
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'domain-dialog-close';
  close.setAttribute('aria-label', 'Fermer la modale');
  close.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'text-link domain-trigger';
  trigger.innerHTML = summary.innerHTML;
  const triggers = [trigger];
  const cardTitle = card.querySelector('.editorial-card-body > h3');
  const titleTrigger = document.createElement('button');
  titleTrigger.className = 'domain-title-trigger';
  titleTrigger.append(...cardTitle.childNodes);
  cardTitle.append(titleTrigger);
  triggers.push(titleTrigger);
  const image = card.querySelector('.editorial-card-image');
  if (image) {
    const imageTrigger = document.createElement('button');
    imageTrigger.className = `${image.className} domain-image-trigger`;
    imageTrigger.setAttribute('aria-label', `Découvrir : ${title.textContent}`);
    imageTrigger.append(...image.childNodes);
    image.replaceWith(imageTrigger);
    triggers.push(imageTrigger);
  }
  dialog.append(close, content);
  document.body.append(dialog);
  disclosure.replaceWith(trigger);
  let opener = trigger;
  triggers.forEach(button => {
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.addEventListener('click', () => {
      opener = button;
      dialog.showModal();
      title.focus();
      document.documentElement.classList.add('domain-dialog-open');
    });
  });
  bindCardAction(card, () => trigger.click());
  close.addEventListener('click', () => dialog.close());
  // Escape and focus containment are provided by the native modal dialog.
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('domain-dialog-open');
    opener.focus();
  });
  let backdropPointer = false;
  const outside = event => {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropPointer = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropPointer && event.target === dialog && outside(event)) dialog.close();
    backdropPointer = false;
  });
});
