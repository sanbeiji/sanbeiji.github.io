// Holiday Theme Module: 雙十國慶 Double Tenth (double-tenth)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: '雙十國慶 Double Tenth',
    icon: '🇹🇼',
    greeting: '雙十國慶 · Happy Double Tenth Day (10/10)',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'fireworks',
    maxParticles: 34,
    speed: 0.58,
    colors: ['#ff5252', '#ffffff', '#448aff', '#ffd740'],
    symbols: ['十', '✨', '★', '•'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}