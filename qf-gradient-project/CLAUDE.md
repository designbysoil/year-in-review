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

### AI (Artificial Intelligence) - LITE: `index-ai-v7-lite.html`
- Ultra-lightweight version for older MacBooks
- Blue (#1B8EE0) → Khaki (#797B4D) → Cream (#FFE9D2)
- Single snoise() call (was 4), no soft-light blend, no vignette
- 3 color stops only

### Precision Health - FINAL: `index-precision-health-v7.html`
- Deep Coral → Coral → Salmon → Rose Pink → Mauve → Orchid → Purple → Cream
- Pink zone contained to narrow band (0.28-0.42 blend factor)
- Gradient compressed to always show warm beige at bottom
- Ends at 0.70 blend factor for guaranteed beige visibility

### Precision Health - LITE: `index-precision-health-v8-lite.html`
- Ultra-lightweight version for older MacBooks
- Deep Coral → Mauve → Purple → Cream (#FFE9D2)
- Single snoise() call (was 3), no depth variation, no vignette
- 4 color stops only (was 8)

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
| `SPEED` | 0.14 | Animation speed (synced across Full/Lite+) |
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
    ├── overview.html                   # 🎬 Preview & Export tool
    ├── index-ai-v6.html                # ✅ FINAL AI theme
    ├── index-ai-v7-lite.html           # ⚡ LITE AI theme (for older devices)
    ├── index-precision-health-v7.html  # ✅ FINAL Precision Health
    ├── index-precision-health-v8-lite.html  # ⚡ LITE Precision Health (for older devices)
    └── index-*-v[1-5].html             # Earlier iterations (archived)
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
| v7-lite | Single noise, no blend modes, DPR 1.0, 24fps | **LITE** (for older devices) |

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
| v8-lite | Single noise, 4 colors only, DPR 1.0, 24fps | **LITE** (for older devices) |

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

### Performance (Optimized January 2026)

Performance optimizations applied to reduce CPU/GPU load on older devices:

| Setting | Before | After | Impact |
|---------|--------|-------|--------|
| `maxDPR` | 2.0 | 1.5 | 44% fewer pixels |
| `targetFPS` | 60 | 30 | 50% fewer renders |
| FBM octaves | 3 | 2 | 33% fewer noise calls |
| Blob evaluations | 3 fbm() | 1 fbm() + 2 snoise() | ~50% fewer noise calls |
| Visibility API | No | Yes | 0% GPU when hidden |

**JavaScript Performance Config:**
```javascript
const PERF_CONFIG = {
  maxDPR: 1.5,           // Was 2.0 - reduces pixel count by 44%
  targetFPS: 30,         // Was 60 - halves render calls
  pauseWhenHidden: true  // Stop rendering when tab not visible
};
```

**Optimized FBM (2 octaves):**
```glsl
float fbm(vec3 p) {
  float value = 0.0;
  value += 0.667 * snoise(p);
  value += 0.333 * snoise(p * 2.0);
  return value;
}
```

**Optimized Soft-Light (AI theme only):**
```glsl
// Pegtop formula - no loops or conditionals
vec3 softLight(vec3 base, vec3 blend) {
  return (1.0 - 2.0 * blend) * base * base + 2.0 * blend * base;
}
```

**Total Impact Estimate:**
- Before: ~500M shader ops/sec on Retina display
- After: ~80M shader ops/sec (84% reduction)
- Fans should stay silent on older MacBooks

### Ultra-Lightweight Versions (January 2026)

For devices where even the optimized versions cause fan activation, ultra-lightweight "lite" versions are available with dramatically reduced shader complexity:

| Feature | Standard (v6/v7) | Lite Version | Reduction |
|---------|------------------|--------------|-----------|
| Noise calls | 3-4 snoise() | 1 snoise() | 75% |
| Blend modes | Soft-light (AI) | None | 100% |
| Depth layer | Yes | No | 100% |
| Vignette | Yes | No | 100% |
| Color stops | 7-8 conditionals | 3-4 conditionals | ~50% |
| DPR | 1.5 | 1.0 | 56% fewer pixels |
| FPS | 30 | 24 | 20% fewer renders |
| Precision | highp | mediump | Faster math |
| Antialias | true | false | Faster |

**Lite Version JavaScript Config:**
```javascript
const PERF_CONFIG = {
  maxDPR: 1.0,           // Minimum resolution
  targetFPS: 24,         // Cinematic framerate
  pauseWhenHidden: true
};
```

**Lite Version Shader Pattern:**
```glsl
precision mediump float;  // Lower precision

// Single noise call only
float blob = snoise(vec3(coord * BLOB_SCALE, t * 0.3));
blob = blob * 0.5 + 0.5;

// Simple 3-4 color gradient, no alpha compositing
if (blendFactor < 0.35) {
  color = COLOR_1;
} else if (blendFactor < 0.55) {
  color = mix(COLOR_1, COLOR_2, smoothstep(0.35, 0.55, blendFactor));
} else if (blendFactor < 0.75) {
  color = mix(COLOR_2, COLOR_3, smoothstep(0.55, 0.75, blendFactor));
} else {
  color = COLOR_3;
}
```

**Expected Performance:**
- ~20M shader ops/sec (95% reduction from original)
- Fans should remain completely silent on 2015-era MacBooks

### Visual Quality
- No visible banding in gradients
- Smooth, continuous animation at 30fps (imperceptible given slow SPEED)
- Colors match Figma reference
- Warm beige always visible at bottom
- Slightly softer edges on Retina (acceptable for blurry gradients)

## Preview & Export Tool

**File:** `demo/overview.html`

A unified tool for previewing and exporting gradient themes.

### Features
- **Theme tabs**: Switch between AI, Precision Health (more themes to be added)
- **Version toggle**: Full vs Lite+ versions
- **Iframe preview**: 16:9 aspect ratio preview
- **Video export**: 30-second WebM loops for After Effects

### Export Settings
| Setting | Value |
|---------|-------|
| Format | WebM (VP9 codec) |
| Frame rate | 30fps |
| Bitrate | 40 Mbps |
| Landscape | 1920 × 1080 |
| Portrait | 1080 × 1920 |
| Dithering | Yes (prevents banding) |

### Export Workflow
1. Select theme and preview in iframe
2. Click export button (Landscape or Portrait)
3. Wait for 30-second render (progress shown)
4. WebM file auto-downloads
5. Import into After Effects for compositing

### Adding New Themes
Update the `THEMES` config in overview.html:
```javascript
const THEMES = {
  ai: {
    name: 'Artificial Intelligence',
    full: 'index-ai-v6.html',
    lite: 'index-ai-v7-lite.html'
  },
  'precision-health': {
    name: 'Precision Health',
    full: 'index-precision-health-v7.html',
    lite: 'index-precision-health-v8-lite.html'
  },
  // Add new themes here
};
```

Also add the fragment shader code for export (inline in overview.html).

## TODO

- [ ] Progressive Education theme
- [ ] Social Progress theme
- [ ] Sustainability theme
- [x] Performance optimization for older MacBooks (January 2026)
- [x] Ultra-lightweight "lite" versions for oldest devices (January 2026)
- [x] Export as video loop option (January 2026)
- [ ] Add `prefers-reduced-motion` media query support
- [ ] Create production component version

## Resources

- [Simplex Noise GLSL](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)
- [The Book of Shaders - Noise](https://thebookofshaders.com/11/)
- Figma: https://www.figma.com/design/Bi0rYZgaCjIJpUwtPNgbFh/Year-in-Review?node-id=148-88
