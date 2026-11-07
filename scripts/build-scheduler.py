import json
import os

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
schedule_path = os.path.join(repo_root, "docs", "assets", "themes", "schedule.json")
out_path = os.path.join(repo_root, "docs", "assets", "js", "theme-scheduler.js")

with open(schedule_path, "r", encoding="utf-8") as f:
    schedule_data = json.load(f)

schedule_json = json.dumps(schedule_data, separators=(",", ":"))

js_content = f"""// Lightweight Holiday Theme Scheduler & Dynamic Loader for sanbeiji.com
// Zero dependencies, zero extra assets loaded on normal non-holiday days.
// Precomputed schedule embedded for 0ms synchronous evaluation (zero flash of bass clef).
// Supports ?theme=<id> and ?date=<YYYY-MM-DD[THH:mm:ss]> overrides.

(function () {{
  const VALID_THEMES = new Set([
    'mlk-day',
    'lunar-new-year',
    'lantern-festival',
    'pi-day',
    'may-fourth',
    'dragon-boat',
    'juneteenth',
    'fourth-of-july',
    'ghost-festival',
    'mid-autumn',
    'double-tenth',
    'halloween',
    'thanksgiving',
    'birthday',
    'winter-solstice',
    'christmas',
    'new-years'
  ]);

  const EMBEDDED_SCHEDULE = {schedule_json};

  let currentThemeId = null;
  let currentUnmount = null;
  let transitionTimer = null;

  function parseLocalDate(isoString) {{
    if (!isoString || typeof isoString !== 'string') return new Date(NaN);
    const trimmed = isoString.trim();
    const [datePart, timePart] = trimmed.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    if (!y || !m || !d) return new Date(isoString);
    if (!timePart) {{
      return new Date(y, m - 1, d, 12, 0, 0);
    }}
    const cleanTime = timePart.replace(/Z|[+-]\\d{{2}}:?\\d{{2}}$/, '');
    const parts = cleanTime.split(':').map(Number);
    return new Date(y, m - 1, d, parts[0] || 0, parts[1] || 0, parts[2] || 0);
  }}

  function evaluateActiveHoliday(schedule, nowDate) {{
    if (!schedule || !(nowDate instanceof Date) || isNaN(nowDate.getTime())) {{
      return null;
    }}
    const yr = nowDate.getFullYear();
    const yearEntries = [
      ...(schedule[String(yr - 1)] || []),
      ...(schedule[String(yr)] || [])
    ];

    const candidates = yearEntries.filter((item) => {{
      const start = parseLocalDate(item.start);
      const end = parseLocalDate(item.end);
      return nowDate >= start && nowDate <= end;
    }});

    if (candidates.length === 0) return null;

    // Conflict Resolution: Latest window start time wins
    candidates.sort((a, b) => parseLocalDate(b.start) - parseLocalDate(a.start));
    return candidates[0].id;
  }}

  function replaceLogoElement(themeId) {{
    const bc = document.getElementById('bc');
    if (!bc) return false;
    const logoLink = bc.querySelector('a.logo');
    if (!logoLink) return false;
    const img = logoLink.querySelector('img');
    if (!img) return false;

    if (!img.dataset.origSrc) {{
      img.dataset.origSrc = img.getAttribute('src') || '/assets/img/bassclef.gif';
      img.dataset.origAlt = img.getAttribute('alt') || 'bass clef logo';
      img.dataset.origTitle = logoLink.getAttribute('title') || '';
    }}

    const targetSrc = '/assets/themes/' + themeId + '/logo.svg';
    if (img.getAttribute('src') !== targetSrc) {{
      img.src = targetSrc;
      img.alt = themeId + ' logo';
      img.className = 'holiday-logo-icon';
      void img.offsetWidth;
      img.classList.add('anim');
    }}
    return true;
  }}

  function restoreLogoElement() {{
    const bc = document.getElementById('bc');
    if (!bc) return;
    const logoLink = bc.querySelector('a.logo');
    if (!logoLink) return;
    const img = logoLink.querySelector('img');
    if (!img) return;

    if (img.dataset.origSrc) {{
      img.src = img.dataset.origSrc;
      img.alt = img.dataset.origAlt || 'bass clef logo';
      img.className = 'anim';
    }}
    if (img.dataset.origTitle) {{
      logoLink.setAttribute('title', img.dataset.origTitle);
    }}
  }}

  function unmountCurrentTheme() {{
    if (typeof currentUnmount === 'function') {{
      try {{
        currentUnmount();
      }} catch (e) {{
        console.warn('Error unmounting theme:', e);
      }}
      currentUnmount = null;
    }}
    const existingCss = document.getElementById('holiday-theme-css');
    if (existingCss && existingCss.parentNode) {{
      existingCss.parentNode.removeChild(existingCss);
    }}
    if (currentThemeId) {{
      document.documentElement.classList.remove('holiday-active', 'theme-' + currentThemeId);
      if (document.body) {{
        document.body.classList.remove('theme-' + currentThemeId);
        delete document.body.dataset.holidayTheme;
      }}
      restoreLogoElement();
    }}
    currentThemeId = null;
  }}

  function loadTheme(themeId) {{
    if (!themeId || !VALID_THEMES.has(themeId)) return Promise.resolve(null);
    if (currentThemeId === themeId) return Promise.resolve(themeId);

    unmountCurrentTheme();
    currentThemeId = themeId;

    // Apply immediate synchronous markers on <html> (prevents flash of bass clef or background)
    document.documentElement.classList.add('holiday-active', 'theme-' + themeId);
    if (document.body) {{
      document.body.dataset.holidayTheme = themeId;
      document.body.classList.add('theme-' + themeId);
    }} else {{
      document.addEventListener('DOMContentLoaded', () => {{
        if (currentThemeId === themeId && document.body) {{
          document.body.dataset.holidayTheme = themeId;
          document.body.classList.add('theme-' + themeId);
        }}
      }}, {{ once: true }});
    }}

    // 1. Inject isolated theme stylesheet
    let link = document.getElementById('holiday-theme-css');
    if (!link) {{
      link = document.createElement('link');
      link.id = 'holiday-theme-css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }}
    link.href = '/assets/themes/' + themeId + '/theme.css';

    // 2. Fast logo replacement as soon as #bc exists in DOM
    if (!replaceLogoElement(themeId)) {{
      const observer = new MutationObserver((_, obs) => {{
        if (replaceLogoElement(themeId)) {{
          obs.disconnect();
        }}
      }});
      observer.observe(document.documentElement, {{ childList: true, subtree: true }});
      document.addEventListener('DOMContentLoaded', () => {{
        observer.disconnect();
        replaceLogoElement(themeId);
      }}, {{ once: true }});
    }}

    function runMount(mod) {{
      if (currentThemeId !== themeId) return;
      if (typeof mod.mount === 'function') {{
        currentUnmount = mod.mount({{ themeId }}) || null;
      }}
    }}

    // 3. Dynamically import theme ES module (particles, greetings, etc.)
    return import('/assets/themes/' + themeId + '/theme.js')
      .then((mod) => {{
        if (currentThemeId !== themeId) return null;
        if (document.body) {{
          runMount(mod);
        }} else {{
          document.addEventListener('DOMContentLoaded', () => runMount(mod), {{ once: true }});
        }}
        return themeId;
      }})
      .catch((err) => {{
        console.warn('Theme script for ' + themeId + ' optional or failed:', err);
        return themeId;
      }});
  }}

  // Synchronous determination in <head>
  const params = new URLSearchParams(window.location.search);
  const themeOverride = params.get('theme');
  const dateOverride = params.get('date');

  let activeTheme = null;
  if (themeOverride && VALID_THEMES.has(themeOverride)) {{
    activeTheme = themeOverride;
  }} else {{
    const simNow = dateOverride ? parseLocalDate(dateOverride) : new Date();
    activeTheme = evaluateActiveHoliday(EMBEDDED_SCHEDULE, simNow);
  }}

  if (activeTheme) {{
    loadTheme(activeTheme);
  }}

  // Boundary transition watcher for active theme or simulated date
  function startBoundaryWatcher() {{
    if (themeOverride) {{
      // Pinned via URL override ?theme=<id> - do not auto-transition or unmount
      return;
    }}
    const bootWallTime = Date.now();
    const baseSimulatedTime = dateOverride ? parseLocalDate(dateOverride) : new Date();

    const getEffectiveNow = () => {{
      const elapsed = Date.now() - bootWallTime;
      return new Date(baseSimulatedTime.getTime() + elapsed);
    }};

    if (transitionTimer) clearInterval(transitionTimer);
    transitionTimer = setInterval(() => {{
      const nextActive = evaluateActiveHoliday(EMBEDDED_SCHEDULE, getEffectiveNow());
      if (nextActive !== currentThemeId) {{
        if (nextActive) {{
          loadTheme(nextActive);
        }} else {{
          unmountCurrentTheme();
        }}
      }}
    }}, 1000);
  }}

  if (document.readyState === 'loading') {{
    document.addEventListener('DOMContentLoaded', startBoundaryWatcher);
  }} else {{
    startBoundaryWatcher();
  }}

  // Expose public helper API for testing and developer tooling
  window.SanbeijiHolidayTheme = {{
    validThemes: Array.from(VALID_THEMES),
    parseLocalDate,
    evaluateActiveHoliday,
    loadTheme,
    unmountCurrentTheme,
    getActiveTheme: () => currentThemeId
  }};
}})();
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes)")
