# Brand Colors

## ExtendScript Format
AE uses RGB values normalized to 0-1 range. Use `hexToAE()` helper below.

```jsx
function hexToAE(hex) {
    var r = parseInt(hex.substring(0, 2), 16) / 255;
    var g = parseInt(hex.substring(2, 4), 16) / 255;
    var b = parseInt(hex.substring(4, 6), 16) / 255;
    return [r, g, b];
}
```

## Palette

| Name | Hex | AE RGB |
|---|---|---|
| Blue | `0A1DAF` | `[0.039, 0.114, 0.686]` |
| Buy Back Blue | `00A2FF` | `[0.000, 0.635, 1.000]` |
| Teal | `6EF8FD` | `[0.431, 0.973, 0.992]` |
| White | `FFFFFF` | `[1.000, 1.000, 1.000]` |
| Midnight Blue | `0C2550` | `[0.047, 0.145, 0.314]` |
| Dark Green | `326F12` | `[0.196, 0.435, 0.071]` |
| Green | `57EA3A` | `[0.341, 0.918, 0.227]` |
| Yellow | `F9F23A` | `[0.976, 0.949, 0.227]` |
| Pink | `F869E5` | `[0.973, 0.412, 0.898]` |
| Red | `CF1212` | `[0.812, 0.071, 0.071]` |
| Orange | `FF9B10` | `[1.000, 0.608, 0.063]` |
| Tan | `F2E1C5` | `[0.949, 0.882, 0.773]` |
| Black | `000000` | `[0.000, 0.000, 0.000]` |
| Charcoal | `1C1C1E` | `[0.110, 0.110, 0.118]` |
| Middle Grey | `808080` | `[0.502, 0.502, 0.502]` |
| Light Grey | `CBCBCB` | `[0.796, 0.796, 0.796]` |

## Quick Copy-Paste for Scripts
```jsx
var COLORS = {
    blue:         [0.039, 0.114, 0.686],
    buyBackBlue:  [0.000, 0.635, 1.000],
    teal:         [0.431, 0.973, 0.992],
    white:        [1.000, 1.000, 1.000],
    midnightBlue: [0.047, 0.145, 0.314],
    darkGreen:    [0.196, 0.435, 0.071],
    green:        [0.341, 0.918, 0.227],
    yellow:       [0.976, 0.949, 0.227],
    pink:         [0.973, 0.412, 0.898],
    red:          [0.812, 0.071, 0.071],
    orange:       [1.000, 0.608, 0.063],
    tan:          [0.949, 0.882, 0.773],
    black:        [0.000, 0.000, 0.000],
    charcoal:     [0.110, 0.110, 0.118],
    middleGrey:   [0.502, 0.502, 0.502],
    lightGrey:    [0.796, 0.796, 0.796]
};
```
