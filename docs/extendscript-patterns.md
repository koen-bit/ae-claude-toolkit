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

---

## Script Template

Every script should follow this structure:

```jsx
app.beginUndoGroup("Description of what this script does");

(function() {
    // Find or create comp
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        comp = app.project.items.addComp("Comp Name", 1920, 1080, 1, 6, 30);
    }

    // ... build layers, set properties, add keyframes ...

    comp.openInViewer();
})();

app.endUndoGroup();
```

---

## Finding a Comp by Name

```jsx
var comp = null;
for (var i = 1; i <= app.project.numItems; i++) {
    if (app.project.item(i) instanceof CompItem && app.project.item(i).name === "Comp Name") {
        comp = app.project.item(i);
        break;
    }
}
```

---

## Dead-Flat Easing (Smooth Ease-In/Ease-Out)

Default easing for all keyframes:
```jsx
new KeyframeEase(0, 85)  // speed=0, influence=85%
```

Must apply per-dimension for multi-dimensional properties (Position = 2 dims in 2D, 3 in 3D).

```jsx
function deadFlat(prop, keyIndex) {
    var dims = 1;
    try { dims = prop.value.length; } catch(e) { dims = 1; }
    var ease = new KeyframeEase(0, 85);
    if (dims > 1) {
        var arr = [];
        for (var d = 0; d < dims; d++) { arr.push(ease); }
        try { prop.setTemporalEaseAtKey(keyIndex, arr, arr); } catch(e) {}
    } else {
        try { prop.setTemporalEaseAtKey(keyIndex, [ease], [ease]); } catch(e) {}
    }
}

// Apply to a range of keys
function deadFlatAll(prop) {
    for (var k = 1; k <= prop.numKeys; k++) {
        deadFlat(prop, k);
    }
}
```

### Other Easing Styles (when requested)

```jsx
// Snappy (punchy UI motion)
new KeyframeEase(0, 80)  // in
new KeyframeEase(0, 20)  // out

// Punch (impact hits)
new KeyframeEase(0, 90)  // in
new KeyframeEase(0, 10)  // out

// Ease out only (elements entering)
new KeyframeEase(0, 70)  // in
new KeyframeEase(0, 0.1) // out (near-linear departure)

// Ease in only (elements exiting)
new KeyframeEase(0, 0.1) // in (near-linear arrival)
new KeyframeEase(0, 70)  // out
```

---

## Text Layers

```jsx
var textLayer = comp.layers.addText("HEADLINE");
var textDoc = textLayer.sourceText.value;
textDoc.font = "Helvetica-Bold";       // exact PostScript name
textDoc.fontSize = 48;
textDoc.fillColor = [1, 1, 1];         // RGB 0-1
textDoc.tracking = 120;
textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
textLayer.sourceText.setValue(textDoc);
```

### Centering Text Visually

Text anchor defaults to baseline-left. To center it so position = visual center:

```jsx
function centerTextAnchor(layer) {
    var rect = layer.sourceRectAtTime(0, false);
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    layer.transform.anchorPoint.setValue([cx, cy]);
}

// Usage:
var title = comp.layers.addText("MAIN TITLE");
// ... set text properties first ...
centerTextAnchor(title);
title.transform.position.setValue([960, 500]); // now truly centered
```

For left-justified text, anchor is at baseline-left by default. Position Y = baseline, text extends ~70% of fontSize above it.

---

## Shape Layers

```jsx
var shapeLayer = comp.layers.addShape();
shapeLayer.name = "BG_Card";

var group = shapeLayer.content.addProperty("ADBE Vector Group");
group.name = "Card";

// Add rect — position is CENTER of the rect
var rect = group.content.addProperty("ADBE Vector Shape - Rect");
rect.property("ADBE Vector Rect Size").setValue([430, 110]);
rect.property("ADBE Vector Rect Position").setValue([0, 0]);  // centered on layer position
rect.property("ADBE Vector Rect Roundness").setValue(8);

// Add fill
var fill = group.content.addProperty("ADBE Vector Graphic - Fill");
fill.property("ADBE Vector Fill Color").setValue([0.18, 0.19, 0.22]);

// Add stroke (border)
var stroke = group.content.addProperty("ADBE Vector Graphic - Stroke");
stroke.property("ADBE Vector Stroke Color").setValue([0.3, 0.32, 0.38]);
stroke.property("ADBE Vector Stroke Width").setValue(1.5);
stroke.property("ADBE Vector Stroke Opacity").setValue(40);

// Add trim paths (for paint-on/wipe reveals)
var trim = group.content.addProperty("ADBE Vector Filter - Trim");
trim.property("ADBE Vector Trim End").setValue(0); // animate to 100
```

### Multiple Shape Groups in One Layer

```jsx
// Background + accent bar in one layer
var bg = shapeLayer.content.addProperty("ADBE Vector Group");
bg.name = "Background";
// ... add rect + fill ...

var accent = shapeLayer.content.addProperty("ADBE Vector Group");
accent.name = "Accent Bar";
// ... add rect + fill with accent color ...
```

---

## Parenting

```jsx
childLayer.parent = parentLayer;
```

**Critical:** Set parenting BEFORE setting child positions. When parented, child position is relative to parent's anchor point, not comp origin.

---

## Keyframes

```jsx
var pos = layer.transform.position;
pos.setValueAtTime(0.5, [120, 930]);  // start position at 0.5s
pos.setValueAtTime(1.0, [120, 910]);  // end position at 1.0s

// Apply easing
deadFlat(pos, 1);  // first keyframe
deadFlat(pos, 2);  // second keyframe

// Set to bezier interpolation (required for easing to work)
pos.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
pos.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
```

---

## 3D Layers + Shadows

```jsx
layer.threeDLayer = true;

// Material options
var matOpts = layer.property("ADBE Material Options Group");
matOpts.property("ADBE Casts Shadows").setValue(1);    // 1 = on
matOpts.property("ADBE Accepts Shadows").setValue(1);

// Add point light
var light = comp.layers.addLight("Key Light", [960, 540]);
var lightOpts = light.property("ADBE Light Options Group");
lightOpts.property("ADBE Casts Shadows").setValue(1);
lightOpts.property("ADBE Shadow Darkness").setValue(75);
lightOpts.property("ADBE Shadow Diffusion").setValue(30);
// Shadow Darkness 75% + Diffusion 30px = nice soft shadow
```

**Gotcha:** Lights and cameras are NOT AVLayer — skip them when setting threeDLayer.

---

## Layer Type Checks

```jsx
layer instanceof AVLayer      // solids, footage, precomps
layer instanceof TextLayer    // text
layer instanceof ShapeLayer   // shapes
// Lights and cameras are NOT AVLayer
```

---

## Effects

```jsx
var effect = layer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
effect.property("Blurriness").setValue(10);

// Common effect matchNames:
// "ADBE Gaussian Blur 2" — Gaussian Blur
// "ADBE Drop Shadow"     — Drop Shadow
// "ADBE Glo2"            — Glow
// "ADBE Fill"            — Fill
// "ADBE Tritone"         — Tritone
```

---

## Expressions

```jsx
layer.transform.rotation.expression = "time * 90";
layer.transform.position.expression = "wiggle(2, 30)";
```

---

## Position Gotchas

- Layer indices are **1-based** in ExtendScript
- After enabling 3D, position gains a Z component: `[x, y]` becomes `[x, y, z]`
- Shape rect `position` = CENTER of rect, not corner
- Text anchor = baseline-left (for left-justified). Use `sourceRectAtTime` to recenter
- New layers default to comp center `[width/2, height/2]` — always set position explicitly
- Set parenting BEFORE child positions to avoid coordinate space confusion
