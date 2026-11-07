// Holiday Theme Module: Merry Christmas (christmas)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: 'Merry Christmas',
    icon: '🎄',
    greeting: 'Merry Christmas & Happy Holidays!',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'snow',
    maxParticles: 38,
    speed: 0.6,
    colors: ['#ffffff', '#e3f2fd', '#ffcdd2', '#fff9c4'],
    symbols: ['❄', '❅', '❆', '•'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}