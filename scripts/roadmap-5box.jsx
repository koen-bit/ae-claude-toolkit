app.beginUndoGroup("5-Box Roadmap");

(function() {
    var helpersFile = new File(new File($.fileName).parent.fsName + "/lib/helpers.jsx");
    if (helpersFile.exists) { $.evalFile(helpersFile); }

    var W = 3840, H = 2160;
    var cx = W/2, cy = H/2;

    // Brand blues
    var black = [0.05, 0.05, 0.06];
    var deepBlue = [0.04, 0.09, 0.22];
    var buyBackBlue = [0.0, 0.635, 1.0];
    var teal = [0.431, 0.973, 0.992];
    var white = [1, 1, 1];

    var comp = findOrCreateComp("5-Box Roadmap", W, H, 8, 30);
    comp.bgColor = black;

    // ---- LAYOUT (fill the space) ----
    var boxSize = 520;
    var boxRound = 70;

    // Zigzag layout: reads left to right, alternating bottom/top
    var topY = 650;
    var botY = 1500;

    // 5 columns spread across the canvas
    var x1 = 560;
    var x2 = 1240;
    var x3 = 1920;
    var x4 = 2600;
    var x5 = 3280;

    // 1=bot-left, 2=top, 3=bot, 4=top, 5=bot-right
    var boxes = [
        { num: "1", x: x1, y: botY },
        { num: "2", x: x2, y: topY },
        { num: "3", x: x3, y: botY },
        { num: "4", x: x4, y: topY },
        { num: "5", x: x5, y: botY }
    ];

    // ---- DASHED LINE ----
    // Shape layers default position = [cx, cy], so path vertices must be relative to center
    var lineLayer = comp.layers.addShape();
    lineLayer.name = "BG_DashedPath";

    var lineGrp = lineLayer.content.addProperty("ADBE Vector Group");
    lineGrp.name = "Flow Line";
    var linePath = lineGrp.content.addProperty("ADBE Vector Shape - Group");
    var ls = new Shape();

    // Flowing S-curve snaking through zigzag boxes
    // Vertices relative to comp center [1920, 1080]
    // Path: box1(bot) → up to box2(top) → down to box3(bot) → up to box4(top) → down to box5(bot)
    ls.vertices = [
        [x1 - cx, botY - cy],     // box 1 (bottom)
        [x2 - cx, topY - cy],     // box 2 (top)
        [x3 - cx, botY - cy],     // box 3 (bottom)
        [x4 - cx, topY - cy],     // box 4 (top)
        [x5 - cx, botY - cy]      // box 5 (bottom)
    ];
    // Big smooth tangents for flowing S-curves between each box
    ls.inTangents = [
        [0, 0],
        [-200, 300],
        [-200, -300],
        [-200, 300],
        [-200, -300]
    ];
    ls.outTangents = [
        [200, -300],
        [200, 300],
        [200, -300],
        [200, 300],
        [0, 0]
    ];
    ls.closed = false;
    linePath.property("ADBE Vector Shape").setValue(ls);

    var lineStroke = lineGrp.content.addProperty("ADBE Vector Graphic - Stroke");
    lineStroke.property("ADBE Vector Stroke Color").setValue(teal);
    lineStroke.property("ADBE Vector Stroke Width").setValue(6);
    lineStroke.property("ADBE Vector Stroke Opacity").setValue(45);
    lineStroke.property("ADBE Vector Stroke Line Cap").setValue(2);

    var dashes = lineStroke.property("ADBE Vector Stroke Dashes");
    dashes.addProperty("ADBE Vector Stroke Dash 1").setValue(35);
    dashes.addProperty("ADBE Vector Stroke Gap 1").setValue(28);

    var lineTrimEnd = lineGrp.content.addProperty("ADBE Vector Filter - Trim").property("ADBE Vector Trim End");
    lineTrimEnd.setValueAtTime(0.3, 0);
    lineTrimEnd.setValueAtTime(4.5, 100);
    bezierAll(lineTrimEnd); deadFlatAll(lineTrimEnd);

    // Glow duplicate behind the line
    var glowLayer = comp.layers.addShape();
    glowLayer.name = "BG_PathGlow";
    var glowGrp = glowLayer.content.addProperty("ADBE Vector Group");
    var glowPathProp = glowGrp.content.addProperty("ADBE Vector Shape - Group");
    glowPathProp.property("ADBE Vector Shape").setValue(ls);
    var glowStroke = glowGrp.content.addProperty("ADBE Vector Graphic - Stroke");
    glowStroke.property("ADBE Vector Stroke Color").setValue(teal);
    glowStroke.property("ADBE Vector Stroke Width").setValue(18);
    glowStroke.property("ADBE Vector Stroke Opacity").setValue(15);
    glowStroke.property("ADBE Vector Stroke Line Cap").setValue(2);
    var glowDashes = glowStroke.property("ADBE Vector Stroke Dashes");
    glowDashes.addProperty("ADBE Vector Stroke Dash 1").setValue(35);
    glowDashes.addProperty("ADBE Vector Stroke Gap 1").setValue(28);
    var glowTrimEnd = glowGrp.content.addProperty("ADBE Vector Filter - Trim").property("ADBE Vector Trim End");
    glowTrimEnd.setValueAtTime(0.3, 0);
    glowTrimEnd.setValueAtTime(4.5, 100);
    bezierAll(glowTrimEnd); deadFlatAll(glowTrimEnd);

    var glowBlur = glowLayer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
    glowBlur.property("Blurriness").setValue(35);

    // ---- BOXES + NUMBERS ----
    var boxDelays = [0.6, 1.4, 2.2, 3.0, 3.8];

    for (var b = 0; b < boxes.length; b++) {
        var box = boxes[b];
        var delay = boxDelays[b];

        // Box shape
        var boxLayer = comp.layers.addShape();
        boxLayer.name = "Box_" + box.num;

        // Fill
        var fillGrp = boxLayer.content.addProperty("ADBE Vector Group");
        fillGrp.name = "Fill";
        var fillRect = fillGrp.content.addProperty("ADBE Vector Shape - Rect");
        fillRect.property("ADBE Vector Rect Size").setValue([boxSize, boxSize]);
        fillRect.property("ADBE Vector Rect Roundness").setValue(boxRound);
        fillGrp.content.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(deepBlue);

        // Border glow
        var borderGrp = boxLayer.content.addProperty("ADBE Vector Group");
        borderGrp.name = "Border";
        var borderRect = borderGrp.content.addProperty("ADBE Vector Shape - Rect");
        borderRect.property("ADBE Vector Rect Size").setValue([boxSize, boxSize]);
        borderRect.property("ADBE Vector Rect Roundness").setValue(boxRound);
        var bStroke = borderGrp.content.addProperty("ADBE Vector Graphic - Stroke");
        bStroke.property("ADBE Vector Stroke Color").setValue(buyBackBlue);
        bStroke.property("ADBE Vector Stroke Width").setValue(4);
        bStroke.property("ADBE Vector Stroke Opacity").setValue(60);

        boxLayer.transform.position.setValue([box.x, box.y]);

        // Subtle glow
        var glow = boxLayer.property("ADBE Effect Parade").addProperty("ADBE Glo2");
        glow.property("Glow Threshold").setValue(60);
        glow.property("Glow Radius").setValue(50);
        glow.property("Glow Intensity").setValue(0.4);

        // Shadow
        var shadow = boxLayer.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
        shadow.property("Opacity").setValue(40);
        shadow.property("Direction").setValue(180);
        shadow.property("Distance").setValue(12);
        shadow.property("Softness").setValue(50);

        // Reveal
        appleReveal(boxLayer, delay, 0.5, 60, 25);

        // Number
        var numLayer = comp.layers.addText(box.num);
        numLayer.name = "Num_" + box.num;
        var nd = numLayer.sourceText.value;
        nd.font = "BBNonamePro-Bold";
        nd.fontSize = 180;
        nd.fillColor = white;
        nd.justification = ParagraphJustification.CENTER_JUSTIFY;
        numLayer.sourceText.setValue(nd);
        centerTextAnchor(numLayer);
        numLayer.transform.position.setValue([box.x, box.y]);

        var numShadow = numLayer.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
        numShadow.property("Opacity").setValue(25);
        numShadow.property("Distance").setValue(4);
        numShadow.property("Softness").setValue(10);

        appleReveal(numLayer, delay + 0.1, 0.4, 35, 15);
    }

    comp.openInViewer();
})();

app.endUndoGroup();
