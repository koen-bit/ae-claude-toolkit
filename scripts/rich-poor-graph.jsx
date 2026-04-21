app.beginUndoGroup("Rich vs Poor Graph");

(function() {
    var helpersFile = new File(new File($.fileName).parent.fsName + "/lib/helpers.jsx");
    if (helpersFile.exists) { $.evalFile(helpersFile); }

    var W = 3840, H = 2160;
    var cx = W/2, cy = H/2;

    var black = [0.06, 0.07, 0.08];
    var green = [0.341, 0.918, 0.227];     // brand green 57EA3A
    var red = [0.812, 0.071, 0.071];       // brand red CF1212
    var gridGrey = [0.35, 0.35, 0.38];
    var white = [1, 1, 1];

    var comp = findOrCreateComp("Rich vs Poor Graph", W, H, 7, 30);
    comp.bgColor = black;

    // ---- CHART AREA ----
    // Padded rectangle area for the graph
    var chartL = 360;   // left edge
    var chartR = 3480;  // right edge
    var chartT = 280;   // top edge
    var chartB = 1880;  // bottom edge
    var chartW = chartR - chartL;
    var chartH = chartB - chartT;

    // ---- GRID: outer border + 3 vertical dividers ----
    var gridLayer = comp.layers.addShape();
    gridLayer.name = "BG_Grid";

    // Outer border
    var borderGrp = gridLayer.content.addProperty("ADBE Vector Group");
    borderGrp.name = "Border";
    var borderPath = borderGrp.content.addProperty("ADBE Vector Shape - Group");
    var bs = new Shape();
    bs.vertices = [
        [chartL - cx, chartT - cy],
        [chartR - cx, chartT - cy],
        [chartR - cx, chartB - cy],
        [chartL - cx, chartB - cy]
    ];
    bs.inTangents = [[0,0],[0,0],[0,0],[0,0]];
    bs.outTangents = [[0,0],[0,0],[0,0],[0,0]];
    bs.closed = true;
    borderPath.property("ADBE Vector Shape").setValue(bs);
    var borderStroke = borderGrp.content.addProperty("ADBE Vector Graphic - Stroke");
    borderStroke.property("ADBE Vector Stroke Color").setValue(gridGrey);
    borderStroke.property("ADBE Vector Stroke Width").setValue(3);
    borderStroke.property("ADBE Vector Stroke Opacity").setValue(35);

    // 3 vertical divider lines (splitting chart into 4 columns)
    for (var v = 1; v <= 3; v++) {
        var vx = chartL + (chartW / 4) * v - cx;
        var vGrp = gridLayer.content.addProperty("ADBE Vector Group");
        vGrp.name = "VLine_" + v;
        var vPath = vGrp.content.addProperty("ADBE Vector Shape - Group");
        var vs = new Shape();
        vs.vertices = [[vx, chartT - cy], [vx, chartB - cy]];
        vs.inTangents = [[0,0],[0,0]];
        vs.outTangents = [[0,0],[0,0]];
        vs.closed = false;
        vPath.property("ADBE Vector Shape").setValue(vs);
        var vStroke = vGrp.content.addProperty("ADBE Vector Graphic - Stroke");
        vStroke.property("ADBE Vector Stroke Color").setValue(gridGrey);
        vStroke.property("ADBE Vector Stroke Width").setValue(2);
        vStroke.property("ADBE Vector Stroke Opacity").setValue(25);
    }

    // Fade grid in
    gridLayer.transform.opacity.setValue(0);
    var gridOpa = gridLayer.transform.opacity;
    gridOpa.setValueAtTime(0.2, 0);
    gridOpa.setValueAtTime(0.8, 100);
    bezierAll(gridOpa); deadFlatAll(gridOpa);

    // ---- GREEN LINE (RICH) — trends upward left to right ----
    var greenLayer = comp.layers.addShape();
    greenLayer.name = "Line_Rich";

    var greenGrp = greenLayer.content.addProperty("ADBE Vector Group");
    greenGrp.name = "Rich Line";
    var greenPathProp = greenGrp.content.addProperty("ADBE Vector Shape - Group");
    var gs = new Shape();
    gs.vertices = [
        [chartL - cx, cy - chartT - 200],           // starts mid-left (around y=1080+200 area... let me think in chart coords)
        [chartL + chartW*0.15 - cx, 200],            // slight rise
        [chartL + chartW*0.35 - cx, 50],             // steeper
        [chartL + chartW*0.5 - cx, -100],            // crossing above center
        [chartL + chartW*0.65 - cx, -200],           // continuing up
        [chartL + chartW*0.8 - cx, -280],            // near top
        [chartR - cx, -380]                          // ends high right
    ];
    gs.inTangents = [
        [0, 0],
        [-150, 40],
        [-150, 30],
        [-120, 50],
        [-100, 30],
        [-120, 20],
        [-150, 30]
    ];
    gs.outTangents = [
        [150, -20],
        [150, -30],
        [120, -40],
        [100, -40],
        [120, -30],
        [150, -20],
        [0, 0]
    ];
    gs.closed = false;
    greenPathProp.property("ADBE Vector Shape").setValue(gs);

    var greenStroke = greenGrp.content.addProperty("ADBE Vector Graphic - Stroke");
    greenStroke.property("ADBE Vector Stroke Color").setValue(green);
    greenStroke.property("ADBE Vector Stroke Width").setValue(8);
    greenStroke.property("ADBE Vector Stroke Line Cap").setValue(2);
    greenStroke.property("ADBE Vector Stroke Line Join").setValue(2);

    // Draw on
    var greenTrim = greenGrp.content.addProperty("ADBE Vector Filter - Trim");
    var greenTrimEnd = greenTrim.property("ADBE Vector Trim End");
    greenTrimEnd.setValueAtTime(0.5, 0);
    greenTrimEnd.setValueAtTime(3.5, 100);
    bezierAll(greenTrimEnd); deadFlatAll(greenTrimEnd);

    // Green glow
    var greenGlow = greenLayer.property("ADBE Effect Parade").addProperty("ADBE Glo2");
    greenGlow.property("Glow Threshold").setValue(50);
    greenGlow.property("Glow Radius").setValue(30);
    greenGlow.property("Glow Intensity").setValue(0.5);
    greenGlow.property("Glow Colors").setValue(2); // A & B colors
    greenGlow.property("Color A").setValue(green);

    // ---- RED LINE (POOR) — trends downward left to right ----
    var redLayer = comp.layers.addShape();
    redLayer.name = "Line_Poor";

    var redGrp = redLayer.content.addProperty("ADBE Vector Group");
    redGrp.name = "Poor Line";
    var redPathProp = redGrp.content.addProperty("ADBE Vector Shape - Group");
    var rs = new Shape();
    rs.vertices = [
        [chartL - cx, -200],                         // starts upper-left
        [chartL + chartW*0.15 - cx, -100],           // slight descent
        [chartL + chartW*0.3 - cx, 20],              // crossing center
        [chartL + chartW*0.5 - cx, 150],             // below center
        [chartL + chartW*0.65 - cx, 220],            // continuing down
        [chartL + chartW*0.8 - cx, 300],             // lower
        [chartR - cx, 450]                           // ends low-right
    ];
    rs.inTangents = [
        [0, 0],
        [-150, -20],
        [-120, -30],
        [-140, -30],
        [-100, -20],
        [-120, -20],
        [-150, -30]
    ];
    rs.outTangents = [
        [150, 20],
        [120, 30],
        [140, 40],
        [100, 30],
        [120, 20],
        [150, 30],
        [0, 0]
    ];
    rs.closed = false;
    redPathProp.property("ADBE Vector Shape").setValue(rs);

    var redStroke = redGrp.content.addProperty("ADBE Vector Graphic - Stroke");
    redStroke.property("ADBE Vector Stroke Color").setValue(red);
    redStroke.property("ADBE Vector Stroke Width").setValue(8);
    redStroke.property("ADBE Vector Stroke Line Cap").setValue(2);
    redStroke.property("ADBE Vector Stroke Line Join").setValue(2);

    // Draw on (slightly delayed from green)
    var redTrim = redGrp.content.addProperty("ADBE Vector Filter - Trim");
    var redTrimEnd = redTrim.property("ADBE Vector Trim End");
    redTrimEnd.setValueAtTime(0.8, 0);
    redTrimEnd.setValueAtTime(3.8, 100);
    bezierAll(redTrimEnd); deadFlatAll(redTrimEnd);

    // Red glow
    var redGlow = redLayer.property("ADBE Effect Parade").addProperty("ADBE Glo2");
    redGlow.property("Glow Threshold").setValue(50);
    redGlow.property("Glow Radius").setValue(30);
    redGlow.property("Glow Intensity").setValue(0.5);
    redGlow.property("Glow Colors").setValue(2);
    redGlow.property("Color A").setValue(red);

    // ---- "RICH" LABEL ----
    var richLabel = comp.layers.addText("RICH");
    richLabel.name = "Label_Rich";
    var rd = richLabel.sourceText.value;
    rd.font = "BBNonamePro-Bold";
    rd.fontSize = 100;
    rd.fillColor = green;
    rd.tracking = 80;
    rd.justification = ParagraphJustification.LEFT_JUSTIFY;
    richLabel.sourceText.setValue(rd);
    richLabel.transform.position.setValue([3050, 500]);
    appleReveal(richLabel, 2.8, 0.5, 30, 12);

    // Drop shadow
    var richShadow = richLabel.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    richShadow.property("Opacity").setValue(40);
    richShadow.property("Distance").setValue(4);
    richShadow.property("Softness").setValue(15);

    // ---- "POOR" LABEL ----
    var poorLabel = comp.layers.addText("POOR");
    poorLabel.name = "Label_Poor";
    var pd = poorLabel.sourceText.value;
    pd.font = "BBNonamePro-Bold";
    pd.fontSize = 100;
    pd.fillColor = red;
    pd.tracking = 80;
    pd.justification = ParagraphJustification.LEFT_JUSTIFY;
    poorLabel.sourceText.setValue(pd);
    poorLabel.transform.position.setValue([2550, 1700]);
    appleReveal(poorLabel, 3.2, 0.5, 30, 12);

    var poorShadow = poorLabel.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    poorShadow.property("Opacity").setValue(40);
    poorShadow.property("Distance").setValue(4);
    poorShadow.property("Softness").setValue(15);

    comp.openInViewer();
})();

app.endUndoGroup();
