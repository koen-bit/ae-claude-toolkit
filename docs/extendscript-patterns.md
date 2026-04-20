# After Effects ExtendScript Patterns

Technical reference for ExtendScript API. For workflow rules see `CLAUDE.md`. For positioning and design see `docs/design-reference.md`.

---

## Script Template

```jsx
app.beginUndoGroup("Description of what this script does");

(function() {
    // Include helpers
    var helpersFile = new File(new File($.fileName).parent.parent.fsName + "/scripts/lib/helpers.jsx");
    if (helpersFile.exists) { $.evalFile(helpersFile); }

    var W = 3840, H = 2160; // UHD default
    var cx = W/2, cy = H/2;

    // Find or create comp
    var compName = "My Comp";
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem && app.project.item(i).name === compName) {
            comp = app.project.item(i);
            break;
        }
    }
    if (comp) {
        while (comp.numLayers > 0) comp.layer(1).remove(); // clear for rebuild
    } else {
        comp = app.project.items.addComp(compName, W, H, 1, 8, 30);
    }

    // ... build layers, set properties, add keyframes ...

    comp.openInViewer();
})();

app.endUndoGroup();
```

---

## Easing Helpers

### Dead-flat (default — smooth ease both sides)

```jsx
new KeyframeEase(0, 85)  // speed=0, influence=85%
```

Dimension-aware application:

```jsx
function deadFlat(prop, keyIndex) {
    var dims = 1;
    try { dims = prop.value.length; } catch(e) {}
    var ease = new KeyframeEase(0, 85);
    var arr = [];
    for (var d = 0; d < (dims > 1 ? dims : 1); d++) arr.push(ease);
    try { prop.setTemporalEaseAtKey(keyIndex, arr, arr); } catch(e) {}
}

function deadFlatAll(prop) {
    for (var k = 1; k <= prop.numKeys; k++) deadFlat(prop, k);
}
```

### Apple-style (fast start, smooth stop — deceleration curve)

```jsx
function appleEase(prop, k1, k2) {
    var dims = 1;
    try { dims = prop.value.length; } catch(e) {}
    var fast = new KeyframeEase(0, 5);
    var smooth = new KeyframeEase(0, 90);
    var arrFast = [], arrSmooth = [];
    for (var d = 0; d < (dims > 1 ? dims : 1); d++) {
        arrFast.push(fast);
        arrSmooth.push(smooth);
    }
    try {
        prop.setTemporalEaseAtKey(k1, arrFast, arrFast);
        prop.setTemporalEaseAtKey(k2, arrSmooth, arrSmooth);
    } catch(e) {}
}
```

### Setting bezier interpolation (required before easing)

```jsx
function bezierAll(prop) {
    for (var k = 1; k <= prop.numKeys; k++)
        prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
}
```

### Other easing styles (when requested)

```jsx
// Snappy (punchy UI motion)
new KeyframeEase(0, 80)  // in
new KeyframeEase(0, 20)  // out

// Punch (impact hits)
new KeyframeEase(0, 90)  // in
new KeyframeEase(0, 10)  // out

// Ease out only (elements entering)
new KeyframeEase(0, 70)  // in
new KeyframeEase(0, 5)   // out (near-linear departure)

// Ease in only (elements exiting)
new KeyframeEase(0, 5)   // in (near-linear arrival)
new KeyframeEase(0, 70)  // out
```

---

## Text Layers

```jsx
var textLayer = comp.layers.addText("HEADLINE");
var textDoc = textLayer.sourceText.value;
textDoc.font = "Helvetica-Bold";       // exact PostScript name
textDoc.fontSize = 96;                 // scale for UHD
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
    layer.transform.anchorPoint.setValue([
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
    ]);
}
```

Set text properties FIRST, then call `centerTextAnchor()`, then set position.

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
rect.property("ADBE Vector Rect Size").setValue([860, 220]);
rect.property("ADBE Vector Rect Position").setValue([0, 0]);
rect.property("ADBE Vector Rect Roundness").setValue(16);

// Add fill
var fill = group.content.addProperty("ADBE Vector Graphic - Fill");
fill.property("ADBE Vector Fill Color").setValue([0.18, 0.19, 0.22]);

// Add stroke (border)
var stroke = group.content.addProperty("ADBE Vector Graphic - Stroke");
stroke.property("ADBE Vector Stroke Color").setValue([0.3, 0.32, 0.38]);
stroke.property("ADBE Vector Stroke Width").setValue(3);
stroke.property("ADBE Vector Stroke Opacity").setValue(40);

// Add trim paths (for paint-on/wipe reveals)
var trim = group.content.addProperty("ADBE Vector Filter - Trim");
trim.property("ADBE Vector Trim End").setValue(0); // animate to 100
```

### Multiple Shape Groups in One Layer

```jsx
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
pos.setValueAtTime(0.5, [240, 1860]);
pos.setValueAtTime(1.0, [240, 1820]);

bezierAll(pos);
deadFlatAll(pos);
```

---

## 3D Layers + Shadows

```jsx
layer.threeDLayer = true;

var matOpts = layer.property("ADBE Material Options Group");
matOpts.property("ADBE Casts Shadows").setValue(1);
matOpts.property("ADBE Accepts Shadows").setValue(1);

var light = comp.layers.addLight("Key Light", [1920, 1080]);
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
effect.property("Blurriness").setValue(20);

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
- Text anchor = baseline-left (for left-justified). Use `centerTextAnchor()` to recenter
- New layers default to comp center `[width/2, height/2]` — always set position explicitly
- Set parenting BEFORE child positions to avoid coordinate space confusion
