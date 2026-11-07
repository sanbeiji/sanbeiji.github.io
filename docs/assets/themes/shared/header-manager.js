// Shared Header & UI Manager for sanbeiji.com Holiday Themes
// Replaces the bass clef logo with the themed holiday icon, matching its relative
// size and bounce-in animation, with zero extra vertical spacing.

export function decorateHeader({ themeId, label, icon, greeting, logoSrc }) {
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
    img.className = 'holiday-logo-icon';
    void img.offsetWidth;
    img.classList.add('anim');
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
