# YIR Gradient Generator — Project Context

## Project Overview

Building a gradient generator tool for Qatar Foundation's Year in Review 2025 campaign. The tool extracts dominant colors from theme card images and generates a two-layer gradient system for thematic landing pages.

This is part of the "Living Archive" digital transformation—moving from static annual reports to dynamic, evergreen experiences integrated into qf.org.qa. Each of the five strategic themes (AI, Precision Health, Progressive Education, Social Progress, Sustainability) gets its own visual identity through content-driven gradients.

## Design System

Follow the QF Design System patterns:
- Ultra-minimal UI
- Colors: Sidra green (#11362A), Sage (#889A68), neutrals (#F5F5F3, #E8E8E5, #D6D6D2)
- Typography: Text sizes xs/sm, muted secondary text (#9AB3A9, #4A7561), primary text (#0B241C)
- Components: Rounded corners (rounded-lg), subtle borders (border-[#E8E8E5]), minimal shadows

## Gradient System Specification

### Three-Layer Architecture

1. **Base layer**: Solid #FFE9D2 (peachy cream) — CONSTANT across all themes
2. **Primary gradient layer**: Linear vertical gradient with theme colors
3. **Top gradient layer**: Linear vertical gradient with Soft Light blend mode

### Edge Treatment
- Color stops at 0% and 100% positions: 0% opacity (transparent)
- Heavy offset positioning (-50% on all sides)
- 20px blur applied to gradient layers
- Creates infinite/atmospheric feel

### Color Extraction Process

1. Input: 6-10 card images per theme
2. Extract top 3-4 dominant colors per image (excluding near-black <30 brightness, near-white >225 brightness)
3. Cluster similar colors across full image set using k-means
4. Output: 2-3 most frequent color clusters
5. Classify each as "warm" or "cool" based on hue:
   - Warm: hue 0-60° or 300-360° (reds, oranges, yellows)
   - Cool: hue 90-270° (greens, blues, purples)

### Gradient Construction

**Primary Layer:**
```
linear-gradient(180deg, 
  rgba(249, 249, 247, 0) 0%,      /* transparent edge */
  [COOL_COLOR] 15%,               /* cool tone higher */
  [WARM_COLOR] 58%,               /* warm tone lower */
  rgba(217, 217, 217, 0) 100%     /* transparent edge */
)
```

**Soft Light Layer:**
```
linear-gradient(180deg, 
  rgba(249, 249, 247, 0) 0%,      /* transparent edge */
  [ACCENT_COLOR] 29%,             /* most saturated color */
  rgba(217, 217, 217, 0) 100%     /* transparent edge */
)
mix-blend-mode: soft-light;
```

### Color Selection Logic

- **Cool color**: Most saturated from cool-classified colors
- **Warm color**: Most saturated from warm-classified colors
- **Accent color**: Most saturated overall (used in soft light layer)
- Interior stops: 77-100% opacity, clustered in 15-60% position range

## Theme Color Palette Reference

From manual Figma mockups:

| Theme | Primary Tones | Feeling |
|-------|---------------|---------|
| AI | Teal/Sidra green + Blue | Tech, digital, cool |
| Precision Health | Magenta/Pink + Purple | Medical, caring, innovative |
| Progressive Education | Teal + Warm sand | Growth, grounded wisdom |
| Social Progress | Deep purple + Warm peach | Community, warmth |
| Sustainability | Golden amber + Olive/green | Earth, nature, energy |

## Output Formats

The tool should generate:

1. **CSS** — Pseudo-element approach with ::before and ::after
2. **Figma** — Exact gradient stop values for manual recreation
3. **Future**: Social media exports, other team formats

## Files

- `gradient-generator.html` — Main tool (React + Tailwind, single file)
- Uses QF Design System styling patterns
- Canvas-based color extraction with k-means clustering

## Key Decisions

- Gradient direction: Vertical (consistent across all themes)
- Base color #FFE9D2: Stays constant as unifying element
- Multi-image sampling: Colors derived from collective theme imagery, not single hero shot
- Content-driven system: As new stories are added, gradients can regenerate organically
