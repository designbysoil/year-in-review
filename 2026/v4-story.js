/* 2026 Year in Review — an achievement's story page: v4-story.html?t=<theme>&s=<story>,
   opened from the achievement cards on a theme page (v4-theme-c.html).

   Layout follows the article page (Figma 1974:2490, sidebar option B):
   header, photo, the body beside a meta column (theme, national priorities,
   contents), then the National Priority Module (1985:2953) for the outcomes
   this story counts toward. Content is the theme's SID source document via
   v4-pages-data.js. */
(() => {
  'use strict';

  const { THEMES, PRIORITIES } = window.YIRP;

  /* ─────────────────────────── helpers ─────────────────────────── */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const plain = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); };
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  const arrow = '<svg class="i-arr" width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M10 1l5 5-5 5M15 6H0" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
  const NP = Object.fromEntries(PRIORITIES.map(p => [p.key, p]));
  const pict = k => `<svg viewBox="0 0 32 32" aria-hidden="true">${NP[k].icon}</svg>`;

  /* An initiative's heading: its bold name when that leads the text,
     otherwise its opening clause (as the cards in v4-pages.js). */
  function heading(html) {
    const m = html.match(/<strong>(.*?)<\/strong>/);
    if (m && html.indexOf(m[0]) < 240 && plain(m[1]).length <= 90) return cap(plain(m[1]).replace(/[.,:;]$/, ''));
    const words = plain(html).split(/(?<=[.;:])\s|,\s(?=[a-z])/)[0].split(' ');
    return cap(words.length > 11 ? words.slice(0, 10).join(' ') + '…' : words.join(' ').replace(/[.;:]$/, ''));
  }

  /* ─────────────────────────── which story ─────────────────────────── */
  const qs = new URLSearchParams(location.search);
  const theme = THEMES.find(t => t.slug === qs.get('t')) || THEMES[THEMES.length - 1];
  const list = theme.achievements;
  const idx = Math.max(0, list.findIndex(x => x.id === qs.get('s')));
  const me = list[idx];
  // back to the version the story was opened from (A or C)
  const fromA = qs.get('v') === 'a';
  const themeUrl = `${fromA ? 'v4-theme.html' : 'v4-theme-c.html'}?t=${theme.slug}`;
  const storyUrl = x => `v4-story.html?t=${theme.slug}&s=${x.id}${fromA ? '&v=a' : ''}`;

  document.title = `${me.title} — ${theme.name} — YIR 2026`;
  document.body.dataset.theme = theme.key;

  /* ─────────────────────────── header ─────────────────────────── */
  $('#nav-story').innerHTML = `<a href="${themeUrl}">${esc(theme.name)}</a><span aria-hidden="true">/</span>Achievement ${idx + 1} of ${list.length}`;
  $('#a-crumb').innerHTML = `<a href="v4-long.html">Year in Review</a><span aria-hidden="true">/</span><a href="${themeUrl}">${esc(theme.name)}</a><span aria-hidden="true">/</span><a href="${themeUrl}#achievements">Achievements</a>`;
  $('#a-eyebrow').textContent = me.group ? `${me.group} · Achievement ${pad(idx + 1)}` : `Achievement ${pad(idx + 1)}`;
  $('#a-title').textContent = me.title;
  // the standfirst is the story's own opening; a story without one leads with its first initiative
  const intro = [...me.intro];
  const items = [...me.items];
  $('#a-stand').innerHTML = intro.length ? intro.shift() : plain(items[0]).split(/(?<=\.)\s/)[0];
  $('#a-hero').innerHTML = me.img
    ? `<img src="${me.img}" alt="" decoding="async">`
    : `<span class="a-hero-tone is-tone" data-theme="${theme.key}"></span>`;

  /* ─────────────────────────── body ─────────────────────────── */
  const sec = items.map((it, i) => ({ id: `i-${i + 1}`, h: heading(it), html: it }));
  $('#a-body').innerHTML =
    (me.stat ? `<p class="sx-fig"><span class="num">${esc(me.stat[0])}</span><span class="lbl">${esc(me.stat[1])}</span></p>` : '') +
    intro.map(p => `<p class="a-p">${p}</p>`).join('') +
    sec.map((x, i) => `
      <section class="a-sec" id="${x.id}">
        <p class="a-sec-idx">${pad(i + 1)}</p>
        <h2 class="a-h2">${esc(x.h)}</h2>
        <p class="a-p">${x.html}</p>
      </section>`).join('') +
    `<p class="a-source">Figures from QF entities’ 2025 annual reporting, verified by a QF entity and validated by QF’s Strategy and Impact Department (SID).</p>`;

  // meta column: plain text, an arrow then one item per line (sidebar option B)
  const line = (href, text) => `<li><a href="${href}">${arrow}<span>${esc(text)}</span></a></li>`;
  $('#a-meta').innerHTML = `
    <div class="a-meta-block"><h2>Theme</h2><ul role="list">${line(themeUrl, theme.name)}</ul></div>
    ${me.align.length ? `<div class="a-meta-block"><h2>National Priorities</h2><ul role="list">${me.align.map(k => line('#a-np-h', NP[k].name)).join('')}</ul></div>` : ''}
    ${sec.length ? `<div class="a-meta-block a-meta-toc"><h2>In this story</h2><ol role="list">${sec.map((x, i) =>
      `<li><a href="#${x.id}"><span class="idx">${pad(i + 1)}</span><span>${esc(x.h)}</span></a></li>`).join('')}</ol></div>` : ''}`;

  /* ─────────────────────────── national priorities ─────────────────────────── */
  const outcome = Object.fromEntries(theme.outcomes.map(o => [o.key, o.text]));
  $('#a-np').innerHTML = me.align.map((k, i) => `
    <article class="np-card${i % 2 ? ' np-card--alt' : ''}">
      <h3 class="np-title">${esc(NP[k].name)}</h3>
      <svg class="np-icon" viewBox="0 0 32 32" aria-hidden="true">${NP[k].icon}</svg>
      <div class="np-text"><p>${outcome[k] || ''}</p></div>
    </article>`).join('');
  if (!me.align.length) $('.a-np').remove();

  /* ─────────────────────────── more + next ─────────────────────────── */
  $('#more-h').textContent = `More from ${theme.name}`;
  $('#more-sub').textContent = `The other ${list.length - 1} achievements on this theme.`;
  $('#more-grid').innerHTML = list.map((x, i) => x === me ? '' : `
    <li><a class="scard scard--ach${x.img ? '' : ' no-photo'}" href="${storyUrl(x)}" data-theme="${theme.key}">
      <span class="scard-media">${x.img ? `<img src="${x.img}" alt="" loading="lazy" decoding="async">` : ''}</span>
      <span class="scard-top"><span>${pad(i + 1)}</span>${x.group ? `<span>${esc(x.group)}</span>` : ''}</span>
      <span class="scard-foot">
        ${x.stat ? `<span class="scard-num">${esc(x.stat[0])}</span>` : ''}
        <span class="scard-title">${esc(x.title)}</span>
      </span>
    </a></li>`).join('');
  const next = list[(idx + 1) % list.length];
  $('#pg-next').href = storyUrl(next);
  $('#pg-next').innerHTML = `<span>${esc(next.title)}</span>${arrow}`;
  $('#a-back').href = themeUrl;
  $('#a-back').textContent = `Back to ${theme.name}`;

  /* ─────────────────────────── nav ─────────────────────────── */
  const nav = $('#nav'), sections = $$('[data-bar]'), root = document.documentElement;
  const update = () => {
    const under = sections.find(s => { const r = s.getBoundingClientRect(); return r.top <= 28 && r.bottom > 28; }) || sections[0];
    nav.dataset.tone = under.dataset.tone;
    nav.style.setProperty('--bar', under.dataset.bar);
    nav.classList.toggle('is-solid', scrollY > 8);
  };
  addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  update();

  // contents follows the section being read; in-page links land under the bar
  const toc = $$('.a-meta-toc a');
  const spy = () => {
    let i = -1;
    sec.forEach((x, k) => { const t = document.getElementById(x.id); if (t.getBoundingClientRect().top <= innerHeight * 0.4) i = k; });
    toc.forEach((a, k) => a.setAttribute('aria-current', String(k === i)));
  };
  if (toc.length) { addEventListener('scroll', () => requestAnimationFrame(spy), { passive: true }); spy(); }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
    const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
    e.preventDefault();
    const navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 63;
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - navH - 24, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
})();
