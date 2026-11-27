// Enhance the card's pointer target without replacing its native keyboard control.
const interactive = 'a, button, summary, input, select, textarea, label, [contenteditable], [role="button"], [role="link"]';

export function bindCardAction(card, action) {
  if (!card) return;
  card.setAttribute('data-card-action', '');
  card.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.target.closest(interactive)
        || card.ownerDocument.getSelection()?.isCollapsed === false) return;
    action(event);
  });
}

export function bindDisclosureCard(card, disclosure) {
  bindCardAction(card, () => {
    disclosure.open = !disclosure.open;
    if (!disclosure.open) disclosure.querySelector('summary').focus({ preventScroll: true });
  });
}
