/* Auto-paging recap — a placeholder for the video overview that will be produced.
   Seven beats, after the 2025 narrative arc: Promise, Proof, Proof, Reflection, Scale, Invitation.
   Cards are generated from the tagged record; the two editorial ones are marked, not faked. */
window.QFRecap = (function () {
"use strict";

const { pc, rank, profile } = window.QF;
const DUR = 5200;

const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };

/* ---------- build the deck from data ---------- */
function deck(name, stories, kicker){
  const cards = [];
  const metrics = stories.flatMap(s => (s.metrics || []).map(m => ({ ...m, story:s })));
  const withHero = stories.filter(s => s.hero);
  const ents = rank("entities", stories);
  const kws  = profile(stories, 3).distinctive;

  cards.push({ beat:"Promise", type:"title", skin:"rc-green", eyebrow:"2026 Year in Review",
    h:"A Year in\n" + name, sub: kicker });

  if (metrics[0]) cards.push({ beat:"Scale", type:"stat", skin:"rc-cream", eyebrow:"The year in one number",
    stat:metrics[0].value, lbl:metrics[0].label });

  if (withHero[0]) cards.push({ beat:"Proof", type:"image", skin:"rc-green", eyebrow:withHero[0].month,
    img:withHero[0].hero, h:withHero[0].title, sub:withHero[0].summary });

  if (withHero[1]) cards.push({ beat:"Proof", type:"split", skin:"rc-taupe", eyebrow:withHero[1].month,
    img:withHero[1].hero, h:withHero[1].title, sub:withHero[1].summary });

  cards.push({ beat:"Reflection", type:"quote", skin:"rc-green", eyebrow:"Reflection",
    quote:"—", attr:"",
    todo:"The pull quote. One line from someone who was there — the beat the 2025 arc calls Reflection. Editorial, not derivable." });

  if (metrics.length > 1) cards.push({ beat:"Scale", type:"grid", skin:"rc-olive", eyebrow:"The scale of it",
    grid: metrics.slice(0, 3).map(m => ({ v:m.value, l:m.label })) });

  cards.push({ beat:"Invitation", type:"cta", skin:"rc-cream", eyebrow:"One chapter of many",
    h: stories.length + " stories",
    sub: ents.length ? "Carried by " + ents.slice(0,2).map(e => e.name).join(" and ") + "." : "",
    kws: kws.map(k => k.k) });

  return cards;
}

/* ---------- render one card ---------- */
function card(c){
  const n = el("div", "recap-card " + c.skin + (c.img ? " has-img" : ""));
  if (c.img && c.type === "image"){
    const im = el("div","recap-img"); im.style.backgroundImage = `url("${c.img.replace(/"/g,"%22")}")`;
    n.appendChild(im); n.appendChild(el("div","recap-scrim"));
  }
  if (c.type === "split"){
    const sp = el("div","recap-split");
    const im = el("div","half-img");
    if (c.img) im.style.backgroundImage = `url("${c.img.replace(/"/g,"%22")}")`;
    sp.appendChild(im);
    sp.appendChild(body(c));
    n.appendChild(sp);
    return n;
  }
  n.appendChild(body(c));
  return n;
}

function body(c){
  const p = el("div","recap-pad");
  p.appendChild(el("div","recap-eyebrow", c.eyebrow || ""));
  const mid = el("div");

  if (c.type === "stat"){
    mid.appendChild(el("div","recap-stat", c.stat));
    mid.appendChild(el("div","recap-lbl", c.lbl));
  } else if (c.type === "grid"){
    const g = el("div","recap-grid");
    c.grid.forEach(x => { const d = el("div","g");
      d.appendChild(el("div","v", x.v)); d.appendChild(el("div","l", x.l)); g.appendChild(d); });
    mid.appendChild(g);
  } else if (c.type === "quote"){
    const bq = el("blockquote","recap-quote");
    bq.appendChild(el("span","qm","\u201C"));
    const rules = el("span","qrule");
    rules.appendChild(el("i")); rules.appendChild(el("i")); rules.appendChild(el("i"));
    bq.appendChild(rules);
    mid.appendChild(bq);
    const t = el("div","recap-todo");
    t.appendChild(el("b", null, "Editorial — to be written"));
    t.appendChild(document.createTextNode(c.todo));
    mid.appendChild(t);
  } else {
    const h = el("h3","recap-h");
    String(c.h).split("\n").forEach((line, i) => {
      if (i) h.appendChild(document.createElement("br"));
      h.appendChild(document.createTextNode(line));
    });
    mid.appendChild(h);
    if (c.sub) mid.appendChild(el("p","recap-sub", c.sub));
    if (c.kws && c.kws.length){
      const k = el("p","recap-sub", c.kws.join(" · ")); k.style.opacity = ".6"; mid.appendChild(k);
    }
  }
  p.appendChild(mid);
  return p;
}

/* ---------- mount ---------- */
function mount(root, name, stories, kicker, opts){
  opts = opts || {};
  const cards = deck(name, stories, kicker);
  root.className = "recap";
  root.innerHTML = "";
  root.tabIndex = 0;
  root.setAttribute("role","group");
  root.setAttribute("aria-label", "Recap of " + name + ", " + cards.length + " cards");

  const bar = el("div","recap-bar");
  const segs = cards.map((_, i) => {
    const b = el("button","recap-seg"); b.type = "button";
    b.setAttribute("aria-label","Go to card " + (i+1));
    b.appendChild(el("i")); bar.appendChild(b); return b;
  });
  root.appendChild(bar);

  const nodes = cards.map(c => { const n = card(c); root.appendChild(n); return n; });

  const count = el("div","recap-count"); root.appendChild(count);
  const ctrl = el("div","recap-ctrl");
  const pauseBtn = el("button", null, "‖"); pauseBtn.type = "button"; pauseBtn.setAttribute("aria-label","Pause");
  const nextBtn  = el("button", null, "›"); nextBtn.type = "button";  nextBtn.setAttribute("aria-label","Next card");
  ctrl.appendChild(pauseBtn); ctrl.appendChild(nextBtn); root.appendChild(ctrl);

  const ac = new AbortController(), sig = { signal: ac.signal };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0, timer = null, paused = reduce, dead = false;

  function show(k){
    i = (k + cards.length) % cards.length;
    nodes.forEach((n, j) => n.classList.toggle("on", j === i));
    segs.forEach((s, j) => { s.className = "recap-seg" + (j < i ? " done" : j === i ? " live" : "");
      const fill = s.querySelector("i"); fill.style.animation = "none"; void fill.offsetWidth; fill.style.animation = ""; });
    root.style.setProperty("--dur", DUR + "ms");
    root.classList.toggle("light-ui", cards[i].skin === "rc-cream" || cards[i].skin === "rc-olive");
    count.textContent = (i + 1) + " / " + cards.length;
    if (opts.onChange) opts.onChange(i, cards);
    schedule();
  }
  function schedule(){ clearTimeout(timer); if (!paused && !dead) timer = setTimeout(() => show(i + 1), DUR); }
  function setPaused(v){ paused = v; root.classList.toggle("paused", v);
    pauseBtn.textContent = v ? "▶" : "‖";
    pauseBtn.setAttribute("aria-label", v ? "Play" : "Pause");
    if (v) clearTimeout(timer); else schedule(); }

  pauseBtn.onclick = () => setPaused(!paused);
  nextBtn.onclick  = () => { show(i + 1); };
  segs.forEach((s, j) => s.onclick = () => show(j));
  root.addEventListener("mouseenter", () => { clearTimeout(timer); root.classList.add("paused"); }, sig);
  root.addEventListener("mouseleave", () => { if (!paused){ root.classList.remove("paused"); show(i); } }, sig);
  root.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") show(i + 1);
    if (e.key === "ArrowLeft")  show(i - 1);
    if (e.key === " "){ e.preventDefault(); setPaused(!paused); }
  }, sig);

  show(0);
  if (reduce) setPaused(true);
  return { cards, go: show, destroy(){ dead = true; clearTimeout(timer); ac.abort(); } };
}

return { mount };
})();
