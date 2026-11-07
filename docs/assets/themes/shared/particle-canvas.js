// Shared Lightweight Particle & Cursor Effect Engine for sanbeiji.com Holiday Themes
// Strictly respects prefers-reduced-motion, pauses when tab is hidden,
// and cleans up all DOM/event listeners on unmount.

export function createParticleCanvas(options = {}) {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotionQuery.matches) {
    return () => {};
  }

  const {
    mode = 'snow', // 'snow' | 'float-up' | 'drift-down' | 'starfield' | 'fireworks'
    maxParticles = 32,
    speed = 0.6,
    colors = ['#ffffff', '#e3f2fd', '#fff9c4'],
    symbols = null,
    cursorTrail = true,
    cursorSymbols = null
  } = options;

  // Remove any existing particle canvas
  const existing = document.getElementById('holiday-particle-canvas');
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'holiday-particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  let isDestroyed = false;

  function attachCanvas() {
    if (isDestroyed) return;
    if (!canvas.parentNode && document.body) {
      document.body.appendChild(canvas);
    }
  }

  if (document.body) {
    attachCanvas();
  } else {
    document.addEventListener('DOMContentLoaded', attachCanvas, { once: true });
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth || 800);
  let height = (canvas.height = window.innerHeight || 600);
  let rafId = null;

  const particles = [];
  const trailParticles = [];

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createAmbientParticle(initialRandomY = true) {
    const color = pick(colors);
    const symbol = symbols && symbols.length > 0 ? pick(symbols) : null;
    const size = symbol ? randomBetween(12, 18) : randomBetween(2.2, 5.2);

    if (mode === 'float-up') {
      return {
        x: randomBetween(0, width),
        y: initialRandomY ? randomBetween(0, height) : height + 20,
        vx: randomBetween(-0.25, 0.25) * speed,
        vy: -randomBetween(0.35, 0.85) * speed,
        size,
        alpha: randomBetween(0.35, 0.78),
        phase: randomBetween(0, Math.PI * 2),
        color,
        symbol
      };
    }

    if (mode === 'starfield') {
      return {
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.08, 0.08) * speed,
        vy: randomBetween(-0.08, 0.08) * speed,
        size: symbol ? randomBetween(10, 15) : randomBetween(1.4, 3.4),
        alpha: randomBetween(0.2, 0.85),
        phase: randomBetween(0, Math.PI * 2),
        color,
        symbol
      };
    }

    if (mode === 'fireworks') {
      return {
        x: randomBetween(width * 0.1, width * 0.9),
        y: randomBetween(height * 0.1, height * 0.75),
        vx: randomBetween(-0.45, 0.45) * speed,
        vy: randomBetween(-0.45, 0.45) * speed,
        size: symbol ? randomBetween(12, 17) : randomBetween(2.0, 4.2),
        alpha: randomBetween(0.2, 0.85),
        phase: randomBetween(0, Math.PI * 2),
        color,
        symbol
      };
    }

    // Default: 'snow' or 'drift-down'
    return {
      x: randomBetween(0, width),
      y: initialRandomY ? randomBetween(0, height) : -20,
      vx: randomBetween(-0.35, 0.35) * speed,
      vy: randomBetween(0.4, 1.05) * speed,
      size,
      alpha: randomBetween(0.38, 0.82),
      phase: randomBetween(0, Math.PI * 2),
      color,
      symbol
    };
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(createAmbientParticle(true));
  }

  let lastCursorTime = 0;
  function onPointerMove(e) {
    if (!cursorTrail || isDestroyed) return;
    const now = performance.now();
    if (now - lastCursorTime < 42) return;
    lastCursorTime = now;

    const trailSymbol =
      cursorSymbols && cursorSymbols.length > 0
        ? pick(cursorSymbols)
        : symbols && symbols.length > 0
        ? pick(symbols)
        : null;

    trailParticles.push({
      x: e.clientX + randomBetween(-4, 4),
      y: e.clientY + randomBetween(-4, 4),
      vx: randomBetween(-0.45, 0.45),
      vy: randomBetween(-0.65, 0.25),
      size: trailSymbol ? randomBetween(10, 14) : randomBetween(2.2, 4.2),
      alpha: 0.78,
      decay: randomBetween(0.018, 0.03),
      color: pick(colors),
      symbol: trailSymbol
    });

    if (trailParticles.length > 28) {
      trailParticles.shift();
    }
  }

  function onResize() {
    if (isDestroyed) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function renderFrame() {
    if (isDestroyed) return;
    ctx.clearRect(0, 0, width, height);

    // Update and draw ambient particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.phase += 0.02;

      if (mode === 'starfield' || mode === 'fireworks') {
        p.x += p.vx;
        p.y += p.vy;
        const twinkle = 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(p.phase * 1.8));
        drawParticle(p, twinkle);

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      } else if (mode === 'float-up') {
        p.x += p.vx + Math.sin(p.phase) * 0.22;
        p.y += p.vy;
        drawParticle(p, p.alpha);

        if (p.y < -30) {
          particles[i] = createAmbientParticle(false);
        }
      } else {
        // 'snow' or 'drift-down'
        p.x += p.vx + Math.sin(p.phase) * 0.28;
        p.y += p.vy;
        drawParticle(p, p.alpha);

        if (p.y > height + 30) {
          particles[i] = createAmbientParticle(false);
        }
      }
    }

    // Update and draw subtle cursor trail particles
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const tp = trailParticles[i];
      tp.x += tp.vx;
      tp.y += tp.vy;
      tp.alpha -= tp.decay;
      if (tp.alpha <= 0.02) {
        trailParticles.splice(i, 1);
      } else {
        drawParticle(tp, tp.alpha);
      }
    }

    if (!document.hidden && !isDestroyed) {
      rafId = window.requestAnimationFrame(renderFrame);
    } else {
      rafId = null;
    }
  }

  function drawParticle(p, alpha) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    if (p.symbol) {
      ctx.font = `${Math.round(p.size)}px 'Special Elite', 'Noto Serif SC', sans-serif`;
      ctx.fillStyle = p.color;
      ctx.fillText(p.symbol, p.x, p.y);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fill();
    }
    ctx.restore();
  }

  function onVisibilityChange() {
    if (isDestroyed) return;
    if (document.hidden) {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (!rafId && !reducedMotionQuery.matches) {
      rafId = window.requestAnimationFrame(renderFrame);
    }
  }

  function onReducedMotionChange(e) {
    if (e.matches) {
      cleanup();
    }
  }

  function cleanup() {
    if (isDestroyed) return;
    isDestroyed = true;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (typeof reducedMotionQuery.removeEventListener === 'function') {
      reducedMotionQuery.removeEventListener('change', onReducedMotionChange);
    }
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', onReducedMotionChange);
  }

  rafId = window.requestAnimationFrame(renderFrame);
  return cleanup;
}

// Alias for direct snow effect usage
export function createSnowCanvas(options = {}) {
  return createParticleCanvas({
    mode: 'snow',
    maxParticles: options.maxFlakes || 35,
    speed: options.speed || 0.6,
    colors: options.colors || ['#ffffff', '#e3f2fd', '#bbdefb'],
    symbols: options.symbols || ['❄', '❅', '•'],
    cursorTrail: options.cursorTrail !== false
  });
}
