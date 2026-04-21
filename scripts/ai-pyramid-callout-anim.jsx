app.beginUndoGroup("Fix Callout Animation");

(function() {
    var helpersFile = new File(new File($.fileName).parent.parent.fsName + "/scripts/lib/helpers.jsx");
    if (helpersFile.exists) { $.evalFile(helpersFile); }

    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem && app.project.item(i).name === "AI Replacing People") {
            comp = app.project.item(i); break;
        }
    }
    if (!comp) { alert("Comp not found"); return; }

    function findLayer(name) {
        for (var j = 1; j <= comp.numLayers; j++) {
            if (comp.layer(j).name === name) return comp.layer(j);
        }
        return null;
    }

    // ============ REBUILD LINE_Callout ============
    var oldLine = findLayer("LINE_Callout");
    var lineIdx = oldLine ? oldLine.index : null;
    if (oldLine) oldLine.remove();

    var lineLyr = comp.layers.addShape();
    lineLyr.name = "LINE_Callout";
    var lg = lineLyr.content.addProperty("ADBE Vector Group"); lg.name = "Dash";
    var lp = lg.content.addProperty("ADBE Vector Shape - Group");
    var ls = new Shape();
    ls.vertices = [[-1500, 500], [-750, 350]];
    ls.outTangents = [[80, 180], [0, 0]];
    ls.inTangents = [[0, 0], [-250, 100]];
    ls.closed = false;
    lp.property("ADBE Vector Shape").setValue(ls);
    var lStroke = lg.content.addProperty("ADBE Vector Graphic - Stroke");
    lStroke.property("ADBE Vector Stroke Color").setValue([1, 1, 1]);
    lStroke.property("ADBE Vector Stroke Width").setValue(5);
    lStroke.property("ADBE Vector Stroke Opacity").setValue(75);
    var dashes = lStroke.property("ADBE Vector Stroke Dashes");
    dashes.addProperty("ADBE Vector Stroke Dash 1").setValue(20);
    dashes.addProperty("ADBE Vector Stroke Gap 1").setValue(16);

    // Trim paths — reverse direction: Start 100→0
    var trim = lg.content.addProperty("ADBE Vector Filter - Trim");
    trim.property("ADBE Vector Trim End").setValue(100);
    var trimStart = trim.property("ADBE Vector Trim Start");
    trimStart.setValueAtTime(0.9, 100);
    trimStart.setValueAtTime(1.5, 0);
    bezierAll(trimStart); deadFlatAll(trimStart);

    // Move to correct stack position (below callout text)
    var calloutLyr = findLayer("TXT_Callout");
    if (calloutLyr) lineLyr.moveAfter(calloutLyr);

    // ============ FIX TXT_Callout ============
    calloutLyr = findLayer("TXT_Callout");
    if (calloutLyr) {
        // Clear all keyframes
        var cp = calloutLyr.transform.position;
        var co = calloutLyr.transform.opacity;
        while (cp.numKeys > 0) cp.removeKey(1);
        while (co.numKeys > 0) co.removeKey(1);
        cp.setValue([220, 1470]);
        co.setValue(100);

        // Remove ALL existing text animators (clean slate)
        var animators = calloutLyr.property("ADBE Text Properties").property("ADBE Text Animators");
        while (animators.numProperties > 0) animators.property(1).remove();

        // Fresh word-by-word reveal
        var animator = animators.addProperty("ADBE Text Animator");
        animator.name = "Word Reveal";
        animator.property("ADBE Text Animator Properties")
                .addProperty("ADBE Text Opacity").setValue(0);

        // Range selector — must be added explicitly
        var selector = animator.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
        selector.property("ADBE Text Percent End").setValue(100);

        // Based On = Words
        var advanced = selector.property("ADBE Text Range Advanced");
        advanced.property("ADBE Text Range Type2").setValue(3);

        // Animate Start 0→100 to reveal words left-to-right
        var rs = selector.property("ADBE Text Percent Start");
        rs.setValueAtTime(1.5, 0);
        rs.setValueAtTime(2.5, 100);
        bezierAll(rs); deadFlatAll(rs);
    }
})();

app.endUndoGroup();
