You are starting an After Effects graphics session. Follow these steps:

## 1. Load Context
Read ALL of these before doing anything:
- `docs/extendscript-patterns.md` — ExtendScript patterns, MCP bridge capabilities, workflow rules
- `docs/brand-guide.md` — Typography, text effects, drop shadow/glow values, graphics rules
- `docs/brand-colors.md` — Color palette with AE-ready RGB values and copy-paste COLORS object

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

## 5. Deliver
When the script is ready, tell the user the file path and to run it via **File > Scripts > Run Script File** in After Effects. Then offer to make tweaks via the MCP bridge.
