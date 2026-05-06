app.beginUndoGroup("Iceberg Leaders Graphic");

(function() {
    // Include shared helpers
    var helpersFile = new File(new File($.fileName).parent.fsName + "/lib/helpers.jsx");
    if (helpersFile.exists) { $.evalFile(helpersFile); }

    var W = 3840, H = 2160;
    var cx = W/2, cy = H/2;

    // Brand colors
    var red = [0.812, 0.071, 0.071];
    var darkRed = [0.55, 0.05, 0.08];
    var charcoal = [0.2, 0.2, 0.22];
    var tan = [0.949, 0.91, 0.87];
    var lineColor = [0.12, 0.12, 0.12];
    var white = [1, 1, 1];

    // Find or create comp (UHD)
    var comp = findOrCreateComp("99% of Leaders - Iceberg", W, H, 8, 30);
    comp.bgColor = tan;

    // Helper: add a smooth flowing path with trim draw-on
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
    // ICEBERG LINE ART (scaled 2x for UHD)
    // ============================================================
    var iceLayer = comp.layers.addShape();
    iceLayer.name = "Iceberg_Lines";
    iceLayer.transform.position.setValue([cx, cy + 100]);

    // --- WATERLINE ---
    addFlowLine(iceLayer, "Waterline",
        [[-1100, 0], [-400, 0], [0, 0], [400, 0], [1100, 0]],
        [[0,0], [-240,0], [-160,0], [-160,0], [-240,0]],
        [[240,0], [160,0], [160,0], [240,0], [0,0]],
        false, 3, 55, 0.3, 1.0
    );

    // --- PEAK: main mountain ---
    addFlowLine(iceLayer, "Peak_Outline",
        [
            [-600, 0], [-300, -80], [-120, -220], [0, -360],
            [140, -200], [340, -70], [620, 0]
        ],
        [
            [0,0], [-120,30], [-80,60], [-50,80],
            [-60,-70], [-100,50], [-120,24]
        ],
        [
            [100,-20], [80,-50], [60,-70], [50,70],
            [90,50], [120,-30], [0,0]
        ],
        false, 3.6, 90, 0.4, 1.6
    );

    // --- PEAK: secondary ridge ---
    addFlowLine(iceLayer, "Peak_InnerRidge",
        [
            [-400, -20], [-200, -120], [-60, -240], [0, -300],
            [80, -220], [240, -100], [420, -16]
        ],
        [
            [0,0], [-80,30], [-60,50], [-30,40],
            [-30,-30], [-70,40], [-80,20]
        ],
        [
            [70,-24], [60,-40], [30,-40], [30,36],
            [60,-36], [80,-24], [0,0]
        ],
        false, 2.0, 65, 0.7, 1.3
    );

    // --- PEAK: snow line ---
    addFlowLine(iceLayer, "Peak_Snow",
        [[-120, -170], [-70, -230], [-20, -290], [20, -250], [60, -200], [110, -160]],
        [[0,0], [-16,20], [-10,20], [-10,-10], [-10,-16], [-16,-10]],
        [[16,-20], [10,-20], [10,10], [10,16], [16,10], [0,0]],
        false, 2.0, 65, 0.7, 1.0
    );

    // --- UNDERWATER: main body ---
    addFlowLine(iceLayer, "Under_MainOutline",
        [
            [-580, 10], [-560, 120], [-440, 260], [-280, 380],
            [-100, 460], [20, 520], [140, 450], [300, 350],
            [460, 220], [560, 100], [590, 10]
        ],
        [
            [0,0], [-40,-40], [-80,60], [-90,50],
            [-80,30], [-60,30], [-50,-30], [-80,-40],
            [-80,-60], [-50,-50], [-30,-36]
        ],
        [
            [30,40], [60,70], [80,60], [90,40],
            [70,36], [60,-24], [80,-50], [80,-60],
            [60,-60], [30,-40], [0,0]
        ],
        false, 3.0, 85, 0.8, 2.2
    );

    // --- UNDERWATER: contour 1 ---
    addFlowLine(iceLayer, "Under_Flow1",
        [[-500, 80], [-240, 150], [0, 180], [260, 140], [520, 70]],
        [[0,0], [-100,20], [-100,10], [-100,-10], [-100,-20]],
        [[100,-20], [100,-10], [100,10], [100,20], [0,0]],
        false, 2.0, 55, 1.0, 1.6
    );

    // --- UNDERWATER: contour 2 ---
    addFlowLine(iceLayer, "Under_Flow2",
        [[-420, 180], [-200, 260], [0, 310], [200, 280], [400, 190]],
        [[0,0], [-90,24], [-90,16], [-80,-10], [-90,-24]],
        [[80,-20], [80,-16], [90,10], [90,24], [0,0]],
        false, 2.0, 50, 1.3, 1.5
    );

    // --- UNDERWATER: contour 3 ---
    addFlowLine(iceLayer, "Under_Flow3",
        [[-320, 290], [-120, 370], [20, 420], [160, 380], [320, 290]],
        [[0,0], [-80,24], [-60,20], [-60,-16], [-70,-30]],
        [[70,-20], [60,-20], [60,16], [80,30], [0,0]],
        false, 2.0, 45, 1.6, 1.4
    );

    // --- UNDERWATER: inner swirl ---
    addFlowLine(iceLayer, "Under_Swirl",
        [[-240, 220], [-80, 300], [60, 360], [0, 310], [-100, 340], [20, 420]],
        [[0,0], [-70,20], [-60,20], [-30,-24], [-50,10], [-50,16]],
        [[60,-16], [60,-20], [40,30], [40,16], [60,-16], [0,0]],
        false, 1.6, 40, 1.8, 1.2
    );

    // --- UNDERWATER: bottom tendril ---
    addFlowLine(iceLayer, "Under_Tendril",
        [[-60, 400], [0, 480], [30, 530], [10, 480], [50, 500]],
        [[0,0], [-30,30], [-16,24], [-10,-20], [-20,10]],
        [[24,-24], [16,-24], [10,24], [20,10], [0,0]],
        false, 1.6, 40, 2.2, 1.0
    );

    // ============================================================
    // NUMBERED CIRCLES (overlapping chain reaction)
    // ============================================================
    var circleData = [
        { num: "1", y: cy - 80,  delay: 1.3 },
        { num: "2", y: cy + 140, delay: 1.6 },
        { num: "3", y: cy + 360, delay: 1.9 },
        { num: "4", y: cy + 560, delay: 2.2 }
    ];

    for (var c = 0; c < circleData.length; c++) {
        var cd = circleData[c];

        // Circle
        var cl = comp.layers.addShape();
        cl.name = "Circle_" + cd.num;
        var cg = cl.content.addProperty("ADBE Vector Group");
        cg.content.addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([100, 100]);
        cg.content.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(darkRed);
        cl.transform.position.setValue([cx, cd.y]);
        appleReveal(cl, cd.delay, 0.5, 40, 15);

        // Number
        var nl = comp.layers.addText(cd.num);
        nl.name = "Num_" + cd.num;
        var nd = nl.sourceText.value;
        nd.font = "Bodoni72-BookItalic";
        nd.fontSize = 56;
        nd.fillColor = white;
        nd.justification = ParagraphJustification.CENTER_JUSTIFY;
        nl.sourceText.setValue(nd);
        centerTextAnchor(nl);
        nl.transform.position.setValue([cx, cd.y]);
        appleReveal(nl, cd.delay, 0.5, 40, 12);
    }

    // ============================================================
    // TITLE TEXT
    // ============================================================
    var thinkLayer = comp.layers.addText("THINK LIKE THIS");
    thinkLayer.name = "Title_ThinkLikeThis";
    var td = thinkLayer.sourceText.value;
    td.font = "Bodoni72-BookItalic";
    td.fontSize = 260;
    td.fillColor = red;
    td.tracking = 60;
    td.justification = ParagraphJustification.CENTER_JUSTIFY;
    thinkLayer.sourceText.setValue(td);
    centerTextAnchor(thinkLayer);
    thinkLayer.transform.position.setValue([cx, 430]);
    fadeSlideIn(thinkLayer, 0.15, 0.8, 40);
    var ts = thinkLayer.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    ts.property("Opacity").setValue(25);
    ts.property("Distance").setValue(8);
    ts.property("Softness").setValue(24);

    var leadersLayer = comp.layers.addText("99% OF LEADERS");
    leadersLayer.name = "Title_99Percent";
    var ld = leadersLayer.sourceText.value;
    ld.font = "Akkordeon-Nine";
    ld.fontSize = 144;
    ld.fillColor = charcoal;
    ld.tracking = 200;
    ld.justification = ParagraphJustification.CENTER_JUSTIFY;
    leadersLayer.sourceText.setValue(ld);
    centerTextAnchor(leadersLayer);
    leadersLayer.transform.position.setValue([cx, 230]);
    fadeSlideIn(leadersLayer, 0.0, 0.7, 30);
    var ls = leadersLayer.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    ls.property("Opacity").setValue(15);
    ls.property("Distance").setValue(6);
    ls.property("Softness").setValue(16);

    comp.openInViewer();
})();

app.endUndoGroup();
