# Martell Graphics App — Build Plan

## What This Is

A standalone macOS app that sits alongside After Effects. Team members drop a reference image, describe what they want, and get a finished AE comp in ~10 seconds. Uses the Claude API to generate ExtendScript, executes it in AE automatically, screenshots the result, and self-corrects before presenting it.

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│  Martell Graphics (Electron + React)              │
│                                                    │
│  ┌────────────┐  ┌─────────────────────────────┐  │
│  │  Drop Zone  │  │  Chat Interface (streaming) │  │
│  │  (ref img)  │  │  Shows script being written │  │
│  └──────┬─────┘  └──────────────┬──────────────┘  │
│         │                       │                  │
│         ▼                       ▼                  │
│  ┌─────────────────────────────────────────────┐  │
│  │  Main Process                                │  │
│  │                                              │  │
│  │  claude.ts — API client                      │  │
│  │  ├ Anthropic SDK with streaming              │  │
│  │  ├ System prompt cached (1-hour TTL)         │  │
│  │  ├ Model routing (Opus/Sonnet/Haiku)         │  │
│  │  └ Structured output (script + metadata)     │  │
│  │                                              │  │
│  │  ae-bridge.ts — AE communication             │  │
│  │  ├ osascript DoScriptFile (execute JSX)      │  │
│  │  ├ saveFrameToPng (capture screenshot)       │  │
│  │  └ Error capture and forwarding              │  │
│  │                                              │  │
│  │  templates.ts — Template engine              │  │
│  │  ├ Parameterized JSX templates               │  │
│  │  ├ Template matching from user prompt        │  │
│  │  └ Zero API cost for known graphic types     │  │
│  └─────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
         │
         │ osascript -e 'tell application
         │   "Adobe After Effects 2025"
         │   to DoScriptFile "..."'
         ▼
┌──────────────────┐
│  After Effects    │
│  Executes .jsx    │
│  Returns 0 or 1   │
└──────────────────┘
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Electron via electron-vite | Modern, fast, React + TS out of the box |
| Frontend | React + TypeScript | Streaming chat UI, drag-drop, state management |
| AI | `@anthropic-ai/sdk` | Direct API with streaming, caching, structured output |
| AE Bridge | `child_process.exec` + osascript | Same mechanism proven in this project |
| Packaging | electron-builder | .dmg output, no code signing needed for internal |
| Auto-update | electron-updater + GitHub Releases | Push updates, team gets them automatically |

---

## Authentication

**API key only.** Anthropic blocks third-party apps from using Pro/Max subscriptions. Each team gets one shared API key from console.anthropic.com.

- App stores key in Electron's `safeStorage` (encrypted on disk)
- First launch: settings screen asks for API key
- Key is per-machine, not bundled in the app
- Monthly spend limit set in Anthropic console (recommend $50-100)

---

## Project Structure

```
martell-graphics/
├── src/
│   ├── main/                          # Electron main process
│   │   ├── index.ts                   # App entry, window management
│   │   ├── ipc.ts                     # All IPC channel handlers
│   │   ├── claude.ts                  # Anthropic API client
│   │   ├── ae-bridge.ts              # osascript execution + screenshot
│   │   └── templates.ts              # Template engine
│   │
│   ├── preload/                       # Context bridge
│   │   └── index.ts                   # Expose IPC methods to renderer
│   │
│   ├── renderer/                      # React frontend
│   │   ├── App.tsx                    # Root component
│   │   ├── components/
│   │   │   ├── Chat.tsx              # Streaming chat interface
│   │   │   ├── DropZone.tsx          # Reference image upload
│   │   │   ├── Palette.tsx           # Brand color picker
│   │   │   ├── TemplateSelector.tsx  # Quick-pick graphic types
│   │   │   ├── Settings.tsx          # API key, model selection
│   │   │   └── CompPreview.tsx       # Shows screenshot from AE
│   │   ├── hooks/
│   │   │   ├── useChat.ts           # Chat state + streaming logic
│   │   │   └── useAE.ts             # AE bridge hooks
│   │   ├── styles/
│   │   │   └── index.css            # Tailwind or plain CSS
│   │   └── types/
│   │       └── index.ts             # Shared types
│   │
│   └── assets/                        # Bundled context for Claude
│       ├── system-prompt.md          # Compressed prompt (~4k tokens)
│       ├── extendscript-matchnames.md # Full matchName reference
│       ├── extendscript-patterns.md   # API patterns
│       ├── design-reference.md        # Coordinates, safe areas
│       ├── brand/
│       │   ├── config.json           # Colors, fonts, comp presets
│       │   └── editing-style-guide.md # Full style guide
│       ├── scripts/
│       │   └── lib/helpers.jsx       # Easing, text, animation helpers
│       └── templates/                 # Parameterized JSX templates
│           ├── pyramid.jsx.template
│           ├── roadmap.jsx.template
│           ├── lower-third.jsx.template
│           ├── title-card.jsx.template
│           ├── graph.jsx.template
│           └── index.json            # Template registry
│
├── electron-vite.config.ts
├── package.json
└── electron-builder.yml
```

---

## Setup Commands

```bash
# Create project
npm create electron-vite@latest martell-graphics -- --template react-ts
cd martell-graphics

# Install dependencies
npm install @anthropic-ai/sdk         # Claude API
npm install --save-dev electron-builder electron-updater
npm install --save-dev tailwindcss     # Optional: styling

# Development
npm run dev

# Build + package
npm run build && npm run dist
# Output: dist/Martell Graphics-1.0.0.dmg
```

---

## Core Module: claude.ts

```typescript
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// Load and cache system prompt from bundled assets
const systemPrompt = [
  fs.readFileSync(path.join(__dirname, "../assets/system-prompt.md"), "utf-8"),
  fs.readFileSync(path.join(__dirname, "../assets/extendscript-matchnames.md"), "utf-8"),
  fs.readFileSync(path.join(__dirname, "../assets/extendscript-patterns.md"), "utf-8"),
  fs.readFileSync(path.join(__dirname, "../assets/design-reference.md"), "utf-8"),
  fs.readFileSync(path.join(__dirname, "../assets/brand/config.json"), "utf-8"),
].join("\n\n---\n\n");

let client: Anthropic;

export function initClient(apiKey: string) {
  client = new Anthropic({ apiKey });
}

export interface GenerateResult {
  script: string;
  description: string;
  layerCount: number;
}

export async function* generateGraphic(
  userPrompt: string,
  referenceImage?: string, // base64 PNG
  conversationHistory?: Anthropic.MessageParam[],
  model: string = "claude-sonnet-4-6"
): AsyncGenerator<{ type: "token" | "result"; data: string | GenerateResult }> {

  const messages: Anthropic.MessageParam[] = [
    ...(conversationHistory || []),
    {
      role: "user",
      content: referenceImage
        ? [
            { type: "image", source: { type: "base64", media_type: "image/png", data: referenceImage } },
            { type: "text", text: userPrompt }
          ]
        : userPrompt
    }
  ];

  const stream = client.messages.stream({
    model,
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" } // 5-min cache
      }
    ],
    messages,
    tools: [
      {
        name: "generate_script",
        description: "Generate an After Effects ExtendScript (.jsx) that builds the requested graphic",
        input_schema: {
          type: "object" as const,
          properties: {
            script: { type: "string", description: "Complete standalone .jsx script" },
            description: { type: "string", description: "One-line description of what was built" },
            layerCount: { type: "number", description: "Approximate number of layers created" }
          },
          required: ["script", "description", "layerCount"]
        }
      }
    ],
    tool_choice: { type: "tool", name: "generate_script" }
  });

  // Stream text tokens as they arrive
  for await (const event of stream) {
    if (event.type === "content_block_delta") {
      if (event.delta.type === "input_json_delta") {
        yield { type: "token", data: event.delta.partial_json };
      }
    }
  }

  // Extract final structured result
  const finalMessage = await stream.finalMessage();
  const toolUse = finalMessage.content.find((c) => c.type === "tool_use");
  if (toolUse && toolUse.type === "tool_use") {
    yield { type: "result", data: toolUse.input as GenerateResult };
  }
}
```

---

## Core Module: ae-bridge.ts

```typescript
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

const SCRIPTS_DIR = path.join(os.tmpdir(), "martell-graphics");
const SCREENSHOT_PATH = path.join(os.tmpdir(), "martell-graphics", "frame.png");

// Ensure temp directory exists
if (!fs.existsSync(SCRIPTS_DIR)) fs.mkdirSync(SCRIPTS_DIR, { recursive: true });

/**
 * Execute a JSX script in After Effects
 * Returns { success: boolean, error?: string }
 */
export async function executeScript(jsx: string): Promise<{ success: boolean; error?: string }> {
  // Write script to temp file
  const scriptPath = path.join(SCRIPTS_DIR, `gen_${Date.now()}.jsx`);
  fs.writeFileSync(scriptPath, jsx);

  try {
    const { stdout, stderr } = await execAsync(
      `osascript -e 'tell application "Adobe After Effects 2025" to DoScriptFile "${scriptPath}"'`,
      { timeout: 30000 }
    );

    const exitCode = stdout.trim();
    if (exitCode === "0") {
      return { success: true };
    } else {
      return { success: false, error: stderr || `Script returned exit code ${exitCode}` };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Capture a screenshot of the active comp at the given time
 * Returns base64 PNG string
 */
export async function captureScreenshot(time: number = 2.0): Promise<string | null> {
  const captureScript = `
    (function() {
      var comp = app.project.activeItem;
      if (!comp || !(comp instanceof CompItem)) return "NO_COMP";
      var f = new File("${SCREENSHOT_PATH.replace(/\\/g, "/")}");
      comp.saveFrameToPng(${time}, f);
      var waitCount = 0;
      while ((!f.exists || f.length === 0) && waitCount < 100) {
        $.sleep(50);
        waitCount++;
      }
      return f.exists ? "OK" : "FAIL";
    })();
  `;

  const result = await executeScript(captureScript);
  if (!result.success) return null;

  // Wait briefly for file system sync
  await new Promise((r) => setTimeout(r, 200));

  if (fs.existsSync(SCREENSHOT_PATH)) {
    const buffer = fs.readFileSync(SCREENSHOT_PATH);
    return buffer.toString("base64");
  }
  return null;
}

/**
 * Install helpers.jsx to AE's scripts folder if not present
 */
export async function installHelpers(helpersSource: string): Promise<void> {
  const aeScriptsDir = path.join(
    os.homedir(),
    "Documents/ae-martell-graphics/scripts/lib"
  );
  if (!fs.existsSync(aeScriptsDir)) fs.mkdirSync(aeScriptsDir, { recursive: true });

  const dest = path.join(aeScriptsDir, "helpers.jsx");
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(helpersSource, dest);
  }
}
```

---

## Core Module: templates.ts

```typescript
import fs from "fs";
import path from "path";

interface Template {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  parameters: TemplateParam[];
  file: string;
}

interface TemplateParam {
  name: string;
  type: "text" | "number" | "color" | "array";
  label: string;
  default: any;
}

// Load template registry
const registryPath = path.join(__dirname, "../assets/templates/index.json");
const registry: Template[] = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

/**
 * Match user prompt to a template. Returns null if no match.
 */
export function matchTemplate(prompt: string): Template | null {
  const lower = prompt.toLowerCase();
  for (const tmpl of registry) {
    const matchCount = tmpl.keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount >= 2) return tmpl; // Need at least 2 keyword matches
  }
  return null;
}

/**
 * Fill a template with parameters. Returns ready-to-execute JSX.
 */
export function fillTemplate(template: Template, params: Record<string, any>): string {
  const templatePath = path.join(__dirname, "../assets/templates", template.file);
  let jsx = fs.readFileSync(templatePath, "utf-8");

  for (const [key, value] of Object.entries(params)) {
    const placeholder = `{{${key}}}`;
    if (typeof value === "string") {
      jsx = jsx.replace(new RegExp(placeholder, "g"), value.replace(/"/g, '\\"'));
    } else if (Array.isArray(value)) {
      jsx = jsx.replace(new RegExp(placeholder, "g"), JSON.stringify(value));
    } else {
      jsx = jsx.replace(new RegExp(placeholder, "g"), String(value));
    }
  }

  return jsx;
}
```

---

## The Self-Correcting Loop (ipc.ts)

This is the key differentiator — the app iterates with Claude automatically.

```typescript
import { ipcMain, BrowserWindow } from "electron";
import { generateGraphic, initClient } from "./claude";
import { executeScript, captureScreenshot } from "./ae-bridge";
import { matchTemplate, fillTemplate } from "./templates";

export function registerIPC(mainWindow: BrowserWindow) {

  ipcMain.handle("generate", async (event, { prompt, referenceImage, model }) => {
    const send = (channel: string, data: any) => mainWindow.webContents.send(channel, data);

    // Step 1: Check for template match
    const template = matchTemplate(prompt);
    if (template) {
      send("status", "Template match found — generating instantly");
      // TODO: extract params from prompt (could use Haiku for this)
      const jsx = fillTemplate(template, { title: prompt });
      const result = await executeScript(jsx);
      if (result.success) {
        const screenshot = await captureScreenshot();
        send("complete", { screenshot, method: "template", cost: 0 });
        return;
      }
      // Template failed — fall through to AI generation
    }

    // Step 2: AI generation
    send("status", "Generating with Claude...");
    let script = "";
    let conversationHistory: any[] = [];

    // Stream the generation
    for await (const chunk of generateGraphic(prompt, referenceImage, [], model)) {
      if (chunk.type === "token") {
        send("token", chunk.data);
      }
      if (chunk.type === "result") {
        script = (chunk.data as any).script;
      }
    }

    if (!script) {
      send("error", "No script generated");
      return;
    }

    // Step 3: Execute in AE
    send("status", "Executing in After Effects...");
    let execResult = await executeScript(script);

    // Step 4: Auto-retry on error (up to 2 attempts)
    let retries = 0;
    while (!execResult.success && retries < 2) {
      retries++;
      send("status", `Script error — auto-fixing (attempt ${retries})...`);

      // Send error to Claude for fix
      conversationHistory.push(
        { role: "assistant", content: `Generated script:\n\`\`\`jsx\n${script}\n\`\`\`` },
        { role: "user", content: `Script failed with error: ${execResult.error}\nFix the script.` }
      );

      // Use Haiku for fast error fixes
      for await (const chunk of generateGraphic("", undefined, conversationHistory, "claude-haiku-4-5-20251001")) {
        if (chunk.type === "result") {
          script = (chunk.data as any).script;
        }
      }

      execResult = await executeScript(script);
    }

    if (!execResult.success) {
      send("error", `Script failed after ${retries} retries: ${execResult.error}`);
      return;
    }

    // Step 5: Screenshot and visual review
    send("status", "Capturing screenshot for review...");
    const screenshot = await captureScreenshot();

    if (screenshot && referenceImage) {
      // Step 6: Visual comparison (optional — only if reference image provided)
      send("status", "Comparing with reference...");

      conversationHistory.push(
        { role: "assistant", content: `Script executed successfully.` },
        {
          role: "user",
          content: [
            { type: "text", text: "Here is the rendered result. Compare it to the original reference. If it looks good, respond with APPROVED. If there are visible issues, generate a fixed script." },
            { type: "image", source: { type: "base64", media_type: "image/png", data: screenshot } }
          ]
        }
      );

      // Use Sonnet for visual review (good vision, cheaper than Opus)
      let approved = false;
      for await (const chunk of generateGraphic("", undefined, conversationHistory, "claude-sonnet-4-6")) {
        if (chunk.type === "result") {
          const result = chunk.data as any;
          if (result.script.includes("APPROVED") || result.description.includes("APPROVED")) {
            approved = true;
          } else {
            // Claude generated a fix — execute it
            script = result.script;
            await executeScript(script);
            const newScreenshot = await captureScreenshot();
            send("complete", { screenshot: newScreenshot, method: "ai", cost: "~$0.15" });
            return;
          }
        }
      }
    }

    send("complete", { screenshot, method: "ai", cost: retries > 0 ? "~$0.20" : "~$0.10" });
  });
}
```

---

## System Prompt (Compressed)

The bundled `system-prompt.md` should be a compressed version of our docs, optimized for tokens. Here's the structure:

```markdown
# AE Script Generator

Generate standalone .jsx scripts for After Effects (3840x2160 UHD, 30fps).

## Rules
- Wrap in beginUndoGroup/endUndoGroup
- Include helpers via $.evalFile
- Use findOrCreateComp pattern
- Create layers bottom-to-top (BG first, text last)
- Default easing: KeyframeEase(0, 85)
- Name layers: BG_, CTRL_, TXT_, NUM_, LINE_, TIER_
- Always drop shadow on text
- Layer budget: simple 8-15, medium 15-30, complex 30-60

## Coordinates (UHD)
- Origin [0,0] = top-left, center = [1920,1080]
- Title safe: x 192-3648, y 108-2052
- Upper third: y 108-720, Center: y 720-1440, Lower: y 1520-2052

## Brand
[Inline from config.json — colors, fonts, comp presets]

## Output Format
Return ONLY the tool call with the complete .jsx script.
Do not explain. Do not add comments unless logic is non-obvious.

## Reference
See extendscript-matchnames.md for all property matchNames.
See extendscript-patterns.md for API patterns.
```

Target: **~4,000 tokens** (down from 7,000 in current docs). The matchNames reference loads separately and gets cached.

---

## Template Registry (index.json)

```json
[
  {
    "id": "pyramid",
    "name": "Pyramid / Tier Diagram",
    "description": "N-tier pyramid with numbers and title",
    "keywords": ["pyramid", "tier", "level", "triangle", "hierarchy"],
    "parameters": [
      { "name": "title", "type": "text", "label": "Title", "default": "" },
      { "name": "tiers", "type": "number", "label": "Number of tiers", "default": 3 },
      { "name": "tierLabels", "type": "array", "label": "Tier labels", "default": [] }
    ],
    "file": "pyramid.jsx.template"
  },
  {
    "id": "roadmap",
    "name": "Roadmap / Steps",
    "description": "N-box zigzag roadmap with connecting line",
    "keywords": ["roadmap", "steps", "process", "flow", "boxes", "journey"],
    "parameters": [
      { "name": "title", "type": "text", "label": "Title", "default": "" },
      { "name": "steps", "type": "number", "label": "Number of steps", "default": 5 },
      { "name": "stepLabels", "type": "array", "label": "Step labels", "default": [] }
    ],
    "file": "roadmap.jsx.template"
  },
  {
    "id": "lower-third",
    "name": "Lower Third",
    "description": "Name + subtitle lower third with accent bar",
    "keywords": ["lower third", "name", "subtitle", "title card", "intro"],
    "parameters": [
      { "name": "name", "type": "text", "label": "Name", "default": "" },
      { "name": "subtitle", "type": "text", "label": "Subtitle", "default": "" }
    ],
    "file": "lower-third.jsx.template"
  },
  {
    "id": "graph",
    "name": "Line Graph / Chart",
    "description": "Trend lines with labels and grid",
    "keywords": ["graph", "chart", "line", "trend", "data", "rich", "poor", "up", "down"],
    "parameters": [
      { "name": "title", "type": "text", "label": "Title", "default": "" },
      { "name": "lines", "type": "number", "label": "Number of lines", "default": 2 },
      { "name": "lineLabels", "type": "array", "label": "Line labels", "default": [] }
    ],
    "file": "graph.jsx.template"
  },
  {
    "id": "title-card",
    "name": "Title Card",
    "description": "Centered title + subtitle with accent line",
    "keywords": ["title", "headline", "centered", "intro", "chapter"],
    "parameters": [
      { "name": "title", "type": "text", "label": "Title", "default": "" },
      { "name": "subtitle", "type": "text", "label": "Subtitle", "default": "" }
    ],
    "file": "title-card.jsx.template"
  }
]
```

---

## Model Routing Strategy

| Scenario | Model | Cost/1M tokens | Why |
|----------|-------|----------------|-----|
| Novel design from reference image | Opus | $5/$25 | Visual reasoning, geometry |
| Refinements ("move title up") | Sonnet | $3/$15 | Code editing, fast |
| Error auto-fix | Haiku | $1/$5 | Pattern matching, cheap |
| Visual review (screenshot compare) | Sonnet | $3/$15 | Good vision, not overkill |
| Template parameter extraction | Haiku | $1/$5 | Simple NLU task |
| Template fill | None | $0 | String interpolation |

---

## Cost Model (Revised Final)

| Graphic type | % of volume | Cost each | Weighted |
|---|---|---|---|
| Template fill | 65% | $0.00 | $0.000 |
| Simple variation (Sonnet, 2 turns) | 20% | $0.04 | $0.008 |
| Novel design (Opus, 4 turns + screenshots) | 15% | $0.18 | $0.027 |
| **Blended average** | | | **~$0.035** |

**At 1,000 graphics/month: ~$35**

---

## Speed Targets

| Operation | Target | How |
|-----------|--------|-----|
| Template fill → comp in AE | <1s | No API call, instant |
| Sonnet generation → comp in AE | 4-6s | Streaming, fast model |
| Opus generation → comp in AE | 8-12s | Streaming, visual reasoning |
| Auto-fix retry | 2-3s | Haiku, error-only context |
| Screenshot capture | <1s | saveFrameToPng is instant |
| Full novel graphic (with visual review) | 12-18s | 2-3 turns automated |

---

## Build Phases

### Phase 1: Core Pipeline (Week 1-2)

**Goal:** Drop an image, get a comp in AE.

Files to build:
- [ ] `src/main/index.ts` — Electron app shell, window management
- [ ] `src/main/claude.ts` — Anthropic API client with streaming + caching
- [ ] `src/main/ae-bridge.ts` — osascript execution + screenshot capture
- [ ] `src/main/ipc.ts` — IPC handlers connecting renderer to main
- [ ] `src/preload/index.ts` — Context bridge (invoke, send, on)
- [ ] `src/renderer/App.tsx` — Root layout
- [ ] `src/renderer/components/Chat.tsx` — Streaming message display
- [ ] `src/renderer/components/DropZone.tsx` — Image drag-drop with preview
- [ ] `src/assets/system-prompt.md` — Compressed system prompt
- [ ] Copy `extendscript-matchnames.md`, `extendscript-patterns.md`, `design-reference.md`, `brand/` from toolkit

Test: Drop a reference image → type "recreate this" → see script stream in → comp appears in AE.

### Phase 2: Smart Features (Week 2-3)

**Goal:** Templates, auto-retry, visual review.

- [ ] `src/main/templates.ts` — Template engine with matching
- [ ] `src/assets/templates/` — Parameterized JSX templates (pyramid, roadmap, lower third, graph, title card)
- [ ] Auto-retry loop in `ipc.ts` — Error → Haiku fix → retry
- [ ] Screenshot visual review loop — Capture → Sonnet compare → auto-fix
- [ ] `src/renderer/components/Palette.tsx` — Brand color picker from config.json
- [ ] `src/renderer/components/TemplateSelector.tsx` — Quick-pick graphic types
- [ ] `src/renderer/components/Settings.tsx` — API key input, model preference
- [ ] `src/renderer/components/CompPreview.tsx` — Show captured screenshot in app
- [ ] Model routing logic — Opus for novel, Sonnet for refine, Haiku for errors
- [ ] Conversation history with context trimming (keep last 4 turns)

Test: Type "5-step roadmap for hiring" → template fills instantly → comp in AE in <1s.
Test: Script error → auto-fixes without user intervention.
Test: Visual review catches wrong positioning → auto-corrects.

### Phase 3: Polish + Ship (Week 3-4)

**Goal:** Package for team, auto-updates work.

- [ ] `electron-builder.yml` — macOS .dmg configuration
- [ ] GitHub Actions workflow — Auto-build .dmg on push to main
- [ ] `electron-updater` setup — Team gets updates automatically
- [ ] Install helpers.jsx to user's AE scripts folder on first launch
- [ ] Onboarding screen (API key setup + AE connection test)
- [ ] Error UX — Surface AE errors clearly in the chat
- [ ] Loading states, progress indicators
- [ ] Keyboard shortcuts (Cmd+Enter to send, Cmd+N for new graphic)

Test: Fresh Mac → install .dmg → enter API key → generate first graphic.
Test: Push update to GitHub → team's app auto-updates.

---

## Key Decisions Already Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Electron over CEP | Electron | CEP dead in AE 2025+, UXP not available |
| API key over Pro login | API key | Anthropic blocks third-party Pro/Max usage |
| osascript over MCP | osascript | Simpler, proven in this project, no server needed |
| Structured output over text parsing | Tool use | Guaranteed script extraction, no regex parsing |
| saveFrameToPng over render queue | saveFrameToPng | Instant, no render queue complexity |
| Templates over AI-for-everything | Templates first | 65% of graphics are known types, $0 each |
| electron-vite over electron-forge | electron-vite | Faster builds, simpler config, modern default |
| Shared API key over per-user | Shared | Simpler billing, one spend limit, no onboarding friction |

---

## Files From This Project That Ship With the App

| Source | Destination in app | Purpose |
|--------|-------------------|---------|
| `docs/extendscript-matchnames.md` | `src/assets/` | Prevent property errors |
| `docs/extendscript-patterns.md` | `src/assets/` | API patterns for Claude |
| `docs/design-reference.md` | `src/assets/` | Coordinates, safe areas |
| `brand/config.json` | `src/assets/brand/` | Colors, fonts |
| `brand/editing-style-guide.md` | `src/assets/brand/` | Style decisions |
| `scripts/lib/helpers.jsx` | `src/assets/scripts/lib/` | Installed to user's AE |

---

## What This Plan Does NOT Cover (Future)

- Windows support (osascript is macOS only — would need a different bridge)
- Multiple AE versions simultaneously
- Premiere Pro support
- Team analytics (who generated what)
- Asset management (organizing generated comps)
- Version control for templates
