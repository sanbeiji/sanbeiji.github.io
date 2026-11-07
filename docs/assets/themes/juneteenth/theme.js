// Holiday Theme Module: Juneteenth (juneteenth)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: 'Juneteenth',
    icon: '✊🏿',
    greeting: 'Celebrating Juneteenth · Freedom & Jubilee',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'starfield',
    maxParticles: 34,
    speed: 0.55,
    colors: ['#ef4444', '#22c55e', '#facc15', '#ffffff'],
    symbols: ['✦', '★', '✨'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}