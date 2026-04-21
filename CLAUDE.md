# AE Claude Toolkit

Generate and animate After Effects compositions through Claude Code using direct ExtendScript.

## Project Structure
- `.claude/commands/ae.md` — `/ae` slash command that primes an AE graphics session
- `docs/extendscript-patterns.md` — ExtendScript reference (patterns, easing, 3D, shadows)
- `docs/extendscript-matchnames.md` — Complete matchName reference (probed from AE 2025)
- `docs/design-reference.md` — Coordinate system, safe areas, design principles, recipes
- `brand/config.json` — Dan Martell brand colors (hex→RGB), fonts, graphic rules
- `brand/editing-style-guide.md` — Full editing style guide (typography, graphics, color, sound)
- `brand/style-guide-assets/` — Reference images, GIFs, color swatches
- `docs/troubleshooting.md` — Common issues and fixes (AE crashes, font errors)
- `scripts/` — Generated `.jsx` scripts to run in After Effects

## Core Rules

1. **Write standalone `.jsx` scripts** for building/animating — runs inside AE in one shot, sub-second even for hundreds of layers
2. **Use MCP bridge only** for single-layer tweaks after the comp is built (it's too slow for bulk ops)
3. **Default easing:** `KeyframeEase(0, 85)` (dead-flat, smooth)
4. **Always wrap** in `beginUndoGroup` / `endUndoGroup`
5. **Ask for a reference image** when starting a new comp — saves tons of back-and-forth
6. **Read `docs/design-reference.md`** before generating any script — it has the coordinate system, safe areas, and positioning rules that prevent misplaced elements
6b. **Read `docs/extendscript-matchnames.md`** when using text animators, effects, or shape properties — it has the exact matchNames probed from AE (prevents "property not found" errors)
7. **Read `brand/config.json`** for Dan Martell brand colors, fonts, and graphic rules
8. **Read `brand/editing-style-guide.md`** for full style guide (typography, graphics, sound design)

## New vs Iterate (Decision Logic)

When the user says something, determine intent before writing any code:

**CREATE NEW COMP** when:
- User shares a new reference image
- User asks for a different graphic type than what's currently open
- User says "make", "create", "build", "new" with no reference to existing work
- The topic/subject is different from the active comp (e.g., active comp is "AI Replacing People" but user asks about "5 Steps to Hiring")
- Use `findOrCreateComp` with a new name. Never overwrite unrelated comps.

**REBUILD EXISTING COMP** when:
- User wants structural changes to the current graphic: adding/removing tiers, changing layout, rearranging elements
- User says "redo", "rebuild", "start over", "from scratch" about the current comp
- The change touches 3+ layers or requires re-parenting/repositioning dependent elements
- Use `findOrCreateComp` with the same name — it clears and rebuilds.

**ITERATE IN-PLACE** when:
- User asks to tweak what's already there: move, resize, recolor, retime, add/remove one element
- User says "make it bigger", "change the color", "move it up", "slower", "add a shadow"
- The change affects 1-2 layers and doesn't break dependencies
- Use MCP bridge for single-property changes (apply_effect, modify_layer, set_expression)
- Use a targeted `.jsx` script for multi-step changes on a few layers (like rebuilding one animation)

**How to decide when it's ambiguous:**
- Check the active comp name via MCP `get_project_info` or `list_compositions`
- If the user's request is clearly about the same subject matter → iterate
- If the user's request is about a different subject or they share a new reference → new comp
- If unsure, ask: "Want me to modify the current comp or create a new one?"
- Default to iterate — it's less destructive and the user can always say "start fresh"

## Layer Discipline

- **Layer budgets:** Simple 8-15, Medium 15-30, Complex 30-60
- **Naming:** `CTRL_` nulls, `BG_` backgrounds, `TM_` mattes, `CMP_` precomps — never generic names
- **Hierarchy:** Parent to nulls first, shape groups second, precomp third, separate layers last
- **Direct parenting:** When a text/number layer sits on top of a shape (circle, box, tier), parent the text to the shape. This way moving or scaling the shape automatically moves the text with it. The editor should never have to ask to reposition both separately. Examples: number on a pyramid tier, label inside a box, icon on a circle.
- **Array/creation order:** Create backgrounds first (bottom), foreground/text last (top)
- **Shape consolidation:** 3+ shapes with same animation → one shape layer, multiple groups
