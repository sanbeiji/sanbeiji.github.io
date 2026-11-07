// Holiday Theme Module: 中元節 Ghost Festival (ghost-festival)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: '中元節 Ghost Festival',
    icon: '🪷',
    greeting: '中元普渡 · 祈福平安 · Water Lanterns',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'float-up',
    maxParticles: 30,
    speed: 0.5,
    colors: ['#f48fb1', '#ce93d8', '#ffe082', '#80deea'],
    symbols: ['🪷', '🕯️', '✨', '•'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}