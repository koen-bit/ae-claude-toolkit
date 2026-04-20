# AE Claude Toolkit

Generate and animate After Effects compositions through Claude Code using direct ExtendScript.

## Project Structure
- `.claude/commands/ae.md` — `/ae` slash command that primes an AE graphics session
- `docs/extendscript-patterns.md` — ExtendScript reference (patterns, easing, 3D, shadows)
- `docs/design-reference.md` — Coordinate system, safe areas, design principles, recipes
- `brand/config.json` — Dan Martell brand colors (hex→RGB), fonts, graphic rules
- `brand/editing-style-guide.md` — Full editing style guide (typography, graphics, color, sound)
- `brand/style-guide-assets/` — Reference images, GIFs, color swatches
- `scripts/` — Generated `.jsx` scripts to run in After Effects

## Core Rules

1. **Write standalone `.jsx` scripts** for building/animating — runs inside AE in one shot, sub-second even for hundreds of layers
2. **Use MCP bridge only** for single-layer tweaks after the comp is built (it's too slow for bulk ops)
3. **Default easing:** `KeyframeEase(0, 85)` (dead-flat, smooth)
4. **Always wrap** in `beginUndoGroup` / `endUndoGroup`
5. **Ask for a reference image** when starting a new comp — saves tons of back-and-forth
6. **Read `docs/design-reference.md`** before generating any script — it has the coordinate system, safe areas, and positioning rules that prevent misplaced elements
7. **Read `brand/config.json`** for Dan Martell brand colors, fonts, and graphic rules
8. **Read `brand/editing-style-guide.md`** for full style guide (typography, graphics, sound design)

## Layer Discipline

- **Layer budgets:** Simple 8-15, Medium 15-30, Complex 30-60
- **Naming:** `CTRL_` nulls, `BG_` backgrounds, `TM_` mattes, `CMP_` precomps — never generic names
- **Hierarchy:** Parent to nulls first, shape groups second, precomp third, separate layers last
- **Array/creation order:** Create backgrounds first (bottom), foreground/text last (top)
- **Shape consolidation:** 3+ shapes with same animation → one shape layer, multiple groups
