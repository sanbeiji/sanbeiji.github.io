// Holiday Theme Module: Birthday Celebration (birthday)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: 'Birthday Celebration',
    icon: '🎂',
    greeting: 'Happy Birthday, Joe! (December 11)',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'drift-down',
    maxParticles: 34,
    speed: 0.65,
    colors: ['#ffd54f', '#ff80ab', '#b388ff', '#80d8ff'],
    symbols: ['♪', '♫', '𝄢', '🎉', '✨'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}