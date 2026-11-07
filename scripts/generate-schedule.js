#!/usr/bin/env node
/**
 * Generate Precomputed Holiday Schedule (2025-2050) for sanbeiji.com
 * Uses Node's built-in Intl Chinese/Taiwanese lunisolar calendar and Jean Meeus's
 * astronomical algorithm for Winter Solstice (冬至).
 * Zero external npm dependencies required.
 */

const fs = require('fs');
const path = require('path');

const chineseFormatter = new Intl.DateTimeFormat('zh-TW-u-ca-chinese', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
});

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatLocalIso(year, month, day, hour = 0, minute = 0, second = 0) {
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

function addDays(dateObj, days) {
  const d = new Date(dateObj.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function formatDateWithOffset(baseDateUtc, dayOffset, hour = 0) {
  const d = addDays(baseDateUtc, dayOffset);
  return formatLocalIso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), hour, 0, 0);
}

function getLunarParts(utcDate) {
  const parts = chineseFormatter.formatToParts(utcDate);
  let monthStr = '';
  let day = 0;
  for (const p of parts) {
    if (p.type === 'month') monthStr = p.value;
    if (p.type === 'day') day = parseInt(p.value, 10);
  }
  const isLeap = monthStr.includes('閏') || monthStr.includes('bis');
  const month = parseInt(monthStr.replace(/[^\d]/g, ''), 10);
  return { month, day, isLeap };
}

function findLunarDateInYear(gregorianYear, targetMonth, targetDay) {
  const start = new Date(Date.UTC(gregorianYear, 0, 1, 12, 0, 0));
  for (let i = 0; i < 385; i++) {
    const cur = addDays(start, i);
    const { month, day, isLeap } = getLunarParts(cur);
    if (!isLeap && month === targetMonth && day === targetDay) {
      return cur;
    }
  }
  throw new Error(`Could not find lunar ${targetMonth}/${targetDay} in ${gregorianYear}`);
}

function getNthWeekdayOfMonth(year, month1Based, weekday0Sun, n) {
  let d = new Date(Date.UTC(year, month1Based - 1, 1, 12, 0, 0));
  while (d.getUTCDay() !== weekday0Sun) {
    d = addDays(d, 1);
  }
  return addDays(d, 7 * (n - 1));
}

function getWinterSolsticeWindow(year) {
  const t = (year - 2000.0) / 1000.0;
  const jde =
    2451900.05952 +
    365242.74049 * t -
    0.06223 * t * t -
    0.00823 * Math.pow(t, 3) +
    0.00032 * Math.pow(t, 4);
  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const utcMs = j2000 + (jde - 2451545.0) * 86400000;
  const utcDate = new Date(utcMs);
  const tpeDate = new Date(utcMs + 8 * 3600000);
  const firstDay = new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), 12, 0, 0));
  const lastDay = new Date(Date.UTC(tpeDate.getUTCFullYear(), tpeDate.getUTCMonth(), tpeDate.getUTCDate(), 12, 0, 0));
  return {
    start: formatDateWithOffset(firstDay, -1, 0),
    end: formatDateWithOffset(lastDay, 1, 12)
  };
}

function generateSchedule() {
  const lines = ['{'];
  for (let year = 2025; year <= 2050; year++) {
    const mlk = getNthWeekdayOfMonth(year, 1, 1, 3);
    const lny1 = findLunarDateInYear(year, 1, 1);
    const chuxi = addDays(lny1, -1);
    const chu5 = addDays(lny1, 4);
    const lantern = findLunarDateInYear(year, 1, 15);
    const piDay = new Date(Date.UTC(year, 2, 14, 12, 0, 0));
    const may4 = new Date(Date.UTC(year, 4, 4, 12, 0, 0));
    const dragon = findLunarDateInYear(year, 5, 5);
    const juneteenth = new Date(Date.UTC(year, 5, 19, 12, 0, 0));
    const july4 = new Date(Date.UTC(year, 6, 4, 12, 0, 0));
    const ghost = findLunarDateInYear(year, 7, 15);
    const midAutumn = findLunarDateInYear(year, 8, 15);
    const doubleTenth = new Date(Date.UTC(year, 9, 10, 12, 0, 0));
    const halloween = new Date(Date.UTC(year, 9, 31, 12, 0, 0));
    const tgThu = getNthWeekdayOfMonth(year, 11, 4, 4);
    const tgSun = addDays(tgThu, 3);
    const birthday = new Date(Date.UTC(year, 11, 11, 12, 0, 0));
    const ws = getWinterSolsticeWindow(year);

    const events = [
      { id: 'mlk-day', start: formatDateWithOffset(mlk, -1, 0), end: formatDateWithOffset(mlk, 1, 12) },
      { id: 'lunar-new-year', start: formatDateWithOffset(chuxi, -1, 0), end: formatDateWithOffset(chu5, 1, 12) },
      { id: 'lantern-festival', start: formatDateWithOffset(lantern, -1, 0), end: formatDateWithOffset(lantern, 1, 12) },
      { id: 'pi-day', start: formatDateWithOffset(piDay, -1, 0), end: formatDateWithOffset(piDay, 1, 12) },
      { id: 'may-fourth', start: formatDateWithOffset(may4, -1, 0), end: formatDateWithOffset(may4, 1, 12) },
      { id: 'dragon-boat', start: formatDateWithOffset(dragon, -1, 0), end: formatDateWithOffset(dragon, 1, 12) },
      { id: 'juneteenth', start: formatDateWithOffset(juneteenth, -1, 0), end: formatDateWithOffset(juneteenth, 1, 12) },
      { id: 'fourth-of-july', start: formatDateWithOffset(july4, -1, 0), end: formatDateWithOffset(july4, 1, 12) },
      { id: 'ghost-festival', start: formatDateWithOffset(ghost, -1, 0), end: formatDateWithOffset(ghost, 1, 12) },
      { id: 'mid-autumn', start: formatDateWithOffset(midAutumn, -1, 0), end: formatDateWithOffset(midAutumn, 1, 12) },
      { id: 'double-tenth', start: formatDateWithOffset(doubleTenth, -1, 0), end: formatDateWithOffset(doubleTenth, 1, 12) },
      { id: 'halloween', start: formatDateWithOffset(halloween, -1, 0), end: formatDateWithOffset(halloween, 1, 12) },
      { id: 'thanksgiving', start: formatDateWithOffset(tgThu, -1, 0), end: formatDateWithOffset(tgSun, 1, 12) },
      { id: 'birthday', start: formatDateWithOffset(birthday, -1, 0), end: formatDateWithOffset(birthday, 1, 12) },
      { id: 'winter-solstice', start: ws.start, end: ws.end },
      { id: 'christmas', start: `${year}-12-23T00:00:00`, end: `${year}-12-26T12:00:00` },
      { id: 'new-years', start: `${year}-12-30T00:00:00`, end: `${year + 1}-01-02T12:00:00` }
    ];

    lines.push(`  "${year}": [`);
    events.forEach((ev, idx) => {
      const comma = idx < events.length - 1 ? ',' : '';
      lines.push(`    { "id": "${ev.id}", "start": "${ev.start}", "end": "${ev.end}" }${comma}`);
    });
    lines.push(`  ]${year < 2050 ? ',' : ''}`);
  }
  lines.push('}');
  const outPath = path.join(__dirname, '..', 'docs', 'assets', 'themes', 'schedule.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`Generated ${outPath}`);
}

generateSchedule();
