// Holiday Theme Module: Pi Day (3.14) (pi-day)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: 'Pi Day (3.14)',
    icon: '🥧',
    greeting: 'Happy Pi Day! π = 3.1415926535…',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'drift-down',
    maxParticles: 34,
    speed: 0.55,
    colors: ['#82b1ff', '#ffd54f', '#80cbc4', '#ffffff'],
    symbols: ['π', '3', '.', '1', '4', '1', '5', '9'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}