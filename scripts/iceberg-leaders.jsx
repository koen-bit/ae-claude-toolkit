app.beginUndoGroup("Iceberg Leaders Graphic");

(function() {
    var W = 1920, H = 1080;
    var cx = W/2, cy = H/2;

    var red = [0.812, 0.071, 0.071];
    var darkRed = [0.55, 0.05, 0.08];
    var charcoal = [0.2, 0.2, 0.22];
    var tan = [0.949, 0.91, 0.87];
    var lineColor = [0.12, 0.12, 0.12];
    var white = [1, 1, 1];

    // ---- FIND OR CREATE COMP ----
    var compName = "99% of Leaders - Iceberg";
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem && app.project.item(i).name === compName) {
            comp = app.project.item(i);
            break;
        }
    }
    if (comp) {
        // Clear all layers
        while (comp.numLayers > 0) comp.layer(1).remove();
    } else {
        comp = app.project.items.addComp(compName, W, H, 1, 8, 30);
    }
    comp.bgColor = tan;

    // ---- HELPERS ----
    function deadFlat(prop, k) {
        var dims = 1;
        try { dims = prop.value.length; } catch(e) {}
        var ease = new KeyframeEase(0, 85);
        var arr = [];
        for (var d = 0; d < (dims > 1 ? dims : 1); d++) arr.push(ease);
        try { prop.setTemporalEaseAtKey(k, arr, arr); } catch(e) {}
    }
    function deadFlatAll(prop) { for (var k = 1; k <= prop.numKeys; k++) deadFlat(prop, k); }

    // Apple-style easing: fast start (low influence out on k1), smooth stop (high influence in on k2)
    function appleEase(prop, k1, k2) {
        var dims = 1;
        try { dims = prop.value.length; } catch(e) {}
        var fastOut = new KeyframeEase(0, 5);
        var smoothIn = new KeyframeEase(0, 90);
        var arrFast = [], arrSmooth = [];
        for (var d = 0; d < (dims > 1 ? dims : 1); d++) {
            arrFast.push(fastOut);
            arrSmooth.push(smoothIn);
        }
        try {
            prop.setTemporalEaseAtKey(k1, arrFast, arrFast);
            prop.setTemporalEaseAtKey(k2, arrSmooth, arrSmooth);
        } catch(e) {}
    }
    function bezierAll(prop) {
        for (var k = 1; k <= prop.numKeys; k++)
            prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
    }
    function centerTextAnchor(layer) {
        var r = layer.sourceRectAtTime(0, false);
        layer.transform.anchorPoint.setValue([r.left + r.width/2, r.top + r.height/2]);
    }
    function fadeSlideIn(layer, t, dur, yOff) {
        var pos = layer.transform.position;
        var base = pos.value;
        pos.setValueAtTime(t, [base[0], base[1] + yOff]);
        pos.setValueAtTime(t + dur, base);
        bezierAll(pos); deadFlatAll(pos);
        var opa = layer.transform.opacity;
        opa.setValueAtTime(t, 0);
        opa.setValueAtTime(t + dur, 100);
        bezierAll(opa); deadFlatAll(opa);
    }

    // Add a smooth flowing path
    function addFlowLine(layer, name, verts, tanIn, tanOut, closed, strokeW, opacity, delay, drawDur) {
        var grp = layer.content.addProperty("ADBE Vector Group");
        grp.name = name;
        var pathProp = grp.content.addProperty("ADBE Vector Shape - Group");
        var s = new Shape();
        s.vertices = verts;
        s.inTangents = tanIn;
        s.outTangents = tanOut;
        s.closed = closed || false;
        pathProp.property("ADBE Vector Shape").setValue(s);

        var stroke = grp.content.addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("ADBE Vector Stroke Color").setValue(lineColor);
        stroke.property("ADBE Vector Stroke Width").setValue(strokeW);
        stroke.property("ADBE Vector Stroke Line Cap").setValue(2);
        stroke.property("ADBE Vector Stroke Line Join").setValue(2);
        stroke.property("ADBE Vector Stroke Opacity").setValue(opacity);

        var trim = grp.content.addProperty("ADBE Vector Filter - Trim");
        var te = trim.property("ADBE Vector Trim End");
        te.setValueAtTime(delay, 0);
        te.setValueAtTime(delay + drawDur, 100);
        bezierAll(te); deadFlatAll(te);
    }

    // ============================================================
    // BG
    // ============================================================
    comp.layers.addSolid(tan, "BG_Cream", W, H, 1);

    // ============================================================
    // ICEBERG LINE ART — smooth flowing bezier curves
    // Key: use LARGE tangent handles (40-120px) for flowing curves
    // ============================================================
    var iceLayer = comp.layers.addShape();
    iceLayer.name = "Iceberg_Lines";
    iceLayer.transform.position.setValue([cx, cy + 50]);

    // --- WATERLINE ---
    addFlowLine(iceLayer, "Waterline",
        [[-550, 0], [-200, 0], [0, 0], [200, 0], [550, 0]],
        [[0,0], [-120,0], [-80,0], [-80,0], [-120,0]],
        [[120,0], [80,0], [80,0], [120,0], [0,0]],
        false, 1.2, 55, 0.3, 1.0
    );

    // --- PEAK: main mountain silhouette (few points, big smooth tangents) ---
    addFlowLine(iceLayer, "Peak_Outline",
        [
            [-300, 0],       // left base
            [-150, -40],     // left foothill
            [-60, -110],     // left shoulder
            [0, -180],       // summit
            [70, -100],      // right shoulder
            [170, -35],      // right foothill
            [310, 0]         // right base
        ],
        [
            [0, 0],
            [-60, 15],     // smooth approach from left
            [-40, 30],     // sweeping up
            [-25, 40],     // into summit
            [-30, -35],    // descending from summit
            [-50, 25],     // smooth descent
            [-60, 12]      // approaching base
        ],
        [
            [50, -10],     // leaving left base
            [40, -25],     // climbing
            [30, -35],     // steep climb
            [25, 35],      // over summit
            [45, 25],      // descending
            [60, -15],     // flattening
            [0, 0]
        ],
        false, 1.8, 90, 0.4, 1.6
    );

    // --- PEAK: secondary ridge (softer, inner line) ---
    addFlowLine(iceLayer, "Peak_InnerRidge",
        [
            [-200, -10],
            [-100, -60],
            [-30, -120],
            [0, -150],
            [40, -110],
            [120, -50],
            [210, -8]
        ],
        [
            [0, 0],
            [-40, 15],
            [-30, 25],
            [-15, 20],
            [-15, -15],
            [-35, 20],
            [-40, 10]
        ],
        [
            [35, -12],
            [30, -20],
            [15, -20],
            [15, 18],
            [30, -18],
            [40, -12],
            [0, 0]
        ],
        false, 1.0, 65, 0.7, 1.3
    );

    // --- UNDERWATER: main body — big sweeping organic outline ---
    addFlowLine(iceLayer, "Under_MainOutline",
        [
            [-290, 5],        // left waterline
            [-280, 60],       // curves down left
            [-220, 130],      // left body
            [-140, 190],      // lower left
            [-50, 230],       // approaching bottom
            [10, 260],        // bottom tip
            [70, 225],        // right rise
            [150, 175],       // right body
            [230, 110],       // upper right
            [280, 50],        // near waterline right
            [295, 5]          // right waterline
        ],
        [
            [0, 0],
            [-20, -20],
            [-40, 30],
            [-45, 25],
            [-40, 15],
            [-30, 15],
            [-25, -15],
            [-40, -20],
            [-40, -30],
            [-25, -25],
            [-15, -18]
        ],
        [
            [15, 20],
            [30, 35],
            [40, 30],
            [45, 20],
            [35, 18],
            [30, -12],
            [40, -25],
            [40, -30],
            [30, -30],
            [15, -20],
            [0, 0]
        ],
        false, 1.8, 85, 0.8, 2.2
    );

    // --- UNDERWATER: flowing contour 1 (upper sweep) ---
    addFlowLine(iceLayer, "Under_Flow1",
        [
            [-250, 40],
            [-120, 75],
            [0, 90],
            [130, 70],
            [260, 35]
        ],
        [
            [0, 0],
            [-50, 10],
            [-50, 5],
            [-50, -5],
            [-50, -10]
        ],
        [
            [50, -10],
            [50, -5],
            [50, 5],
            [50, 10],
            [0, 0]
        ],
        false, 1.0, 55, 1.0, 1.6
    );

    // --- UNDERWATER: flowing contour 2 (mid sweep) ---
    addFlowLine(iceLayer, "Under_Flow2",
        [
            [-210, 90],
            [-100, 130],
            [0, 155],
            [100, 140],
            [200, 95]
        ],
        [
            [0, 0],
            [-45, 12],
            [-45, 8],
            [-40, -5],
            [-45, -12]
        ],
        [
            [40, -10],
            [40, -8],
            [45, 5],
            [45, 12],
            [0, 0]
        ],
        false, 1.0, 50, 1.3, 1.5
    );

    // --- UNDERWATER: flowing contour 3 (lower) ---
    addFlowLine(iceLayer, "Under_Flow3",
        [
            [-160, 145],
            [-60, 185],
            [10, 210],
            [80, 190],
            [160, 145]
        ],
        [
            [0, 0],
            [-40, 12],
            [-30, 10],
            [-30, -8],
            [-35, -15]
        ],
        [
            [35, -10],
            [30, -10],
            [30, 8],
            [40, 15],
            [0, 0]
        ],
        false, 1.0, 45, 1.6, 1.4
    );

    // --- UNDERWATER: inner organic swirl ---
    addFlowLine(iceLayer, "Under_Swirl",
        [
            [-120, 110],
            [-40, 150],
            [30, 180],
            [0, 155],
            [-50, 170],
            [10, 210]
        ],
        [
            [0, 0],
            [-35, 10],
            [-30, 10],
            [-15, -12],
            [-25, 5],
            [-25, 8]
        ],
        [
            [30, -8],
            [30, -10],
            [20, 15],
            [20, 8],
            [30, -8],
            [0, 0]
        ],
        false, 0.8, 40, 1.8, 1.2
    );

    // --- UNDERWATER: bottom tendril ---
    addFlowLine(iceLayer, "Under_Tendril",
        [
            [-30, 200],
            [0, 240],
            [15, 265],
            [5, 240],
            [25, 250]
        ],
        [
            [0, 0],
            [-15, 15],
            [-8, 12],
            [-5, -10],
            [-10, 5]
        ],
        [
            [12, -12],
            [8, -12],
            [5, 12],
            [10, 5],
            [0, 0]
        ],
        false, 0.8, 40, 2.2, 1.0
    );

    // ============================================================
    // NUMBERED CIRCLES
    // ============================================================
    var circleData = [
        { num: "1", y: cy - 40,  delay: 1.3 },
        { num: "2", y: cy + 70,  delay: 1.6 },
        { num: "3", y: cy + 180, delay: 1.9 },
        { num: "4", y: cy + 280, delay: 2.2 }
    ];

    for (var c = 0; c < circleData.length; c++) {
        var cd = circleData[c];

        var cl = comp.layers.addShape();
        cl.name = "Circle_" + cd.num;
        var cg = cl.content.addProperty("ADBE Vector Group");
        cg.content.addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([50, 50]);
        cg.content.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(darkRed);

        cl.transform.position.setValue([cx, cd.y]);

        // Fade in + slide up — Apple-style: fast start, smooth stop
        var cPos = cl.transform.position;
        cPos.setValueAtTime(cd.delay, [cx, cd.y + 20]);
        cPos.setValueAtTime(cd.delay + 0.5, [cx, cd.y]);
        bezierAll(cPos); appleEase(cPos, 1, 2);

        var cOp = cl.transform.opacity;
        cOp.setValueAtTime(cd.delay, 0);
        cOp.setValueAtTime(cd.delay + 0.5, 100);
        bezierAll(cOp); appleEase(cOp, 1, 2);

        // Gaussian blur that clears as it comes in
        var cBlur = cl.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
        var cBlurP = cBlur.property("Blurriness");
        cBlurP.setValueAtTime(cd.delay, 15);
        cBlurP.setValueAtTime(cd.delay + 0.5, 0);
        bezierAll(cBlurP); appleEase(cBlurP, 1, 2);

        // Number text
        var nl = comp.layers.addText(cd.num);
        nl.name = "Num_" + cd.num;
        var nd = nl.sourceText.value;
        nd.font = "Bodoni72-BookItalic";
        nd.fontSize = 28;
        nd.fillColor = white;
        nd.justification = ParagraphJustification.CENTER_JUSTIFY;
        nl.sourceText.setValue(nd);
        centerTextAnchor(nl);
        nl.transform.position.setValue([cx, cd.y]);

        // Match circle — slide up + fade + blur, same Apple easing
        var nPos = nl.transform.position;
        nPos.setValueAtTime(cd.delay, [cx, cd.y + 20]);
        nPos.setValueAtTime(cd.delay + 0.5, [cx, cd.y]);
        bezierAll(nPos); appleEase(nPos, 1, 2);

        var nOp = nl.transform.opacity;
        nOp.setValueAtTime(cd.delay, 0);
        nOp.setValueAtTime(cd.delay + 0.5, 100);
        bezierAll(nOp); appleEase(nOp, 1, 2);

        var nBlur = nl.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
        var nBlurP = nBlur.property("Blurriness");
        nBlurP.setValueAtTime(cd.delay, 12);
        nBlurP.setValueAtTime(cd.delay + 0.5, 0);
        bezierAll(nBlurP); appleEase(nBlurP, 1, 2);
    }

    // ============================================================
    // TITLE TEXT
    // ============================================================
    var thinkLayer = comp.layers.addText("THINK LIKE THIS");
    thinkLayer.name = "Title_ThinkLikeThis";
    var td = thinkLayer.sourceText.value;
    td.font = "Bodoni72-BookItalic";
    td.fontSize = 130;
    td.fillColor = red;
    td.tracking = 60;
    td.justification = ParagraphJustification.CENTER_JUSTIFY;
    thinkLayer.sourceText.setValue(td);
    centerTextAnchor(thinkLayer);
    thinkLayer.transform.position.setValue([cx, 215]);
    fadeSlideIn(thinkLayer, 0.15, 0.8, 20);
    var ts = thinkLayer.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    ts.property("Opacity").setValue(25);
    ts.property("Distance").setValue(4);
    ts.property("Softness").setValue(12);

    var leadersLayer = comp.layers.addText("99% OF LEADERS");
    leadersLayer.name = "Title_99Percent";
    var ld = leadersLayer.sourceText.value;
    ld.font = "Akkordeon-Nine";
    ld.fontSize = 72;
    ld.fillColor = charcoal;
    ld.tracking = 200;
    ld.justification = ParagraphJustification.CENTER_JUSTIFY;
    leadersLayer.sourceText.setValue(ld);
    centerTextAnchor(leadersLayer);
    leadersLayer.transform.position.setValue([cx, 115]);
    fadeSlideIn(leadersLayer, 0.0, 0.7, 15);
    var ls = leadersLayer.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    ls.property("Opacity").setValue(15);
    ls.property("Distance").setValue(3);
    ls.property("Softness").setValue(8);

    comp.openInViewer();
})();

app.endUndoGroup();
