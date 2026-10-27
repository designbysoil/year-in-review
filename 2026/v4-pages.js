/* 2026 Year in Review — theme and national priority pages.

   One script for both templates: v4-theme.html?t=<slug> and
   v4-priority.html?p=<slug>, reached from the long page's Themes and National
   Priorities sections. Content is v4-pages-data.js; stories are data.js.
   Nav behaviour and the theme gradients follow v4-long.js. */
(() => {
  'use strict';

  const { THEMES, PRIORITIES, MATRIX, STRENGTH, stories, themeHref, priorityHref } = window.YIRP;
  const IMG = 'v4/img/';
  const PAGE_SIZE = 12;

  /* The theme pages' gradient layers, as in v4-long.js (Figma 216:163 … 216:1213). */
  const BG = {
    'artificial-intelligence': { y0: 440, layers: [
      { y: -703, stops: [['#f9f9f7', 0, 0], ['#1b8ee0', 1, .448], ['#797b4d', 1, .578], ['#797b4d', 0, 1]] },
      { y: -441, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4d7b6b', 1, .288], ['#d9d9d9', 0, 1]] }] },
    'precision-health': { y0: 470, layers: [
      { y: -424, stops: [['#f9f9f7', 0, 0], ['#e09b1b', 1, .448], ['#4d7b6b', .43, .578], ['#d9d9d9', 0, 1]] },
      { y: -162, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4f1be0', 1, .288], ['#d9d9d9', 0, 1]] },
      { y: -424, h: 2422, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4f1be0', 1, .288], ['#d9d9d9', 0, 1]] }] },
    'progressive-education': { y0: 360, layers: [
      { y: -703, stops: [['#f9f9f7', 0, 0], ['#1e4d3d', 1, .4], ['#c4a77d', .77, .65], ['#d9d9d9', 0, 1]] },
      { y: -441, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#4f1be0', 1, .12], ['#357aaf', 1, .35], ['#d9d9d9', 0, 1]] },
      { y: -703, h: 2422, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#4f1be0', 1, .12], ['#357aaf', 1, .35], ['#d9d9d9', 0, 1]] }] },
    'sustainability': { y0: 220, layers: [
      { y: -703, stops: [['#f9f9f7', 0, 0], ['#e09b1b', 1, .448], ['#4d7b6b', .62, .578], ['#d9d9d9', 0, 1]] },
      { y: -441, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4d7b6b', 1, .288], ['#d9d9d9', 0, 1]] },
      { y: -703, h: 2422, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#b09cf6', 1, .149], ['#4d7b6b', 1, .288], ['#d9d9d9', 0, 1]] }] },
    'social-progress': { y0: 110, layers: [
      { y: -703, stops: [['#f9f9f7', 0, 0], ['#7642ba', 1, .448], ['#c38f46', .73, .578], ['#d9d9d9', 0, 1]] },
      { y: -441, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#351d47', 1, .149], ['#7d66a2', 1, .288], ['#d9d9d9', 0, 1]] },
      { y: -703, h: 2422, blend: 'soft-light', stops: [['#f9f9f7', 0, 0], ['#351d47', 1, .149], ['#7d66a2', 1, .288], ['#d9d9d9', 0, 1]] }] }
  };

  /* Logos the long page already carries; other partners show as names. */
  const LOGOS = {
    'Ministry of Environment and Climate Change': 'logo-mecc.png', 'Jassim and Hamad bin Jassim Charitable Foundation': 'logo-jhbj.png',
    'The Social & Sport Contribution Fund (DAAM)': 'logo-daam.png', 'Woqod': 'logo-woqod.png', 'WOQOD': 'logo-woqod.png',
    'Qatar National Bank': 'logo-qnb.png', 'ConocoPhillips': 'logo-conoco.png', 'Dukhan Bank': 'logo-dukhan.png'
  };

  /* ─────────────────────────── helpers ─────────────────────────── */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const root = document.documentElement;
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const arrow = '<svg class="i-arr" width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M10 1l5 5-5 5M15 6H0" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
  const meter = n => `<span class="meter" data-n="${n}" aria-label="${STRENGTH[n]}"><i></i><i></i><i></i></span>`;

  /* Paints a theme gradient onto a canvas the size of its box (canvas does soft-light natively). */
  function paintGradient(canvas, slug, scale = 0.5) {
    const bg = BG[slug], box = canvas.parentElement;
    const w = Math.max(1, Math.round(box.clientWidth * scale)), h = Math.max(1, Math.round(box.clientHeight * scale));
    const k = box.clientHeight / 900;   // Figma frames are 900 tall
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffe9d2';
    ctx.fillRect(0, 0, w, h);
    bg.layers.forEach(l => {
      const top = (l.y - bg.y0) * k * scale, lh = (l.h || 2160) * k * scale;
      const g = ctx.createLinearGradient(0, top, 0, top + lh);
      l.stops.forEach(([hex, a, pos]) => g.addColorStop(pos, rgba(hex, a)));
      ctx.globalCompositeOperation = l.blend || 'source-over';
      ctx.fillStyle = g;
      ctx.fillRect(0, Math.max(0, top), w, Math.min(h, top + lh) - Math.max(0, top));
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ─────────────────────────── what are we looking at ─────────────────────────── */
  const isTheme = document.body.dataset.page === 'theme';
  const set = isTheme ? THEMES : PRIORITIES;
  const qs = new URLSearchParams(location.search).get(isTheme ? 't' : 'p');
  const idx = Math.max(0, set.findIndex(x => x.slug === qs));
  const me = set[idx];
  const mine = isTheme ? stories.filter(s => s.theme === me.key) : stories.filter(s => s.priorities.includes(me.key));

  document.title = `${me.name} — ${isTheme ? 'Themes' : 'National Priorities'} — YIR 2026`;
  $('#pg-title').textContent = me.name;
  $('#pg-eyebrow').textContent = `${isTheme ? 'Theme' : 'National Priority'} ${pad(idx + 1)} / ${pad(set.length)}`;

  /* ─────────────────────────── theme page ─────────────────────────── */
  function buildTheme() {
    $('#pg-key').textContent = me.key_line;
    const img = $('#pg-img'); img.src = IMG + me.img;
    $('#pg-achieved').innerHTML = me.achieved;
    $('#pg-stats').innerHTML = me.stats.map(([n, l]) => `<div class="stat"><dt class="num">${esc(n)}</dt><dd class="lbl">${esc(l)}</dd></div>`).join('');
    $('#ch-name').textContent = me.name;
    $('#pg-intro').textContent = me.intro;

    $('#pg-toc').innerHTML = me.chapters.map((c, i) =>
      `<li><a href="#ch-${i + 1}"><span class="idx">${pad(i + 1)}</span><span class="nm">${esc(c.title)}</span></a></li>`).join('') +
      `<li><a href="#np-h"><span class="idx">${pad(me.chapters.length + 1)}</span><span class="nm">Where it counts</span></a></li>` +
      `<li><a href="#st-h"><span class="idx">${pad(me.chapters.length + 2)}</span><span class="nm">Stories</span></a></li>`;
    $('#pg-chapters').innerHTML = me.chapters.map((c, i) => `
      <article class="chapter" id="ch-${i + 1}">
        <p class="chapter-idx">${pad(i + 1)}</p>
        <h3 class="chapter-title">${esc(c.title)}</h3>
        ${c.body.map(p => `<p>${esc(p)}</p>`).join('')}
      </article>`).join('');

    // national priorities this theme counts toward, strongest first
    const rows = PRIORITIES.map((p, i) => ({ p, i, n: MATRIX[me.key][p.key], count: mine.filter(s => s.priorities.includes(p.key)).length }))
      .filter(r => r.n > 0).sort((a, b) => b.n - a.n || a.i - b.i);
    $('#pg-xrows').innerHTML = rows.map(r => `
      <li><a class="xrow" href="${priorityHref(r.p)}">
        <span class="idx">${pad(r.i + 1)}</span>
        <span class="xrow-name">${esc(r.p.name)}</span>
        <span class="xrow-meta">${meter(r.n)}<span class="xrow-lbl">${STRENGTH[r.n]}</span></span>
        <span class="xrow-count">${r.count ? `${r.count} ${r.count === 1 ? 'story' : 'stories'}` : '–'}</span>
        ${arrow}
      </a></li>`).join('');

    const canvas = $('#t-hero-bg canvas');
    const paint = () => paintGradient(canvas, me.slug);
    paint();
    let t = 0; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(paint, 120); });
  }

  /* ─────────────────────────── priority page ─────────────────────────── */
  function buildPriority() {
    $('#pg-desc').textContent = `${me.name} is one of seven outcomes in Qatar’s national development strategy. Qatar Foundation contributes to it ${me.via}. ${mine.length} of this year’s stories count toward this outcome.`;
    $('#pg-peers-inline').innerHTML = PRIORITIES.filter(p => p !== me).map(p => `<a href="${priorityHref(p)}">${esc(p.name)}</a>`).join(' ');

    // the long page's card, unchanged
    $('#pg-card').innerHTML = `
      <div class="card-media"><img class="on" src="${IMG}${me.img}" alt="" decoding="async"></div>
      <div class="card-shade" aria-hidden="true"></div>
      <div class="card-text">
        <p class="card-key">${esc(me.key_line)}</p>
        <dl class="card-stats">${me.stats.map(([n, l]) => `<div class="stat"><dt class="num">${esc(n)}</dt><dd class="lbl">${esc(l)}</dd></div>`).join('')}</dl>
      </div>`;
    $('#pg-what').textContent = me.what;
    $('#pg-why').textContent = me.why;
    $('#pg-record').innerHTML = me.evidence.map((e, i) => `<li><span class="idx">${pad(i + 1)}</span><p>${esc(e)}</p></li>`).join('');

    // themes behind it, strongest first, each with its own gradient
    const rows = THEMES.map((t, i) => ({ t, i, n: MATRIX[t.key][me.key], count: mine.filter(s => s.theme === t.key).length }))
      .filter(r => r.n > 0).sort((a, b) => b.n - a.n || a.i - b.i);
    $('#pg-xrows').innerHTML = rows.map(r => `
      <li><a class="xrow xrow--theme" href="${themeHref(r.t)}" data-slug="${r.t.slug}">
        <span class="swatch"><canvas></canvas></span>
        <span class="xrow-name">${esc(r.t.name)}</span>
        <span class="xrow-meta">${meter(r.n)}<span class="xrow-lbl">${STRENGTH[r.n]}</span></span>
        <span class="xrow-count">${r.count} ${r.count === 1 ? 'story' : 'stories'}</span>
        ${arrow}
      </a></li>`).join('');
    $$('.xrow--theme').forEach(a => paintGradient($('canvas', a), a.dataset.slug, 1));
  }

  /* ─────────────────────────── stories ─────────────────────────── */
  function buildStories() {
    const themeName = Object.fromEntries(THEMES.map(t => [t.key, t.name]));
    const tabs = [
      ['all', 'All', () => true],
      ['qf', 'Across QF', s => !(s.partners || []).length],
      ['partners', 'With partners', s => (s.partners || []).length > 0]
    ];
    let mode = 'all', open = false;
    $('#st-sub').textContent = `${mine.length} stories from 2025${isTheme ? '' : ', across ' + new Set(mine.map(s => s.theme)).size + ' themes'}.`;
    $('#st-tabs').innerHTML = tabs.map(([k, l, f]) =>
      `<button type="button" role="tab" data-k="${k}" aria-selected="${k === mode}">${l}<span>${mine.filter(f).length}</span></button>`).join('');

    // partners named in these stories, most frequent first
    const tally = {};
    mine.forEach(s => (s.partners || []).forEach(p => { tally[p] = (tally[p] || 0) + 1; }));
    const partners = Object.entries(tally).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 16);
    $('#st-partners').innerHTML = partners.map(([name]) => LOGOS[name]
      ? `<div class="ptile ptile--logo"><img src="${IMG}${LOGOS[name]}" alt=""><span class="pname">${esc(name)}</span></div>`
      : `<div class="ptile ptile--name"><span class="pname">${esc(name)}</span></div>`).join('');

    function render() {
      const list = mine.filter(tabs.find(t => t[0] === mode)[2]);
      const shown = open ? list : list.slice(0, PAGE_SIZE);
      $('#st-grid').innerHTML = shown.map(s => `
        <li><a class="scard${s.photo ? '' : ' no-photo'}" href="${s.href}" data-theme="${s.theme}">
          <span class="scard-media">${s.photo ? `<img src="${s.photo}" alt="" loading="lazy" decoding="async">` : ''}</span>
          <span class="scard-top"><span>${esc(s.month)}</span>${isTheme ? '' : `<span>${esc(themeName[s.theme] || '')}</span>`}</span>
          <span class="scard-foot"><span class="scard-title">${esc(s.title)}</span><span class="scard-sum">${esc(s.summary)}</span></span>
        </a></li>`).join('') || '<li class="st-empty">No stories in this view yet.</li>';
      // media that isn't deployed falls back to the theme's tone
      $$('.scard-media img', $('#st-grid')).forEach(img => img.addEventListener('error', () => { img.closest('.scard').classList.add('no-photo'); img.remove(); }, { once: true }));
      const more = $('#st-more');
      more.hidden = open || list.length <= PAGE_SIZE;
      more.textContent = `Show all ${list.length} stories`;
      $('#st-partners').hidden = mode !== 'partners' || !partners.length;
    }
    $('#st-tabs').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      mode = b.dataset.k; open = false;
      $$('button', $('#st-tabs')).forEach(x => x.setAttribute('aria-selected', String(x === b)));
      render();
    });
    $('#st-more').addEventListener('click', () => { open = true; render(); });
    render();
  }

  /* ─────────────────────────── next + peers ─────────────────────────── */
  function buildNext() {
    const href = isTheme ? themeHref : priorityHref;
    const next = set[(idx + 1) % set.length];
    const a = $('#pg-next');
    a.href = href(next);
    a.innerHTML = `<span>${esc(next.name)}</span>${arrow}`;
    $('#pg-peers').innerHTML = set.map((x, i) =>
      `<li><a href="${href(x)}"${x === me ? ' aria-current="page"' : ''}><span class="idx">${pad(i + 1)}</span>${esc(x.name)}</a></li>`).join('');
  }

  /* ─────────────────────────── nav (as v4-long.js) ─────────────────────────── */
  function buildNav() {
    const nav = $('#nav'), menu = $('#nav-menu'), btn = $('#nav-current');
    const sections = $$('[data-bar]');
    const toggle = open => { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', e => { e.stopPropagation(); toggle(menu.hidden); });
    document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target)) toggle(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { toggle(false); btn.focus(); } });

    let ticking = false;
    const update = () => {
      ticking = false;
      const probe = 28;
      const under = sections.find(s => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; }) || sections[0];
      nav.dataset.tone = under.dataset.tone;
      nav.style.setProperty('--bar', under.dataset.bar);
      nav.classList.toggle('is-solid', scrollY > 8);
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    // in-page links scroll under the bar
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
      const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
      e.preventDefault();
      const navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 63;
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - navH - 24, behavior: mqReduce.matches ? 'auto' : 'smooth' });
    });
  }

  /* The theme contents list follows the chapter being read. */
  function trackToc() {
    const links = $$('#pg-toc a'); if (!links.length) return;
    const targets = links.map(a => document.getElementById(a.getAttribute('href').slice(1)));
    const update = () => {
      const probe = innerHeight * 0.4;
      let i = 0;
      targets.forEach((t, k) => { if (t && t.getBoundingClientRect().top <= probe) i = k; });
      links.forEach((a, k) => a.setAttribute('aria-current', String(k === i)));
    };
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  /* ─────────────────────────── boot ─────────────────────────── */
  isTheme ? buildTheme() : buildPriority();
  buildStories();
  buildNext();
  buildNav();
  trackToc();
})();
