/* 2026 Year in Review — v4, the long page.

   The four sections of v4.html as one continuous page, in ordinary scroll:
   nothing is pinned whole, nothing snaps. Priorities and Themes give every
   item its own card in a column that scrolls past a pinned heading and list;
   the list follows the card crossing the middle of the screen, and in Themes
   the backdrop gradient follows it too. Phones keep v4's 390px layouts.

   Content, the recaps rail and the partners grid are v4.js's, unchanged.
   Copy is DRAFT, from the Figma file; figures are mostly 2025 record values
   from 05_national_impact_mapping.md and content.js, pending 2026 sign-off. */
(() => {
  'use strict';

  /* ─────────────────────────── content ─────────────────────────── */
  const IMG = 'v4/img/';
  const AUTO_MS = 6000;    // Priorities / Themes auto-advance

  const PRIORITIES = [
    { name: 'Sustainable Economic Growth', img: 'priority-1.jpg',
      key: 'We turn research into companies, and train the people who run them.',
      stats: [['40%', 'of Qatar’s published research is QF-affiliated'], ['50%+', 'of the country’s patented technology'], ['11', 'tech products shipped from QSTP']] },
    { name: 'Fiscal Sustainability', img: 'priority-2.jpg',
      key: 'Prevention is the most fiscally conservative policy a state can buy.',
      stats: [['90%', 'of prediabetic patients kept from progressing to diabetes'], ['900+', 'cardiac patients on personalised, lower-risk treatment'], ['250+', 'newborns screened for risk at birth']] },
    { name: 'Future-Ready Workforce', img: 'priority-3.jpg',
      key: 'A graduate pipeline aligned to the sectors Qatar is building.',
      stats: [['1,000+', 'graduates from 70+ programmes this year'], ['11,000+', 'university graduates over 30 years'], ['500+', 'alumni placed into jobs and internships']] },
    { name: 'Cohesive Society', img: 'priority-4.jpg',
      key: 'Arabic, identity and family, carried into policy and the classroom.',
      stats: [['27,500+', 'students worldwide in QFI Arabic programmes'], ['29,000', 'students taking part in QatarDebate'], ['3M+', 'visitors to Education City']] },
    { name: 'Quality of Life', img: 'priority-5.jpg',
      key: 'Children with complex conditions treated at home, not abroad.',
      stats: [['45+', 'children treated with gene therapy since 2022'], ['35,000', 'genomic records released for research'], ['2,900+', 'patients receiving free diabetes supplies']] },
    { name: 'Environmental Sustainability', img: 'priority-6.jpg',
      key: 'Solutions built for a hot, arid climate, proven on our own campus.',
      stats: [['125,000+', 'seedlings collected to restore forty hectares of coastline'], ['5.3M', 'kWh of renewable energy generated in Education City'], ['20,000+', 'students in Eco-Schools programmes']] },
    { name: 'Government Excellence', img: 'priority-7.jpg',
      key: 'Research that lands as national policy.',
      stats: [['5', 'family-policy recommendations implemented nationally'], ['6+', 'ministries working inside QF’s stories this year'], ['7', 'countries in our genomics-policy study']] }
  ];

  /* Gradients are the theme pages' own layers (frames 216:163 … 216:1213):
     each layer keeps its offset, height and blend (the upper layers are
     soft-light); `y0` is where the 900px window starts. Stops: [hex, alpha, pos]. */
  const THEMES = [
    { name: 'Artificial Intelligence', img: 'theme-1.jpg', secs: 10,
      key: 'Building artificial intelligence in Arabic, and the people who will govern it.',
      stats: [['400bn', 'words of Arabic behind Fanar, Qatar’s own language model'], ['20', 'startups enabled by QSTP to reach Web Summit Qatar'], ['200+', 'experts convened at Quantum.Tech Doha']],
      bg: { y0: 440, layers: [
        { y: -703, stops: [['#f9f9f7', 0, 0], ['#1b8ee0', 1, .448], ['#797b4d', 1, .578], ['#797b4d', 0, 1]] },
        { y: -441, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4d7b6b', 1, .288], ['#d9d9d9', 0, 1]] }] } },
    { name: 'Precision Health', img: 'theme-2.jpg', secs: 8,
      key: 'Medicine that fits the patient, built on a genomic record of this population.',
      stats: [['45+', 'children treated with gene therapy at Sidra Medicine since 2022'], ['400+', 'trainees graduated from paediatric programmes'], ['5', 'MENA populations given their first complete genome maps']],
      bg: { y0: 470, layers: [
        { y: -424, stops: [['#f9f9f7', 0, 0], ['#e09b1b', 1, .448], ['#4d7b6b', .43, .578], ['#d9d9d9', 0, 1]] },
        { y: -162, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4f1be0', 1, .288], ['#d9d9d9', 0, 1]] },
        { y: -424, h: 2422, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4f1be0', 1, .288], ['#d9d9d9', 0, 1]] }] } },
    { name: 'Progressive Education', img: 'theme-3.jpg', secs: 9,
      key: 'The long work of building a system that teaches itself, in Arabic, at every level.',
      stats: [['946', 'graduates from 77 nations crossed the stage'], ['1,100+', 'scholarships awarded'], ['600+', 'high-school graduates advancing to university']],
      bg: { y0: 360, layers: [
        { y: -703, stops: [['#f9f9f7', 0, 0], ['#1e4d3d', 1, .4], ['#c4a77d', .77, .65], ['#d9d9d9', 0, 1]] },
        { y: -441, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#4f1be0', 1, .12], ['#357aaf', 1, .35], ['#d9d9d9', 0, 1]] },
        { y: -703, h: 2422, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#4f1be0', 1, .12], ['#357aaf', 1, .35], ['#d9d9d9', 0, 1]] }] } },
    { name: 'Sustainability', img: 'theme-4.jpg', secs: 7,
      key: 'Putting the coast back, and the knowledge that manages it.',
      stats: [['40', 'hectares of coastline being restored with mangroves'], ['100+', 'countries represented at the Earthna Summit'], ['80%+', 'of waste recycled across Education City']],
      bg: { y0: 220, layers: [
        { y: -703, stops: [['#f9f9f7', 0, 0], ['#e09b1b', 1, .448], ['#4d7b6b', .62, .578], ['#d9d9d9', 0, 1]] },
        { y: -441, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4d7b6b', 1, .288], ['#d9d9d9', 0, 1]] },
        { y: -703, h: 2422, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4d7b6b', 1, .288], ['#d9d9d9', 0, 1]] }] } },
    { name: 'Social Progress', img: 'theme-5.jpg', secs: 8,
      key: 'Social progress is measured by who is included, not by how many attended.',
      stats: [['1,500+', 'submissions to BilAraby to revive Arabic in daily life'], ['68', 'teams competing in the Jr. NBA and Jr. WNBA Qatar League'], ['3', 'days of paid volunteering leave for every QF employee']],
      bg: { y0: 110, layers: [
        { y: -703, stops: [['#f9f9f7', 0, 0], ['#7642ba', 1, .448], ['#c38f46', .73, .578], ['#d9d9d9', 0, 1]] },
        { y: -441, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#351d47', 1, .149], ['#7d66a2', 1, .288], ['#d9d9d9', 0, 1]] },
        { y: -703, h: 2422, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#351d47', 1, .149], ['#7d66a2', 1, .288], ['#d9d9d9', 0, 1]] }] } }
  ];

  const LOGOS = [
    ['Ministry of Environment and Climate Change', 'logo-mecc.png'],
    ['Jassim and Hamad bin Jassim Charitable Foundation', 'logo-jhbj.png'],
    ['The Social & Sport Contribution Fund (DAAM)', 'logo-daam.png'],
    ['Woqod', 'logo-woqod.png'],
    ['Qatar National Bank', 'logo-qnb.png'],
    ['ConocoPhillips', 'logo-conoco.png'],
    ['Dukhan Bank', 'logo-dukhan.png']
  ];
  /* From the 130-partner index (Figma "Option D – name list"). */
  const NAMES = ['Qatar University', 'UNICEF', 'Microsoft', 'World Health Organization', 'Qatar Museums',
    'Aga Khan Development Network', 'Al Jazeera Digital', 'Carnegie Mellon University', 'Duke University', 'Education Above All',
    'Georgetown University', 'Huawei', 'HundrED', 'International Olympic Committee', 'JPMorgan Chase', 'Mastercard',
    'Ministry of Public Health', 'Ministry of Education and Higher Education', 'Msheireb Museums', 'National Basketball Association (NBA)',
    'Qatar Charity', 'Qatar Energy', 'Qatar Red Crescent', 'Rolls Royce', 'Shell', 'The Carter Center', 'The King’s Foundation',
    'UNESCO', 'United Nations', 'University College London', 'University of Cambridge', 'University of Oxford', 'University of Tokyo',
    'Web Summit', 'World Economic Forum', 'Doha Forum', 'Qatar Paralympic Committee', 'Volkswagen Middle East'];

  /* ─────────────────────────── helpers ─────────────────────────── */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = n => String(n).padStart(2, '0');
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

  const root = document.documentElement;
  const mqMobile = matchMedia('(max-width: 820px)');
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const panels = $$('.panel');
  const nav = $('#nav');
  const cssPx = name => parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;
  const navH = () => cssPx('--nav-h');
  const gutter = () => cssPx('--gut');

  let active = -1;         // section index under the tabs

  /* toast — for links that go nowhere in this prototype */
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let toastT = 0;
  const say = msg => { toast.textContent = msg; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 2200); };

  /* ─────────────────────────── 01 · recaps ─────────────────────────── */
  function buildRecaps() {
    const rail = $('#recap-rail'), dots = $('#recap-dots');
    const play = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>';
    rail.innerHTML = THEMES.map((r, i) => `
      <article class="rcard" tabindex="0" aria-label="${esc(r.name)} recap, ${r.secs} seconds">
        <img src="${IMG}${r.img}" alt="" decoding="async" ${i > 2 ? 'loading="lazy"' : ''}>
        <div class="rcard-shade"></div>
        <span class="rcard-play">${play}Play • ${r.secs} seconds</span>
        <div class="rcard-foot"><p>2026 Recap</p><h3>${esc(r.name)}</h3></div>
      </article>`).join('');
    const cards = $$('.rcard', rail);
    const [prev, next] = $$('.arrows button');
    let dotEls = [];

    /* One dot per position the rail can actually reach: with ~3.5 cards on a
       desktop screen that's 3, on a phone it's all 5. */
    const maxLeft = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
    const pages = () => {
      const w = cards[0].offsetWidth + parseFloat(getComputedStyle(rail).columnGap || 24);
      const n = maxLeft() < 4 ? 1 : Math.ceil(maxLeft() / w - 0.05) + 1;
      return { w, n };
    };
    const buildDots = () => {
      const { n } = pages();
      dots.innerHTML = Array.from({ length: n }, (_, k) => `<button type="button" aria-label="Go to position ${k + 1} of ${n}"></button>`).join('');
      dotEls = $$('button', dots);
      dotEls.forEach((d, k) => d.addEventListener('click', () => {
        rail.scrollTo({ left: Math.min(k * pages().w, maxLeft()), behavior: mqReduce.matches ? 'auto' : 'smooth' });
      }));
      dots.hidden = n < 2;
    };
    const sync = () => {
      const { w, n } = pages();
      const at = rail.scrollLeft >= maxLeft() - 4 ? n - 1 : clamp(Math.round(rail.scrollLeft / w), 0, n - 1);
      dotEls.forEach((d, k) => d.classList.toggle('on', k === at));
      prev.disabled = rail.scrollLeft < 4;
      next.disabled = rail.scrollLeft > maxLeft() - 4;
    };
    buildDots();
    addEventListener('resize', () => { buildDots(); sync(); });
    $$('.arrows button').forEach(b => b.addEventListener('click', () => {
      const step = cards[0].offsetWidth + 24;
      rail.scrollBy({ left: +b.dataset.dir * step, behavior: mqReduce.matches ? 'auto' : 'smooth' });
    }));
    rail.addEventListener('scroll', sync, { passive: true });

    /* Mouse drag. Touch and trackpads already scroll the rail natively; this
       gives a mouse the same grab-and-throw, then settles on the nearest card
       in the direction of the throw. */
    let drag = null, dragged = false;
    const step = () => cards[0].offsetWidth + parseFloat(getComputedStyle(rail).columnGap || 24);
    $$('img', rail).forEach(img => { img.draggable = false; });
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: rail.scrollLeft, lastX: e.clientX, lastT: performance.now(), v: 0 };
      dragged = false;
    });
    addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!dragged && Math.abs(dx) > 5) {
        dragged = true;
        rail.setPointerCapture?.(e.pointerId);
        rail.classList.add('is-dragging');           // snap off, grabbing cursor
      }
      if (!dragged) return;
      const now = performance.now();
      drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);   // px/ms
      drag.lastX = e.clientX; drag.lastT = now;
      rail.scrollLeft = drag.left - dx;
    });
    const release = () => {
      if (!drag) return;
      const d = drag; drag = null;
      if (!dragged) return;
      const w = step();
      const projected = rail.scrollLeft - d.v * 220;              // throw distance
      let i = Math.round(projected / w);
      const from = Math.round(d.left / w);
      if (i === from && Math.abs(rail.scrollLeft - d.left) > w * 0.15) i += rail.scrollLeft > d.left ? 1 : -1;
      i = clamp(i, 0, cards.length - 1);
      rail.scrollTo({ left: Math.min(i * w, rail.scrollWidth - rail.clientWidth), behavior: mqReduce.matches ? 'auto' : 'smooth' });
      setTimeout(() => rail.classList.remove('is-dragging'), 450); // restore snap after the settle
    };
    addEventListener('pointerup', release);
    addEventListener('pointercancel', release);

    cards.forEach(c => c.addEventListener('click', e => {
      if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; return; }   // a drag isn't a click
      say('The recap player isn’t wired into this prototype');
    }, true));
    sync();
  }

  /* The header wordmark: two rows drifting in opposite directions, one phrase
     per 14s, as in Figma. The text masks a gradient that stays put while the
     letters move (background-position runs against the transform). Each row
     is one phrase repeated past the screen width, so moving by one phrase
     loops seamlessly. CSS pauses it whenever Recaps isn't the active section. */
  function placeRecapsGradient() {
    const panel = $('#recaps'), rail = $('#recap-rail');
    const p = panel.getBoundingClientRect(), r = rail.getBoundingClientRect();
    panel.style.setProperty('--ct', (r.top - p.top) + 'px');
    panel.style.setProperty('--cb', (r.bottom - p.top) + 'px');
    panel.classList.add('has-cards');
  }

  function buildMarquee() {
    $$('.mq-row').forEach(row => {
      const track = $('.mq-track', row), unit = row.dataset.unit;
      track.textContent = unit;
      const u = track.getBoundingClientRect().width, w = row.clientWidth;
      if (!u || !w) return;
      track.textContent = unit.repeat(Math.ceil(w / u) + 2);
      row.style.setProperty('--u', u.toFixed(2) + 'px');
      row.style.setProperty('--w', w + 'px');
    });
  }

  /* ─────────── 02/03 · split: pinned list beside a column of cards ─────────── */
  function buildSplit(el, items, prefix, onChange) {
    const list = $('.split-list', el), column = $('.split-media', el);

    list.innerHTML = items.map((it, i) =>
      `<li><a href="#${prefix}-${i + 1}" data-i="${i}"><span class="idx">${pad(i + 1)}</span><span class="nm">${esc(it.name)}</span></a></li>`).join('');
    column.innerHTML = items.map((it, i) => `
      <div class="item" id="${prefix}-${i + 1}">
        <p class="card-label"><span class="idx">${pad(i + 1)}</span>${esc(it.name)}</p>
        <article class="card" aria-label="${esc(it.name)}">
          <div class="card-media"><img class="on" src="${IMG}${it.img}" alt="" decoding="async" ${i ? 'loading="lazy"' : ''}></div>
          <div class="card-shade" aria-hidden="true"></div>
          <div class="card-text">
            <p class="card-key rv" style="--d:0.04s">${esc(it.key)}</p>
            <dl class="card-stats">${it.stats.map(([num, lbl], k) =>
              `<div class="stat rv" style="--d:${(0.16 + k * 0.1).toFixed(2)}s"><dt class="num">${esc(num)}</dt><dd class="lbl">${esc(lbl)}</dd></div>`).join('')}</dl>
          </div>
        </article>
      </div>`).join('');

    const links = $$('a', list), cells = $$('.item', column), cards = $$('.card', column);
    let cur = -1;

    /* Each card plays its entrance once, when a third of it is on screen. */
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: 0.35 });
    cards.forEach(c => io.observe(c));

    links.forEach((a, i) => a.addEventListener('click', e => {
      e.preventDefault();
      const y = cells[i].getBoundingClientRect().top + scrollY - navH() - gutter();
      scrollTo({ top: y, behavior: mqReduce.matches ? 'auto' : 'smooth' });
    }));

    /* The active item is the card crossing the middle of the space below
       the nav; its rule in the list fills as that card scrolls past. */
    function update() {
      const probe = navH() + (innerHeight - navH()) / 2, gap = gutter();
      let i = 0;
      cells.forEach((c, k) => { if (c.getBoundingClientRect().top <= probe) i = k; });
      const r = cells[i].getBoundingClientRect();
      const p = clamp((probe - r.top) / (r.height + gap), 0, 1);
      links[i].style.setProperty('--p', p.toFixed(3));
      if (i === cur) return;
      cur = i;
      links.forEach((a, k) => a.setAttribute('aria-current', String(k === i)));
      onChange && onChange(i);
    }
    return { update };
  }

  /* Each theme's gradient is drawn once onto a canvas (canvas does soft-light
     natively), the size of the viewport it stays pinned to. */
  function buildThemeBackdrops() {
    const host = $('#theme-bg');
    host.innerHTML = THEMES.map((th, i) => `<div class="tbg${i ? '' : ' on'}" data-i="${i}"><canvas></canvas></div>`).join('');
    const layers = $$('.tbg', host);
    const canvases = layers.map(l => $('canvas', l));
    const SCALE = 0.5;                      // smooth gradients survive the upscale; quarter the pixels
    function paint() {
      const w = Math.max(1, Math.round(host.clientWidth * SCALE));
      const h = Math.max(1, Math.round(host.clientHeight * SCALE));
      const k = host.clientHeight / 900;   // Figma frames are 900 tall: stretch the gradient with the screen
      THEMES.forEach((th, i) => {
        const c = canvases[i];
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#ffe9d2';           // theme page base
        ctx.fillRect(0, 0, w, h);
        th.bg.layers.forEach(l => {
          const top = (l.y - th.bg.y0) * k * SCALE, lh = (l.h || 2160) * k * SCALE;
          const g = ctx.createLinearGradient(0, top, 0, top + lh);
          l.stops.forEach(([hex, a, pos]) => g.addColorStop(pos, rgba(hex, a)));
          ctx.globalCompositeOperation = l.blend || 'source-over';
          ctx.fillStyle = g;
          ctx.fillRect(0, Math.max(0, top), w, Math.min(h, top + lh) - Math.max(0, top));
        });
      });
    }
    const set = i => layers.forEach((l, k) => l.classList.toggle('on', k === i));
    set.paint = paint;
    return set;
  }

  /* ─────────────────────────── 04 · partners grid ─────────────────────────── */
  function buildPartners() {
    const grid = $('#pgrid');
    let cfg = null, tiles = [], timer = 0, pool = [];

    const config = () => mqMobile.matches
      ? { cols: 3, rows: 4, logos: 6, names: 3, gap: 8 }
      : { cols: 4, rows: 4, logos: 7, names: 5, gap: 12 };

    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

    function render() {
      cfg = config();
      const total = cfg.cols * cfg.rows;
      const logos = LOGOS.slice(0, cfg.logos).map(([name, img]) => ({ kind: 'logo', name, img }));
      const names = NAMES.slice(0, cfg.names).map(name => ({ kind: 'name', name }));
      pool = NAMES.slice(cfg.names);
      // interleave so logos and names mix
      const items = [];
      for (let i = 0; i < Math.max(logos.length, names.length); i++) { if (logos[i]) items.push(logos[i]); if (names[i]) items.push(names[i]); }
      const slots = shuffle([...Array(total).keys()]);
      tiles = items.map((it, i) => ({ ...it, slot: slots[i] }));
      grid.innerHTML = tiles.map(tl => tl.kind === 'logo'
        ? `<div class="ptile ptile--logo"><img src="${IMG}${tl.img}" alt=""><span class="pname">${esc(tl.name)}</span></div>`
        : `<div class="ptile ptile--name"><span class="pname">${esc(tl.name)}</span></div>`).join('');
      tiles.forEach((tl, i) => { tl.el = grid.children[i]; });
      place(true);
    }

    function place(instant) {
      const W = grid.clientWidth;
      const cell = (W - cfg.gap * (cfg.cols - 1)) / cfg.cols;
      grid.style.height = (cell * cfg.rows + cfg.gap * (cfg.rows - 1)) + 'px';
      tiles.forEach(tl => {
        const x = (tl.slot % cfg.cols) * (cell + cfg.gap), y = Math.floor(tl.slot / cfg.cols) * (cell + cfg.gap);
        if (instant) tl.el.style.transition = 'none';
        tl.el.style.width = tl.el.style.height = cell + 'px';
        tl.el.style.transform = `translate(${x}px,${y}px)`;
        if (instant) { void tl.el.offsetWidth; tl.el.style.transition = ''; }
      });
    }

    /* Sliding-puzzle moves: a tile only ever steps one cell into an empty
       neighbour, so nothing crosses anything else mid-flight. */
    function step() {
      const total = cfg.cols * cfg.rows;
      const bySlot = new Map(tiles.map(tl => [tl.slot, tl]));
      const empty = shuffle([...Array(total).keys()].filter(s => !bySlot.has(s)));
      const neighbours = s => {
        const c = s % cfg.cols, r = (s / cfg.cols) | 0, out = [];
        if (c > 0) out.push(s - 1);
        if (c < cfg.cols - 1) out.push(s + 1);
        if (r > 0) out.push(s - cfg.cols);
        if (r < cfg.rows - 1) out.push(s + cfg.cols);
        return shuffle(out);
      };
      const used = new Set(), moves = [];
      for (const e of empty) {
        const tl = neighbours(e).map(s => bySlot.get(s)).find(x => x && !used.has(x));
        if (tl) { used.add(tl); moves.push([tl, e]); }
        if (moves.length === 3) break;
      }
      moves.forEach(([tl, to]) => {
        tl.slot = to;
        if (tl.kind === 'name' && pool.length) {          // name tiles pick up a new partner as they travel
          tl.el.classList.add('swap');
          setTimeout(() => {
            pool.push(tl.name);
            tl.name = pool.shift();
            $('.pname', tl.el).textContent = tl.name;
            tl.el.classList.remove('swap');
          }, 420);
        }
      });
      place(false);
    }

    /* Moves only while the grid is on screen. */
    let visible = false;
    const run = () => {
      clearInterval(timer);
      if (mqReduce.matches || document.hidden || !visible) return;
      timer = setInterval(step, 2600);
    };
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; run(); }).observe(grid);
    document.addEventListener('visibilitychange', run);
    return { render, place: () => place(true) };
  }

  /* ─────────────────────────── nav ─────────────────────────── */
  const tabLinks = $$('.nav-tabs a'), menuLinks = $$('.nav-menu a');
  const menu = $('#nav-menu'), menuBtns = [$('#nav-current')];   // section switcher (phones)
  const SECTION_NAMES = ['Recaps', 'National Priorities', 'Themes', 'Partners'];

  function setActive(i) {
    if (i === active) return;
    active = i;
    tabLinks.concat(menuLinks).forEach(a => a.setAttribute('aria-current', String(+a.dataset.go === i)));
    $('#nav-current-label').textContent = SECTION_NAMES[i];
    history.replaceState(null, '', '#' + panels[i].id);
    root.dataset.active = panels[i].id;
  }

  const toggleMenu = open => {
    menu.hidden = !open;
    menuBtns.forEach(b => b.setAttribute('aria-expanded', String(open)));
  };
  menuBtns.forEach(b => b.addEventListener('click', e => { e.stopPropagation(); toggleMenu(menu.hidden); }));
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target)) toggleMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { toggleMenu(false); menuBtns[0].focus(); } });

  $$('[data-go]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); toggleMenu(false);
    panels[+a.dataset.go].scrollIntoView({ behavior: mqReduce.matches ? 'auto' : 'smooth' });
  }));

  /* ─────────────────────────── scroll ───────────────────────────
     One rAF per scroll: which section the tabs mark (the one across 45% of
     the screen), which one is under the bar (its tone, and a backdrop once
     its content runs beneath), and the
     two split columns. */
  let ticking = false;
  function update() {
    ticking = false;
    const probe = 28;
    let top = 0, mid = 0;
    panels.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) top = i;
      if (r.top <= innerHeight * 0.45 && r.bottom > innerHeight * 0.45) mid = i;
    });
    nav.dataset.tone = panels[top].dataset.tone;
    nav.style.setProperty('--bar', panels[top].dataset.bar);
    nav.classList.toggle('is-solid', panels[top].getBoundingClientRect().top < -8);   // clear at each section's own top, as in Figma
    setActive(mid);
    splits.forEach(s => s.update());
  }
  const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', requestUpdate, { passive: true });

  /* ─────────────────────────── boot ─────────────────────────── */
  buildRecaps();
  buildMarquee();
  const setThemeBg = buildThemeBackdrops();
  const splits = [
    buildSplit($('[data-split="priorities"]'), PRIORITIES, 'priority'),
    buildSplit($('[data-split="themes"]'), THEMES, 'theme', setThemeBg)
  ];
  const partners = buildPartners();

  setThemeBg.paint();
  partners.render();
  placeRecapsGradient();
  update();

  // land on the hash (a section or a single card) once the cards exist
  const target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView();

  document.fonts && document.fonts.ready.then(() => { buildMarquee(); placeRecapsGradient(); });   // re-measure once QF Serif is in

  let resizeT = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      setThemeBg.paint();
      partners.render();
      buildMarquee();
      placeRecapsGradient();
      update();
    }, 120);
  });
  mqMobile.addEventListener('change', () => { partners.render(); update(); });
})();
