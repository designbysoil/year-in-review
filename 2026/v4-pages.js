/* 2026 Year in Review — theme pages: v4-theme.html?t=<slug>, reached from
   the long page's Themes section and its National Priority cards.

   The page follows the theme's SID source document: why QF focuses on the
   theme, how it contributes to Qatar's national priorities, QF's
   achievements (the stories) and how QF is making a difference. Content is
   v4-sid-data.js via v4-pages-data.js; the monthly stories are data.js.
   Nav behaviour and the theme gradients follow v4-long.js. Version B
   (v4-theme-b.html, data-variant="b") shows each achievement's initiatives
   as cards and gives the nav this page's own sections. Version C
   (v4-theme-c.html) shows one card per achievement, each opening its story
   page (v4-story.html, v4-story.js). */
(() => {
  'use strict';

  const { THEMES, PRIORITIES, stories, themeHref } = window.YIRP;
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

  /* ─────────────────────────── which theme ─────────────────────────── */
  const qs = new URLSearchParams(location.search).get('t');
  const idx = Math.max(0, THEMES.findIndex(x => x.slug === qs));
  const me = THEMES[idx];
  const mine = stories.filter(s => s.theme === me.key);
  const NP = Object.fromEntries(PRIORITIES.map(p => [p.key, p]));
  const all = [...me.achievements, ...me.difference];
  const V = document.body.dataset.variant || 'a';   // a: v4-theme.html, b: v4-theme-b.html, c: v4-theme-c.html
  const B = V !== 'a';                               // B and C share the page-section nav
  document.body.dataset.theme = me.key;

  document.title = `${me.name} — Themes — YIR 2026`;
  $('#pg-title').textContent = me.name;
  $('#pg-eyebrow').textContent = `Theme ${pad(idx + 1)} / ${pad(THEMES.length)}`;

  /* a priority as a small tag: its pictogram and name */
  const chip = k => `<span class="np-chip"><svg viewBox="0 0 32 32" aria-hidden="true">${NP[k].icon}</svg>${esc(NP[k].name)}</span>`;
  const chips = keys => keys.length ? `<p class="np-chips"><span class="vh">Counts toward: </span>${keys.map(chip).join('')}</p>` : '';
  const figure = st => st ? `<p class="sx-fig"><span class="num">${esc(st[0])}</span><span class="lbl">${esc(st[1])}</span></p>` : '';
  const media = (sec, cls) => sec.img
    ? `<span class="${cls}"><img src="${sec.img}" alt="" loading="lazy" decoding="async"></span>`
    : `<span class="${cls} is-tone" data-theme="${me.key}"></span>`;
  const itemList = items => items.length ? `<ul class="sx-items" role="list">${items.map(x => `<li>${x}</li>`).join('')}</ul>` : '';

  /* ─────────────────────────── hero ─────────────────────────── */
  function buildHero() {
    $('#pg-key').textContent = me.key_line;
    $('#pg-img').src = IMG + me.img;
    // the year in four figures, quoted from the stories below
    // achievements carry no figures themselves; the hero still quotes theirs
    $('#pg-stats').innerHTML = all.map(x => x.stat || x.heroStat).filter(Boolean).slice(0, 4).map(st =>
      `<div class="stat"><dt class="num">${esc(st[0])}</dt><dd class="lbl">${esc(st[1])}</dd></div>`).join('');
    const canvas = $('#t-hero-bg canvas');
    const paint = () => paintGradient(canvas, me.slug);
    paint();
    let t = 0; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(paint, 120); });
  }

  /* ─────────────────────────── 01 · why ─────────────────────────── */
  function buildWhy() {
    $('#why-h').textContent = `Why does QF focus on ${me.name}?`;
    const [lede, ...rest] = me.why;
    $('#pg-why').innerHTML = `<p class="pg-lede">${lede}</p>` + rest.map(p => `<p class="pg-p">${p}</p>`).join('');
  }

  /* ─────────────────────────── 02 · national priorities ─────────────────────────── */
  /* The article page's National Priority card (Figma 1980:2686 / 1980:2697),
     stacked and alternating; each also points to the stories that count toward it. */
  function buildPriorities() {
    $('#np-h').textContent = `How does ${me.name} contribute to Qatar’s national priorities?`;
    $('#pg-np').innerHTML = me.outcomes.map((o, i) => {
      const seen = all.filter(x => x.align.includes(o.key));
      return `
      <article class="np-card${i % 2 ? ' np-card--alt' : ''}">
        <h3 class="np-title">${esc(NP[o.key].name)}</h3>
        <svg class="np-icon" viewBox="0 0 32 32" aria-hidden="true">${NP[o.key].icon}</svg>
        <div class="np-text">
          <p>${o.text}</p>
          ${seen.length ? `<p class="np-seen"><span>Seen in</span>${seen.map(x => `<a href="#${x.id}">${esc(x.title)}</a>`).join('')}</p>` : ''}
        </div>
      </article>`;
    }).join('');
  }

  /* ─────────────────────────── 03 · achievements ─────────────────────────── */
  function buildAchievements() {
    const list = me.achievements;
    $('#ach-sub').textContent = `${list.length} achievements of ${me.name} at Qatar Foundation. Open one to read the full story.`;
    // one card per achievement, each opening its story page
    $('#pg-index').innerHTML = list.map((x, i) => `
      <li><a class="sx-card" id="${x.id}" href="v4-story.html?t=${me.slug}&amp;s=${x.id}&amp;v=a">
        ${media(x, 'sx-card-media')}
        <span class="sx-card-top"><span class="idx">${pad(i + 1)}</span>${x.group ? `<span>${esc(x.group)}</span>` : ''}</span>
        <span class="sx-card-foot">
          <span class="sx-card-title">${esc(x.title)}</span>
        </span>
      </a></li>`).join('');
  }

  /* ─────────────────────────── 04 · making a difference ─────────────────────────── */
  function buildDifference() {
    const list = me.difference;
    $('#pg-dtoc').innerHTML = list.map((x, i) =>
      `<li><a href="#${x.id}"><span class="idx">${pad(i + 1)}</span><span class="nm">${esc(x.title)}</span></a></li>`).join('');
    $('#pg-diff').innerHTML = list.map((x, i) => `
      <article class="sx" id="${x.id}">
        <p class="sx-eyebrow"><span class="idx">${pad(i + 1)}</span>${x.timeline ? 'Timeline' : 'Making a difference'}</p>
        <h3 class="sx-title">${esc(x.title)}</h3>
        ${chips(x.align)}
        ${x.img ? `<figure class="sx-media"><img src="${x.img}" alt="" loading="lazy" decoding="async"></figure>` : ''}
        ${figure(x.stat)}
        ${x.intro.map((p, k) => `<p class="${k ? 'pg-p' : 'sx-lede'}">${p}</p>`).join('')}
        ${x.timeline
          ? `<ol class="dx-timeline" role="list">${x.timeline.map(y => `<li><span class="yr">${y.year}</span><div>${y.items.map(p => `<p>${p}</p>`).join('')}</div></li>`).join('')}</ol>`
          : itemList(x.items)}
      </article>`).join('');
  }


  function buildNotes() {
    if (!me.notes.length) return;
    const ol = $('#pg-notes');
    ol.hidden = false;
    ol.innerHTML = me.notes.map(n => `<li id="fn-${n.n}"><span class="idx">${n.n}</span><div>${n.html.map(p => `<p>${p}</p>`).join('')}</div></li>`).join('');
  }

  /* ─────────────────────────── stories ─────────────────────────── */
  function buildStories() {
    const tabs = [
      ['all', 'All', () => true],
      ['qf', 'Across QF', s => !(s.partners || []).length],
      ['partners', 'With partners', s => (s.partners || []).length > 0]
    ];
    let mode = 'all', open = false;
    $('#st-sub').textContent = `${mine.length} stories from the monthly reviews, filed under ${me.name}.`;
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
          <span class="scard-top"><span>${esc(s.month)}</span></span>
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
    const href = V === 'a' ? themeHref : (t => themeHref(t).replace('v4-theme.html', `v4-theme-${V}.html`));
    const next = THEMES[(idx + 1) % THEMES.length];
    const a = $('#pg-next');
    a.href = href(next);
    a.innerHTML = `<span>${esc(next.name)}</span>${arrow}`;
    $('#pg-peers').innerHTML = THEMES.map((x, i) =>
      `<li><a href="${href(x)}"${x === me ? ' aria-current="page"' : ''}><span class="idx">${pad(i + 1)}</span>${esc(x.name)}</a></li>`).join('');
  }

  /* ─────────────────────────── nav (as v4-long.js) ─────────────────────────── */
  function buildNav() {
    const nav = $('#nav'), menu = $('#nav-menu'), btn = $('#nav-current');
    const sections = $$('[data-bar]');
    if (menu && btn) {
      const toggle = open => { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
      btn.addEventListener('click', e => { e.stopPropagation(); toggle(menu.hidden); });
      document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target)) toggle(false); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { toggle(false); btn.focus(); } });
    }
    // the section nav sticks once it reaches the top
    const sub = $('#pg-subnav');

    let ticking = false;
    const update = () => {
      ticking = false;
      const probe = 28;
      const under = sections.find(s => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; }) || sections[0];
      nav.dataset.tone = under.dataset.tone;
      nav.style.setProperty('--bar', under.dataset.bar);
      nav.classList.toggle('is-solid', scrollY > 8);
      if (sub) {
        const stuck = sub.getBoundingClientRect().top <= parseFloat(getComputedStyle(sub).top) + 0.5;
        sub.classList.toggle('is-stuck', stuck);
        nav.classList.toggle('is-solid', scrollY > 8 || stuck);
      }
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    // in-page links scroll under the bar
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
      const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
      e.preventDefault();
      const navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 63;
      const sub = $('#pg-subnav');
      const subH = sub && getComputedStyle(sub).top !== '0px' ? sub.offsetHeight : 0;   // phones: a second row under the bar
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - navH - subH - 24, behavior: mqReduce.matches ? 'auto' : 'smooth' });
    });
  }

  /* The theme contents list follows the chapter being read. */
  function trackToc(sel) {
    const links = $$(sel); if (!links.length) return;
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

  /* ─────────────────────────── version B ───────────────────────────
     v4-theme-b.html: each achievement's initiatives are cards in a rail,
     read one at a time in a drawer; no "Through the year"; the nav carries
     this page's own sections instead of the long page's. */
  const plain = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); };

  /* A card's title: the initiative's bold name when it leads the text,
     otherwise its opening clause. */
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  function cardTitle(html) {
    const m = html.match(/<strong>(.*?)<\/strong>/);
    if (m && html.indexOf(m[0]) < 240 && plain(m[1]).length <= 90) return cap(plain(m[1]).replace(/[.,:;]$/, ''));
    const t = plain(html).replace(/^(19|20)\d\d:\s*/, '');
    const clause = t.split(/(?<=[.;:])\s|,\s(?=[a-z])/)[0];
    const words = clause.split(' ');
    return cap(words.length > 11 ? words.slice(0, 10).join(' ') + '…' : clause.replace(/[.;:]$/, ''));
  }

  function buildAchievementsB() {
    const list = me.achievements;
    $('#ach-sub').textContent = `${list.length} stories of ${me.name} at Qatar Foundation. Each card is one initiative; open it to read the detail.`;
    $('#pg-index').remove();
    $('#pg-stories').innerHTML = list.map((x, i) => `
      <article class="sb" id="${x.id}">
        <div class="sb-head">
          <div class="sb-text">
            <p class="sx-eyebrow"><span class="idx">${pad(i + 1)}</span>${x.group ? esc(x.group) : 'Achievement'}</p>
            <h3 class="sx-title">${esc(x.title)}</h3>
            ${chips(x.align)}
            ${figure(x.stat)}
            ${x.intro.map((p, k) => `<p class="${k ? 'pg-p' : 'sx-lede'}">${p}</p>`).join('')}
          </div>
          ${media(x, 'sb-media')}
        </div>
        ${x.items.length ? `
        <div class="ix-rail-wrap">
          <ul class="ix-rail" role="list" aria-label="${esc(x.title)}: ${x.items.length} initiatives">
            ${x.items.map((it, k) => `
            <li><button type="button" class="ix-card" data-s="${i}" data-k="${k}">
              <span class="ix-card-idx">${pad(k + 1)} / ${pad(x.items.length)}</span>
              <span class="ix-card-title">${esc(cardTitle(it))}</span>
              <span class="ix-card-text">${esc(plain(it))}</span>
              <span class="ix-card-go">Read more<svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true"><path d="M9 1l4 4-4 4M13 5H0" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></span>
            </button></li>`).join('')}
          </ul>
          <div class="ix-arrows">
            <button type="button" data-dir="-1" aria-label="Previous initiatives"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>
            <button type="button" data-dir="1" aria-label="Next initiatives"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>
          </div>
        </div>` : ''}
      </article>`).join('');

    // rail arrows
    $$('.ix-rail-wrap').forEach(w => {
      const rail = $('.ix-rail', w), [prev, next] = $$('.ix-arrows button', w);
      const sync = () => {
        const max = rail.scrollWidth - rail.clientWidth;
        prev.disabled = rail.scrollLeft < 4; next.disabled = rail.scrollLeft > max - 4;
        w.classList.toggle('is-static', max < 4);
      };
      [prev, next].forEach(b => b.addEventListener('click', () => {
        const step = $('li', rail).offsetWidth + 16;
        rail.scrollBy({ left: +b.dataset.dir * step * 2, behavior: mqReduce.matches ? 'auto' : 'smooth' });
      }));
      rail.addEventListener('scroll', sync, { passive: true });
      addEventListener('resize', sync);
      sync();
    });

    buildDrawer(list);
  }

  /* One initiative at a time, in a drawer; arrows step through its story. */
  function buildDrawer(list) {
    const drawer = $('#ix-drawer'), overlay = $('#ix-overlay');
    let s = 0, k = 0, opener = null;
    const show = () => {
      const x = list[s];
      $('#ix-story').innerHTML = `${esc(x.title)}`;
      $('#ix-title').textContent = cardTitle(x.items[k]);
      $('#ix-text').innerHTML = `<p>${x.items[k]}</p>${x.align.length ? chips(x.align) : ''}`;
      $('#ix-pos').textContent = `Initiative ${k + 1} of ${x.items.length}`;
      $('#ix-prev').disabled = k === 0;
      $('#ix-next').disabled = k === x.items.length - 1;
      $('.ix-body', drawer).scrollTop = 0;
    };
    const open = (si, ki, from) => {
      s = si; k = ki; opener = from; show();
      drawer.hidden = overlay.hidden = false;
      requestAnimationFrame(() => { drawer.classList.add('on'); overlay.classList.add('on'); });
      document.body.classList.add('ix-open');
      $('#ix-close').focus();
    };
    const close = () => {
      drawer.classList.remove('on'); overlay.classList.remove('on');
      document.body.classList.remove('ix-open');
      setTimeout(() => { drawer.hidden = overlay.hidden = true; }, mqReduce.matches ? 0 : 400);
      opener && opener.focus();
    };
    document.addEventListener('click', e => {
      const c = e.target.closest('.ix-card'); if (c) open(+c.dataset.s, +c.dataset.k, c);
    });
    $('#ix-close').addEventListener('click', close);
    overlay.addEventListener('click', close);
    $('#ix-prev').addEventListener('click', () => { if (k > 0) { k--; show(); } });
    $('#ix-next').addEventListener('click', () => { if (k < list[s].items.length - 1) { k++; show(); } });
    document.addEventListener('keydown', e => {
      if (drawer.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') $('#ix-prev').click();
      if (e.key === 'ArrowRight') $('#ix-next').click();
    });
  }

  /* The nav's tabs follow the section being read. */
  function trackSections() {
    const links = $$('.pg-subnav a');
    const ids = [...new Set(links.map(a => a.getAttribute('href').slice(1)))];
    let last = null;
    const update = () => {
      const probe = innerHeight * 0.35;
      let cur = '';
      ids.forEach(id => { const t = document.getElementById(id); if (t && t.getBoundingClientRect().top <= probe) cur = id; });
      links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + cur)));
      // phones: keep the current tab in view
      const on = links.find(a => a.getAttribute('href') === '#' + cur);
      if (on && on !== last) { last = on; const r = on.parentNode; r.scrollTo({ left: on.offsetLeft - 16, behavior: 'smooth' }); }
    };
    addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  }

  /* ─────────────────────────── version C ───────────────────────────
     v4-theme-c.html: one tall card per achievement, in the story-card style
     the monthly stories used; each opens the achievement's own page
     (v4-story.html). */
  function buildAchievementsC() {
    const list = me.achievements;
    $('#ach-sub').textContent = `${list.length} achievements of ${me.name} at Qatar Foundation. Open one to read the full story.`;
    $('#pg-index').innerHTML = list.map((x, i) => `
      <li><a class="scard scard--ach${x.img ? '' : ' no-photo'}" id="${x.id}" href="v4-story.html?t=${me.slug}&amp;s=${x.id}" data-theme="${me.key}">
        <span class="scard-media">${x.img ? `<img src="${x.img}" alt="" loading="lazy" decoding="async">` : ''}</span>
        <span class="scard-top"><span>${pad(i + 1)}</span>${x.group ? `<span>${esc(x.group)}</span>` : ''}</span>
        <span class="scard-foot">
          ${x.stat ? `<span class="scard-num">${esc(x.stat[0])}</span>` : ''}
          <span class="scard-title">${esc(x.title)}</span>
          <span class="scard-go">Read the story<svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true"><path d="M9 1l4 4-4 4M13 5H0" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></span>
        </span>
      </a></li>`).join('');
  }

  /* Land on a story from the long page (…#s-arabic-language-preservation)
     once the page exists; a "difference" card opens its evidence on arrival. */
  function landOnHash() {
    const t = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (!t) return;
    const more = t.classList.contains('dx') && $('details', t);
    if (more) more.open = true;
    const navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 63;
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - navH - 24 });
  }

  /* ─────────────────────────── boot ─────────────────────────── */
  buildHero();
  buildWhy();
  buildPriorities();
  ({ a: buildAchievements, b: buildAchievementsB, c: buildAchievementsC })[V]();
  buildDifference();
  buildNotes();
  if ($('#st-grid')) buildStories();
  buildNext();
  buildNav();
  trackSections();   // every version carries the page's own section nav
  trackToc('#pg-dtoc a');
  landOnHash();
  document.fonts && document.fonts.ready.then(landOnHash);
})();
