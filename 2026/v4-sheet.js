/* 2026 Year in Review — an achievement's story in a bottom sheet.
   Loads after v4-pages.js on the theme pages (versions A and C). A click on an
   achievement card, or on a "Seen in" link, slides the story up from the
   bottom up to 72px below the top of the screen; close, Escape, a click outside, a drag down
   or the back button slide it away again. The URL carries the story
   (…#s-ai-in-education), so a story can be shared and the homepage cards
   open it directly. The full page (v4-story.html) stays as the fallback.

   Layout follows the story page in Figma (1985:2758). */
(() => {
  'use strict';

  const { THEMES, PRIORITIES } = window.YIRP;
  const $ = (s, r = document) => r.querySelector(s);
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const plain = html => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); };
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  const arrow = '<svg class="i-arr" width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M10 1l5 5-5 5M15 6H0" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const NP = Object.fromEntries(PRIORITIES.map(p => [p.key, p]));

  const slug = new URLSearchParams(location.search).get('t');
  const theme = THEMES.find(t => t.slug === slug) || THEMES[0];
  const list = theme.achievements;
  const byId = Object.fromEntries(list.map((x, i) => [x.id, i]));
  const outcome = Object.fromEntries(theme.outcomes.map(o => [o.key, o.text]));

  /* An initiative's heading: its bold name when that leads the text,
     otherwise its opening clause (as on the story page). */
  function heading(html) {
    const m = html.match(/<strong>(.*?)<\/strong>/);
    if (m && html.indexOf(m[0]) < 240 && plain(m[1]).length <= 90) return cap(plain(m[1]).replace(/[.,:;]$/, ''));
    const words = plain(html).split(/(?<=[.;:])\s|,\s(?=[a-z])/)[0].split(' ');
    return cap(words.length > 11 ? words.slice(0, 10).join(' ') + '…' : words.join(' ').replace(/[.;:]$/, ''));
  }
  const photo = x => x.img
    ? `<img src="${x.img}" alt="" decoding="async">`
    : `<span class="is-tone" data-theme="${theme.key}"></span>`;

  /* ─────────────────────────── the sheet ─────────────────────────── */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="sh-overlay" id="sh-overlay" hidden></div>
    <div class="sh" id="sh" role="dialog" aria-modal="true" aria-labelledby="sh-title" hidden>
      <div class="sh-head" id="sh-head">
        <span class="sh-grab" aria-hidden="true"></span>
        <p class="sh-pos" id="sh-pos"></p>
        <button class="sh-close" id="sh-close" type="button" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.4"/></svg>
        </button>
      </div>
      <div class="sh-body" id="sh-body"><article class="sh-art" id="sh-art"></article></div>
    </div>`);
  const sheet = $('#sh'), overlay = $('#sh-overlay'), body = $('#sh-body');

  function render(i) {
    const x = list[i];
    const intro = [...x.intro], items = [...x.items];
    const stand = intro.length ? intro.shift() : plain(items[0] || '').split(/(?<=\.)\s/)[0];
    const more = [1, 2].map(n => list[(i + n) % list.length]).filter((y, k, a) => y !== x && a.indexOf(y) === k);
    const line = (text, href) => href
      ? `<li><a href="${href}">${arrow}<span>${esc(text)}</span></a></li>`
      : `<li>${arrow}<span>${esc(text)}</span></li>`;

    $('#sh-pos').textContent = `${theme.name} · Achievement ${i + 1} of ${list.length}`;
    $('#sh-art').innerHTML = `
      <figure class="sh-hero">${photo(x)}</figure>
      <div class="sh-meta">
        <div><h3>Theme</h3><ul role="list">${line(theme.name)}</ul></div>
        <div><h3>National priorities</h3><ul role="list">${x.align.length ? x.align.map(k => line(NP[k].name, '#sh-np')).join('') : line('—')}</ul></div>
        ${x.group ? `<div><h3>Area</h3><ul role="list">${line(x.group)}</ul></div>` : ''}
      </div>
      <h2 class="sh-title" id="sh-title">${esc(x.title)}</h2>
      <p class="sh-stand">${stand}</p>
      <div class="sh-text">
        ${intro.map(p => `<p class="sh-p">${p}</p>`).join('')}
        ${items.map(it => `
          <section class="sh-sec">
            <h3 class="sh-h">${esc(heading(it))}</h3>
            <p class="sh-p">${it}</p>
          </section>`).join('')}
      </div>
      ${x.align.length ? `
      <section class="sh-np" id="sh-np" aria-label="National priorities">
        <p class="sh-np-note">How this story contributes to Qatar’s national priorities, the outcomes set out in the Third National Development Strategy (2024–2030).</p>
        <div class="np-stack">${x.align.map((k, n) => `
          <article class="np-card${n % 2 ? ' np-card--alt' : ''}">
            <h4 class="np-title">${esc(NP[k].name)}</h4>
            <svg class="np-icon" viewBox="0 0 32 32" aria-hidden="true">${NP[k].icon}</svg>
            <div class="np-text"><p>${outcome[k] || ''}</p></div>
          </article>`).join('')}
        </div>
      </section>` : ''}
      ${more.length ? `
      <section class="sh-more" aria-label="More from ${esc(theme.name)}">
        <h3>Discover more from ${esc(theme.name)}</h3>
        <ul role="list">${more.map(y => `
          <li><a class="sh-card" href="#${y.id}" data-sh="${y.id}">${photo(y)}<span>${esc(y.title)}</span></a></li>`).join('')}
        </ul>
      </section>` : ''}`;
    body.scrollTop = 0;
  }

  /* ─────────────────────────── open and close ─────────────────────────── */
  let current = -1, opener = null, pushed = false;
  const isOpen = () => !sheet.hidden;

  function open(id, { from = null, push = true } = {}) {
    const i = byId[id]; if (i === undefined) return false;
    render(i); current = i;
    if (push) { history[isOpen() && pushed ? 'replaceState' : 'pushState']({ sh: id }, '', '#' + id); pushed = true; }
    if (!isOpen()) {
      opener = from || document.activeElement;
      sheet.hidden = overlay.hidden = false;
      sheet.style.transform = '';
      requestAnimationFrame(() => requestAnimationFrame(() => { sheet.classList.add('on'); overlay.classList.add('on'); }));
      document.body.classList.add('sh-open');
    }
    $('#sh-close').focus({ preventScroll: true });
    return true;
  }

  function hide() {
    if (!isOpen()) return;
    sheet.classList.remove('on'); overlay.classList.remove('on');
    sheet.style.transform = '';
    document.body.classList.remove('sh-open');
    setTimeout(() => { if (!sheet.classList.contains('on')) sheet.hidden = overlay.hidden = true; }, reduce.matches ? 0 : 450);
    current = -1;
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  }

  // closing steps back through history when the sheet added an entry, so Back and close agree
  function close() {
    if (pushed && history.state && history.state.sh) { history.back(); return; }
    history.replaceState(null, '', location.pathname + location.search);
    hide();
  }

  addEventListener('popstate', () => {
    const id = location.hash.slice(1);
    if (byId[id] !== undefined) open(id, { push: false });
    else { pushed = false; hide(); }
  });

  // cards and "Seen in" links open the sheet instead of leaving the page
  document.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    const a = e.target.closest('a'); if (!a) return;
    let id = a.dataset.sh;
    if (!id) {
      const href = a.getAttribute('href') || '';
      const m = href.match(/v4-story\.html\?[^#]*\bs=([\w-]+)/) || href.match(/^#(s-[\w-]+)$/);
      id = m && m[1];
    }
    if (!id || byId[id] === undefined) return;
    e.preventDefault();
    open(id, { from: isOpen() ? opener : a });
  });

  $('#sh-close').addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    // keep Tab inside the sheet
    if (e.key === 'Tab') {
      const f = [...sheet.querySelectorAll('a[href],button')].filter(n => n.offsetParent);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // links inside the sheet to its own priorities scroll the sheet, not the page
  sheet.addEventListener('click', e => {
    const a = e.target.closest('a[href="#sh-np"]'); if (!a) return;
    e.preventDefault(); e.stopPropagation();
    const t = $('#sh-np', sheet);
    t && body.scrollTo({ top: t.offsetTop - 24, behavior: reduce.matches ? 'auto' : 'smooth' });
  }, true);

  /* ─────────────────────────── drag the bar down to dismiss ─────────────────────────── */
  const head = $('#sh-head');
  let y0 = null, dy = 0, t0 = 0;
  head.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    y0 = e.clientY; dy = 0; t0 = performance.now();
    head.setPointerCapture(e.pointerId);
    sheet.classList.add('is-drag');
  });
  head.addEventListener('pointermove', e => {
    if (y0 === null) return;
    dy = Math.max(0, e.clientY - y0);
    sheet.style.transform = `translateY(${dy}px)`;
    overlay.style.opacity = String(Math.max(0, 1 - dy / (sheet.offsetHeight * 0.9)));
  });
  const release = () => {
    if (y0 === null) return;
    const fast = dy / Math.max(1, performance.now() - t0) > 0.6;
    y0 = null; sheet.classList.remove('is-drag'); overlay.style.opacity = '';
    if (dy > Math.min(160, sheet.offsetHeight * 0.25) || (fast && dy > 30)) close();
    else sheet.style.transform = '';
  };
  head.addEventListener('pointerup', release);
  head.addEventListener('pointercancel', release);

  /* ─────────────────────────── arriving with a story in the URL ─────────────────────────── */
  const first = location.hash.slice(1);
  if (byId[first] !== undefined) {
    history.replaceState({ base: true }, '', location.pathname + location.search);
    open(first);
  }
})();
