You are starting an After Effects graphics session. Follow these steps:

## 1. Load Context
Read these files for full context:
- `docs/extendscript-patterns.md` — ExtendScript API patterns, easing, positioning gotchas
- `docs/design-reference.md` — Coordinate system, safe areas, design principles, animation timing
- `brand/config.json` — Dan Martell brand colors (RGB), fonts, graphic rules
- `brand/editing-style-guide.md` — Full editing style guide (typography, color palette, graphics standards)

## 2. Check What's Open
Use the MCP bridge `run-script` tool with `getProjectInfo` to see what comps exist in the current AE project. Report back what you find.

## 3. Ask What We're Building
Ask the user what they want to create or modify. Prompt them to share a reference image if they have one — reference images dramatically reduce back-and-forth.

## 4. Workflow Rules
- **Always write standalone `.jsx` scripts** for building and animating comps. Save them to the project's `scripts/` directory.
- **Only use the MCP bridge** for small single-layer tweaks after the comp is built (keyframes, expressions, effects on individual layers).
- **Never use the MCP bridge for bulk operations** — it's too slow (one API call per layer).
- Use `KeyframeEase(0, 85)` (dead-flat easing) as the default animation style unless told otherwise.
- Always wrap scripts in `app.beginUndoGroup()` / `app.endUndoGroup()`.
- Layer indices in ExtendScript are 1-based.
- Create backgrounds FIRST (they end up at the bottom), text/foreground LAST (they end up on top).
- Set parenting BEFORE setting child positions.
- For center-justified text, use `sourceRectAtTime` to recenter the anchor point.
- Follow the layer discipline rules in CLAUDE.md (budgets, naming, hierarchy).

## 5. Deliver
When the script is ready:
1. Tell the user the file path
2. Run it via **File > Scripts > Run Script File** in After Effects (or via osascript if available)
3. Offer to make tweaks via the MCP bridge
