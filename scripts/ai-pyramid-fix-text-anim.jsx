app.beginUndoGroup("Fix Callout Text Animation");

(function() {
    var helpersFile = new File(new File($.fileName).parent.parent.fsName + "/scripts/lib/helpers.jsx");
    if (helpersFile.exists) { $.evalFile(helpersFile); }

    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem && app.project.item(i).name === "AI Replacing People") {
            comp = app.project.item(i); break;
        }
    }
    if (!comp) return;

    var calloutLyr = null;
    for (var j = 1; j <= comp.numLayers; j++) {
        if (comp.layer(j).name === "TXT_Callout") { calloutLyr = comp.layer(j); break; }
    }
    if (!calloutLyr) return;

    // Clean slate
    var animators = calloutLyr.property("ADBE Text Properties").property("ADBE Text Animators");
    while (animators.numProperties > 0) animators.property(1).remove();

    // Animator: opacity 0 + slide up 30px for selected (unrevealed) words
    var animator = animators.addProperty("ADBE Text Animator");
    animator.name = "Word Reveal";
    var props = animator.property("ADBE Text Animator Properties");
    props.addProperty("ADBE Text Opacity").setValue(0);
    props.addProperty("ADBE Text Position 3D").setValue([0, 30, 0]);

    // Range selector — sharp square shape, word-based
    var selector = animator.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    selector.property("ADBE Text Percent End").setValue(100);

    var advanced = selector.property("ADBE Text Range Advanced");
    advanced.property("ADBE Text Range Type2").setValue(3); // Words
    try { advanced.property("ADBE Text Range Shape").setValue(1); } catch(e) {} // Square
    try { advanced.property("ADBE Text Selector Smoothness").setValue(100); } catch(e) {} // Max overlap

    // Start 0→100: slower reveal with overlap between words
    var rs = selector.property("ADBE Text Percent Start");
    rs.setValueAtTime(1.5, 0);
    rs.setValueAtTime(3.5, 100);
    bezierAll(rs);
    appleEase(rs, 1, 2);
})();

app.endUndoGroup();
