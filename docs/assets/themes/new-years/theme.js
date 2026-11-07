// Holiday Theme Module: Happy New Year (new-years)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: 'Happy New Year',
    icon: '🎆',
    greeting: 'Happy New Year! 新年快樂 ✨',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'fireworks',
    maxParticles: 34,
    speed: 0.55,
    colors: ['#ffd700', '#fff59d', '#80deea', '#f48fb1'],
    symbols: ['✨', '🎇', '⋆', '•'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}