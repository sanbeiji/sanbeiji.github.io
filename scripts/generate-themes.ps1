# Generate All 17 Self-Hosted Holiday Theme Bundles for sanbeiji.com
# Reads UTF-8 configuration from scripts/themes-config.json and creates
# theme.css, theme.js, and logo.svg in docs/assets/themes/<id>/

$ErrorActionPreference = 'Stop'
$themesRoot = Join-Path $PSScriptRoot '..\docs\assets\themes'
$configPath = Join-Path $PSScriptRoot 'themes-config.json'

$rawJson = [System.IO.File]::ReadAllText($configPath, [System.Text.Encoding]::UTF8)
$themeConfigs = $rawJson | ConvertFrom-Json
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

foreach ($cfg in $themeConfigs) {
    $id = $cfg.id
    $dir = Join-Path $themesRoot $id
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    # 1. Write logo.svg
    $svgPath = Join-Path $dir 'logo.svg'
    [System.IO.File]::WriteAllText($svgPath, $cfg.svg, $utf8NoBom)

    # 2. Write theme.css
    $css = @"
/* Holiday Theme Stylesheet: $($cfg.label) ($id) */
:root {
  --theme-accent: $($cfg.accent);
  --theme-banner-bg: $($cfg.cardBg);
  --theme-banner-fg: $($cfg.headingColor);
  --theme-banner-border: $($cfg.cardBorder);
}

html.theme-$id,
body.theme-$id {
  background: $($cfg.bgGradient);
  background-attachment: fixed;
  color: #1c1b1f;
}

html.theme-$id #layout,
body.theme-$id #layout {
  background-color: $($cfg.cardBg);
  border: 2px solid $($cfg.cardBorder);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
}

html.theme-$id h2,
body.theme-$id h2 {
  color: $($cfg.headingColor);
}

html.theme-$id a,
body.theme-$id a {
  color: $($cfg.linkColor);
  border-bottom-color: $($cfg.linkColor);
}

html.theme-$id a:hover,
body.theme-$id a:hover {
  color: $($cfg.linkHover);
  border-bottom-color: $($cfg.linkHover);
}

html.theme-$id #quicklinks a,
body.theme-$id #quicklinks a {
  background-color: $($cfg.btnBg);
  color: #ffffff;
}

html.theme-$id #quicklinks a:hover,
body.theme-$id #quicklinks a:hover {
  background-color: $($cfg.btnHoverBg);
  color: #ffffff;
}

html.theme-$id #lessons,
body.theme-$id #lessons {
  border-color: $($cfg.cardBorder);
  background-color: rgba(255, 255, 255, 0.72);
}
"@
    $cssPath = Join-Path $dir 'theme.css'
    [System.IO.File]::WriteAllText($cssPath, $css, $utf8NoBom)

    # 3. Write theme.js
    $colorsJson = ($cfg.colors | ForEach-Object { "'$_'" }) -join ', '
    $symbolsJson = ($cfg.symbols | ForEach-Object { "'$_'" }) -join ', '
    $safeLabel = $cfg.label -replace "'", "\'"
    $safeGreeting = $cfg.greeting -replace "'", "\'"

    $js = @"
// Holiday Theme Module: $($cfg.label) ($id)
import { decorateHeader } from '../shared/header-manager.js';
import { createParticleCanvas } from '../shared/particle-canvas.js';

export function mount({ themeId }) {
  const cleanupHeader = decorateHeader({
    themeId,
    label: '$safeLabel',
    icon: '$($cfg.icon)',
    greeting: '$safeGreeting',
    logoSrc: '/assets/themes/' + themeId + '/logo.svg'
  });

  const cleanupParticles = createParticleCanvas({
    mode: '$($cfg.mode)',
    maxParticles: $($cfg.particles),
    speed: $($cfg.speed),
    colors: [$colorsJson],
    symbols: [$symbolsJson],
    cursorTrail: true
  });

  return function unmount() {
    if (cleanupParticles) cleanupParticles();
    if (cleanupHeader) cleanupHeader();
  };
}
"@
    $jsPath = Join-Path $dir 'theme.js'
    [System.IO.File]::WriteAllText($jsPath, $js, $utf8NoBom)
}

Write-Output "Successfully generated all $($themeConfigs.Count) holiday theme packages in $themesRoot"
