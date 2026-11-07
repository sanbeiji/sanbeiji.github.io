// Shared Header & UI Manager for sanbeiji.com Holiday Themes
// Replaces the bass clef logo with the themed holiday icon, matching its relative
// size and bounce-in animation, with zero extra vertical spacing.

function ensureHeaderStylesheet() {
  if (document.getElementById('holiday-theme-ui-css')) return;
  const link = document.createElement('link');
  link.id = 'holiday-theme-ui-css';
  link.rel = 'stylesheet';
  link.href = '/assets/css/theme-toggle.css';
  document.head.appendChild(link);
}

export function decorateHeader({ themeId, label, icon, greeting, logoSrc }) {
  ensureHeaderStylesheet();
  const bc = document.getElementById('bc');
  if (!bc) return () => {};

  const logoLink = bc.querySelector('a.logo');
  if (!logoLink) return () => {};

  const img = logoLink.querySelector('img');
  if (!img) return () => {};

  const originalSrc = img.dataset.origSrc || img.getAttribute('src');
  const originalAlt = img.dataset.origAlt || img.getAttribute('alt');
  const originalTitle = img.dataset.origTitle || logoLink.getAttribute('title');

  if (logoSrc && img.getAttribute('src') !== logoSrc) {
    img.src = logoSrc;
    img.alt = `${label || themeId} logo`;
    img.className = 'holiday-logo-icon anim';
  }

  if (greeting) {
    logoLink.setAttribute('title', `${greeting} (Click or tap to reload)`);
  }

  return function cleanupHeader() {
    if (originalSrc) img.src = originalSrc;
    if (originalAlt) img.alt = originalAlt;
    img.className = 'anim';
    if (originalTitle) {
      logoLink.setAttribute('title', originalTitle);
    }
  };
}
