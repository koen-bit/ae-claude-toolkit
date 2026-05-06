# ExtendScript MatchName Reference

Probed directly from After Effects 2025. This is ground truth — not guesswork.

---

## Text Animator Properties

Properties addable to `animator.property("ADBE Text Animator Properties")`:

| matchName | Display Name | Default Value | Notes |
|-----------|-------------|---------------|-------|
| `ADBE Text Position 3D` | Position | `[0,0,0]` | **Must use 3D variant. `ADBE Text Position` does NOT work.** |
| `ADBE Text Anchor Point 3D` | Anchor Point | `[0,0,0]` | **Must use 3D variant.** |
| `ADBE Text Scale 3D` | Scale | `[100,100,100]` | **Must use 3D variant.** |
| `ADBE Text Rotation` | Rotation | `0` | Z rotation (2D) |
| `ADBE Text Rotation X` | X Rotation | `0` | 3D rotation |
| `ADBE Text Rotation Y` | Y Rotation | `0` | 3D rotation |
| `ADBE Text Opacity` | Opacity | `100` | 0-100 |
| `ADBE Text Fill Opacity` | Fill Opacity | `100` | |
| `ADBE Text Stroke Opacity` | Stroke Opacity | `100` | |
| `ADBE Text Fill Color` | Fill Color | `[1,0,0,1]` | RGBA 0-1 |
| `ADBE Text Stroke Color` | Stroke Color | `[1,0,0,1]` | RGBA 0-1 |
| `ADBE Text Stroke Width` | Stroke Width | `0` | |
| `ADBE Text Tracking Amount` | Tracking Amount | `0` | |
| `ADBE Text Line Spacing` | Line Spacing | `[0,0]` | 2D value |
| `ADBE Text Line Anchor` | Line Anchor | `50` | 0-100 |
| `ADBE Text Blur` | Blur | `[0,0]` | 2D value |
| `ADBE Text Skew` | Skew | `0` | |
| `ADBE Text Skew Axis` | Skew Axis | `0` | |
| `ADBE Text Character Offset` | Character Offset | `0` | |
| `ADBE Text Character Change Type` | Character Change Type | | |
| `ADBE Text Character Range` | Character Range | | |

**Will NOT work (confirmed false):**
- `ADBE Text Position` — use `ADBE Text Position 3D`
- `ADBE Text Anchor Point` — use `ADBE Text Anchor Point 3D`
- `ADBE Text Scale` — use `ADBE Text Scale 3D`
- `ADBE Text Tracking Type`
- `ADBE Text Character Value`
- Display names (`Position`, `Opacity`, etc.) — must use matchNames

---

## Text Selectors

### Selector Types (addable to `animator.property("ADBE Text Selectors")`)

| matchName | Display Name |
|-----------|-------------|
| `ADBE Text Selector` | Range Selector |
| `ADBE Text Expressible Selector` | Expression Selector |
| `ADBE Text Wiggly Selector` | Wiggly Selector |

**Important:** Range Selectors are NOT auto-created when you add an animator. You must explicitly `addProperty("ADBE Text Selector")`.

### Range Selector Properties

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Text Percent Start` | Start | `0` |
| `ADBE Text Percent End` | End | `100` |
| `ADBE Text Percent Offset` | Offset | `0` |
| `ADBE Text Index Start` | Start (index) | `0` |
| `ADBE Text Index End` | End (index) | `0` |
| `ADBE Text Index Offset` | Offset (index) | `0` |

### Advanced Range Properties (`selector.property("ADBE Text Range Advanced")`)

| matchName | Display Name | Default | Values |
|-----------|-------------|---------|--------|
| `ADBE Text Range Units` | Units | `1` | 1=Percentage, 2=Index |
| `ADBE Text Range Type2` | Based On | `1` | 1=Characters, 2=Chars Excl. Spaces, 3=Words, 4=Lines |
| `ADBE Text Selector Mode` | Mode | `1` | 1=Add, 2=Subtract, 3=Intersect, 4=Min, 5=Max, 6=Difference |
| `ADBE Text Selector Max Amount` | Amount | `100` | 0-100 |
| `ADBE Text Range Shape` | Shape | `1` | 1=Square, 2=Ramp Up, 3=Ramp Down, 4=Triangle, 5=Round, 6=Smooth |
| `ADBE Text Selector Smoothness` | Smoothness | `100` | 0-100 |
| `ADBE Text Levels Max Ease` | Ease High | `0` | |
| `ADBE Text Levels Min Ease` | Ease Low | `0` | |
| `ADBE Text Randomize Order` | Randomize Order | `0` | 0=off, 1=on |
| `ADBE Text Random Seed` | Random Seed | `0` | |

---

## Transform Properties

### 2D/3D Layer Transform (`layer.property("ADBE Transform Group")`)

| matchName | Display Name | Default (2D) |
|-----------|-------------|--------------|
| `ADBE Anchor Point` | Anchor Point | `[w/2, h/2, 0]` |
| `ADBE Position` | Position | `[1920, 1080, 0]` |
| `ADBE Position_0` | X Position | (separated dims) |
| `ADBE Position_1` | Y Position | (separated dims) |
| `ADBE Position_2` | Z Position | (separated dims) |
| `ADBE Scale` | Scale | `[100, 100, 100]` |
| `ADBE Orientation` | Orientation | `[0, 0, 0]` |
| `ADBE Rotate X` | X Rotation | `0` |
| `ADBE Rotate Y` | Y Rotation | `0` |
| `ADBE Rotate Z` | Rotation / Z Rotation | `0` |
| `ADBE Opacity` | Opacity | `100` |

**Note:** `ADBE Rotate Z` name changes from "Rotation" (2D) to "Z Rotation" (3D).

### 3D Material Options (`layer.property("ADBE Material Options Group")`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Casts Shadows` | Casts Shadows | `0` (off) |
| `ADBE Light Transmission` | Light Transmission | `0` |
| `ADBE Accepts Shadows` | Accepts Shadows | `1` (on) |
| `ADBE Accepts Lights` | Accepts Lights | `1` (on) |
| `ADBE Shadow Color` | Shadow Color | `[0,0,0,1]` |
| `ADBE Ambient Coefficient` | Ambient | `100` |
| `ADBE Diffuse Coefficient` | Diffuse | `50` |
| `ADBE Specular Coefficient` | Specular Intensity | `50` |
| `ADBE Shininess Coefficient` | Specular Shininess | `5` |
| `ADBE Metal Coefficient` | Metal | `100` |
| `ADBE Reflection Coefficient` | Reflection Intensity | `0` |
| `ADBE Glossiness Coefficient` | Reflection Sharpness | `100` |
| `ADBE Fresnel Coefficient` | Reflection Rolloff | `0` |
| `ADBE Transparency Coefficient` | Transparency | `0` |
| `ADBE Transp Rolloff` | Transparency Rolloff | `0` |
| `ADBE Index of Refraction` | Index of Refraction | `1` |

---

## Effects

### Drop Shadow (`ADBE Drop Shadow`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Drop Shadow-0001` | Shadow Color | `[0,0,0,1]` |
| `ADBE Drop Shadow-0002` | Opacity | `127.5` (0-255 range) |
| `ADBE Drop Shadow-0003` | Direction | `135` (degrees) |
| `ADBE Drop Shadow-0004` | Distance | `5` (pixels) |
| `ADBE Drop Shadow-0005` | Softness | `0` |
| `ADBE Drop Shadow-0006` | Shadow Only | `0` |

### Gaussian Blur (`ADBE Gaussian Blur 2`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Gaussian Blur 2-0001` | Blurriness | `25` |
| `ADBE Gaussian Blur 2-0002` | Blur Dimensions | `1` (1=Horizontal and Vertical) |
| `ADBE Gaussian Blur 2-0003` | Repeat Edge Pixels | `1` (checkbox) |

### Glow (`ADBE Glo2`)

| matchName | Display Name | Default | Notes |
|-----------|-------------|---------|-------|
| `ADBE Glo2-0001` | Glow Based On | `2` | 1=Color Channels, 2=Alpha Channel |
| `ADBE Glo2-0002` | Glow Threshold | `153` | 0-255 |
| `ADBE Glo2-0003` | Glow Radius | `10` | |
| `ADBE Glo2-0004` | Glow Intensity | `1` | |
| `ADBE Glo2-0005` | Composite Original | `2` | 1=Behind, 2=On Top, 3=None |
| `ADBE Glo2-0006` | Glow Operation | `3` | |
| `ADBE Glo2-0007` | Glow Colors | `1` | 1=A & B Colors, 2=Arbitrary Map |
| `ADBE Glo2-0008` | Color Looping | `3` | |
| `ADBE Glo2-0009` | Color Loops | `1` | |
| `ADBE Glo2-0010` | Color Phase | `0` | |
| `ADBE Glo2-0011` | A & B Midpoint | `0.5` | |
| `ADBE Glo2-0012` | Color A | `[1,1,1,1]` | |
| `ADBE Glo2-0013` | Color B | `[0,0,0,1]` | |
| `ADBE Glo2-0014` | Glow Dimensions | `1` | |

### Gradient Ramp (`ADBE Ramp`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Ramp-0001` | Start of Ramp | `[1920, 0]` (point) |
| `ADBE Ramp-0002` | Start Color | `[0,0,0,1]` |
| `ADBE Ramp-0003` | End of Ramp | `[1920, 2160]` (point) |
| `ADBE Ramp-0004` | End Color | `[1,1,1,1]` |
| `ADBE Ramp-0005` | Ramp Shape | `1` (1=Linear, 2=Radial) |
| `ADBE Ramp-0006` | Ramp Scatter | `0` |
| `ADBE Ramp-0007` | Blend With Original | `0` |

### Fill (`ADBE Fill`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Fill-0001` | Fill Mask | `0` |
| `ADBE Fill-0007` | All Masks | `0` |
| `ADBE Fill-0002` | Color | `[1,0,0,1]` |
| `ADBE Fill-0006` | Invert | `0` |
| `ADBE Fill-0003` | Horizontal Feather | `0` |
| `ADBE Fill-0004` | Vertical Feather | `0` |
| `ADBE Fill-0005` | Opacity | `1` (0-1 range) |

### Tritone (`ADBE Tritone`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Tritone-0001` | Highlights | `[1,1,1,0]` |
| `ADBE Tritone-0002` | Midtones | `[0.498,0.392,0.275,0]` |
| `ADBE Tritone-0003` | Shadows | `[0,0,0,0]` |
| `ADBE Tritone-0004` | Blend With Original | `0` |

### Tint (`ADBE Tint`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Tint-0001` | Map Black To | `[0,0,0,0]` |
| `ADBE Tint-0002` | Map White To | `[1,1,1,0]` |
| `ADBE Tint-0003` | Amount to Tint | `100` |

### Hue/Saturation (`ADBE HUE SATURATION`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE HUE SATURATION-0002` | Channel Control | `1` |
| `ADBE HUE SATURATION-0004` | Master Hue | `0` |
| `ADBE HUE SATURATION-0005` | Master Saturation | `0` |
| `ADBE HUE SATURATION-0006` | Master Lightness | `0` |
| `ADBE HUE SATURATION-0007` | Colorize | `0` |
| `ADBE HUE SATURATION-0008` | Colorize Hue | `0` |
| `ADBE HUE SATURATION-0009` | Colorize Saturation | `25` |
| `ADBE HUE SATURATION-0010` | Colorize Lightness | `0` |

### Exposure (`ADBE Exposure2`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Exposure2-0003` | Exposure | `0` |
| `ADBE Exposure2-0004` | Offset | `0` |
| `ADBE Exposure2-0005` | Gamma Correction | `1` |

### Vibrance (`ADBE Vibrance`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Vibrance-0001` | Vibrance | `0` |
| `ADBE Vibrance-0002` | Saturation | `0` |

### Linear Wipe (`ADBE Linear Wipe`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Linear Wipe-0001` | Transition Completion | `0` |
| `ADBE Linear Wipe-0002` | Wipe Angle | `90` |
| `ADBE Linear Wipe-0003` | Feather | `0` |

### Radial Wipe (`ADBE Radial Wipe`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Radial Wipe-0001` | Transition Completion | `0` |
| `ADBE Radial Wipe-0002` | Start Angle | `0` |
| `ADBE Radial Wipe-0003` | Wipe Center | `[1920, 1080]` |
| `ADBE Radial Wipe-0004` | Wipe | `1` |
| `ADBE Radial Wipe-0005` | Feather | `0` |

### Turbulent Displace (`ADBE Turbulent Displace`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Turbulent Displace-0001` | Displacement | `1` |
| `ADBE Turbulent Displace-0002` | Amount | `50` |
| `ADBE Turbulent Displace-0003` | Size | `100` |
| `ADBE Turbulent Displace-0004` | Offset (Turbulence) | `[1920,1080]` |
| `ADBE Turbulent Displace-0005` | Complexity | `1` |
| `ADBE Turbulent Displace-0006` | Evolution | `0` |

### Fractal Noise (`ADBE Fractal Noise`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Fractal Noise-0001` | Fractal Type | `1` |
| `ADBE Fractal Noise-0002` | Noise Type | `3` |
| `ADBE Fractal Noise-0003` | Invert | `0` |
| `ADBE Fractal Noise-0004` | Contrast | `100` |
| `ADBE Fractal Noise-0005` | Brightness | `0` |
| `ADBE Fractal Noise-0010` | Scale | `100` |
| `ADBE Fractal Noise-0013` | Offset Turbulence | `[1920,1080]` |
| `ADBE Fractal Noise-0015` | Complexity | `6` |
| `ADBE Fractal Noise-0023` | Evolution | `0` |
| `ADBE Fractal Noise-0029` | Opacity | `100` |
| `ADBE Fractal Noise-0030` | Blending Mode | `2` |

### Other Effects (matchName only)

| matchName | Display Name |
|-----------|-------------|
| `ADBE Invert` | Invert |
| `ADBE Set Matte3` | Set Matte |
| `ADBE Venetian Blinds` | Venetian Blinds |
| `ADBE Motion Blur` | Directional Blur |
| `ADBE Box Blur2` | Fast Box Blur |
| `ADBE Camera Lens Blur` | Camera Lens Blur |
| `ADBE Sharpen` | Sharpen |
| `ADBE Unsharp Mask2` | Unsharp Mask |
| `ADBE Color Balance 2` | Color Balance |
| `ADBE Photo Filter` | Photo Filter |
| `ADBE Black&White` | Black & White |
| `ADBE Corner Pin` | Corner Pin |
| `ADBE Displacement Map` | Displacement Map |
| `ADBE Echo` | Echo |
| `ADBE Posterize Time` | Posterize Time |
| `ADBE Ripple` | Ripple |
| `ADBE Bulge` | Bulge |
| `CC Particle World` | CC Particle World |

**Effects that do NOT work with addProperty:**
- `ADBE Channel Mixer`
- `ADBE Curves`
- `ADBE Levels2`

---

## Shape Layer Properties

### Addable to Shape Content (top-level or inside groups)

| matchName | Display Name |
|-----------|-------------|
| `ADBE Vector Group` | Group |
| `ADBE Vector Shape - Group` | Path |
| `ADBE Vector Shape - Rect` | Rectangle |
| `ADBE Vector Shape - Ellipse` | Ellipse |
| `ADBE Vector Shape - Star` | Polystar |
| `ADBE Vector Graphic - Fill` | Fill |
| `ADBE Vector Graphic - Stroke` | Stroke |
| `ADBE Vector Graphic - G-Fill` | Gradient Fill |
| `ADBE Vector Graphic - G-Stroke` | Gradient Stroke |
| `ADBE Vector Filter - Trim` | Trim Paths |
| `ADBE Vector Filter - Offset` | Offset Paths |
| `ADBE Vector Filter - PB` | Pucker & Bloat |
| `ADBE Vector Filter - Roughen` | Roughen Edges |
| `ADBE Vector Filter - Wiggler` | Wiggle Paths |
| `ADBE Vector Filter - RC` | Round Corners |
| `ADBE Vector Filter - Merge` | Merge Paths |
| `ADBE Vector Filter - Repeater` | Repeater |
| `ADBE Vector Filter - Twist` | Twist |
| `ADBE Vector Filter - Zig Zag` | Zig Zag |

### Rectangle Properties

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Vector Shape Direction` | Shape Direction | `1` |
| `ADBE Vector Rect Size` | Size | `[100,100]` |
| `ADBE Vector Rect Position` | Position | `[0,0]` |
| `ADBE Vector Rect Roundness` | Roundness | `0` |

### Ellipse Properties

| matchName | Display Name |
|-----------|-------------|
| `ADBE Vector Ellipse Size` | Size |
| `ADBE Vector Ellipse Position` | Position |

### Fill Properties

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Vector Blend Mode` | Blend Mode | `1` |
| `ADBE Vector Composite Order` | Composite | `1` |
| `ADBE Vector Fill Rule` | Fill Rule | `1` |
| `ADBE Vector Fill Color` | Color | `[1,0,0,1]` |
| `ADBE Vector Fill Opacity` | Opacity | `100` |

### Stroke Properties

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Vector Blend Mode` | Blend Mode | `1` |
| `ADBE Vector Composite Order` | Composite | `1` |
| `ADBE Vector Stroke Color` | Color | `[1,1,1,1]` |
| `ADBE Vector Stroke Opacity` | Opacity | `100` |
| `ADBE Vector Stroke Width` | Stroke Width | `2` |
| `ADBE Vector Stroke Line Cap` | Line Cap | `1` (1=Butt, 2=Round, 3=Projecting) |
| `ADBE Vector Stroke Line Join` | Line Join | `1` (1=Miter, 2=Round, 3=Bevel) |
| `ADBE Vector Stroke Miter Limit` | Miter Limit | `4` |
| `ADBE Vector Stroke Dashes` | Dashes | (container) |

### Stroke Dashes (addable to `ADBE Vector Stroke Dashes`)

| matchName | Display Name |
|-----------|-------------|
| `ADBE Vector Stroke Dash 1` | Dash |
| `ADBE Vector Stroke Gap 1` | Gap |
| `ADBE Vector Stroke Dash 2` | Dash 2 |
| `ADBE Vector Stroke Gap 2` | Gap 2 |
| `ADBE Vector Stroke Dash 3` | Dash 3 |
| `ADBE Vector Stroke Gap 3` | Gap 3 |
| `ADBE Vector Stroke Offset` | Offset |

### Gradient Fill Properties

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Vector Grad Type` | Type | `1` (1=Linear, 2=Radial) |
| `ADBE Vector Grad Start Pt` | Start Point | `[0,0]` |
| `ADBE Vector Grad End Pt` | End Point | `[100,0]` |
| `ADBE Vector Grad HiLite Length` | Highlight Length | `0` |
| `ADBE Vector Grad HiLite Angle` | Highlight Angle | `0` |
| `ADBE Vector Grad Scale` | Scale | `[100,100]` |
| `ADBE Vector Grad Rotation` | Rotation | `0` |
| `ADBE Vector Grad Colors` | Colors | (gradient data) |
| `ADBE Vector Fill Opacity` | Opacity | `100` |

### Trim Paths Properties

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Vector Trim Start` | Start | `0` |
| `ADBE Vector Trim End` | End | `100` |
| `ADBE Vector Trim Offset` | Offset | `0` |
| `ADBE Vector Trim Type` | Trim Multiple Shapes | `1` (1=Simultaneously, 2=Individually) |

### Repeater Properties

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Vector Repeater Copies` | Copies | `1` |
| `ADBE Vector Repeater Offset` | Offset | `0` |
| `ADBE Vector Repeater Order` | Composite | `1` |

Repeater Transform (`ADBE Vector Repeater Transform`):

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Vector Repeater Anchor` | Anchor Point | `[0,0]` |
| `ADBE Vector Repeater Position` | Position | `[0,0]` |
| `ADBE Vector Repeater Scale` | Scale | `[100,100]` |
| `ADBE Vector Repeater Rotation` | Rotation | `0` |
| `ADBE Vector Repeater Opacity 1` | Start Opacity | `100` |
| `ADBE Vector Repeater Opacity 2` | End Opacity | `100` |

### Merge Paths

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Vector Merge Type` | Mode | `1` (1=Merge, 2=Add, 3=Subtract, 4=Intersect, 5=Exclude) |

---

## Camera Properties (`layer.property("ADBE Camera Options Group")`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Camera Zoom` | Zoom | `5333.3` |
| `ADBE Camera Depth of Field` | Depth of Field | `0` |
| `ADBE Camera Focus Distance` | Focus Distance | `5333.3` |
| `ADBE Camera Aperture` | Aperture | `25.3` |
| `ADBE Camera Blur Level` | Blur Level | `100` |
| `ADBE Iris Shape` | Iris Shape | `1` |
| `ADBE Iris Rotation` | Iris Rotation | `0` |
| `ADBE Iris Roundness` | Iris Roundness | `0` |
| `ADBE Iris Aspect Ratio` | Iris Aspect Ratio | `1` |

---

## Light Properties (`layer.property("ADBE Light Options Group")`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Light Intensity` | Intensity | `100` |
| `ADBE Light Color` | Color | `[1,1,1,1]` |
| `ADBE Light Cone Angle` | Cone Angle | `90` |
| `ADBE Light Cone Feather 2` | Cone Feather | `50` |
| `ADBE Light Falloff Type` | Falloff | `1` |
| `ADBE Light Falloff Start` | Radius | `500` |
| `ADBE Light Falloff Distance` | Falloff Distance | `500` |
| `ADBE Casts Shadows` | Casts Shadows | `0` |
| `ADBE Light Shadow Darkness` | Shadow Darkness | `100` |
| `ADBE Light Shadow Diffusion` | Shadow Diffusion | `0` |

---

## Mask Properties (`layer.property("ADBE Mask Parade").addProperty("ADBE Mask Atom")`)

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Mask Shape` | Mask Path | (shape) |
| `ADBE Mask Feather` | Mask Feather | `[0,0]` |
| `ADBE Mask Opacity` | Mask Opacity | `100` |
| `ADBE Mask Offset` | Mask Expansion | `0` |

---

## Text Layer Properties (`layer.property("ADBE Text Properties")`)

| matchName | Display Name |
|-----------|-------------|
| `ADBE Text Document` | Source Text |
| `ADBE Text Path Options` | Path Options |
| `ADBE Text More Options` | More Options |
| `ADBE Text Animators` | Animators |

### Path Options

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Text Path` | Path | `0` |
| `ADBE Text Reverse Path` | Reverse Path | `0` |
| `ADBE Text Perpendicular To Path` | Perpendicular | `1` |
| `ADBE Text Force Align Path` | Force Alignment | `0` |
| `ADBE Text First Margin` | First Margin | `0` |
| `ADBE Text Last Margin` | Last Margin | `0` |

### More Options

| matchName | Display Name | Default |
|-----------|-------------|---------|
| `ADBE Text Anchor Point Option` | Anchor Point Grouping | `1` |
| `ADBE Text Anchor Point Align` | Grouping Alignment | `[0,0]` |
| `ADBE Text Render Order` | Fill & Stroke | `1` |
| `ADBE Text Character Blend Mode` | Inter-Character Blending | `1` |

---

## Expression Controls

Pseudo-effects added to layers for expression-driven control. Add via `layer.property("ADBE Effect Parade").addProperty(matchName)`.

| matchName | Display Name | Value Type |
|-----------|-------------|-----------|
| `ADBE Slider Control` | Slider Control | Slider (float) |
| `ADBE Point Control` | Point Control | Point [x,y] |
| `ADBE Point3D Control` | 3D Point Control | Point [x,y,z] |
| `ADBE Color Control` | Color Control | Color [r,g,b,a] |
| `ADBE Checkbox Control` | Checkbox Control | 0 or 1 |
| `ADBE Angle Control` | Angle Control | Degrees |
| `ADBE Layer Control` | Layer Control | Layer index |
| `ADBE Dropdown Control` | Dropdown Menu Control | Index (1-based) |

---

## Layer Styles

Added via `layer.property("ADBE Layer Styles").addProperty(matchName)`.

| matchName | Display Name |
|-----------|-------------|
| `dropShadow/enabled` | Drop Shadow |
| `innerShadow/enabled` | Inner Shadow |
| `outerGlow/enabled` | Outer Glow |
| `innerGlow/enabled` | Inner Glow |
| `bevelEmboss/enabled` | Bevel and Emboss |
| `chromeFX/enabled` | Satin |
| `solidFill/enabled` | Color Overlay |
| `gradientFill/enabled` | Gradient Overlay |
| `patternFill/enabled` | Pattern Overlay |
| `frameFX/enabled` | Stroke |

---

## Discovery Tools

When you hit an unknown matchName, use these approaches:

1. **rd_GimmePropPath** — Select a property in AE UI, run the script, get the exact matchName path. Download from [redefinery.com](http://www.redefinery.com/ae/view.php?item=rd_GimmePropPath)
2. **canAddProperty()** — Probe what a PropertyGroup accepts: `group.canAddProperty("ADBE Text Position 3D")`
3. **Enumerate** — Loop through `group.numProperties` and log `.matchName` for each

**Important:** Always use matchNames, never display names. Display names change with AE's language setting; matchNames don't.

---

## Enums

### BlendingMode

| Name | Value |
|------|-------|
| `NORMAL` | 5212 |
| `DISSOLVE` | 5213 |
| `DARKEN` | 5215 |
| `MULTIPLY` | 5216 |
| `COLOR_BURN` | 5218 |
| `LINEAR_BURN` | 5217 |
| `ADD` | 5220 |
| `LIGHTEN` | 5221 |
| `SCREEN` | 5222 |
| `COLOR_DODGE` | 5224 |
| `LINEAR_DODGE` | 5223 |
| `OVERLAY` | 5226 |
| `SOFT_LIGHT` | 5227 |
| `HARD_LIGHT` | 5228 |
| `LINEAR_LIGHT` | 5229 |
| `VIVID_LIGHT` | 5230 |
| `PIN_LIGHT` | 5231 |
| `DIFFERENCE` | 5233 |
| `EXCLUSION` | 5235 |
| `HUE` | 5236 |
| `SATURATION` | 5237 |
| `COLOR` | 5238 |
| `LUMINOSITY` | 5239 |

### ParagraphJustification

| Name | Value |
|------|-------|
| `LEFT_JUSTIFY` | 7413 |
| `RIGHT_JUSTIFY` | 7414 |
| `CENTER_JUSTIFY` | 7415 |
| `FULL_JUSTIFY_LASTLINE_LEFT` | 7416 |
| `FULL_JUSTIFY_LASTLINE_RIGHT` | 7417 |
| `FULL_JUSTIFY_LASTLINE_CENTER` | 7418 |
| `FULL_JUSTIFY_LASTLINE_FULL` | 7419 |

### KeyframeInterpolationType

| Name | Value |
|------|-------|
| `LINEAR` | 6612 |
| `BEZIER` | 6613 |
| `HOLD` | 6614 |

### TrackMatteType

| Name | Value |
|------|-------|
| `NO_TRACK_MATTE` | 5012 |
| `ALPHA` | 5013 |
| `ALPHA_INVERTED` | 5014 |
| `LUMA` | 5015 |
| `LUMA_INVERTED` | 5016 |

### MaskMode

| Name | Value |
|------|-------|
| `NONE` | 6812 |
| `ADD` | 6813 |
| `SUBTRACT` | 6814 |
| `INTERSECT` | 6815 |
| `LIGHTEN` | 6816 |
| `DARKEN` | 6817 |
| `DIFFERENCE` | 6818 |
