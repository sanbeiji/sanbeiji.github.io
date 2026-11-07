// Holiday Theme Module: Happy Thanksgiving (thanksgiving)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: 'Happy Thanksgiving',
    icon: '🍂',
    greeting: 'Happy Thanksgiving · Grateful for Music & Friends',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'drift-down',
    maxParticles: 32,
    speed: 0.55,
    colors: ['#ff8f00', '#d84315', '#fbc02d', '#8d6e63'],
    symbols: ['🍁', '🍂', '🌾', '✨'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}