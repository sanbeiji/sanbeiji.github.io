// Holiday Theme Module: 元宵節 Lantern Festival (lantern-festival)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: '元宵節 Lantern Festival',
    icon: '🏮',
    greeting: '元宵節快樂 · Pingxi Sky Lanterns',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'float-up',
    maxParticles: 32,
    speed: 0.55,
    colors: ['#ff9800', '#ffeb3b', '#ff5722', '#ffe082'],
    symbols: ['🏮', '✨', '•'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}