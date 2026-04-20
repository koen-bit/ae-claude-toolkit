# AE Claude Toolkit

Slash commands and ExtendScript patterns for building After Effects compositions with Claude Code.

## Project Structure
- `.claude/commands/ae.md` — `/ae` slash command that primes an AE graphics session
- `docs/extendscript-patterns.md` — ExtendScript reference (patterns, MCP bridge capabilities)
- `scripts/` — generated `.jsx` scripts to run in After Effects

## Key Rules
- Write standalone `.jsx` scripts for building/animating (fast, runs inside AE)
- Use the MCP bridge only for single-layer tweaks after the comp is built
- Default easing: `KeyframeEase(0, 85)` (dead-flat)
- Always wrap scripts in `beginUndoGroup` / `endUndoGroup`
- Ask for a reference image when starting a new comp — it saves tons of back-and-forth
