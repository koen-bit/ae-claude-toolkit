# AE Design Reference

Read this before generating any script. It prevents mispositioned elements and bad design.

---

## Coordinate System (3840x2160 UHD — default)

- Origin `[0, 0]` = top-left corner
- `[3840, 2160]` = bottom-right corner
- `[1920, 1080]` = exact center
- X increases rightward, Y increases downward
- **Always create UHD comps (3840x2160) unless told otherwise**

## Safe Areas (UHD 3840x2160)

| Area | Left | Right | Top | Bottom |
|------|------|-------|-----|--------|
| **Title Safe** (90%) | x=192 | x=3648 | y=108 | y=2052 |
| **Action Safe** (93%) | x=136 | x=3704 | y=76 | y=2084 |

All text and critical content must stay inside title safe.

## Standard Zones (UHD)

| Zone | Y Range | Use For |
|------|---------|---------|
| Upper third | 108–720 | Headers, title cards |
| Center | 720–1440 | Hero content, logos |
| Lower third | 1520–2052 | Lower thirds, subtitles |

---

## Positioning Quick Reference

### Lower Third (left-aligned, 2-line) — UHD

| Element | Position | Notes |
|---------|----------|-------|
| Background card | [620, 1840] | Shape layer, rect centered at [0,0], size [860, 220] |
| Accent bar | Shape group at [-422, 0] | 8px wide, inside the card shape layer |
| Name text (bold) | [240, 1820] | Baseline sits at y=1820, text extends above |
| Subtitle text | [240, 1900] | 80px below name baseline |

### Centered Title Card — UHD

| Element | Position | Notes |
|---------|----------|-------|
| Title text | [1920, 960] | Center-justified, use `centerTextAnchor()` |
| Subtitle text | [1920, 1120] | Center-justified, below title |
| Accent line | [1920, 1240] | Shape, well below subtitle baseline |

### Center-Screen Logo — UHD

| Element | Position | Notes |
|---------|----------|-------|
| Logo mark | [1400, 1080] | Offset left for wordmark |
| Wordmark text | [1700, 1110] | Right of mark, baseline slightly below center |

---

## Design Principles

### Contrast
- Dark bg + light text: bg `[0.08–0.12]`, text `[0.95–1.0]`
- Light bg + dark text: bg `[0.95–1.0]`, text `[0.1–0.2]`
- Cards on dark bg: minimum `[0.18–0.22]` fill — must be distinguishable
- Borders: stroke at 30-50% opacity, slightly brighter than fill

### Typography Hierarchy
- Primary: bold, 42–64px, white
- Secondary: regular/light, 24–36px, muted (80-90% white or tinted)
- Tracking: headlines 80–150, body 20–60, ALL CAPS always needs 100+
- Line spacing: 35-45px baseline-to-baseline
- Never same size + weight for two text elements

### Spacing
- Padding inside cards: 20-30px
- Element gap: 15-25px
- Margins: minimum 96px from comp edges (title safe)
- Accent bars: 3-5px wide, aligned to card left edge
- Decorative lines: NEVER overlap text. Place 20px+ below lowest baseline. Text extends ~70% of fontSize above its baseline.

### Color (all RGB 0.0–1.0)
- Dark backgrounds: `[0.08, 0.08, 0.1]` or `[0.067, 0.067, 0.067]`
- White text: `[1, 1, 1]`
- Muted text: `[0.6, 0.65, 0.7]` or `[0.75, 0.75, 0.78]`
- Check `brand/config.json` for project-specific colors

---

## Animation Timing

| Type | Animate In | Hold | Animate Out | Total |
|------|-----------|------|-------------|-------|
| Lower third | 0.5–0.8s | 3–4s | 0.3–0.5s | 4–5s |
| Title card | 0.8–1.2s | 2–3s | 0.5–0.8s | 3.5–5s |
| Logo reveal | 1.0–2.0s | 2–3s | 0.5–1.0s | 3.5–6s |
| Social post | 0.5–0.8s | 3–5s | 0.3–0.5s | 4–6s |

### Stagger Between Elements
- Tight (UI, fast): 0.08–0.12s
- Medium (lower thirds): 0.12–0.18s
- Loose (cinematic): 0.2–0.4s
- Background always animates in FIRST, text follows after

### Animation Amounts
- Slide in: 20-40px movement, NOT 100+
- Scale in: 0% to 100% direct. **NEVER overshoot** (no 105%→100% bounce)
- Fade in: always combine with subtle position shift (10-20px)
- Trim path paint-on: 0.4-0.8s per element
- No bounce, no overshoot, no elastic — motion is smooth, direct, and intentional

### Alignment
- If a comp is center-aligned, ALL center-column elements must share the exact same X position
- Never offset elements by arbitrary amounts — it looks unintentional and breaks the design
