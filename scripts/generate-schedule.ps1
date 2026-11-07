# Generate Precomputed Holiday Schedule (2025-2050) for sanbeiji.com
# Uses .NET System.Globalization.TaiwanLunisolarCalendar for exact Taiwanese lunar dates
# and Jean Meeus's astronomical algorithm for Winter Solstice (solar term 冬至).
# Generates both docs/assets/themes/schedule.json and embeds into docs/assets/js/theme-scheduler.js.

$ErrorActionPreference = 'Stop'
$cal = New-Object System.Globalization.TaiwanLunisolarCalendar

function Format-LocalIso([DateTime]$dt) {
    return $dt.ToString('yyyy-MM-ddTHH:mm:ss')
}

function Get-LunarDate([int]$gregorianYear, [int]$lunarMonth, [int]$lunarDay) {
    $rocYear = $gregorianYear - 1911
    $leapMonth = $cal.GetLeapMonth($rocYear)
    $actualMonth = $lunarMonth
    if ($leapMonth -gt 0 -and $lunarMonth -ge $leapMonth) {
        $actualMonth = $lunarMonth + 1
    }
    return $cal.ToDateTime($rocYear, $actualMonth, $lunarDay, 0, 0, 0, 0)
}

function Get-NthWeekdayOfMonth([int]$year, [int]$month, [System.DayOfWeek]$dayOfWeek, [int]$n) {
    $dt = [DateTime]::new($year, $month, 1, 0, 0, 0)
    while ($dt.DayOfWeek -ne $dayOfWeek) {
        $dt = $dt.AddDays(1)
    }
    return $dt.AddDays(7 * ($n - 1))
}

function Get-WinterSolsticeWindow([int]$year) {
    $t = ($year - 2000.0) / 1000.0
    $jde = 2451900.05952 + 365242.74049 * $t - 0.06223 * $t * $t - 0.00823 * [Math]::Pow($t, 3) + 0.00032 * [Math]::Pow($t, 4)
    $utc = ([DateTime]::new(2000, 1, 1, 12, 0, 0, [DateTimeKind]::Utc)).AddDays($jde - 2451545.0)
    $tpe = $utc.AddHours(8)
    $firstDay = $utc.Date
    $lastDay = $tpe.Date
    return @{
        start = Format-LocalIso ($firstDay.AddDays(-1))
        end   = Format-LocalIso ($lastDay.AddDays(1).AddHours(12))
    }
}

$scheduleObj = [ordered]@{}

for ($year = 2025; $year -le 2050; $year++) {
    $events = New-Object System.Collections.Generic.List[object]

    # 1. MLK Day (3rd Monday in January)
    $mlk = Get-NthWeekdayOfMonth $year 1 ([System.DayOfWeek]::Monday) 3
    $events.Add(@{ id = 'mlk-day'; start = Format-LocalIso ($mlk.AddDays(-1)); end = Format-LocalIso ($mlk.AddDays(1).AddHours(12)) })

    # 2. Lunar New Year (Taiwan: Lunar New Year's Eve 除夕 through 初五)
    $lnyDay1 = Get-LunarDate $year 1 1
    $chuxi = $lnyDay1.AddDays(-1)
    $chu5  = $lnyDay1.AddDays(4)
    $events.Add(@{ id = 'lunar-new-year'; start = Format-LocalIso ($chuxi.AddDays(-1)); end = Format-LocalIso ($chu5.AddDays(1).AddHours(12)) })

    # 3. Lantern Festival (元宵節: 1st Lunar Month Day 15)
    $lantern = Get-LunarDate $year 1 15
    $events.Add(@{ id = 'lantern-festival'; start = Format-LocalIso ($lantern.AddDays(-1)); end = Format-LocalIso ($lantern.AddDays(1).AddHours(12)) })

    # 4. Pi Day (March 14)
    $piDay = [DateTime]::new($year, 3, 14, 0, 0, 0)
    $events.Add(@{ id = 'pi-day'; start = Format-LocalIso ($piDay.AddDays(-1)); end = Format-LocalIso ($piDay.AddDays(1).AddHours(12)) })

    # 5. May the 4th (May 4)
    $may4 = [DateTime]::new($year, 5, 4, 0, 0, 0)
    $events.Add(@{ id = 'may-fourth'; start = Format-LocalIso ($may4.AddDays(-1)); end = Format-LocalIso ($may4.AddDays(1).AddHours(12)) })

    # 6. Dragon Boat Festival (端午節: 5th Lunar Month Day 5)
    $dragonBoat = Get-LunarDate $year 5 5
    $events.Add(@{ id = 'dragon-boat'; start = Format-LocalIso ($dragonBoat.AddDays(-1)); end = Format-LocalIso ($dragonBoat.AddDays(1).AddHours(12)) })

    # 7. Juneteenth (June 19)
    $juneteenth = [DateTime]::new($year, 6, 19, 0, 0, 0)
    $events.Add(@{ id = 'juneteenth'; start = Format-LocalIso ($juneteenth.AddDays(-1)); end = Format-LocalIso ($juneteenth.AddDays(1).AddHours(12)) })

    # 8. 4th of July (July 4)
    $july4 = [DateTime]::new($year, 7, 4, 0, 0, 0)
    $events.Add(@{ id = 'fourth-of-july'; start = Format-LocalIso ($july4.AddDays(-1)); end = Format-LocalIso ($july4.AddDays(1).AddHours(12)) })

    # 9. Ghost Festival (中元節: 7th Lunar Month Day 15)
    $ghost = Get-LunarDate $year 7 15
    $events.Add(@{ id = 'ghost-festival'; start = Format-LocalIso ($ghost.AddDays(-1)); end = Format-LocalIso ($ghost.AddDays(1).AddHours(12)) })

    # 10. Mid-Autumn Festival (中秋節: 8th Lunar Month Day 15)
    $midAutumn = Get-LunarDate $year 8 15
    $events.Add(@{ id = 'mid-autumn'; start = Format-LocalIso ($midAutumn.AddDays(-1)); end = Format-LocalIso ($midAutumn.AddDays(1).AddHours(12)) })

    # 11. Double Tenth Day (國慶日: October 10)
    $doubleTenth = [DateTime]::new($year, 10, 10, 0, 0, 0)
    $events.Add(@{ id = 'double-tenth'; start = Format-LocalIso ($doubleTenth.AddDays(-1)); end = Format-LocalIso ($doubleTenth.AddDays(1).AddHours(12)) })

    # 12. Halloween (October 31)
    $halloween = [DateTime]::new($year, 10, 31, 0, 0, 0)
    $events.Add(@{ id = 'halloween'; start = Format-LocalIso ($halloween.AddDays(-1)); end = Format-LocalIso ($halloween.AddDays(1).AddHours(12)) })

    # 13. Thanksgiving (4th Thursday of November through Sunday)
    $tgThu = Get-NthWeekdayOfMonth $year 11 ([System.DayOfWeek]::Thursday) 4
    $tgSun = $tgThu.AddDays(3)
    $events.Add(@{ id = 'thanksgiving'; start = Format-LocalIso ($tgThu.AddDays(-1)); end = Format-LocalIso ($tgSun.AddDays(1).AddHours(12)) })

    # 14. Birthday (December 11)
    $bday = [DateTime]::new($year, 12, 11, 0, 0, 0)
    $events.Add(@{ id = 'birthday'; start = Format-LocalIso ($bday.AddDays(-1)); end = Format-LocalIso ($bday.AddDays(1).AddHours(12)) })

    # 15. Winter Solstice (冬至: ~Dec 21-22)
    $ws = Get-WinterSolsticeWindow $year
    $events.Add(@{ id = 'winter-solstice'; start = $ws.start; end = $ws.end })

    # 16. Christmas (December 24-25)
    $xmasStart = [DateTime]::new($year, 12, 23, 0, 0, 0)
    $xmasEnd   = [DateTime]::new($year, 12, 26, 12, 0, 0)
    $events.Add(@{ id = 'christmas'; start = Format-LocalIso $xmasStart; end = Format-LocalIso $xmasEnd })

    # 17. New Year's Eve / New Year's Day (Dec 31 - Jan 1)
    $nyStart = [DateTime]::new($year, 12, 30, 0, 0, 0)
    $nyEnd   = [DateTime]::new($year + 1, 1, 2, 12, 0, 0)
    $events.Add(@{ id = 'new-years'; start = Format-LocalIso $nyStart; end = Format-LocalIso $nyEnd })

    $scheduleObj["$year"] = $events
}

# 1. Output schedule.json
$outThemesDir = Join-Path $PSScriptRoot '..\docs\assets\themes'
if (-not (Test-Path $outThemesDir)) {
    New-Item -ItemType Directory -Path $outThemesDir -Force | Out-Null
}
$outFileJson = Join-Path $outThemesDir 'schedule.json'
$compactJson = $scheduleObj | ConvertTo-Json -Compress -Depth 5
[System.IO.File]::WriteAllText($outFileJson, $compactJson, [System.Text.UTF8Encoding]::new($false))
Write-Output "Generated schedule.json for 2025-2050 ($((Get-Item $outFileJson).Length) bytes)"

# 2. Output theme-scheduler.js with embedded schedule for 0ms synchronous evaluation
$schedulerJsPath = Join-Path $PSScriptRoot '..\docs\assets\js\theme-scheduler.js'
$schedulerTemplate = @"
// Lightweight Holiday Theme Scheduler & Dynamic Loader for sanbeiji.com
// Zero dependencies, zero extra assets loaded on normal non-holiday days.
// Precomputed schedule embedded for 0ms synchronous evaluation (zero flash of bass clef).
// Supports ?theme=<id> and ?date=<YYYY-MM-DD[THH:mm:ss]> overrides.

(function () {
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

  const EMBEDDED_SCHEDULE = $compactJson;

  let currentThemeId = null;
  let currentUnmount = null;
  let transitionTimer = null;

  function parseLocalDate(isoString) {
    if (!isoString || typeof isoString !== 'string') return new Date(NaN);
    const trimmed = isoString.trim();
    const [datePart, timePart] = trimmed.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    if (!y || !m || !d) return new Date(isoString);
    if (!timePart) {
      return new Date(y, m - 1, d, 12, 0, 0);
    }
    const cleanTime = timePart.replace(/Z|[+-]\d{2}:?\d{2}$/, '');
    const parts = cleanTime.split(':').map(Number);
    return new Date(y, m - 1, d, parts[0] || 0, parts[1] || 0, parts[2] || 0);
  }

  function evaluateActiveHoliday(schedule, nowDate) {
    if (!schedule || !(nowDate instanceof Date) || isNaN(nowDate.getTime())) {
      return null;
    }
    const yr = nowDate.getFullYear();
    const yearEntries = [
      ...(schedule[String(yr - 1)] || []),
      ...(schedule[String(yr)] || [])
    ];

    const candidates = yearEntries.filter((item) => {
      const start = parseLocalDate(item.start);
      const end = parseLocalDate(item.end);
      return nowDate >= start && nowDate <= end;
    });

    if (candidates.length === 0) return null;

    // Conflict Resolution: Latest window start time wins
    candidates.sort((a, b) => parseLocalDate(b.start) - parseLocalDate(a.start));
    return candidates[0].id;
  }

  function replaceLogoElement(themeId) {
    const bc = document.getElementById('bc');
    if (!bc) return false;
    const logoLink = bc.querySelector('a.logo');
    if (!logoLink) return false;
    const img = logoLink.querySelector('img');
    if (!img) return false;

    if (!img.dataset.origSrc) {
      img.dataset.origSrc = img.getAttribute('src') || '/assets/img/bassclef.gif';
      img.dataset.origAlt = img.getAttribute('alt') || 'bass clef logo';
      img.dataset.origTitle = logoLink.getAttribute('title') || '';
    }

    img.src = `/assets/themes/` + themeId + `/logo.svg`;
    img.alt = `${themeId} logo`;
    img.className = 'holiday-logo-icon';
    img.classList.remove('anim');
    void img.offsetWidth;
    img.classList.add('anim');
    return true;
  }

  function restoreLogoElement() {
    const bc = document.getElementById('bc');
    if (!bc) return;
    const logoLink = bc.querySelector('a.logo');
    if (!logoLink) return;
    const img = logoLink.querySelector('img');
    if (!img) return;

    if (img.dataset.origSrc) {
      img.src = img.dataset.origSrc;
      img.alt = img.dataset.origAlt || 'bass clef logo';
      img.className = 'anim';
    }
    if (img.dataset.origTitle) {
      logoLink.setAttribute('title', img.dataset.origTitle);
    }
  }

  function unmountCurrentTheme() {
    if (typeof currentUnmount === 'function') {
      try {
        currentUnmount();
      } catch (e) {
        console.warn('Error unmounting theme:', e);
      }
      currentUnmount = null;
    }
    const existingCss = document.getElementById('holiday-theme-css');
    if (existingCss && existingCss.parentNode) {
      existingCss.parentNode.removeChild(existingCss);
    }
    if (currentThemeId) {
      document.documentElement.classList.remove('holiday-active', `theme-` + currentThemeId);
      if (document.body) {
        document.body.classList.remove(`theme-` + currentThemeId);
        delete document.body.dataset.holidayTheme;
      }
      restoreLogoElement();
    }
    currentThemeId = null;
  }

  function loadTheme(themeId) {
    if (!themeId || !VALID_THEMES.has(themeId)) return Promise.resolve(null);
    if (currentThemeId === themeId) return Promise.resolve(themeId);

    unmountCurrentTheme();
    currentThemeId = themeId;

    // Apply immediate synchronous markers on <html> (prevents flash of bass clef or background)
    document.documentElement.classList.add('holiday-active', `theme-` + themeId);
    if (document.body) {
      document.body.dataset.holidayTheme = themeId;
      document.body.classList.add(`theme-` + themeId);
    }

    // 1. Inject isolated theme stylesheet
    let link = document.getElementById('holiday-theme-css');
    if (!link) {
      link = document.createElement('link');
      link.id = 'holiday-theme-css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `/assets/themes/` + themeId + `/theme.css`;

    // 2. Fast logo replacement as soon as #bc exists in DOM
    if (!replaceLogoElement(themeId)) {
      const observer = new MutationObserver((_, obs) => {
        if (replaceLogoElement(themeId)) {
          obs.disconnect();
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      document.addEventListener('DOMContentLoaded', () => observer.disconnect(), { once: true });
    }

    // 3. Dynamically import theme ES module (particles, greetings, etc.)
    return import(`/assets/themes/` + themeId + `/theme.js`)
      .then((mod) => {
        if (currentThemeId !== themeId) return null;
        if (typeof mod.mount === 'function') {
          currentUnmount = mod.mount({ themeId }) || null;
        }
        return themeId;
      })
      .catch((err) => {
        console.warn(`Theme script for ` + themeId + ` optional or failed:`, err);
        return themeId;
      });
  }

  // Synchronous determination in <head>
  const params = new URLSearchParams(window.location.search);
  const themeOverride = params.get('theme');
  const dateOverride = params.get('date');

  let activeTheme = null;
  if (themeOverride && VALID_THEMES.has(themeOverride)) {
    activeTheme = themeOverride;
  } else {
    const simNow = dateOverride ? parseLocalDate(dateOverride) : new Date();
    activeTheme = evaluateActiveHoliday(EMBEDDED_SCHEDULE, simNow);
  }

  if (activeTheme) {
    loadTheme(activeTheme);
  }

  // Boundary transition watcher for active theme or simulated date
  function startBoundaryWatcher() {
    if (!dateOverride && !activeTheme) return;
    const bootWallTime = Date.now();
    const baseSimulatedTime = dateOverride ? parseLocalDate(dateOverride) : new Date();

    const getEffectiveNow = () => {
      const elapsed = Date.now() - bootWallTime;
      return new Date(baseSimulatedTime.getTime() + elapsed);
    };

    if (transitionTimer) clearInterval(transitionTimer);
    transitionTimer = setInterval(() => {
      const nextActive = evaluateActiveHoliday(EMBEDDED_SCHEDULE, getEffectiveNow());
      if (nextActive !== currentThemeId) {
        if (nextActive) {
          loadTheme(nextActive);
        } else {
          unmountCurrentTheme();
        }
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startBoundaryWatcher);
  } else {
    startBoundaryWatcher();
  }

  // Expose public helper API for testing and developer tooling
  window.SanbeijiHolidayTheme = {
    validThemes: Array.from(VALID_THEMES),
    parseLocalDate,
    evaluateActiveHoliday,
    loadTheme,
    unmountCurrentTheme,
    getActiveTheme: () => currentThemeId
  };
})();
"@

[System.IO.File]::WriteAllText($schedulerJsPath, $schedulerTemplate, [System.Text.UTF8Encoding]::new($false))
Write-Output "Generated theme-scheduler.js with embedded schedule ($((Get-Item $schedulerJsPath).Length) bytes)"
