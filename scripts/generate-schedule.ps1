# Generate Precomputed Holiday Schedule (2025-2050) for sanbeiji.com
# Uses .NET System.Globalization.TaiwanLunisolarCalendar for exact Taiwanese lunar dates
# and Jean Meeus's astronomical algorithm for Winter Solstice (solar term 冬至).
# Generates schedule.json and builds docs/assets/js/theme-scheduler.js via python.

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

# 2. Rebuild theme-scheduler.js via python builder
$buildScript = Join-Path $PSScriptRoot 'build-scheduler.py'
if (Get-Command python3 -ErrorAction SilentlyContinue) {
    & python3 $buildScript
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    & python $buildScript
}
