const labels = ['Santé mentale', 'Santé physique', 'Vie quotidienne'];

document.querySelectorAll('.editorial-benefits').forEach((section, sectionIndex) => {
  const panels = [...section.querySelectorAll('.benefit-group')];
  if (panels.length !== labels.length) return;

  const tablist = document.createElement('div');
  tablist.className = 'benefit-tabs';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', section.querySelector('h2').textContent);

  function select(index) {
    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[position].hidden = !active;
    });
  }

  const tabs = panels.map((panel, index) => {
    const id = `benefits-${sectionIndex}-${index}`;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.id = id + '-tab';
    tab.textContent = labels[index];
    tab.setAttribute('role', 'tab');
    panel.id = id + '-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.setAttribute('aria-controls', panel.id);
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const last = panels.length - 1;
      let next;
      switch (event.key) {
        case 'ArrowRight': next = index === last ? 0 : index + 1; break;
        case 'ArrowLeft': next = index === 0 ? last : index - 1; break;
        case 'Home': next = 0; break;
        case 'End': next = last; break;
        default: return;
      }
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
    tablist.append(tab);
    return tab;
  });

  panels[0].parentElement.before(tablist);
  select(0);
});
