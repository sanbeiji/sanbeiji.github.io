// Holiday Theme Module: MLK Day (mlk-day)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: 'MLK Day',
    icon: '🕊️',
    greeting: 'Martin Luther King Jr. Day · Peace, Justice & Harmony',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'float-up',
    maxParticles: 28,
    speed: 0.48,
    colors: ['#fde68a', '#ffffff', '#93c5fd'],
    symbols: ['🕊️', '⚖️', '✊', '☮️', '🤝', '✨', '⭐'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}