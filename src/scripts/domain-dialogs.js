// Native details keep every topic accessible if JavaScript is unavailable.
document.querySelectorAll('.domain-disclosure').forEach((disclosure, index) => {
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
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
  close.textContent = 'Fermer ×';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'text-link domain-trigger';
  trigger.innerHTML = summary.innerHTML;
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', dialog.id);
  dialog.append(close, content);
  document.body.append(dialog);
  disclosure.replaceWith(trigger);
  trigger.addEventListener('click', () => {
    dialog.showModal();
    title.focus();
    document.documentElement.classList.add('domain-dialog-open');
  });
  close.addEventListener('click', () => dialog.close());
  // Escape and focus containment are provided by the native modal dialog.
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('domain-dialog-open');
    trigger.focus();
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
