// Holiday Theme Module: 端午節 Dragon Boat (dragon-boat)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: '端午節 Dragon Boat',
    icon: '🐉',
    greeting: '端午安康 · Dragon Boat Festival',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'drift-down',
    maxParticles: 30,
    speed: 0.55,
    colors: ['#80cbc4', '#a5d6a7', '#ffd54f', '#b2ebf2'],
    symbols: ['粽', '🌿', '💧', '✨'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}