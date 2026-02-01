# QF Year in Review - Animated Gradient System

## Project Overview

WebGL shader-based animated gradients for Qatar Foundation's 2025 Year in Review. These gradients serve as hero backgrounds for five thematic landing pages, inspired by Runway ML's Demo Day 2025 aesthetic.

**Goal:** Organic, slowly-drifting color clouds that feel alive and exciting with anticipation—sophisticated yet noticeable movement.

## Primary Development File

**`demo/index.html`** is the SINGLE SOURCE OF TRUTH for all gradient development.

### IMPORTANT: All gradient changes happen in `demo/index.html`

When updating gradients, colors, or adding features:
1. **Edit `demo/index.html` directly** — it contains:
   - All theme shaders (Standard style)
   - All varied style color definitions (`VARIED_THEME_COLORS`)
   - Preview tool with theme/style toggles
   - Video export functionality
   - Text overlay for Varied style preview
2. The preview tool loads individual theme files via iframe (Standard style)
3. Varied style uses `index-varied.html` with URL color params passed from index.html
4. Individual theme files (`index-[theme]-v*.html`) are standalone but shaders originate in index.html

### Never edit these files directly for color changes:
- `index-varied.html` — only receives colors via URL params from index.html
- `index-[theme]-v*.html` — standalone files, but colors should match index.html

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

### Progressive Education - FINAL: `index-education-v1.html`
- Dark Teal (#1E4D3D @ 40%) → Warm Sand (#C4A77D @ 65%) → Cream (#FFE9D2)
- **TWO soft-light layers** at different positions for rich color interaction
- Soft-light: Purple (#4F1BE0 @ 12%) → Blue (#357AAF @ 35%)
- Creates sophisticated teal-sand appearance through layer blending

### Progressive Education - LITE: `index-education-v2-lite.html`
- Ultra-lightweight version for older MacBooks
- 5-color gradient matching varied/full appearance: Violet → Blue → Dark Teal → Light Teal → Cream
- Direct colors bypass expensive soft-light compositing from full version
- Single snoise() call, mediump precision, DPR 1.0, 24fps

### Social Progress - FINAL: `index-social-progress-v1.html`
- Purple (#7642BA @ 44.8%) → Warm Gold (#C38F46 @ 73% opacity @ 57.8%) → Cream (#FFE9D2)
- **TWO soft-light layers** at different positions for rich color interaction
- Soft-light: Dark Purple (#351D47 @ 15%) → Medium Purple (#7D66A2 @ 29%)
- Creates sophisticated purple-gold appearance through layer blending

### Social Progress - LITE: `index-social-progress-v2-lite.html`
- Ultra-lightweight version for older MacBooks
- Simplified 4-color gradient: Purple → Mauve → Warm Gold → Cream
- Single snoise() call, no soft-light blending

### Sustainability - FINAL: `index-sustainability-v1.html`
- Golden Amber (#E09B1B @ 44.8%) → Teal-Green (#4D7B6B @ 62% opacity @ 57.8%) → Cream (#FFE9D2)
- **TWO soft-light layers** at different positions for rich color interaction
- Soft-light: Lavender (#B09CF6 @ 15%) → Teal-Green (#4D7B6B @ 29%)
- Creates earthy amber-green appearance through layer blending

### Sustainability - LITE: `index-sustainability-v2-lite.html`
- Ultra-lightweight version for older MacBooks
- Simplified 4-color gradient: Amber → Olive → Teal → Cream
- Single snoise() call, no soft-light blending

## All 5 Themes Complete

---

## Style Variants

The preview tool supports two gradient styles:

### Standard Style (Default)
- Figma-accurate multi-stop gradients with soft-light compositing
- Theme-specific shaders with precise color stops
- Best for full-screen web backgrounds
- Files: `index-[theme]-v*.html`

### Varied Style (Runway-inspired)
- Organic, pocket-like drift patterns inspired by Runway Demo Day 2025
- Directional movement: clouds drift left-to-right at ~8.5° upward angle
- 3-5 color gradients with dynamic shape morphing
- Best for social media video exports
- File: `index-varied.html` (accepts colors via URL params)
- **Preview includes text overlay** (Qatar Foundation + Year in Review + Theme title) — overlay only in preview, not in exports

**Varied Style Parameters:**
| Parameter | Value | Effect |
|-----------|-------|--------|
| `SPEED` | 0.40 | Base animation speed |
| `driftSpeed` | 0.72 | Directional drift velocity |
| `noiseScale` | 0.55 | Blob size (higher = smaller) |
| `noise1 time` | t * 0.6 | Shape morphing speed (layer 1) |
| `noise2 time` | t * 0.84 | Shape morphing speed (layer 2) |

**Varied Style Colors (per theme) — defined in `demo/index.html`:**
```javascript
const VARIED_THEME_COLORS = {
  'ai': ['1B8EE0', '797B4D', 'FFE9D2'],              // Blue → Khaki → Cream (3 colors)
  'precision-health': ['E06B51', 'DB7A8F', '9B7BB8', 'FFE9D2'], // Coral → Rose Pink → Lavender → Cream (4 colors)
  'education': ['4F1BE0', '357AAF', '1E4D3D', '4D7B6B', 'FFE9D2'], // Violet → Blue → Dark Teal → Light Teal → Cream (5 colors)
  'social-progress': ['5B2D91', '7642BA', '9B6B9E', 'C38F46', 'FFE9D2'], // Deep Purple → Purple → Mauve → Gold → Cream (5 colors)
  'sustainability': ['E09B1B', '8B8648', '6B8B5E', '4D7B6B', 'FFE9D2']  // Amber → Olive → Sage → Teal → Cream (5 colors)
};
```

**URL Format:**
- 3-color: `index-varied.html?c1=HEX&c2=HEX&c3=HEX`
- 4-color: `index-varied.html?c1=HEX&c2=HEX&c3=HEX&c4=HEX`
- 5-color: `index-varied.html?c1=HEX&c2=HEX&c3=HEX&c4=HEX&c5=HEX`

---

## Technical Architecture

### Stack
- **Renderer:** WebGL 1.0 (for broad compatibility)
- **Noise Algorithm:** 3D Simplex noise with FBM (Fractal Brownian Motion)
- **Base Color:** #FFE9D2 (peachy cream) - constant across all themes

### Key Shader Parameters

| Parameter | Value | Effect |
|-----------|-------|--------|
| `BLOB_SCALE` | 0.35 | Big visible blobs (lower = bigger) |
| `SPEED` | 0.40 | Animation speed (synced across Full/Lite+) |
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

### Progressive Education Theme (index-education-v1.html)
```glsl
const vec3 BASE_COLOR = vec3(1.0, 0.914, 0.824);           // #FFE9D2
const vec3 PRIMARY_TEAL = vec3(0.118, 0.302, 0.239);       // #1E4D3D @ 40%
const vec3 PRIMARY_SAND = vec3(0.769, 0.655, 0.490);       // #C4A77D @ 65%

// TWO soft-light layers create rich color interaction
const vec3 SOFTLIGHT_PURPLE = vec3(0.310, 0.106, 0.878);   // #4F1BE0 @ 12%
const vec3 SOFTLIGHT_BLUE = vec3(0.208, 0.478, 0.686);     // #357AAF @ 35%
```

### Social Progress Theme (index-social-progress-v1.html)
```glsl
const vec3 BASE_COLOR = vec3(1.0, 0.914, 0.824);           // #FFE9D2
const vec3 PRIMARY_PURPLE = vec3(0.463, 0.259, 0.729);     // #7642BA @ 44.8%
const vec3 PRIMARY_GOLD = vec3(0.765, 0.561, 0.275);       // #C38F46 @ 57.8%

// TWO soft-light layers create rich color interaction
const vec3 SOFTLIGHT_DARK = vec3(0.208, 0.114, 0.278);     // #351D47 @ 15%
const vec3 SOFTLIGHT_MID = vec3(0.490, 0.400, 0.635);      // #7D66A2 @ 29%
```

### Sustainability Theme (index-sustainability-v1.html)
```glsl
const vec3 BASE_COLOR = vec3(1.0, 0.914, 0.824);           // #FFE9D2
const vec3 PRIMARY_AMBER = vec3(0.878, 0.608, 0.106);      // #E09B1B @ 44.8%
const vec3 PRIMARY_TEAL = vec3(0.302, 0.482, 0.420);       // #4D7B6B @ 57.8%

// TWO soft-light layers create rich color interaction
const vec3 SOFTLIGHT_LAVENDER = vec3(0.690, 0.612, 0.965); // #B09CF6 @ 15%
const vec3 SOFTLIGHT_TEAL = vec3(0.302, 0.482, 0.420);     // #4D7B6B @ 29%
```

## File Structure

```
qf-gradient-project/
├── CLAUDE.md                           # This file
├── package.json                        # Project metadata
├── src/                                # Source components & utilities
│   ├── components/
│   │   └── AnimatedGradient.jsx        # React component wrapper (inline shaders)
│   ├── config/
│   │   └── themes.js                   # Theme color configs (RGB 0-1)
│   ├── shaders/
│   │   ├── vertex.glsl                 # Shared vertex shader
│   │   └── fragment.glsl               # Full fragment shader (FBM, 3 colors)
│   └── utils/
│       └── webgl.js                    # WebGL utility functions
└── demo/
    ├── index.html                      # 🎬 PRIMARY: Preview, Export MP4 & Export for Web
    ├── index-varied.html               # Parameterized varied style (3-5 colors via URL)
    ├── index-ai-v6.html                # ✅ FINAL AI theme (Standard)
    ├── index-ai-v7-lite.html           # ⚡ LITE AI theme
    ├── index-precision-health-v7.html  # ✅ FINAL Precision Health (Standard)
    ├── index-precision-health-v8-lite.html  # ⚡ LITE Precision Health
    ├── index-education-v1.html         # ✅ FINAL Progressive Education (Standard)
    ├── index-education-v2-lite.html    # ⚡ LITE Progressive Education
    ├── index-education-varied.html     # ✅ Progressive Education (Varied, 5-color)
    ├── index-social-progress-v1.html   # ✅ FINAL Social Progress (Standard)
    ├── index-social-progress-v2-lite.html  # ⚡ LITE Social Progress
    ├── index-sustainability-v1.html    # ✅ FINAL Sustainability (Standard)
    ├── index-sustainability-v2-lite.html   # ⚡ LITE Sustainability
    ├── overview.html                   # Reference overview page
    └── index-*-v[1-5].html            # Earlier iterations (archived)
```

## How to Extract Gradients from Figma

The rich gradient colors come from **layered Figma backgrounds** that interact through blend modes. Here's the process:

### Step 1: Access Figma via MCP
Use the Figma MCP server to fetch design context:
```javascript
mcp__figma-dev-mode-mcp-server__get_design_context({
  nodeId: "217:1425",  // Background node ID
  clientLanguages: "html,css,javascript"
})
```

### Step 2: Identify Layer Structure
Each theme background typically has 3-4 layers:
1. **Base layer**: Solid #FFE9D2 (peachy cream)
2. **Primary gradient**: Linear gradient with theme colors
3. **Soft-light layer(s)**: One or more gradients with `mix-blend-mode: soft-light`

### Step 3: Extract Gradient Colors
From the Figma response, extract `linear-gradient` values:
```
linear-gradient(
  rgba(249, 249, 247, 0) 0%,        // transparent at top
  rgb(53, 122, 175) 44.792%,        // Blue at 44.8%
  rgba(94, 87, 34, 0.56) 57.812%,   // Olive at 56% opacity at 57.8%
  rgba(217, 217, 217, 0) 100%       // transparent at bottom
)
```

### Step 4: Note Layer Positions
**Critical**: Layers may have different `top` positions that offset the gradient:
- Layer at `top: -703px` vs `top: -441px` = 262px offset
- This offset creates different blend zones and richer color interaction

### Step 5: Implement in Shader
Convert gradient stops to shader code:
```glsl
if (blendFactor < 0.448) {
  primaryColor = PRIMARY_BLUE;
  primaryAlpha = smoothstep(0.0, 0.448, blendFactor);
}
else if (blendFactor < 0.578) {
  float t = smoothstep(0.448, 0.578, blendFactor);
  primaryColor = mix(PRIMARY_BLUE, PRIMARY_OLIVE, t);
  primaryAlpha = mix(1.0, 0.56, t);  // Note: 56% opacity from Figma
}
```

### Why Multiple Soft-Light Layers Create Rich Colors
The Progressive Education theme uses **two soft-light layers** at different positions:
- When lavender (#D29CF6) soft-lights onto cream + blue, it creates cyan tones
- When mint (#88CC90) soft-lights, it adds green depth
- The offset between layers creates variation across the gradient
- Double application intensifies the effect

This is why the final result looks like rich cyan/teal even though the raw colors are blue and lavender/mint.

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

**File:** `demo/index.html`

A unified tool for previewing and exporting gradient themes.

### Features
- **Theme tabs**: AI, Precision Health, Progressive Education
- **Version toggle**: Full vs Lite+ versions
- **Iframe preview**: 16:9 aspect ratio preview
- **Video export**: 30-second MP4 loops for After Effects

### Export Settings
| Setting | Value |
|---------|-------|
| Format | MP4 (H.264 codec) |
| Frame rate | 30fps |
| Bitrate | 40 Mbps |
| Landscape | 1920 × 1080 |
| Portrait | 1080 × 1920 (with smaller blob scale 0.28) |
| Dithering | Yes (prevents banding) |

### Export Workflow
1. Select theme and preview in iframe
2. Click export button (Landscape or Portrait)
3. Wait for 30-second render (progress shown)
4. MP4 file auto-downloads
5. Import into After Effects for compositing

### Adding New Themes
Update the `THEMES` config in index.html:
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
  'education': {
    name: 'Progressive Education',
    full: 'index-education-v1.html',
    lite: 'index-education-v2-lite.html'
  }
};
```

Also add the fragment shader code for export (inline in index.html as `THEME_FRAGMENT_SHADER`).

### Export for Web (React / Gatsby)

The preview tool includes an "Export for Web" section that generates production-ready components for embedding animated gradients in React/Gatsby sites.

**Click "Generate Component"** to produce:

1. **`gradient-renderer.js`** (~10KB) — Vanilla JS ES module
   - `QFGradientRenderer` class with full WebGL lifecycle
   - Single parameterized lite+ fragment shader (all 5 themes via `u_color1..u_color5` + `u_numColors` uniforms)
   - Single `snoise()` call, `mediump` precision — optimized for performance
   - `THEME_COLORS` export with all 5 theme color configs
   - Performance: DPR 1.0, 30fps throttle, visibility API pause
   - `ResizeObserver` for container-aware canvas sizing
   - `prefers-reduced-motion` media query support
   - Clean `destroy()`, `pause()`, `resume()` methods

2. **`GradientCanvas.jsx`** (~1.2KB) — React wrapper component
   - Props: `theme`, `className`, `style`, `paused`
   - SSR-safe (`typeof window === 'undefined'` guard)
   - Falls back to solid `#FFE9D2` background if WebGL unavailable

3. **Usage tab** — Gatsby integration example

**Download .zip** bundles both files plus a README.

**Lite+ theme colors used in the web export** (from `LITE_THEME_COLORS` in index.html):
```javascript
'ai':               3 colors — Blue → Khaki → Cream
'precision-health':  4 colors — Coral → Mauve → Purple → Cream
'education':         5 colors — Violet → Blue → Dark Teal → Light Teal → Cream
'social-progress':   4 colors — Purple → Mauve → Gold → Cream
'sustainability':    4 colors — Amber → Olive → Teal → Cream
```

## TODO

- [x] Progressive Education theme (January 2026)
- [x] Social Progress theme (January 2026)
- [x] Sustainability theme (January 2026)
- [x] Performance optimization for older MacBooks (January 2026)
- [x] Ultra-lightweight "lite" versions for oldest devices (January 2026)
- [x] Export as video loop option (January 2026)
- [x] 5-color varied gradient support (January 2026)
- [x] Text overlay for Varied style preview (January 2026)
- [x] **Export for Web** — generates gradient-renderer.js ES module + GradientCanvas.jsx React wrapper (February 2026)
- [x] **Parameterized lite+ shader** — single fragment shader with color uniforms supports all 5 themes (February 2026)
- [x] Add `prefers-reduced-motion` media query support (in generated web export)
- [x] Create production component version (gradient-renderer.js + GradientCanvas.jsx)
- [ ] **Integration with Year in Review pages** — embed gradients as hero backgrounds

## Resources

- [Simplex Noise GLSL](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)
- [The Book of Shaders - Noise](https://thebookofshaders.com/11/)
- Figma: https://www.figma.com/design/Bi0rYZgaCjIJpUwtPNgbFh/Year-in-Review?node-id=148-88
