// Holiday Theme Module: 中秋節 Mid-Autumn (mid-autumn)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: '中秋節 Mid-Autumn',
    icon: '🥮',
    greeting: '中秋節快樂 · 花好月圓 · Full Moon & Mooncakes',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'drift-down',
    maxParticles: 32,
    speed: 0.52,
    colors: ['#fde047', '#fbbf24', '#fef08a', '#fed7aa'],
    symbols: ['🌕', '🥮', '桂', '✨'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}