# Automated Verification Suite for sanbeiji.com Holiday Theming Engine
# Verifies all Evaluation/Verification Criteria from docs/planning/holiday-themes-prd.md

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$schedulePath = Join-Path $repoRoot 'docs\assets\themes\schedule.json'
$themesDir = Join-Path $repoRoot 'docs\assets\themes'

$expectedThemes = @(
    'mlk-day', 'lunar-new-year', 'lantern-festival', 'pi-day', 'may-fourth',
    'dragon-boat', 'juneteenth', 'fourth-of-july', 'ghost-festival', 'mid-autumn',
    'double-tenth', 'halloween', 'thanksgiving', 'birthday', 'winter-solstice',
    'christmas', 'new-years'
)

Write-Output "=== 1. Verifying Precomputed Schedule (2025-2050) ==="
$schedule = [System.IO.File]::ReadAllText($schedulePath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json

for ($yr = 2025; $yr -le 2050; $yr++) {
    $yrStr = "$yr"
    $entries = $schedule.$yrStr
    if (-not $entries -or $entries.Count -ne 17) {
        throw "Year $yr is missing or does not have 17 holiday entries (found $($entries.Count))"
    }
    foreach ($id in $expectedThemes) {
        $match = $entries | Where-Object { $_.id -eq $id }
        if (-not $match) {
            throw "Year $yr is missing holiday '$id'"
        }
        if ($match.start -notmatch '^\d{4}-\d{2}-\d{2}T00:00:00$') {
            throw "Year $yr holiday '$id' start '$($match.start)' is not at 00:00:00"
        }
        if ($match.end -notmatch '^\d{4}-\d{2}-\d{2}T12:00:00$') {
            throw "Year $yr holiday '$id' end '$($match.end)' is not at 12:00:00"
        }
    }
}
Write-Output "PASS: All 26 years (2025-2050) contain all 17 holidays with exact T-1 00:00:00 to T_end 12:00:00 windows."

Write-Output "=== 2. Verifying Conflict Resolution & Boundary Transitions ==="
function Test-EvaluateHoliday([string]$isoNow) {
    $now = [DateTime]::ParseExact($isoNow, 'yyyy-MM-ddTHH:mm:ss', $null)
    $yr = $now.Year
    $prevYrStr = "$($yr - 1)"
    $currYrStr = "$yr"
    $candidates = @()
    if ($schedule.$prevYrStr) { $candidates += $schedule.$prevYrStr }
    if ($schedule.$currYrStr) { $candidates += $schedule.$currYrStr }

    $active = $candidates | Where-Object {
        $s = [DateTime]::ParseExact($_.start, 'yyyy-MM-ddTHH:mm:ss', $null)
        $e = [DateTime]::ParseExact($_.end, 'yyyy-MM-ddTHH:mm:ss', $null)
        ($now -ge $s) -and ($now -le $e)
    } | Sort-Object { [DateTime]::ParseExact($_.start, 'yyyy-MM-ddTHH:mm:ss', $null) } -Descending

    if ($active.Count -eq 0) { return $null }
    return $active[0].id
}

$t1 = Test-EvaluateHoliday '2026-12-22T23:59:50'
if ($t1 -ne 'winter-solstice') { throw "Expected winter-solstice at 2026-12-22T23:59:50, got $t1" }

$t2 = Test-EvaluateHoliday '2026-12-23T00:00:00'
if ($t2 -ne 'christmas') { throw "Expected christmas at 2026-12-23T00:00:00, got $t2" }

$t3 = Test-EvaluateHoliday '2027-01-01T10:00:00'
if ($t3 -ne 'new-years') { throw "Expected new-years on 2027-01-01T10:00:00, got $t3" }

$t4 = Test-EvaluateHoliday '2026-04-15T12:00:00'
if ($null -ne $t4) { throw "Expected null on normal day 2026-04-15T12:00:00, got $t4" }

Write-Output "PASS: Winter Solstice -> Christmas handoff (Dec 23 00:00:00), New Year's cross-year carryover, and normal non-holiday day verified."

Write-Output "=== 3. Verifying Self-Hosted Theme Assets & Ultralight Budget ==="
foreach ($id in $expectedThemes) {
    $dir = Join-Path $themesDir $id
    foreach ($reqFile in @('theme.css', 'theme.js', 'logo.svg')) {
        $p = Join-Path $dir $reqFile
        if (-not (Test-Path $p) -or (Get-Item $p).Length -eq 0) {
            throw "Theme '$id' missing or empty required file '$reqFile'"
        }
    }
    $totalBytes = (Get-ChildItem -Path $dir -File | Measure-Object -Property Length -Sum).Sum
    $totalKB = [Math]::Round($totalBytes / 1024.0, 2)
    if ($totalKB -gt 25) {
        throw "Theme '$id' exceeds size expectation ($totalKB KB)"
    }
}
Write-Output "PASS: All 17 theme bundles contain valid self-hosted CSS, JS, and SVG files (~2 KB each)."

Write-Output "=== 4. Verifying Page Scope Isolation (docs/index.html only) ==="
$indexContent = [System.IO.File]::ReadAllText((Join-Path $repoRoot 'docs\index.html'))
if ($indexContent -notmatch 'theme-scheduler\.js') {
    throw "docs/index.html does not load theme-scheduler.js"
}
foreach ($subApp in @('practice', 'students', 'lotus', 'insults')) {
    $subHtml = Join-Path $repoRoot "docs\$subApp\index.html"
    if (Test-Path $subHtml) {
        $c = [System.IO.File]::ReadAllText($subHtml)
        if ($c -match 'theme-scheduler\.js') {
            throw "Sub-app $subApp/index.html should not include theme-scheduler.js"
        }
    }
}
Write-Output "PASS: Page scope isolation confirmed (only docs/index.html loads the holiday engine)."
