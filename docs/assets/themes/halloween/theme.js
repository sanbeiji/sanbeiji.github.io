// Holiday Theme Module: Happy Halloween (halloween)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: 'Happy Halloween',
    icon: '🎃',
    greeting: 'Happy Halloween! Trick or Practice 🎻👻',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'float-up',
    maxParticles: 32,
    speed: 0.55,
    colors: ['#ff6d00', '#ffab00', '#b388ff', '#ea80fc'],
    symbols: ['🎃', '👻', '🦇', '✨'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}