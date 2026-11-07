// Holiday Theme Module: 冬至 Winter Solstice (winter-solstice)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: '冬至 Winter Solstice',
    icon: '🍡',
    greeting: '冬至團圓 · Happy Winter Solstice',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: 'snow',
    maxParticles: 34,
    speed: 0.55,
    colors: ['#ffffff', '#ffccd5', '#bde0fe', '#ffe5ec'],
    symbols: ['❄', '⚪', '🩷', '✨'],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}