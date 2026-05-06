You are starting an After Effects graphics session. Follow these steps:

## 1. Load Context
Read these files for full context:
- `CLAUDE.md` — Core rules, layer discipline
- `docs/extendscript-patterns.md` — ExtendScript API patterns, helpers, positioning gotchas
- `docs/design-reference.md` — Coordinate system, safe areas, design principles, animation timing
- `brand/config.json` — Dan Martell brand colors (RGB), fonts, graphic rules
- `brand/editing-style-guide.md` — Full editing style guide (typography, color palette, graphics standards)

## 2. Check What's Open
Use the MCP bridge `run-script` tool with `getProjectInfo` to see what comps exist in the current AE project. Report back what you find.

## 3. Ask What We're Building
Ask the user what they want to create or modify. Prompt them to share a reference image if they have one — reference images dramatically reduce back-and-forth.

## 4. Build
Write a standalone `.jsx` script following the rules in CLAUDE.md and patterns in extendscript-patterns.md. Save to `scripts/`. Include `scripts/lib/helpers.jsx` via the pattern shown in extendscript-patterns.md.

## 5. Deliver
When the script is ready:
1. Tell the user the file path
2. Run it via **File > Scripts > Run Script File** in After Effects (or via osascript if available)
3. Offer to make tweaks via the MCP bridge
