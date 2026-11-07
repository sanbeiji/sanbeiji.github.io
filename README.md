# sanbeiji.com

This repository hosts my personal website, [sanbeiji.com](https://sanbeiji.com), where I occasionally publish code tools and experiments.

## Site Features & Tools

- **[Lotus Pond Reader](https://sanbeiji.com/lotus/)**: A tool to help you learn to read Taiwanese Mandarin by generating short stories, with customizable difficulty levels and text-to-speech pronunciation assistance. Includes a web app and a native Android app.
- **[Practice App](https://sanbeiji.com/practice/)**: My personal double bass practice routine generator and checklist. Features a weighted randomization algorithm for selecting random orchestral excerpts and other exercises, customizable practice pools, and `localStorage` persistence. Checklist resets daily.
- **[Student Practice App](https://sanbeiji.com/students/)**: A shareable, dynamic practice checklist for my double bass students. Allows creating custom task lists and tracking session durations, and provides a shareable URL to load the checklist on any device.
- **[Shakespearean Insult Generator](https://sanbeiji.com/insults/)**: A fun, animated web app that generates random Shakespeare-style insults.
- **[Flexbox Experiments](https://sanbeiji.com/experiments/flexbox/)**: Code experiments and visualizers for Android FlexBox API layouts.

## Homepage Holiday Theming Engine

The homepage (`docs/index.html`) includes a lightweight, zero-dependency holiday theming engine (`docs/assets/js/theme-scheduler.js`) that selectively loads custom CSS palettes, SVG emblems, and gentle canvas particle/cursor animations for 17 holidays using a precomputed schedule (`docs/assets/themes/schedule.json`, covering 2025–2050).

- **Active Window:** 1 day before the first day of the holiday (`00:00:00` local browser time) through 12 hours after the final day (`12:00:00` local browser time).
- **Precedence:** If two holiday windows overlap (such as Winter Solstice and Christmas), the later-starting holiday supersedes the earlier active holiday.
- **Accessibility:** Strictly respects `prefers-reduced-motion: reduce` by disabling canvas animations and transitions. All theme packages are self-hosted with zero external CDN dependencies (~2 KB per theme).

### Previewing & Testing Themes

Append `?theme=<id>` or `?date=<YYYY-MM-DDTHH:mm:ss>` to the homepage URL:

- **Force a specific theme (`?theme=<id>`):**
  `mlk-day`, `lunar-new-year`, `lantern-festival`, `pi-day`, `may-fourth`, `dragon-boat`, `juneteenth`, `fourth-of-july`, `ghost-festival`, `mid-autumn`, `double-tenth`, `halloween`, `thanksgiving`, `birthday`, `winter-solstice`, `christmas`, `new-years`
- **Simulate a date/time (`?date=<timestamp>`):**
  - Winter Solstice into Christmas hand-off: `?date=2026-12-22T23:59:50`
  - Lunar New Year: `?date=2026-02-17T12:00:00`

### Maintenance Scripts

- Regenerate `schedule.json` (2025–2050): `powershell -ExecutionPolicy Bypass -File .\scripts\generate-schedule.ps1` (or `node scripts/generate-schedule.js`)
- Regenerate theme bundles: `powershell -ExecutionPolicy Bypass -File .\scripts\generate-themes.ps1`
- Run automated verification suite: `powershell -ExecutionPolicy Bypass -File .\scripts\verify-holiday-themes.ps1`