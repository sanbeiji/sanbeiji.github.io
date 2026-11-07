import json
import os

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config_path = os.path.join(repo_root, "scripts", "themes-config.json")

with open(config_path, "r", encoding="utf-8") as f:
    themes = json.load(f)

# 1. New Year's Eve/Day: Hourglass icon + champagne, baby, tada floaters
new_years_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="36" fill="#0b0c10" stroke="#ffd700" stroke-width="3"/>
  <rect x="23" y="16" width="34" height="5" rx="2" fill="#d4af37" stroke="#fff8e1" stroke-width="1"/>
  <rect x="23" y="59" width="34" height="5" rx="2" fill="#d4af37" stroke="#fff8e1" stroke-width="1"/>
  <line x1="26" y1="21" x2="26" y2="59" stroke="#b8860b" stroke-width="2" stroke-linecap="round"/>
  <line x1="54" y1="21" x2="54" y2="59" stroke="#b8860b" stroke-width="2" stroke-linecap="round"/>
  <path d="M 28 21 L 52 21 C 52 32, 44 37, 41 40 C 44 43, 52 48, 52 59 L 28 59 C 28 48, 36 43, 39 40 C 36 37, 28 32, 28 21 Z" fill="rgba(255, 255, 255, 0.12)" stroke="#e0e0e0" stroke-width="1.8"/>
  <path d="M 30 23 L 50 23 C 50 31, 45 35, 40 37 C 35 35, 30 31, 30 23 Z" fill="#ffd700"/>
  <line x1="40" y1="37" x2="40" y2="52" stroke="#ffd700" stroke-width="1.8" stroke-dasharray="2 1"/>
  <path d="M 32 58 C 34 52, 46 52, 48 58 Z" fill="#ffd700"/>
  <path d="M 31 25 C 31 30, 34 34, 37 36" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
  <circle cx="56" cy="27" r="1.8" fill="#ffd700"/>
  <circle cx="23" cy="52" r="1.5" fill="#ffd700"/>
</svg>"""

# 2. Thanksgiving: Roasted turkey on platter with pumpkin pie
thanksgiving_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="36" fill="#3e1f0d" stroke="#ffb300" stroke-width="3"/>
  <!-- Silver Platter -->
  <ellipse cx="36" cy="56" rx="26" ry="8" fill="#cfd8dc" stroke="#90a4ae" stroke-width="1.5"/>
  <ellipse cx="36" cy="55" rx="22" ry="6" fill="#eceff1"/>
  <!-- Garnishes on Platter -->
  <circle cx="16" cy="54" r="2.5" fill="#dc2626"/>
  <circle cx="19" cy="56" r="2" fill="#dc2626"/>
  <ellipse cx="17" cy="51" rx="3" ry="1.5" fill="#16a34a"/>
  <!-- Roasted Turkey Body -->
  <path d="M 18 52 C 16 41, 26 33, 38 33 C 48 33, 52 40, 52 49 C 52 54, 46 56, 36 56 C 26 56, 20 54, 18 52 Z" fill="#d97706" stroke="#b45309" stroke-width="1"/>
  <!-- Golden Roast Shading -->
  <path d="M 23 48 C 24 39, 32 35, 40 36 C 46 37, 49 42, 49 48" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
  <path d="M 26 45 C 30 42, 36 43, 38 47" fill="none" stroke="#92400e" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Drumstick with Chef Paper Frill -->
  <path d="M 40 43 C 44 37, 50 39, 52 43 C 50 47, 44 47, 40 43 Z" fill="#b45309"/>
  <line x1="49" y1="39" x2="56" y2="32" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>
  <circle cx="56" cy="32" r="2.2" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>
  <!-- Appetizing Steam Curls -->
  <path d="M 28 28 Q 26 21 30 16 M 38 27 Q 41 20 37 14" fill="none" stroke="#fff8e1" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
  <!-- Pumpkin Pie Slice on Plate -->
  <ellipse cx="60" cy="56" rx="14" ry="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
  <!-- Crust Back -->
  <path d="M 50 56 L 68 50 L 71 53 L 53 58 Z" fill="#b45309"/>
  <!-- Filling -->
  <polygon points="51,57 68,50 64,57" fill="#ea580c"/>
  <polygon points="51,57 64,57 58,58" fill="#c2410c"/>
  <!-- Whipped Cream Dollop -->
  <circle cx="61" cy="53" r="2" fill="#ffffff"/>
  <path d="M 61 51 Q 62 49 61 48" fill="none" stroke="#ffffff" stroke-width="1" stroke-linecap="round"/>
</svg>"""

# 3. May the 4th: Lightsabers with handles + planets & spaceships
may_fourth_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="36" fill="#05070f" stroke="#ffe81f" stroke-width="2.5"/>
  <circle cx="22" cy="20" r="1" fill="#fff"/>
  <circle cx="62" cy="18" r="1" fill="#ffe81f"/>
  <circle cx="18" cy="55" r="1" fill="#fff"/>
  <circle cx="64" cy="58" r="1.2" fill="#4fc3f7"/>
  <line x1="28" y1="52" x2="58" y2="22" stroke="#00e5ff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
  <line x1="28" y1="52" x2="58" y2="22" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="18" y1="62" x2="28" y2="52" stroke="#b0bec5" stroke-width="5.5" stroke-linecap="round"/>
  <line x1="21" y1="59" x2="26" y2="54" stroke="#263238" stroke-width="4.5"/>
  <circle cx="27" cy="53" r="3" fill="#ffe81f"/>
  <circle cx="18" cy="62" r="2.8" fill="#37474f"/>
  <line x1="52" y1="52" x2="22" y2="22" stroke="#00e676" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
  <line x1="52" y1="52" x2="22" y2="22" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="62" y1="62" x2="52" y2="52" stroke="#b0bec5" stroke-width="5.5" stroke-linecap="round"/>
  <line x1="59" y1="59" x2="54" y2="54" stroke="#263238" stroke-width="4.5"/>
  <circle cx="53" cy="53" r="3" fill="#cfd8dc"/>
  <circle cx="62" cy="62" r="2.8" fill="#37474f"/>
  <circle cx="40" cy="37" r="4.5" fill="#fff" opacity="0.9"/>
  <polygon points="40,31 42,37 48,37 43,40 45,46 40,42 35,46 37,40 32,37 38,37" fill="#ffe81f"/>
</svg>"""

# 4. MLK Day: Soaring Peace Dove with Olive Branch + Civil Rights / MLK Principles
mlk_day_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="36" fill="#1a233a" stroke="#ffd700" stroke-width="3"/>
  <circle cx="22" cy="22" r="1.5" fill="#fde68a"/>
  <circle cx="60" cy="20" r="1.5" fill="#fde68a"/>
  <circle cx="62" cy="60" r="1.5" fill="#fde68a"/>
  <path d="M 37 38 C 30 25, 20 18, 14 20 C 14 28, 24 35, 33 41 Z" fill="#e2e8f0"/>
  <path d="M 44 48 C 50 56, 56 62, 62 64 C 61 58, 56 50, 48 46 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>
  <path d="M 46 47 C 54 53, 62 56, 67 56 C 64 51, 56 46, 49 44 Z" fill="#f1f5f9"/>
  <path d="M 26 36 C 32 34, 42 38, 46 47 C 43 49, 36 49, 30 46 C 26 44, 24 39, 26 36 Z" fill="#ffffff"/>
  <path d="M 34 38 C 36 22, 46 14, 56 12 C 55 18, 48 24, 45 28 C 50 24, 56 22, 58 24 C 55 29, 49 33, 44 36 C 48 34, 53 34, 54 36 C 50 40, 42 42, 36 41 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8"/>
  <circle cx="24" cy="35" r="5.5" fill="#ffffff"/>
  <polygon points="19,34 14,36 19,37" fill="#fbbf24"/>
  <circle cx="23" cy="34" r="1" fill="#1e293b"/>
  <path d="M 16 36 Q 10 37 7 42" fill="none" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round"/>
  <ellipse cx="11" cy="37" rx="3" ry="1.4" fill="#22c55e" transform="rotate(-25 11 37)"/>
  <ellipse cx="8" cy="41" rx="2.8" ry="1.3" fill="#22c55e" transform="rotate(35 8 41)"/>
  <ellipse cx="13" cy="40" rx="2.5" ry="1.2" fill="#22c55e" transform="rotate(-60 13 40)"/>
</svg>"""

# 5. 4th of July: Captain America Shield Red, White & Blue pop
fourth_of_july_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="38" fill="#1e293b" opacity="0.25"/>
  <circle cx="40" cy="40" r="36" fill="#d32f2f" stroke="#b71c1c" stroke-width="1"/>
  <circle cx="40" cy="40" r="28" fill="#ffffff" stroke="#e0e0e0" stroke-width="0.8"/>
  <circle cx="40" cy="40" r="20" fill="#d32f2f" stroke="#b71c1c" stroke-width="0.8"/>
  <circle cx="40" cy="40" r="13" fill="#0d47a1" stroke="#0a3880" stroke-width="0.8"/>
  <polygon points="40,29 42.4,36.4 50.2,36.4 43.9,41 46.3,48.4 40,43.8 33.7,48.4 36.1,41 29.8,36.4 37.6,36.4" fill="#ffffff"/>
  <path d="M 16 26 A 32 32 0 0 1 64 26" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.35" stroke-linecap="round"/>
</svg>"""

for t in themes:
    if t["id"] == "new-years":
        t["icon"] = "⏳"
        t["svg"] = new_years_svg
        t["symbols"] = ["⏳", "🥂", "👶", "🎉", "✨", "🎇", "⋆", "•"]
    elif t["id"] == "thanksgiving":
        t["icon"] = "🍗"
        t["svg"] = thanksgiving_svg
        t["symbols"] = ["🥧", "🍗", "🌽", "🍠", "🥖", "🍁", "🍂", "🌾", "✨"]
    elif t["id"] == "may-fourth":
        t["svg"] = may_fourth_svg
        t["symbols"] = ["🪐", "🚀", "🛸", "⭐", "✦", "⋆", "•"]
    elif t["id"] == "mlk-day":
        t["svg"] = mlk_day_svg
        t["symbols"] = ["🕊️", "⚖️", "✊", "☮️", "🤝", "✨", "⭐"]
    elif t["id"] == "fourth-of-july":
        t["icon"] = "🛡️"
        t["svg"] = fourth_of_july_svg
        t["symbols"] = ["🎇", "★", "✨", "🇺🇸", "🎆", "•"]
        t["cardBorder"] = "#d32f2f"
        t["headingColor"] = "#0d47a1"
        t["linkColor"] = "#0d47a1"
        t["linkHover"] = "#d32f2f"
        t["btnBg"] = "#0d47a1"
        t["btnHoverBg"] = "#d32f2f"

with open(config_path, "w", encoding="utf-8") as f:
    json.dump(themes, f, indent=2, ensure_ascii=False)

print("Updated themes-config.json successfully!")
