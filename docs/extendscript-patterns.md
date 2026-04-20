# After Effects ExtendScript Patterns

## Workflow: .jsx Scripts vs MCP Bridge
- **Always default to standalone .jsx scripts** for building/animating — runs inside AE in one shot, sub-second even for hundreds of layers
- **MCP bridge is slow** — one API round trip per command, unusable for bulk ops
- **Use bridge only for small targeted tweaks** after the comp is built

### MCP bridge CAN do (single-layer tweaks):
- Set keyframes (position, scale, rotation, opacity) on a specific layer
- Set or remove expressions on any property
- Apply effects (Gaussian blur, directional blur, color balance, brightness/contrast, curves, glow, drop shadow)
- Apply effect templates (cinematic-look, text-pop, etc.)
- Read/inspect project info, comps, layers

### MCP bridge CANNOT do (need .jsx script):
- Create, delete, or reorder layers
- Bulk operations (anything touching many layers)
- Toggle 3D layer, material options (shadow cast/receive)
- Parenting, masks, track mattes
- Create/resize comps, import footage
- Add lights or cameras

## ExtendScript Patterns

### Finding a comp by name
```jsx
var comp = null;
for (var i = 1; i <= app.project.numItems; i++) {
    if (app.project.item(i) instanceof CompItem && app.project.item(i).name === "Comp Name") {
        comp = app.project.item(i);
        break;
    }
}
```

### Dead-flat easing (smooth ease-in/ease-out)
```jsx
new KeyframeEase(0, 85)  // speed=0, influence=85%
```
Must apply per-dimension for multi-dimensional properties (Position = 3 dims when 3D).

```jsx
function deadFlat(prop, k1, k2) {
    var dims = 1;
    try { dims = prop.value.length; } catch(e) { dims = 1; }
    var eIn = new KeyframeEase(0, 85);
    var eOut = new KeyframeEase(0, 85);
    if (dims > 1) {
        var arrIn = []; var arrOut = [];
        for (var d = 0; d < dims; d++) { arrIn.push(eIn); arrOut.push(eOut); }
        try {
            prop.setTemporalEaseAtKey(k1, arrIn, arrOut);
            prop.setTemporalEaseAtKey(k2, arrIn, arrOut);
        } catch(e) {}
    } else {
        try {
            prop.setTemporalEaseAtKey(k1, [eIn], [eOut]);
            prop.setTemporalEaseAtKey(k2, [eIn], [eOut]);
        } catch(e) {}
    }
}
```

### 3D layers + shadows
- `layer.threeDLayer = true` — makes any AV/Text/Shape layer 3D
- Material Options match strings: `"ADBE Material Options Group"`, `"ADBE Casts Shadows"`, `"ADBE Accepts Shadows"`
- Light shadow properties: `"ADBE Casts Shadows"`, `"ADBE Shadow Darkness"`, `"ADBE Shadow Diffusion"` (under `"ADBE Light Options Group"`)
- Point light: `comp.layers.addLight("Name", [centerX, centerY])`
- Shadow Darkness 75% + Diffusion 30px = nice soft shadow

### Layer type checks
- `layer instanceof AVLayer` — solids, footage, precomps
- `layer instanceof TextLayer` — text
- `layer instanceof ShapeLayer` — shapes
- Lights and cameras are NOT AVLayer — skip them when setting threeDLayer

### Position keyframes
- 2D position: `[x, y]` — 3D position: `[x, y, z]`
- After enabling 3D, position gains a Z component
- When adding keyframes to existing animated properties, use `addKey()` which returns the key index

### Always wrap in undo group
```jsx
app.beginUndoGroup("Description");
// ... all operations ...
app.endUndoGroup();
```
This lets the user Cmd+Z the entire script as one action.
