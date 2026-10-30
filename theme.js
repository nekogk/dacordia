(() => {
  const KEY = 'theme';
  const CHOICES = ['system', 'light', 'dark'];
  const root = document.documentElement;
  const systemDark = matchMedia('(prefers-color-scheme: dark)');

  let choice = 'system';
  try {
    const saved = localStorage.getItem(KEY);
    if (CHOICES.includes(saved)) choice = saved;
  } catch {}

  function effective() {
    return choice === 'system' ? (systemDark.matches ? 'dark' : 'light') : choice;
  }

  function syncButtons() {
    for (const b of document.querySelectorAll('.theme-btn[data-theme-choice]')) {
      const on = b.dataset.themeChoice === choice;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    }
  }

  function apply() {
    const theme = effective();
    if (root.dataset.theme !== theme) root.dataset.theme = theme;
    syncButtons();
  }

  function setChoice(c) {
    if (!CHOICES.includes(c)) return;
    choice = c;
    try { localStorage.setItem(KEY, c); } catch {}
    apply();
  }

  document.addEventListener('click', e => {
    const b = e.target.closest?.('.theme-btn[data-theme-choice]');
    if (b) setChoice(b.dataset.themeChoice);
  });

  systemDark.addEventListener('change', apply);

  addEventListener('storage', e => {
    if (e.key !== KEY) return;
    choice = CHOICES.includes(e.newValue) ? e.newValue : 'system';
    apply();
  });

  window.siteTheme = { sync: syncButtons, current: () => root.dataset.theme };
  apply();
  document.addEventListener('DOMContentLoaded', syncButtons);
})();
