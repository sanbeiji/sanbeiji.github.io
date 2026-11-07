// Holiday Theme Module: 4th of July (fourth-of-july)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: '4th of July',
    icon: '🎇',
    greeting: 'Happy 4th of July!',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'fireworks',
    maxParticles: 36,
    speed: 0.6,
    colors: ['#ff5252', '#ffffff', '#448aff', '#ffd740'],
    symbols: ['🎇', '★', '✨', '•'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}