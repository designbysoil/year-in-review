# Qatar Foundation Year in Review 2025 - Project Memory

## Project Overview

This is the 2025 Year in Review website for Qatar Foundation, showcasing monthly stories across five thematic areas. The project uses a card-based browse interface with drawer/modal navigation for immersive story reading.

## Content Source

**Primary content file:** `2025 content/Year in Review Content English - 2025.docx`

### Document Structure
- 12 monthly essays (January - December)
- Each month has up to 10 chapters/stories
- Each chapter contains:
  - Title
  - Tags (thematic areas)
  - Content paragraphs
  - Visual elements (1-6): images, videos, quotes, stats, social embeds

### Five Thematic Areas
1. **Progressive Education** - Pink/Magenta (`#E91E63`)
2. **Social Progress** - Orange (`#FF9800`)
3. **Sustainability** - Green (`#43A047`)
4. **Artificial Intelligence** - Blue (`#2196F3`)
5. **Precision Health** - Teal (`#4CAF50`)

## File Structure

```
year-in-review/
├── index.html                    # Main browse by month page
├── CLAUDE.md                     # This project memory file
├── gradient-generator/           # Standalone gradient generator tool
│   ├── CLAUDE.md                 # Gradient generator project context
│   ├── gradient-generator.html   # Main tool (React + Tailwind, single file)
│   └── themes/                   # Theme images for gradient extraction
│       ├── ai/                   # 6 images (Quantum, Web Summit, AI Ethics, etc.)
│       ├── education/            # 6 images (Convocation, PUE, Reyada, etc.)
│       ├── social-progress/      # 6 images (Jadal, Ability Friendly, BilAraby, etc.)
│       ├── sustainability/       # 6 images (Earthna Summit, Mangroves, etc.)
│       └── precision-health/     # 6 images (Sidra, WCM-Q, WISH, etc.)
├── months/
│   ├── january-option-a-modal.html     # ✅ COMPLETE - Modal/drawer layout (PREFERRED)
│   ├── february-option-a-modal.html    # ✅ COMPLETE - Modal/drawer layout
│   ├── march-option-a-modal.html       # ✅ COMPLETE - Modal/drawer layout
│   ├── april-option-a-modal.html       # ✅ COMPLETE - Modal/drawer layout
│   ├── may-option-a-modal.html         # ✅ COMPLETE - Modal/drawer layout
│   ├── june-option-a-modal.html        # ✅ COMPLETE - Modal/drawer layout
│   ├── july-august-option-a-modal.html # ✅ COMPLETE - Modal/drawer layout (combined)
│   ├── september-option-a-modal.html   # ✅ COMPLETE - Modal/drawer layout
│   ├── october-option-a-modal.html     # ✅ COMPLETE - Modal/drawer layout
│   ├── november-option-a-modal.html    # 📋 TO DO - needs content
│   ├── december-option-a-modal.html    # 📋 TO DO - needs content
│   ├── january.html                    # BACKUP - Sidebar layout (Option B)
│   ├── january-option-b-anchors.html   # BACKUP - Sidebar layout (Option B)
│   └── [month].html                    # Old 2024 placeholders (deprecated)
└── 2025 content/
    ├── Year in Review Content English - 2025.docx
    ├── Year in Review Content English - 2025.pdf
    └── Media/
        ├── January/              # 18 files
        ├── February/             # 33 files
        ├── March/                # 27 files
        ├── April/                # 32 files
        ├── May/                  # 32 files
        ├── June/                 # 28 files
        ├── July & August/        # 27 files (combined month)
        ├── September/            # 20 files
        ├── October/              # 29 files
        ├── November/             # (pending)
        └── December/             # (pending)
```

## Media File Naming Convention

Files follow this pattern:
```
P[chapter#] [Month] Visual Element [#] - [Description].[ext]
```

Examples:
- `P1 January Visual Element 1 - 0164225001.jpg`
- `P2 January Visual Element 1 - HH Jadal Summit 2.jpg`
- `P10 January Visual Element 3 - QF Ability Friendly Program's Swimming Competition.png`

## Implementation Pattern (Modal/Drawer - PREFERRED)

### UX Pattern: Card Grid + Drawer Modal
The layout uses a card grid for browsing with a slide-up drawer for reading:
- **Header**: Sticky header with logo and month navigation
- **Card Grid**: 3-column grid of chapter cards with images and theme tags
- **Drawer Modal**: Slide-up panel (90vh) for reading full chapter content
- **Shareable URLs**: Each chapter has unique URL (`february-option-a-modal.html#chapter-3`)
- **Keyboard Navigation**: Arrow keys, Escape to close

### Page Structure
```html
<!-- Header -->
<header class="site-header">
    <div class="header-inner">
        <a href="../index.html" class="header-logo">
            <div class="logo">QF</div>
            <span class="header-logo-text">Year in Review</span>
        </a>
        <nav class="header-nav">
            <a href="january-option-a-modal.html">January</a>
            <a href="february-option-a-modal.html" class="active">February</a>
            <!-- ... other months -->
        </nav>
    </div>
</header>

<!-- Main Container -->
<main class="main-container">
    <div class="page-header">
        <p class="breadcrumb"><a href="../index.html">Year in Review</a> / February</p>
        <h1>February 2025</h1>
        <p class="month-intro">Intro paragraph...</p>
    </div>

    <section>
        <h2 class="section-title">10 Stories</h2>
        <div class="cards-grid">
            <!-- Chapter cards here -->
        </div>
    </section>
</main>

<!-- Drawer Overlay -->
<div class="drawer-overlay" id="drawerOverlay"></div>

<!-- Drawer -->
<div class="drawer" id="drawer">
    <div class="drawer-header">
        <div class="drawer-handle"></div>
        <div class="drawer-header-inner">
            <div class="drawer-chapter-indicator">
                <strong id="drawerChapterNum">Chapter 1</strong> of 10
            </div>
            <button class="drawer-close" id="drawerClose">×</button>
        </div>
    </div>
    <div class="drawer-content">
        <div class="drawer-content-inner" id="drawerContent">
            <!-- Content injected from templates -->
        </div>
    </div>
    <div class="drawer-footer">
        <button class="drawer-nav-btn" id="prevChapter">← Previous</button>
        <button class="drawer-nav-btn" id="nextChapter">Next →</button>
    </div>
</div>

<!-- Chapter Content Templates (hidden) -->
<div id="chapter-templates" style="display: none;">
    <template id="template-1">
        <!-- Full chapter HTML here -->
    </template>
    <!-- ... templates 2-10 -->
</div>
```

### Key CSS for Drawer Layout
```css
.drawer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 90vh;
    background: #F4F0EB;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 600;
    border-radius: 24px 24px 0 0;
}

.drawer.active {
    transform: translateY(0);
}

.drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    z-index: 500;
}

.drawer-overlay.active {
    opacity: 1;
    visibility: visible;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.chapter-card {
    height: 400px;
    border-radius: 24px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chapter-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(17, 54, 42, 0.2);
}
```

### JavaScript: Drawer Control
```javascript
function openDrawer(chapterNum) {
    currentChapter = chapterNum;
    updateDrawerContent();
    drawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.classList.add('drawer-open');
    history.pushState({ chapter: chapterNum }, '', `#chapter-${chapterNum}`);
}

function closeDrawer() {
    drawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.classList.remove('drawer-open');
    history.pushState({}, '', window.location.pathname);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'ArrowLeft') prevChapter();
    if (e.key === 'ArrowRight') nextChapter();
});
```

---

## BACKUP: Sidebar Navigation Pattern (Option B)

The sidebar layout is preserved in `january.html` and `january-option-b-anchors.html` as a backup.
- Uses fixed left sidebar with scroll-spy navigation
- All content visible on single page with anchor links
- Reference: Anthropic Economic Index, Shopify Editions

### Chapter Content Components
- **Hero Image** (`.story-hero`): 16:9 aspect ratio, full width with border-radius
- **Inline Image** (`.inline-image`): Full-width image within narrative flow
- **Image Carousel** (`.image-carousel-wrapper`): Horizontal scroll carousel for 2+ images, 90% visible with peek effect
- **Quote Block** (`.quote-block`): Left border accent, italic text
- **Stats Block** (`.stats-block`): Grid of stat cards with large numbers
- **Video Embed** (`.video-embed`): YouTube iframe (responsive 16:9)
- **Info List** (`.info-list`): Bulleted list in styled card

## Design Tokens

```css
/* Colors */
--bg-cream: #F4F0EB;
--green-dark: #11362A;
--green-medium: #4D7B6B;
--text-dark: #2C2C2C;
--text-gray: #414141;
--text-light: #666;

/* Theme Colors */
--education: #E91E63;
--social: #FF9800;
--sustainability: #43A047;
--ai: #2196F3;
--health: #4CAF50;

/* Spacing */
--card-height: 480px;
--card-radius: 30px;
--modal-radius: 24px;
```

## Progress Tracker

### Completed ✅ (Modal/Drawer Layout)
- [x] January 2025 - All 10 chapters with full content
- [x] February 2025 - 30th Anniversary, National Sport Day, Web Summit
- [x] March 2025 - All 10 chapters
- [x] April 2025 - Earthna Summit, Idris Elba, Akhlaquna Awards
- [x] May 2025 - Convocation, Excellence Awards
- [x] June 2025 - Leadership change (Yousif Al-Naama as CEO)
- [x] July & August 2025 (combined) - Summer camps
- [x] September 2025 - Back to school
- [x] October 2025 - All chapters

### To Do 📋
- [ ] November 2025 (10 chapters) - awaiting content/media
- [ ] December 2025 (10 chapters) - awaiting content/media

## How to Add a New Month

### Step 1: Gather Source Content
- Read the PDF for that month from `2025 content/Year in Review Content English - 2025.pdf`
- List media files: `ls -la "2025 content/Media/[Month]/"`

### Step 2: Copy Template
- Copy an existing modal file (e.g., `months/october-option-a-modal.html`) as the new month file
- Update: month name in title, header, breadcrumb, page-header
- Update: header-nav links and active state
- Update: month intro paragraph
- Update: totalChapters in JavaScript if different from 10

### Step 3: Process Each Chapter
For each chapter, extract from the source PDF:
- Title
- Theme tag(s)
- Content paragraphs (with hyperlinks)
- Visual elements (images, videos, quotes, stats)

### Step 4: Build the Page
1. Create card grid entries (`.chapter-card`) with images and theme tags
2. Create corresponding templates (`<template id="template-N">`) with full content
3. Ensure each chapter ends with a text paragraph (see Editorial Rules)

---

## Editorial Design Rules (CRITICAL)

### Rule 1: Chapters MUST End with Text
**NEVER end a chapter with any media element.** Chapters must always end with a text paragraph to provide clear visual separation between chapters.

❌ **Wrong:** Ending with stats block, quote, image, carousel, info-list, or video
✅ **Correct:** Ending with a paragraph of text

### Rule 2: Integrate Media Inline with Narrative
Media elements should appear **where they are contextually relevant** in the story, not appended at the end. The reader should follow the narrative with supporting media appearing at the right moments.

### Rule 3: Hyperlinks from Source
All hyperlinks present in the source PDF must be preserved in the HTML. Common link patterns:
- QF entity pages (e.g., `https://www.qf.org.qa/education/rasekh`)
- QF news stories (e.g., `https://www.qf.org.qa/stories/...`)
- Partner university websites
- External organization links

```html
<a href="https://www.qf.org.qa/..." target="_blank">linked text</a>
```

### Rule 4: Image Carousel for Multiple Images
When a chapter has **2+ images from the same story/event**, use the horizontal carousel instead of separate inline images.

```html
<div class="image-carousel-wrapper">
    <div class="image-carousel" data-carousel>
        <figure class="image-carousel-item">
            <img src="..." alt="Description">
        </figure>
        <figure class="image-carousel-item">
            <img src="..." alt="Description">
        </figure>
    </div>
    <div class="carousel-indicators">
        <button class="carousel-dot active" data-index="0"></button>
        <button class="carousel-dot" data-index="1"></button>
    </div>
</div>
```

**Carousel behavior:**
- Current image shows at 90% width
- Next/prev images peek from edges (bleeding off-canvas)
- Scroll-snap for smooth swiping
- Dot indicators update on scroll

### Rule 5: Single Images
For a single image within the narrative, use the inline-image class:

```html
<img src="..." alt="Descriptive alt text" class="inline-image">
```

### Rule 6: Hero Image
Each chapter starts with a hero image (Visual Element 1 from source):

```html
<img src="..." alt="..." class="story-hero">
```

If no hero image is available, use an empty div with gradient fallback:
```html
<div class="story-hero"></div>
```

---

## Chapter Structure Template

```html
<section id="chapter-N" class="chapter-section">
    <!-- 1. Hero Image -->
    <img src="..." alt="..." class="story-hero">

    <!-- 2. Theme Badge(s) -->
    <div class="story-meta">
        <span class="theme-badge education">Progressive Education</span>
    </div>

    <!-- 3. Title -->
    <h2 class="story-title">Chapter Title</h2>

    <!-- 4. Story Content with Inline Media -->
    <div class="story-content">
        <p>Opening paragraph...</p>

        <p>Paragraph with <a href="..." target="_blank">hyperlink</a>...</p>

        <!-- Stats placed near relevant content -->
        <div class="stats-block">
            <div class="stat-item">
                <div class="stat-number">100+</div>
                <div class="stat-label">description of the stat</div>
            </div>
        </div>

        <!-- Carousel for multiple images -->
        <div class="image-carousel-wrapper">...</div>

        <!-- Quote placed after relevant context -->
        <div class="quote-block">
            <div class="quote-text">"Quote text..."</div>
            <div class="quote-attribution">— Name, Title, Organization</div>
        </div>

        <p>More narrative content...</p>

        <!-- Info list for structured data -->
        <div class="info-list">
            <div class="info-list-title">List title:</div>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
            </ul>
        </div>

        <!-- MUST end with text paragraph -->
        <p>Closing paragraph that wraps up the chapter narrative.</p>
    </div>
</section>
```

---

## Media Element Reference

### Stats Block
```html
<div class="stats-block">
    <div class="stat-item">
        <div class="stat-number">45+</div>
        <div class="stat-label">descriptive label for the statistic</div>
    </div>
</div>
```

### Quote Block
```html
<div class="quote-block">
    <div class="quote-text">"The quote text goes here."</div>
    <div class="quote-attribution">— Speaker Name, Title, Organization</div>
</div>
```

### Video Embed (YouTube)
```html
<div class="video-embed">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
</div>
```

### Info List
```html
<div class="info-list">
    <div class="info-list-title">Title for the list:</div>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
    </ul>
</div>
```

---

## Content Processing Workflow

When given a month's PDF content:

1. **Read the PDF** to understand all chapters
2. **Create todo list** for tracking each chapter
3. **For each chapter card:**
   - Add card with hero image, title, description, and theme tags
   - Set `data-chapter` attribute for drawer linking
4. **For each chapter template:**
   - Start with hero image (Visual Element 1)
   - Add theme badge(s)
   - Add title
   - Process content paragraphs, adding hyperlinks
   - Integrate media elements inline where contextually relevant:
     - Stats near the numbers they describe
     - Quotes after the context they relate to
     - Images/carousels at narrative break points
     - Videos near related content
   - **Ensure chapter ends with a text paragraph**
5. **Update header navigation** with correct links and active state
6. **Update JavaScript** totalChapters if needed

## Figma Reference

Design mockup: https://www.figma.com/design/Bi0rYZgaCjIJpUwtPNgbFh/Year-in-Review?node-id=148-88

Key design elements:
- Card carousel with theme-based cards
- "Browse by Month" section
- "Dive Deeper" category filters
- Gradient backgrounds with soft blend modes

---

## Gradient Generator Tool

Located in `/gradient-generator/` — a standalone tool for generating theme-specific gradients.

**Files:**
- `gradient-generator/gradient-generator.html` — Main tool (React + Tailwind, single file)
- `gradient-generator/themes/` — Curated images for each theme (6 per theme, 30 total)

### Theme Image Sources
Images selected from 2025 content based on chapter-theme mappings:

| Theme | Sample Sources |
|-------|----------------|
| `ai/` | Quantum Computing (Jan), Web Summit (Feb), AI Ethics (Sep), WCM-Q AI Conference (Oct) |
| `education/` | International Day of Education (Jan), Convocation (May), PUE Graduation, QF Reyada |
| `social-progress/` | Jadal Summit (Jan), Ability Friendly Program, BilAraby (Apr), Herfah (Jun) |
| `sustainability/` | Earthna Summit (Apr), Idris Elba, Mangroves (Jul-Aug), King Charles (Jan) |
| `precision-health/` | Sidra Medicine (Jan), WCM-Q Students, WISH-UTokyo (Sep), Precision Medicine (Nov) |

### Purpose
Extracts dominant colors from theme card images and generates a two-layer gradient system for thematic landing pages. Part of the "Living Archive" digital transformation.

### Gradient System Architecture

**Three-Layer System:**
1. **Base layer**: Solid #FFE9D2 (peachy cream) — constant across all themes
2. **Primary gradient layer**: Linear vertical gradient with theme colors
3. **Top gradient layer**: Linear vertical gradient with Soft Light blend mode

**Edge Treatment:**
- Color stops at 0% and 100%: 0% opacity (transparent)
- Heavy offset positioning (-50% on all sides)
- 20px blur applied to gradient layers
- Creates infinite/atmospheric feel

### Color Extraction Process
1. Input: 6-10 card images per theme
2. Extract top 3-4 dominant colors per image (excluding near-black <30, near-white >225)
3. Cluster similar colors across full image set using k-means
4. Output: 2-3 most frequent color clusters
5. Classify as "warm" (hue 0-60° or 300-360°) or "cool" (hue 90-270°)

### Gradient Construction

**Primary Layer:**
```css
linear-gradient(180deg,
  rgba(249, 249, 247, 0) 0%,      /* transparent edge */
  [COOL_COLOR] 15%,               /* cool tone higher */
  [WARM_COLOR] 58%,               /* warm tone lower */
  rgba(217, 217, 217, 0) 100%     /* transparent edge */
)
```

**Soft Light Layer:**
```css
linear-gradient(180deg,
  rgba(249, 249, 247, 0) 0%,
  [ACCENT_COLOR] 29%,             /* most saturated color */
  rgba(217, 217, 217, 0) 100%
)
mix-blend-mode: soft-light;
```

### Theme Color Reference

| Theme | Primary Tones | Feeling |
|-------|---------------|---------|
| AI | Teal/Sidra green + Blue | Tech, digital, cool |
| Precision Health | Magenta/Pink + Purple | Medical, caring, innovative |
| Progressive Education | Teal + Warm sand | Growth, grounded wisdom |
| Social Progress | Deep purple + Warm peach | Community, warmth |
| Sustainability | Golden amber + Olive/green | Earth, nature, energy |

### Output Formats
- **CSS** — Pseudo-element approach with ::before and ::after
- **Figma** — Exact gradient stop values for manual recreation

### Design System Tokens (QF)
- Colors: Sidra green (#11362A), Sage (#889A68), neutrals (#F5F5F3, #E8E8E5, #D6D6D2)
- Typography: Text sizes xs/sm, muted secondary text (#9AB3A9, #4A7561)
- Components: Rounded corners (rounded-lg), subtle borders (border-[#E8E8E5])

---

## Notes

- July and August are combined into one section in the content
- Some months may have media files missing for certain chapters (use gradient fallback)
- Videos are embedded from YouTube using the /embed/ URL format
- Instagram embeds are referenced but not implemented (can add if needed)

## UX Decisions

### 1. Modal/Drawer vs Anchor-Links
**Decision:** Use modal/drawer navigation (Option A) as the preferred pattern.

**Rationale:**
- **Immersive reading**: Full-screen drawer creates focused reading experience
- **Visual browsing**: Card grid with images makes content discovery engaging
- **Mobile-friendly**: Drawer pattern works naturally on touch devices
- **Shareability preserved**: Each chapter still has unique URL (`#chapter-3`)

### 2. Sidebar Navigation (BACKUP - Option B)
**Alternative:** Fixed left sidebar with scroll-spy navigation (preserved in january.html).

**When to consider:**
- If SEO becomes critical (all content visible to crawlers)
- If users prefer seeing all content at once
- Documentation-style use cases

**References:**
- Anthropic Economic Index (https://www.anthropic.com/research/anthropic-economic-index)
- Shopify Editions Winter 2026 (https://www.shopify.com/editions/winter2026)
