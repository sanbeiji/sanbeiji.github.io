// Holiday Theme Module: 農曆新年 Lunar New Year (lunar-new-year)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: '農曆新年 Lunar New Year',
    icon: '🧧',
    greeting: '恭喜發財 · 新年快樂 · 歲歲平安',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'drift-down',
    maxParticles: 32,
    speed: 0.6,
    colors: ['#ffd700', '#ff5252', '#ffab40', '#ffe082'],
    symbols: ['🧧', '福', '✨', '🌸'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}