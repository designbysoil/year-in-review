# QF Year in Review - Animated Gradient System

## Project Overview

WebGL shader-based animated gradients for Qatar Foundation's 2025 Year in Review. These gradients serve as hero backgrounds for five thematic landing pages, inspired by Runway ML's Demo Day 2025 aesthetic.

**Goal:** Organic, slowly-drifting color clouds that feel alive and exciting with anticipation—sophisticated yet noticeable movement.

## Completed Themes

### AI (Artificial Intelligence) - FINAL: `index-ai-v6.html`
- Blue (#1B8EE0) → Khaki (#797B4D @ 77%) → Cream (#FFE9D2)
- Soft-light purple overlay (#B09CF6 → #4F1BE0) for richness
- Gradient shifted higher to show cream at bottom
- Title positioned at top (15vh padding)

### Precision Health - FINAL: `index-precision-health-v7.html`
- Deep Coral → Coral → Salmon → Rose Pink → Mauve → Orchid → Purple → Cream
- Pink zone contained to narrow band (0.28-0.42 blend factor)
- Gradient compressed to always show warm beige at bottom
- Ends at 0.70 blend factor for guaranteed beige visibility

## Pending Themes
- Progressive Education
- Social Progress
- Sustainability

## Technical Architecture

### Stack
- **Renderer:** WebGL 1.0 (for broad compatibility)
- **Noise Algorithm:** 3D Simplex noise with FBM (Fractal Brownian Motion)
- **Base Color:** #FFE9D2 (peachy cream) - constant across all themes

### Key Shader Parameters

| Parameter | Value | Effect |
|-----------|-------|--------|
| `BLOB_SCALE` | 0.35 | Big visible blobs (lower = bigger) |
| `SPEED` | 0.10 | Animation speed |
| `BLOB_INTENSITY` | 0.55 | Noise vs vertical gradient mix |

### Gradient Structure Pattern

Each theme follows this compositing approach:
1. **Base layer**: Solid #FFE9D2 (peachy cream)
2. **Primary gradient**: Multi-stop color gradient with alpha fadeout
3. **Blob displacement**: FBM noise mixed with vertical position

```glsl
float vertPos = 1.0 - uv.y;
float blendFactor = mix(vertPos, blob1, BLOB_INTENSITY);
// blendFactor drives color stop selection
```

### Color Stop Pattern

Gradient stops use tight smoothstep ranges (0.07-0.08 wide) for defined color bands:

```glsl
if (blendFactor < 0.12) {
  primaryColor = COLOR_1;
  primaryAlpha = 1.0;
}
else if (blendFactor < 0.20) {
  float t = smoothstep(0.12, 0.20, blendFactor);
  primaryColor = mix(COLOR_1, COLOR_2, t);
  primaryAlpha = 1.0;
}
// ... continue pattern
```

Alpha fades toward bottom to reveal base cream color.

## Theme Color Definitions

### AI Theme (index-ai-v6.html)
```glsl
const vec3 BASE_COLOR = vec3(1.0, 0.914, 0.824);           // #FFE9D2
const vec3 BLUE = vec3(0.106, 0.557, 0.878);               // #1B8EE0
const vec3 BLUE_MID = vec3(0.310, 0.525, 0.620);           // Transition
const vec3 KHAKI = vec3(0.475, 0.482, 0.302);              // #797B4D
const vec3 SAGE = vec3(0.545, 0.580, 0.420);               // Lighter sage

// Soft-light overlay
const vec3 SOFTLIGHT_LAVENDER = vec3(0.690, 0.612, 0.965); // #B09CF6
const vec3 SOFTLIGHT_PURPLE = vec3(0.310, 0.106, 0.878);   // #4F1BE0
```

### Precision Health Theme (index-precision-health-v7.html)
```glsl
const vec3 BASE_COLOR = vec3(1.0, 0.914, 0.824);           // #FFE9D2
const vec3 DEEP_CORAL = vec3(0.878, 0.420, 0.318);         // Deep coral
const vec3 CORAL = vec3(0.918, 0.506, 0.376);              // Rich coral
const vec3 SALMON = vec3(0.890, 0.530, 0.460);             // Warm salmon
const vec3 ROSE_PINK = vec3(0.860, 0.420, 0.520);          // Rose pink
const vec3 MAUVE = vec3(0.720, 0.380, 0.560);              // Mauve
const vec3 ORCHID = vec3(0.580, 0.340, 0.600);             // Orchid
const vec3 PURPLE = vec3(0.480, 0.300, 0.620);             // Deep purple
```

## File Structure

```
qf-gradient-project/
├── CLAUDE.md                           # This file
└── demo/
    ├── index-ai-v1.html through v6     # AI theme iterations
    ├── index-ai-v6.html                # ✅ FINAL AI theme
    ├── index-precision-health-v1.html through v7
    └── index-precision-health-v7.html  # ✅ FINAL Precision Health
```

## Iteration History

### AI Theme
| Version | Changes | Result |
|---------|---------|--------|
| v1 | Initial with Figma colors | Wrong teal instead of blue |
| v2 | Correct blue from Figma layers | Colors correct |
| v3 | Added bigger blobs (BLOB_SCALE 0.35) | Blobs visible |
| v4 | Fixed harsh color band edges | Too soft |
| v5 | Kept stops, softened transitions | Good balance |
| v6 | Shifted gradient higher for cream at bottom | **FINAL** |

### Precision Health Theme
| Version | Changes | Result |
|---------|---------|--------|
| v1 | Initial with orange/sage | Wrong colors |
| v2 | Direct coral/salmon/blush approach | Too light |
| v3 | More saturated, darker purples | Better punch |
| v4 | Tighter gradient stops | Lavender still light |
| v5 | Added vibrant pink zone | Too overpowering |
| v6 | Contained pink, extended coral | Better balance |
| v7 | Compressed to show beige always | **FINAL** |

## Design Lessons Learned

1. **Get Figma layers first** - Select background layers in Figma to see actual color values, not visual result
2. **Direct colors work better** - Don't rely on blend mode calculations; use the actual target colors
3. **Pink needs containment** - Vibrant pinks spread easily; keep to narrow bands
4. **Always show base** - Compress gradient to ensure cream base is always visible
5. **Tight stops, smooth transitions** - 0.07-0.08 wide smoothstep ranges give defined but smooth bands

## Common Adjustments

### Make gradient show more base color
Compress all stops and end fadeout earlier:
```glsl
// Change fadeout from 0.82 to 0.70
else if (blendFactor < 0.70) {
  primaryAlpha = 0.7 * (1.0 - smoothstep(0.58, 0.70, blendFactor));
}
```

### Contain a color to narrow band
Reduce its blend factor range:
```glsl
// Tight pink zone: only 0.07 wide
else if (blendFactor < 0.35) {
  float t = smoothstep(0.28, 0.35, blendFactor);
  primaryColor = mix(SALMON, ROSE_PINK, t);
}
```

### Add more punch/saturation
Increase RGB values, decrease lightness:
```glsl
// Lighter purple (washed out)
const vec3 PURPLE = vec3(0.640, 0.480, 0.720);
// Darker purple (more punch)
const vec3 PURPLE = vec3(0.480, 0.300, 0.620);
```

## Quality Standards

### Performance
- Target 60fps on mid-range devices
- Use `devicePixelRatio` capped at 2
- FBM with 3 octaves (good balance)

### Visual Quality
- No visible banding in gradients
- Smooth, continuous animation
- Colors match Figma reference
- Warm beige always visible at bottom

## TODO

- [ ] Progressive Education theme
- [ ] Social Progress theme
- [ ] Sustainability theme
- [ ] Add reduced-motion media query support
- [ ] Create production component version
- [ ] Export as video loop option

## Resources

- [Simplex Noise GLSL](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)
- [The Book of Shaders - Noise](https://thebookofshaders.com/11/)
- Figma: https://www.figma.com/design/Bi0rYZgaCjIJpUwtPNgbFh/Year-in-Review?node-id=148-88
