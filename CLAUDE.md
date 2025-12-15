# Qatar Foundation Year in Review 2025 - Project Memory

## Project Overview

This is the 2025 Year in Review website for Qatar Foundation, showcasing monthly stories across five thematic areas. The project uses a card-based browse interface with in-page anchor navigation (Shopify Editions style) for optimal exploration and shareability.

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
├── months/
│   ├── january.html              # ✅ COMPLETE - Full detail view
│   ├── february.html             # Old 2024 version (needs update)
│   ├── march.html                # Old 2024 version (needs update)
│   ├── april.html                # Old 2024 version (needs update)
│   ├── may.html                  # Old 2024 version (needs update)
│   ├── june.html                 # Old 2024 version (needs update)
│   ├── july.html                 # Old 2024 version (needs update)
│   ├── august.html               # Old 2024 version (needs update)
│   ├── september.html            # Old 2024 version (needs update)
│   ├── october.html              # Old 2024 version (needs update)
│   ├── november.html             # Old 2024 version (needs update)
│   └── december.html             # Old 2024 version (needs update)
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
        └── September/            # 20 files
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

## Implementation Pattern (January as Reference)

### UX Pattern: Sidebar Navigation (Anthropic Economic Index style)
The layout uses a fixed left sidebar with chapter navigation:
- **Left Sidebar**: Fixed navigation showing chapter numbers and titles
- **Beige Top Bar**: Sticky bar showing month title and story count
- **Card Grid as TOC**: Visual cards at top that scroll to chapter sections
- **Shareable URLs**: Each chapter has unique URL (`january.html#chapter-3`)
- **Scroll-Spy**: Sidebar highlights current chapter on scroll

### Page Structure
```html
<!-- Left Sidebar (fixed, 280px wide) -->
<aside class="sidebar">
    <div class="sidebar-header">
        <a href="../index.html" class="sidebar-logo">
            <div class="logo">QF</div>
            <span class="sidebar-logo-text">Year in Review</span>
        </a>
    </div>
    <nav class="sidebar-nav">
        <div class="sidebar-section-label">Chapters</div>
        <a href="#chapter-1" class="sidebar-nav-item active" data-chapter="1">
            <span class="sidebar-nav-number">1</span>
            <span class="sidebar-nav-title">A Language That Endures</span>
        </a>
        <!-- Repeat for chapters 2-10 -->
    </nav>
    <div class="sidebar-card">
        <!-- Callout card with link -->
    </div>
</aside>

<!-- Main Content (margin-left: 280px) -->
<main class="main-content">
    <!-- Beige Top Bar -->
    <div class="top-bar">
        <span class="top-bar-title">January 2025</span>
        <span class="top-bar-subtitle">10 stories</span>
    </div>

    <!-- Header, Cards Section, Chapter Sections -->
</main>
```

### Key CSS for Sidebar Layout
```css
.sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 280px;
    background: white;
    border-right: 1px solid rgba(0,0,0,0.08);
}

.main-content {
    margin-left: 280px;
}

.top-bar {
    position: sticky;
    top: 0;
    background: #F4F0EB;
    padding: 16px 40px;
}

.sidebar-nav-item.active {
    background: rgba(17, 54, 42, 0.06);
    border-left: 3px solid #11362A;
}

/* Responsive: hide sidebar on mobile */
@media (max-width: 768px) {
    .sidebar { display: none; }
    .main-content { margin-left: 0; }
}
```

### JavaScript: Scroll-Spy for Sidebar
```javascript
const chapterSections = document.querySelectorAll('.chapter-section');
const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');

function updateActiveChapter() {
    let currentChapter = null;
    chapterSections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom > 150) {
            currentChapter = index + 1;
        }
    });

    if (currentChapter) {
        sidebarNavItems.forEach(item => {
            const itemChapter = parseInt(item.dataset.chapter);
            item.classList.toggle('active', itemChapter === currentChapter);
        });
        history.replaceState(null, null, '#chapter-' + currentChapter);
    }
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveChapter);
});
```

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

### Completed ✅
- [x] January 2025 - All 10 chapters with full content, quotes, stats, media

### To Do 📋
- [ ] February 2025 (10 chapters) - 30th Anniversary, National Sport Day, Web Summit
- [ ] March 2025 (10 chapters)
- [ ] April 2025 (10 chapters) - Earthna Summit, Idris Elba, Akhlaquna Awards
- [ ] May 2025 (10 chapters) - Convocation, Excellence Awards
- [ ] June 2025 (10 chapters) - Leadership change (Yousif Al-Naama as CEO)
- [ ] July & August 2025 (combined) - Summer camps
- [ ] September 2025 (10 chapters) - Back to school
- [ ] October 2025 (10 chapters)
- [ ] November 2025 (10 chapters)
- [ ] December 2025 (10 chapters)

## How to Add a New Month

### Step 1: Gather Source Content
- Read the PDF for that month (e.g., `2025 content/February 2025.pdf`)
- List media files: `ls -la "2025 content/Media/[Month]/"`

### Step 2: Copy January Template
- Copy `months/january.html` as the new month file
- Update: month name in title, header, breadcrumb, top bar
- Update: sidebar navigation with new chapter titles
- Update: card grid with chapter cards
- Update: `chapterTitles` array in JavaScript

### Step 3: Process Each Chapter
For each chapter, extract from the source PDF:
- Title
- Theme tag(s)
- Content paragraphs (with hyperlinks)
- Visual elements (images, videos, quotes, stats)

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
3. **For each chapter:**
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
4. **Update sidebar navigation** with chapter titles
5. **Update card grid** with chapter cards
6. **Update JavaScript** chapterTitles array

## Figma Reference

Design mockup: https://www.figma.com/design/Bi0rYZgaCjIJpUwtPNgbFh/Year-in-Review?node-id=148-88

Key design elements:
- Card carousel with theme-based cards
- "Browse by Month" section
- "Dive Deeper" category filters
- Gradient backgrounds with soft blend modes

## Notes

- July and August are combined into one section in the content
- Some months may have media files missing for certain chapters (use gradient fallback)
- Videos are embedded from YouTube using the /embed/ URL format
- Instagram embeds are referenced but not implemented (can add if needed)

## UX Decisions

### 1. Anchor-Links vs Modals
**Decision:** Use anchor-link navigation instead of modals.

**Rationale:**
- **Shareability essential**: Each chapter has unique URL (`#chapter-3`)
- **Casual exploration**: Continuous scroll reduces friction vs opening/closing modals
- **SEO-friendly**: All content visible and crawlable

### 2. Sidebar Navigation (Anthropic Economic Index style)
**Decision:** Replace sticky top navigation with fixed left sidebar.

**Rationale:**
- **Chapter titles visible**: Users see full chapter names, not just numbers
- **Persistent navigation**: Always visible without scrolling
- **Professional appearance**: Matches dashboard/documentation patterns
- **Better hierarchy**: Clear visual structure with sidebar card for callouts

**References:**
- Anthropic Economic Index (https://www.anthropic.com/research/anthropic-economic-index)
- Shopify Editions Winter 2026 (https://www.shopify.com/editions/winter2026)
