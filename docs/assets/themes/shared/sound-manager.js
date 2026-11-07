// sound-manager.js (Audio feature deferred)
// Re-exports decorateHeader from header-manager.js.

export { decorateHeader } from './header-manager.js';

export function initSoundToggle() {
  return function cleanup() {};
}
