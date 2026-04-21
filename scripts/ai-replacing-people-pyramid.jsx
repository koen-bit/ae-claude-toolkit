app.beginUndoGroup("AI Replacing People Pyramid");

(function() {
    // Include helpers
    var helpersFile = new File(new File($.fileName).parent.parent.fsName + "/scripts/lib/helpers.jsx");
    if (helpersFile.exists) { $.evalFile(helpersFile); }

    var W = 3840, H = 2160;
    var cx = W / 2, cy = H / 2;

    // — Colors —
    var teal = [0.431, 0.973, 0.992];
    var darkBlue = [0.05, 0.1, 0.25];
    var bgDark = [0.055, 0.065, 0.11];
    var white = [1, 1, 1];

    // — Comp —
    var comp = findOrCreateComp("AI Replacing People", W, H, 8, 30);

    // — Pyramid geometry (relative to comp center) —
    var apexY = -500, baseY = 790;
    var totalH = baseY - apexY;
    var baseHW = 1100;
    function hw(y) { return baseHW * (y - apexY) / totalH; }

    var gap = 55;
    var t3Top = apexY, t3Bot = -190;
    var t2Top = t3Bot + gap, t2Bot = 230;
    var t1Top = t2Bot + gap, t1Bot = baseY;

    // ============ BUILD LAYERS (bottom to top) ============

    // BG solid
    comp.layers.addSolid(bgDark, "BG_Base", W, H, 1);

    // BG center glow — large blurred ellipse
    var bgGlow = comp.layers.addShape();
    bgGlow.name = "BG_CenterGlow";
    var gg = bgGlow.content.addProperty("ADBE Vector Group"); gg.name = "Glow";
    gg.content.addProperty("ADBE Vector Shape - Ellipse")
      .property("ADBE Vector Ellipse Size").setValue([3200, 2000]);
    var gf = gg.content.addProperty("ADBE Vector Graphic - Fill");
    gf.property("ADBE Vector Fill Color").setValue([0.09, 0.12, 0.22]);
    gf.property("ADBE Vector Fill Opacity").setValue(55);
    var gBlur = bgGlow.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
    gBlur.property("Blurriness").setValue(350);
    try { gBlur.property("Repeat Edge Pixels").setValue(1); } catch(e) {}

    // — Tier builder —
    function makeTier(name, verts) {
        var lyr = comp.layers.addShape(); lyr.name = name;
        var g = lyr.content.addProperty("ADBE Vector Group"); g.name = "Shape";
        var p = g.content.addProperty("ADBE Vector Shape - Group");
        var s = new Shape(); s.vertices = verts; s.closed = true;
        p.property("ADBE Vector Shape").setValue(s);
        g.content.addProperty("ADBE Vector Graphic - Fill")
         .property("ADBE Vector Fill Color").setValue(teal);
        // Teal glow via drop shadow at distance 0
        var ds = lyr.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
        ds.property("ADBE Drop Shadow-0001").setValue(teal);
        ds.property("ADBE Drop Shadow-0002").setValue(120);
        ds.property("ADBE Drop Shadow-0003").setValue(0);
        ds.property("ADBE Drop Shadow-0004").setValue(0);
        ds.property("ADBE Drop Shadow-0005").setValue(80);
        return lyr;
    }

    var tier1 = makeTier("TIER_1", [
        [-hw(t1Top), t1Top], [hw(t1Top), t1Top],
        [hw(t1Bot), t1Bot], [-hw(t1Bot), t1Bot]
    ]);
    var tier2 = makeTier("TIER_2", [
        [-hw(t2Top), t2Top], [hw(t2Top), t2Top],
        [hw(t2Bot), t2Bot], [-hw(t2Bot), t2Bot]
    ]);
    var tier3 = makeTier("TIER_3", [
        [0, t3Top], [hw(t3Bot), t3Bot], [-hw(t3Bot), t3Bot]
    ]);

    // — Number texts —
    var numYs = [
        (t1Top + t1Bot) / 2,
        (t2Top + t2Bot) / 2,
        t3Top + (t3Bot - t3Top) * 0.6
    ];
    var numLyrs = [];
    for (var n = 0; n < 3; n++) {
        var nl = comp.layers.addText(String(n + 1));
        nl.name = "NUM_" + (n + 1);
        var td = nl.sourceText.value;
        td.font = "BBNonamePro-Bold";
        td.fontSize = 150;
        td.fillColor = darkBlue;
        td.justification = ParagraphJustification.CENTER_JUSTIFY;
        nl.sourceText.setValue(td);
        centerTextAnchor(nl);
        nl.transform.position.setValue([cx, cy + numYs[n]]);
        numLyrs.push(nl);
    }

    // — Callout dashed line —
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
    lStroke.property("ADBE Vector Stroke Color").setValue(white);
    lStroke.property("ADBE Vector Stroke Width").setValue(5);
    lStroke.property("ADBE Vector Stroke Opacity").setValue(75);
    var dashes = lStroke.property("ADBE Vector Stroke Dashes");
    dashes.addProperty("ADBE Vector Stroke Dash 1").setValue(20);
    dashes.addProperty("ADBE Vector Stroke Gap 1").setValue(16);

    // — Callout text —
    var callout = comp.layers.addText("AI-first people are\nreplacing other people");
    callout.name = "TXT_Callout";
    var cd = callout.sourceText.value;
    cd.font = "Bodoni72-BookItalic";
    cd.fontSize = 60;
    cd.fillColor = white;
    cd.justification = ParagraphJustification.LEFT_JUSTIFY;
    callout.sourceText.setValue(cd);
    callout.transform.position.setValue([220, 1470]);

    // — Title (topmost) —
    var title = comp.layers.addText("3 Ways AI Is Replacing People");
    title.name = "TXT_Title";
    var tt = title.sourceText.value;
    tt.font = "Bodoni72-BookItalic";
    tt.fontSize = 150;
    tt.fillColor = white;
    tt.tracking = 30;
    tt.justification = ParagraphJustification.CENTER_JUSTIFY;
    title.sourceText.setValue(tt);
    centerTextAnchor(title);
    title.transform.position.setValue([cx, 260]);
    // Drop shadow for depth
    var tds = title.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    tds.property("ADBE Drop Shadow-0001").setValue([0, 0, 0]);
    tds.property("ADBE Drop Shadow-0002").setValue(140);
    tds.property("ADBE Drop Shadow-0003").setValue(135);
    tds.property("ADBE Drop Shadow-0004").setValue(8);
    tds.property("ADBE Drop Shadow-0005").setValue(20);

    // ============ ANIMATION ============
    fadeSlideIn(title, 0, 0.6, 30);
    fadeSlideIn(tier1, 0.3, 0.5, 40);
    fadeSlideIn(tier2, 0.45, 0.5, 40);
    fadeSlideIn(tier3, 0.6, 0.5, 40);
    fadeSlideIn(numLyrs[0], 0.4, 0.4, 20);
    fadeSlideIn(numLyrs[1], 0.55, 0.4, 20);
    fadeSlideIn(numLyrs[2], 0.7, 0.4, 20);
    fadeSlideIn(callout, 0.9, 0.5, 20);
    fadeSlideIn(lineLyr, 0.9, 0.5, 20);

    comp.openInViewer();
})();

app.endUndoGroup();
