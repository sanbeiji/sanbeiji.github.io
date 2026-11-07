# Homepage Dynamic Holiday Theming Engine

## Problem Definition
[sanbeiji.com](https://sanbeiji.com) is a personal website and portfolio hosting interactive music, language, and coding tools. The site owner wants to celebrate 17 culturally significant, personal, and seasonal holidays by dynamically applying bespoke holiday themes to the homepage ([`docs/index.html`](file:///wsl.localhost/Ubuntu/home/joelewis/Code/sanbeiji.github.io/docs/index.html)).

The themes include visual styling (CSS color palettes, backgrounds, typography, and animated bass clef logo variants) and subtle dynamic behaviors (such as gentle falling snow, customized cursor effects, and subtle audio clips). However, client performance, low initial payload, privacy, accessibility, and resilience are critical constraints. The system must selectively load assets only during active holiday windows without incurring performance penalties on normal days, with zero runtime CDN dependencies, and with full respect for user motion and audio preferences.

---

## Guardrails

1. **Page Scope Isolation:**
   - Holiday themes must apply **strictly** to [`docs/index.html`](file:///wsl.localhost/Ubuntu/home/joelewis/Code/sanbeiji.github.io/docs/index.html).
   - Sub-apps and tools (such as `/practice/`, `/students/`, and `/lotus/`) must remain entirely unaffected.
2. **Zero Overhead on Normal Days:**
   - On non-holiday days, the core site must not load any theme CSS, theme JS, audio files, or third-party calendar libraries. The scheduling evaluator must be an ultralight script (under 2 KB gzipped).
3. **No Third-Party CDN Dependencies:**
   - All code, audio clips, styles, fonts, and images must be 100% self-hosted within the repository under [`docs/assets/themes/`](file:///wsl.localhost/Ubuntu/home/joelewis/Code/sanbeiji.github.io/docs/assets/).
4. **Strict Asset Budget:**
   - Each theme package must remain under **300 KB** total payload (including CSS, JS, images/SVG, and compressed audio).
5. **Accessibility & User Control:**
   - **Audio Autoplay:** Audio must **never** autoplay unprompted. An accessible, fixed on-screen toggle button (in the corner) must allow visitors to mute or unmute audio.
   - **Audio State Persistence:** Mute/unmute preferences must default to **muted** and persist in `localStorage` across page reloads and sessions.
   - **Reduced Motion:** If a visitor has `prefers-reduced-motion: reduce` enabled in their operating system or browser, dynamic cursor effects and particle/snow animations must be automatically disabled.
   - **Non-Obtrusive Aesthetics:** All visual effects must remain subtle, gentle, and performant (using `requestAnimationFrame` with passive event listeners and automatic garbage collection on unmount).
6. **Timezone Determinism:**
   - Holiday windows are evaluated against the visitor's **local browser timezone**.
7. **Window Span & Precedence:**
   - **Active Window:** Begins **1 day before the first day** of the holiday at `00:00:00` local time and ends **12 hours after the final day** at `12:00:00` local time.
   - **Collision Precedence:** If two holiday windows overlap (e.g., Winter Solstice and Christmas), the **later-starting holiday supersedes** the earlier active holiday at the moment its window opens.

---

## Evaluation/Verification Criteria

1. **Scheduling Engine Verification:**
   - Accurate activation for all 17 holidays across Gregorian, US floating, astronomical solar term, and Taiwanese lunar calendar types through **2050**.
   - Unit tests / automated verification scripts verifying that every holiday activates at exactly `T-1 day 00:00:00` and terminates at `T_end + 12:00:00`.
   - Correct conflict hand-off: Winter Solstice runs from Dec 20/21 until Dec 23 `00:00:00`, when Christmas immediately takes over without visual glitches.
2. **Performance & Web Vitals Impact:**
   - Zero impact on Core Web Vitals (LCP, INP, CLS) on normal days.
   - Lighthouse Performance score remains >= 98 on both normal days and active theme days.
   - No memory leaks from continuous canvas rendering or event listeners when navigating or leaving the tab.
3. **Audio & Accessibility Compliance:**
   - Audio does not play on initial load.
   - Audio toggle in the corner is keyboard-accessible (`<button>` with `aria-label` and `aria-pressed`).
   - Toggling mute updates `localStorage['sanbeiji_theme_muted']`.
   - Testing with `@media (prefers-reduced-motion: reduce)` confirms canvas/cursor animations are halted.
4. **Developer Tooling & Query Parameter Overrides:**
   - Appending `?theme=<holiday-key>` immediately activates and mounts the specified theme, bypassing the calendar check.
   - Appending `?date=YYYY-MM-DDTHH:mm:ss` simulates the exact local timestamp, enabling instant visual verification of window boundaries and transitions.

---

## Proposed Technical Plan

### 1. Holiday Catalog & Date Definitions

| Holiday Key | Holiday Name | Calendar Type | Core Holiday Date(s) | Window Starts (1 day lead, 00:00:00) | Window Ends (+12 hrs, 12:00:00) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `mlk-day` | MLK Day | Floating US | 3rd Monday in Jan | Sunday before at 00:00 | Tuesday at 12:00 | Single day |
| `lunar-new-year` | Lunar New Year | Lunar (Taiwan) | 除夕 (Eve) through 初五 | 1 day before 除夕 00:00 | 初六 at 12:00 | Multi-day (6 core days) |
| `lantern-festival` | Lantern Festival (元宵節) | Lunar | 1st Month Day 15 | 1st Month Day 14 00:00 | 1st Month Day 16 12:00 | Single day |
| `pi-day` | Pi Day | Fixed Solar | March 14 | March 13 00:00 | March 15 12:00 | Single day |
| `may-fourth` | May the 4th (Star Wars) | Fixed Solar | May 4 | May 3 00:00 | May 5 12:00 | Single day |
| `dragon-boat` | Dragon Boat Festival (端午節) | Lunar | 5th Month Day 5 | 5th Month Day 4 00:00 | 5th Month Day 6 12:00 | Single day |
| `juneteenth` | Juneteenth | Fixed Solar | June 19 | June 18 00:00 | June 20 12:00 | Single day |
| `fourth-of-july` | 4th of July | Fixed Solar | July 4 | July 3 00:00 | July 5 12:00 | Single day |
| `ghost-festival` | Ghost Festival (中元節) | Lunar | 7th Month Day 15 | 7th Month Day 14 00:00 | 7th Month Day 16 12:00 | Single day |
| `mid-autumn` | Mid-Autumn Festival (中秋節) | Lunar | 8th Month Day 15 | 8th Month Day 14 00:00 | 8th Month Day 16 12:00 | Single day |
| `double-tenth` | Double Tenth Day (國慶日) | Fixed Solar | October 10 | October 9 00:00 | October 11 12:00 | Single day |
| `halloween` | Halloween | Fixed Solar | October 31 | October 30 00:00 | November 1 12:00 | Single day |
| `thanksgiving` | Thanksgiving | Floating US | 4th Thursday in Nov through Sunday | Wednesday 00:00 | Monday 12:00 | Multi-day (4 core days) |
| `birthday` | Birthday | Fixed Solar | December 11 | December 10 00:00 | December 12 12:00 | Single day |
| `winter-solstice` | Winter Solstice (冬至) | Solar Term | Dec 21 or 22 | Dec 20/21 00:00 | Dec 22/23 12:00 (or until Christmas start) | Astronomical solar term |
| `christmas` | Christmas | Fixed Solar | December 24–25 | December 23 00:00 | December 26 12:00 | Multi-day (Eve + Day) |
| `new-years` | New Year's Eve / Day | Fixed Solar | Dec 31 – Jan 1 | December 30 00:00 | January 2 12:00 | Multi-day |

```
Execution Flow:
===============
[Page Load docs/index.html]
         │
         ▼
{URL Override Present?} ──?theme=...──► [Mount Theme directly]
         │
   (?date=... / No params)
         │
         ▼
[Evaluate Active Windows against Precomputed 2025-2050 Table]
         │
         ▼
{Any Holiday Active?} ──No──► [Exit: Default Theme, 0 extra assets]
         │
    (Yes, Active)
         │
         ▼
[Resolve Overlaps: Latest Window Start Wins]
         │
         ▼
[Dynamically Inject Theme CSS + Import theme.js module]
         │
         ▼
[Render Mute Toggle Button in Corner (localStorage)]
         │
         ▼
{prefers-reduced-motion?}
    ├── Yes ──► [Keep static styles, disable particles/canvas]
    └── No  ──► [Init subtle cursor / particle effects]
```

---

### 2. File Organization & Architecture

All theme code resides in a self-contained directory tree under [`docs/assets/themes/`](file:///wsl.localhost/Ubuntu/home/joelewis/Code/sanbeiji.github.io/docs/assets/):

```
docs/
├── assets/
│   ├── js/
│   │   ├── main.js                  # Existing site JS
│   │   ├── theme-scheduler.js       # Core loader (~2 KB): schedule table + loader logic
│   ├── css/
│   │   ├── main.css                 # Existing base CSS
│   │   ├── theme-toggle.css         # Styling for the audio toggle button
│   └── themes/                      # Dynamically loaded theme packages
│       ├── schedule.json            # Precomputed table (2025–2050)
│       ├── shared/
│       │   ├── sound-manager.js     # Shared AudioContext / HTML5 audio helper
│       │   └── particle-canvas.js   # Shared lightweight canvas runner
│       ├── christmas/
│       │   ├── theme.css            # Palette & logo overrides
│       │   ├── theme.js             # Gentle snow particle effect + audio hook
│       │   ├── logo.gif             # Holiday bass clef variant
│       │   └── audio.mp3            # Subtle audio loop/chime (< 150 KB)
│       ├── halloween/
│       │   ├── theme.css
│       │   ├── theme.js
│       │   ├── logo.gif
│       │   └── audio.mp3
│       └── ... (remaining 15 themes)
├── planning/
│   └── holiday-themes-prd.md        # This PRD and project plan
└── index.html                       # Entry point, loads only theme-scheduler.js
```

---

### 3. Precomputed Schedule Format (`schedule.json`)

To guarantee zero dependencies and zero astronomical calculations at runtime, all 17 holiday start and end dates from 2025 through 2050 are stored as a compact JSON map:

```json
{
  "2026": [
    { "id": "mlk-day", "start": "2026-01-18T00:00:00", "end": "2026-01-20T12:00:00" },
    { "id": "lunar-new-year", "start": "2026-02-15T00:00:00", "end": "2026-02-22T12:00:00" },
    { "id": "lantern-festival", "start": "2026-03-02T00:00:00", "end": "2026-03-04T12:00:00" },
    { "id": "pi-day", "start": "2026-03-13T00:00:00", "end": "2026-03-15T12:00:00" },
    { "id": "may-fourth", "start": "2026-05-03T00:00:00", "end": "2026-05-05T12:00:00" },
    { "id": "dragon-boat", "start": "2026-06-18T00:00:00", "end": "2026-06-20T12:00:00" },
    { "id": "juneteenth", "start": "2026-06-18T00:00:00", "end": "2026-06-20T12:00:00" },
    { "id": "fourth-of-july", "start": "2026-07-03T00:00:00", "end": "2026-07-05T12:00:00" },
    { "id": "ghost-festival", "start": "2026-08-26T00:00:00", "end": "2026-08-28T12:00:00" },
    { "id": "mid-autumn", "start": "2026-09-24T00:00:00", "end": "2026-09-26T12:00:00" },
    { "id": "double-tenth", "start": "2026-10-09T00:00:00", "end": "2026-10-11T12:00:00" },
    { "id": "halloween", "start": "2026-10-30T00:00:00", "end": "2026-11-01T12:00:00" },
    { "id": "thanksgiving", "start": "2026-11-25T00:00:00", "end": "2026-11-30T12:00:00" },
    { "id": "birthday", "start": "2026-12-10T00:00:00", "end": "2026-12-12T12:00:00" },
    { "id": "winter-solstice", "start": "2026-12-20T00:00:00", "end": "2026-12-23T12:00:00" },
    { "id": "christmas", "start": "2026-12-23T00:00:00", "end": "2026-12-26T12:00:00" },
    { "id": "new-years", "start": "2026-12-30T00:00:00", "end": "2027-01-02T12:00:00" }
  ]
}
```

> [!NOTE]
> The table entries are parsed into local browser time by instantiating `new Date(year, monthIndex, day, hours, minutes)`. This ensures that `2026-12-23T00:00:00` evaluates to midnight on the visitor's device, regardless of whether they are in Taiwan, Europe, or the United States.

---

### 4. Dynamic Loader & Conflict Resolution Algorithm

In [`docs/assets/js/theme-scheduler.js`](file:///wsl.localhost/Ubuntu/home/joelewis/Code/sanbeiji.github.io/docs/assets/js/):

```javascript
// Lightweight Scheduler & Dynamic Injector
(async function initHolidayThemes() {
  const params = new URLSearchParams(window.location.search);
  const themeOverride = params.get('theme');
  const dateOverride = params.get('date');

  let activeTheme = null;

  if (themeOverride) {
    activeTheme = themeOverride;
  } else {
    const now = dateOverride ? new Date(dateOverride) : new Date();
    const currentYear = now.getFullYear().toString();

    const schedule = await fetch('/assets/themes/schedule.json').then(r => r.json());
    const candidates = (schedule[currentYear] || []).filter(item => {
      const start = parseLocalDate(item.start);
      const end = parseLocalDate(item.end);
      return now >= start && now <= end;
    });

    if (candidates.length > 0) {
      // Conflict Resolution: Latest window start time wins
      candidates.sort((a, b) => parseLocalDate(b.start) - parseLocalDate(a.start));
      activeTheme = candidates[0].id;
    }
  }

  if (activeTheme) {
    loadTheme(activeTheme);
  }
})();

function parseLocalDate(isoString) {
  const [datePart, timePart] = isoString.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm, ss] = timePart.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, ss);
}

function loadTheme(themeId) {
  // 1. Inject isolated theme stylesheet
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/assets/themes/${themeId}/theme.css`;
  document.head.appendChild(link);

  // 2. Import dynamic behavior ES module
  import(`/assets/themes/${themeId}/theme.js`)
    .then(mod => {
      if (typeof mod.mount === 'function') {
        mod.mount({ themeId });
      }
    })
    .catch(err => console.warn(`Theme script for ${themeId} optional or failed:`, err));
}
```

---

### 5. Standard Theme Interface (`theme.js`)

Each individual theme implements a unified lifecycle interface:

```javascript
// Example: docs/assets/themes/christmas/theme.js
import { initSoundToggle } from '../shared/sound-manager.js';
import { createSnowCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cleanupParticles = null;
  if (!prefersReduced) {
    cleanupParticles = createSnowCanvas({ maxFlakes: 35, speed: 0.6 });
  }

  const soundCleanup = initSoundToggle({
    themeId,
    audioSrc: `/assets/themes/${themeId}/audio.mp3`
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (soundCleanup) soundCleanup();
  };
}
```

---

### 6. Sound Manager & Mute Persistence

- A fixed floating button is positioned discreetly (e.g., bottom-right or top-right corner of [`docs/index.html`](file:///wsl.localhost/Ubuntu/home/joelewis/Code/sanbeiji.github.io/docs/index.html)).
- Initial state is read from `localStorage.getItem('sanbeiji_theme_muted')`. If null, default is `'true'` (muted).
- When unmuted, the theme's short audio snippet plays at low volume (0.25 to 0.4), optionally looping gently.
- State changes immediately update `localStorage` and toggle the icon (`🔇` / `🔊`).

---

## Phased Implementation Roadmap

### Phase 1: Core Engine & Developer Preview Tooling
- Create schedule generation script (`scripts/generate-schedule.js`) using verified astronomical and Taiwan lunar calendars to generate `docs/assets/themes/schedule.json` up to 2050.
- Implement [`docs/assets/js/theme-scheduler.js`](file:///wsl.localhost/Ubuntu/home/joelewis/Code/sanbeiji.github.io/docs/assets/js/) with query parameter overrides (`?theme=` and `?date=`).
- Implement the shared audio manager (`docs/assets/themes/shared/sound-manager.js`) with `localStorage` persistence and corner button toggle.
- Add `docs/assets/themes/shared/particle-canvas.js` supporting gentle motion and reduced-motion detection.

### Phase 2: Pilot Themes (Winter Group & Verification)
Build the first three themes to rigorously test date boundaries and collision hand-off:
1. **Birthday (Dec 11):** Festive bass clef, confetti or musical note particle effect.
2. **Winter Solstice (冬至):** Tangyuan (湯圓) or warm lantern accents, subtle cold-to-warm gradient.
3. **Christmas (Dec 24–25):** Gentle snowfall, holiday bass clef, subtle chime audio.
*Verification checkpoint:* Test seamless transition from Winter Solstice to Christmas on Dec 23 at 00:00:00 using `?date=2026-12-22T23:59:50` and checking the hand-off.

### Phase 3: Taiwanese & Lunar Holidays
Implement the culturally specific Taiwanese holiday themes:
1. **Lunar New Year (Taiwan):** Red & gold palette, firecracker / spring couplet motif, celebration loop.
2. **Lantern Festival (元宵節):** Floating sky lanterns gently drifting upwards.
3. **Dragon Boat Festival (端午節):** Dragon boat waves, zongzi (粽子) motif.
4. **Ghost Festival (中元節):** Mystical twilight tones, incense/lantern floating effects.
5. **Mid-Autumn Festival (中秋節):** Full moon glow, jade rabbit motif.
6. **Double Tenth Day (國慶日):** Blue, white, and red celebratory national accents.

### Phase 4: US & Global Pop-Culture Holidays
Implement remaining seasonal themes:
1. **New Year’s Eve / Day:** Midnight sparkle, countdown accent.
2. **Pi Day (March 14):** Floating pi digits, math aesthetic.
3. **May the 4th:** Starfield parallax or subtle lightsaber hum.
4. **Halloween (Oct 31):** Ghostly bass clef, subtle floating embers.
5. **Thanksgiving:** Autumn leaves drift, warm harvest tones.
6. **MLK Day:** Dignified palette, inspiring typographic accents.
7. **Juneteenth:** Pan-African / Juneteenth colors, celebratory star motif.
8. **4th of July:** Subtle distant firework sparkles.

### Phase 5: Verification, Asset Compression & Documentation
- Compress all audio assets using ffmpeg (WebM/Opus and MP3 <= 96 kbps) to ensure each theme remains well under the 300 KB budget.
- Run Lighthouse audits on all 17 themes via `?theme=<id>` to guarantee 98+ scores and zero layout shifts.
- Document testing URLs and maintenance instructions in `README.md`.
