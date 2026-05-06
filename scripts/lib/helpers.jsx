// helpers.jsx — Shared helpers for AE Claude Toolkit scripts
// Include in scripts via:
//   var helpersFile = new File(new File($.fileName).parent.parent.fsName + "/scripts/lib/helpers.jsx");
//   if (helpersFile.exists) { $.evalFile(helpersFile); }

// ============================================================
// EASING
// ============================================================

// Dead-flat easing (smooth ease both sides, influence 85%)
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

// Apple-style easing (fast start, smooth stop — deceleration curve)
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

// Set bezier interpolation on all keys (required before easing)
function bezierAll(prop) {
    for (var k = 1; k <= prop.numKeys; k++)
        prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
}

// ============================================================
// TEXT
// ============================================================

// Recenter anchor to visual center (for center-justified text)
function centerTextAnchor(layer) {
    var rect = layer.sourceRectAtTime(0, false);
    layer.transform.anchorPoint.setValue([
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
    ]);
}

// ============================================================
// ANIMATION PRESETS
// ============================================================

// Fade in + slide up with dead-flat easing
function fadeSlideIn(layer, startTime, duration, yOffset) {
    var pos = layer.transform.position;
    var base = pos.value;
    pos.setValueAtTime(startTime, [base[0], base[1] + yOffset]);
    pos.setValueAtTime(startTime + duration, base);
    bezierAll(pos); deadFlatAll(pos);
    var opa = layer.transform.opacity;
    opa.setValueAtTime(startTime, 0);
    opa.setValueAtTime(startTime + duration, 100);
    bezierAll(opa); deadFlatAll(opa);
}

// Fade in + slide up with Apple-style easing + gaussian blur clear
function appleReveal(layer, startTime, duration, yOffset, blurAmount) {
    var pos = layer.transform.position;
    var base = pos.value;
    pos.setValueAtTime(startTime, [base[0], base[1] + yOffset]);
    pos.setValueAtTime(startTime + duration, base);
    bezierAll(pos); appleEase(pos, 1, 2);

    var opa = layer.transform.opacity;
    opa.setValueAtTime(startTime, 0);
    opa.setValueAtTime(startTime + duration, 100);
    bezierAll(opa); appleEase(opa, 1, 2);

    if (blurAmount) {
        var blur = layer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
        var blurP = blur.property("Blurriness");
        blurP.setValueAtTime(startTime, blurAmount);
        blurP.setValueAtTime(startTime + duration, 0);
        bezierAll(blurP); appleEase(blurP, 1, 2);
    }
}

// ============================================================
// COMP MANAGEMENT
// ============================================================

// Find comp by name, clear it for rebuild or create new
function findOrCreateComp(name, width, height, duration, frameRate) {
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem && app.project.item(i).name === name) {
            comp = app.project.item(i);
            break;
        }
    }
    if (comp) {
        while (comp.numLayers > 0) comp.layer(1).remove();
    } else {
        comp = app.project.items.addComp(name, width || 3840, height || 2160, 1, duration || 8, frameRate || 30);
    }
    return comp;
}
