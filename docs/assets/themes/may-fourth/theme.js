// Holiday Theme Module: May the 4th (may-fourth)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: 'May the 4th',
    icon: '⚔️',
    greeting: 'May the Force Be With You — Always.',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'starfield',
    maxParticles: 40,
    speed: 0.5,
    colors: ['#ffffff', '#4fc3f7', '#ffe81f', '#ff5252'],
    symbols: ['🪐', '🚀', '🛸', '⭐', '✦', '⋆', '•'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}