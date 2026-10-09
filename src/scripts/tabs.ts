/**
 * WAI-ARIA tabs: click or arrow keys switch `[role="tab"]` buttons inside `root`,
 * showing the panel named by each tab's `aria-controls`.
 */
export function initTabs(root: HTMLElement): void {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];

  const select = (selected: HTMLButtonElement, focus: boolean) => {
    for (const tab of tabs) {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
      if (panel) panel.hidden = !active;
    }
    if (focus) selected.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const target = {
        ArrowRight: index === last ? 0 : index + 1,
        ArrowLeft: index === 0 ? last : index - 1,
        Home: 0,
        End: last,
      }[event.key];
      const next = target === undefined ? undefined : tabs[target];
      if (!next) return;
      event.preventDefault();
      select(next, true);
    });
  });
}
