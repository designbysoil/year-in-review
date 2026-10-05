/* QF Impact Index 2026 — prototype logic
   One story set. Four lenses. Two "maps" (geographic + entity grid), one explorer, one table. */

(function () {
"use strict";

const STORIES = (window.YIR && window.YIR.stories) || [];

/* ---------------- configuration ---------------- */

const THEMES = [
  { key: "ai",             label: "Artificial Intelligence", color: "#2a78d6" },
  { key: "education",      label: "Progressive Education",   color: "#c2306b" },
  { key: "social",         label: "Social Progress",         color: "#eb6834" },
  { key: "health",         label: "Precision Health",        color: "#4a3aa7" },
  { key: "sustainability", label: "Sustainability",          color: "#1f7a3d" }
];
const THEME_BY = Object.fromEntries(THEMES.map(t => [t.key, t]));

/* Provisional — QNV 2030 pillars. The IA draft leaves the real list open. */
const PRIORITIES = [
  { key: "human",        label: "Human Development" },
  { key: "social",       label: "Social Development" },
  { key: "economic",     label: "Economic Development" },
  { key: "environment",  label: "Environmental Development" }
];
const THEME_TO_PRIORITY = {
  education:      ["human"],
  health:         ["human", "social"],
  social:         ["social"],
  ai:             ["economic"],
  sustainability: ["environment"]
};

const SEQ = ["#E4EBE6","#C3D8CC","#9CBFAD","#71A38C","#48866C","#2A6650","#11362A"];
const DIV = ["#12564A","#3C7A6C","#8FB2A7","#E3DCD1","#D8A98C","#BC7048","#93441F"];

/* Placeholder for the editorial Foundation<->Frontier field. */
const FRONTIER_WORDS = ["ai","artificial intelligence","quantum","genomics","research","innovation",
  "startups","precision medicine","biotech","data","robotics","space","technology","machine learning"];
const FOUNDATION_WORDS = ["schools","scholarships","community","heritage","arabic language","sport",
  "graduation","volunteering","family","wellbeing","culture","language","students","teaching","access"];

/* The extraction found the same entity under several names. Reconciling them here is a stand-in
   for the entity register the IA draft asks who owns — and a small demonstration of why it matters. */
const ENTITY_CANON = {
  "Al-Mujadilah Center & Mosque for Women": "Al-Mujadilah Center and Mosque for Women",
  "Earthna Center for a Sustainable Future": "Earthna",
  "Akhlaquna initiative": "Akhlaquna",
  "Rasekh initiative": "Rasekh",
  "Minaretein Center": "Minaretein",
  "Ability Friendly": "Ability Friendly Program",
  "QSTP": "Qatar Science & Technology Park",
  "Hamad Bin Khalifa University Press": "Hamad Bin Khalifa University",
  "Juthoor \u2013 Early Education Center": "Juthoor Early Education Center"
};

const COUNTRY_ALIAS = {
  "United States": "United States of America",
  "USA": "United States of America",
  "UK": "United Kingdom",
  "Great Britain": "United Kingdom",
  "Republic of Korea": "South Korea",
  "Korea": "South Korea",
  "Russia": "Russian Federation",
  "UAE": "United Arab Emirates",
  "Czechia": "Czech Republic"
};

/* ---------------- derive ---------------- */

function axisScore(s) {
  const bag = (s.keywords || []).concat([s.theme]).map(x => String(x).toLowerCase());
  let n = 0;
  bag.forEach(k => {
    if (FRONTIER_WORDS.some(w => k.includes(w))) n += 1;
    if (FOUNDATION_WORDS.some(w => k.includes(w))) n -= 1;
  });
  if (s.theme === "ai") n += 1.5;
  if (s.theme === "health") n += 0.5;
  if (s.theme === "education") n -= 0.5;
  if (s.theme === "social") n -= 1;
  return Math.max(-1, Math.min(1, n / 3));
}

STORIES.forEach((s, i) => {
  s.id = s.id || (s.month || "x").toLowerCase() + "-" + (s.chapter || i);
  s.keywords = s.keywords || [];
  s.entities = s.entities || [];
  s.partners = s.partners || [];
  s.countries = [...new Set((s.countries || []).map(c => COUNTRY_ALIAS[c] || c))];
  s.entities  = [...new Set(s.entities.map(e => ENTITY_CANON[e] || e))];
  s.metrics = s.metrics || [];
  s.axisRaw = axisScore(s);
  s.priorities = (THEME_TO_PRIORITY[s.theme] || []).slice();
});

/* The raw heuristic clusters near zero, which wastes the diverging ramp. Spread it by rank so
   the mechanic is legible. In production this is one editorial field and needs no rescaling. */
(function spreadAxis() {
  const order = STORIES.slice().sort((a, b) => a.axisRaw - b.axisRaw);
  const n = order.length || 1;
  order.forEach((s, i) => { s.axis = n === 1 ? 0 : (i / (n - 1)) * 2 - 1; });
})();

const ALL = {
  countries: tally("countries"),
  entities:  tally("entities"),
  partners:  tally("partners"),
  keywords:  tally("keywords")
};

function tally(field) {
  const m = new Map();
  STORIES.forEach(s => (s[field] || []).forEach(v => m.set(v, (m.get(v) || 0) + 1)));
  return m;
}

function storiesWhere(field, value) {
  return STORIES.filter(s => (s[field] || []).includes(value));
}

/* ---------------- small helpers ---------------- */

const $ = (sel, root) => (root || document).querySelector(sel);
const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
const pct = v => (v * 100).toFixed(1) + "%";

function seqColor(t) {                       // t in 0..1
  if (!isFinite(t)) return SEQ[0];
  const i = Math.min(SEQ.length - 1, Math.max(0, Math.round(t * (SEQ.length - 1))));
  return SEQ[i];
}
function divColor(v) {                       // v in -1..1
  const i = Math.round((v + 1) / 2 * (DIV.length - 1));
  return DIV[Math.min(DIV.length - 1, Math.max(0, i))];
}
function themeRamp(hex, t) {
  return d3.interpolateLab("#EDE8E0", hex)(0.18 + 0.82 * (isFinite(t) ? t : 0));
}
function readable(bg) {
  const c = d3.color(bg); if (!c) return "#11362A";
  const L = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  return L > 150 ? "#11362A" : "#F0EDE6";
}

/* frequent vs distinctive — the Economic Index's best cheap move */
function keywordProfile(subset) {
  const local = new Map();
  subset.forEach(s => s.keywords.forEach(k => local.set(k, (local.get(k) || 0) + 1)));
  const n = subset.length || 1;
  const N = STORIES.length || 1;
  const rows = [...local.entries()].map(([k, c]) => {
    const share = c / n;
    const global = (ALL.keywords.get(k) || 1) / N;
    return { k, c, share, lift: share / global };
  });
  return {
    frequent:    rows.slice().sort((a, b) => b.share - a.share || b.c - a.c).slice(0, 8),
    distinctive: rows.slice().sort((a, b) => b.lift - a.lift || b.c - a.c).slice(0, 8)
  };
}

/* ---------------- tooltip ---------------- */

const tip = $("#tip");
function showTip(e, title, value) {
  tip.innerHTML = "";
  tip.appendChild(el("div", "tt", title));
  if (value) tip.appendChild(el("div", "tv", value));
  tip.classList.add("on");
  const pad = 14;
  let x = e.clientX + pad, y = e.clientY + pad;
  const r = tip.getBoundingClientRect();
  if (x + r.width > innerWidth - 8) x = e.clientX - r.width - pad;
  if (y + r.height > innerHeight - 8) y = e.clientY - r.height - pad;
  tip.style.left = x + "px"; tip.style.top = y + "px";
}
const hideTip = () => tip.classList.remove("on");

/* ---------------- hero ---------------- */

(function hero() {
  const track = $("#marquee");
  for (let i = 0; i < 8; i++) {
    track.appendChild(el("span", null, "2026 Impact Index"));
    track.appendChild(el("span", null, "•"));
  }
  const tl = [
    [STORIES.length, "stories"],
    [ALL.entities.size, "QF entities"],
    [ALL.partners.size, "partners"],
    [ALL.countries.size, "countries"]
  ];
  const box = $("#toplines");
  tl.forEach(([n, l]) => {
    const d = el("div", "topline");
    d.appendChild(el("div", "n", String(n)));
    d.appendChild(el("div", "l", l));
    box.appendChild(d);
  });
})();

/* ---------------- lens engine ---------------- */
/* Two sections share one grammar: pick a lens, everything recolours. */

function makeLensSection(cfg) {
  const state = { lens: "activity", sub: null, selected: null, mode: "frequent" };

  const LENSES = [
    { key: "activity", label: "Activity",
      note: "How much of the year's activity each " + cfg.one + " accounts for. One hue, light to dark." },
    { key: "axis", label: "Foundation ↔ Frontier",
      note: "The recurring axis. Cool means capacity built; warm means the edge pushed. A diverging scale, neutral in the middle." },
    { key: "theme", label: "Theme",
      note: "One theme at a time, in its own colour — so the map answers “where did this land” rather than showing five colours at once." },
    { key: "priority", label: "National Priority",
      note: "Provisional QNV 2030 pillars. The real list is the first open decision in the IA draft." }
  ];

  const lensBox = $(cfg.lensesSel), subBox = $(cfg.subchipsSel), noteEl = $(cfg.noteSel);

  LENSES.forEach(L => {
    const b = el("button", "lens", L.label);
    b.type = "button";
    b.setAttribute("aria-pressed", String(L.key === state.lens));
    b.onclick = () => {
      state.lens = L.key;
      state.sub = L.key === "theme" ? THEMES[0].key : (L.key === "priority" ? PRIORITIES[0].key : null);
      [...lensBox.children].forEach(c => c.setAttribute("aria-pressed", String(c === b)));
      noteEl.textContent = L.note;
      renderSub(); render();
    };
    lensBox.appendChild(b);
  });
  noteEl.textContent = LENSES[0].note;

  function renderSub() {
    subBox.innerHTML = "";
    const list = state.lens === "theme" ? THEMES
               : state.lens === "priority" ? PRIORITIES : null;
    subBox.hidden = !list;
    if (!list) return;
    list.forEach(item => {
      const b = el("button", "subchip");
      b.type = "button";
      if (item.color) { const d = el("span", "dot"); d.style.background = item.color; b.appendChild(d); }
      b.appendChild(el("span", null, item.label));
      b.setAttribute("aria-pressed", String(item.key === state.sub));
      b.onclick = () => { state.sub = item.key; renderSub(); render(); };
      subBox.appendChild(b);
    });
  }

  /* value + colour for one node, under the active lens */
  function measure(name) {
    const subset = cfg.subsetFor(name);
    if (state.lens === "activity") return { v: subset.length, label: subset.length + "" };
    if (state.lens === "axis") {
      if (!subset.length) return { v: null, label: "—" };
      const m = d3.mean(subset, s => s.axis);
      return { v: m, label: (m > 0 ? "+" : "") + m.toFixed(2) };
    }
    if (state.lens === "theme") {
      const n = subset.filter(s => s.theme === state.sub).length;
      return { v: n, label: n + "" };
    }
    const n = subset.filter(s => s.priorities.includes(state.sub)).length;
    return { v: n, label: n + "" };
  }

  function colorFor(v, maxV) {
    if (v == null) return "#DCD7CE";
    if (state.lens === "axis") return divColor(v);
    if (v === 0) return "#E8E3DA";
    const t = maxV ? Math.min(1, v / maxV) : 0;
    if (state.lens === "theme") return themeRamp(THEME_BY[state.sub].color, t);
    return seqColor(t);
  }

  function unitLabel() {
    return state.lens === "activity" ? "stories"
         : state.lens === "axis" ? "mean score"
         : state.lens === "theme" ? THEME_BY[state.sub].label
         : PRIORITIES.find(p => p.key === state.sub).label;
  }

  function render() {
    const names = cfg.names();
    const rows = names.map(n => ({ name: n, ...measure(n) })).filter(r => r.v != null);
    /* Qatar is in almost every story. Left alone it compresses every other country into the
       palest step. Scale to the runner-up instead and let the leader clamp to the top. */
    const vals = rows.map(r => r.v).sort((a, b) => b - a);
    let maxV = vals[0] || 1;
    if (state.lens !== "axis" && vals.length > 1 && vals[0] > 2 * vals[1]) maxV = vals[1] || 1;
    rows.forEach(r => (r.color = colorFor(r.v, maxV)));
    const byName = new Map(rows.map(r => [r.name, r]));

    if (!state.selected || !byName.has(state.selected)) {
      const top = rows.slice().sort((a, b) => (b.v) - (a.v))[0];
      state.selected = top ? top.name : null;
    }

    $(cfg.unitSel).textContent = unitLabel();
    cfg.draw(rows, byName, state, select);
    drawRanks(rows);
    drawDrill();
    $(cfg.claimSel).innerHTML = cfg.claim(rows, state);
    $(cfg.methodSel).textContent = cfg.method;
  }

  function select(name) { state.selected = name; render(); }

  function drawRanks(rows) {
    const box = $(cfg.ranksSel);
    box.innerHTML = "";
    const sorted = rows.slice().sort((a, b) => b.v - a.v).slice(0, 10);
    const max = d3.max(sorted, r => Math.abs(r.v)) || 1;
    sorted.forEach((r, i) => {
      const li = el("li");
      if (r.name === state.selected) li.className = "sel";
      li.appendChild(el("span", "i", String(i + 1)));
      li.appendChild(el("span", "nm", r.name));
      li.appendChild(el("span", "v", r.label));
      const bar = el("span", "bar");
      bar.style.width = (Math.abs(r.v) / max * 100) + "%";
      bar.style.background = r.color;
      bar.style.opacity = "0.85";
      li.appendChild(bar);
      li.onclick = () => select(r.name);
      box.appendChild(li);
    });
    if (!sorted.length) box.appendChild(el("li", null, "No data under this lens."));
  }

  function drawDrill() {
    const box = $(cfg.drillSel);
    box.innerHTML = "";
    if (!state.selected) return;
    const name = state.selected;
    const subset = cfg.subsetFor(name);
    const m = measure(name);
    const all = cfg.names().map(n => ({ n, v: measure(n).v })).filter(r => r.v != null).sort((a, b) => b.v - a.v);
    const rank = all.findIndex(r => r.n === name) + 1;

    const top = el("div", "drill-top");
    const left = el("div");
    left.appendChild(el("div", "drill-name", name));
    left.appendChild(el("div", "drill-rank", "Rank " + rank + " of " + all.length + " · " + cfg.noun));
    const right = el("div", "drill-metric");
    right.appendChild(el("div", "big", m.label));
    right.appendChild(el("div", "exp", unitLabel() + " · " + pct(subset.length / STORIES.length) + " of the year"));
    top.appendChild(left); top.appendChild(right);
    box.appendChild(top);

    const seg = el("div", "seg");
    [["frequent", "Most frequent"], ["distinctive", "Most distinctive"]].forEach(([k, l]) => {
      const b = el("button", null, l); b.type = "button";
      b.setAttribute("aria-pressed", String(state.mode === k));
      b.onclick = () => { state.mode = k; drawDrill(); };
      seg.appendChild(b);
    });
    box.appendChild(seg);

    const prof = keywordProfile(subset);
    const rows = prof[state.mode];
    const ul = el("ul", "kw");
    rows.forEach(r => {
      const li = el("li");
      li.appendChild(el("span", null, r.k));
      li.appendChild(el("span", "m", state.mode === "frequent" ? pct(r.share) : "×" + r.lift.toFixed(1)));
      ul.appendChild(li);
    });
    if (!rows.length) ul.appendChild(el("li", null, "No keywords tagged."));
    box.appendChild(ul);
    box.appendChild(el("p", "method",
      state.mode === "frequent"
        ? "Share of this " + cfg.one + "'s stories carrying each keyword."
        : "How much more often a keyword appears here than across the whole year. This is where differentiation lives — what only happens here."));

    const th = el("div", "thumbs");
    subset.slice(0, 8).forEach(s => {
      const a = el("a", "thumb");
      a.href = "../months/" + monthFile(s.month) + "#chapter-" + s.chapter;
      a.target = "_blank"; a.rel = "noopener";
      const img = el("div", "img");
      if (s.hero) img.style.backgroundImage = 'url("' + s.hero.replace(/"/g, "%22") + '")';
      else img.style.background = "linear-gradient(140deg," + THEME_BY[s.theme].color + "33," + THEME_BY[s.theme].color + "cc)";
      const cap = el("div", "cap");
      cap.appendChild(el("span", "mo", s.month));
      cap.appendChild(document.createTextNode(s.title));
      a.appendChild(img); a.appendChild(cap);
      th.appendChild(a);
    });
    box.appendChild(th);
  }

  renderSub();
  return { render, select, state };
}

function monthFile(m) {
  const k = String(m || "").toLowerCase();
  if (k === "july" || k === "august" || k === "july & august") return "july-august-option-a-modal.html";
  return k + "-option-a-modal.html";
}

/* ---------------- 01 · world map ---------------- */

const worldSection = makeLensSection({
  noun: "countries", one: "country",
  lensesSel: "#world-lenses", subchipsSel: "#world-subchips", noteSel: "#world-note",
  ranksSel: "#world-ranks", drillSel: "#world-drill", unitSel: "#world-unit",
  claimSel: "#world-claim", methodSel: "#world-method",
  method: "A country is counted when it is named in a story — a partner, a host, a collaboration. It measures reach, not spend or headcount. Qatar appears in most stories and is shown, not suppressed; the interesting reading is everything beside it.",
  names: () => [...ALL.countries.keys()],
  subsetFor: n => storiesWhere("countries", n),
  claim: (rows) => {
    const nonQa = rows.filter(r => r.name !== "Qatar").sort((a, b) => b.v - a.v);
    const lead = nonQa.slice(0, 3).map(r => r.name).join(", ");
    return "The year reached <strong>" + ALL.countries.size + " countries</strong>. Beyond Qatar, the work concentrated in " + (lead || "—") + ". <em>Switch the lens to see what kind of work travelled.</em>";
  },
  draw: drawWorld
});

let WORLD_FEATURES = null;
let pendingWorldDraw = null;

function drawWorld(rows, byName, state, select) {
  if (!WORLD_FEATURES) { pendingWorldDraw = [rows, byName, state, select]; return; }
  const svg = d3.select("#world-map svg");
  svg.selectAll("*").remove();

  const projection = d3.geoNaturalEarth1().fitSize([960, 440], { type: "FeatureCollection", features: WORLD_FEATURES });
  const path = d3.geoPath(projection);

  svg.append("g").selectAll("path")
    .data(WORLD_FEATURES)
    .join("path")
      .attr("d", path)
      .attr("class", d => "geo" + (byName.has(d.properties.name) ? " has-data" : "") + (d.properties.name === state.selected ? " sel" : ""))
      .attr("fill", d => { const r = byName.get(d.properties.name); return r ? r.color : "#DCD7CE"; })
      .on("mousemove", (e, d) => {
        const r = byName.get(d.properties.name);
        showTip(e, d.properties.name, r ? r.label + " · " + $("#world-unit").textContent : "no stories");
      })
      .on("mouseleave", hideTip)
      .on("click", (e, d) => { if (byName.has(d.properties.name)) { hideTip(); select(d.properties.name); } });
}

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
  .then(topo => {
    WORLD_FEATURES = topojson.feature(topo, topo.objects.countries).features
      .filter(f => f.properties.name !== "Antarctica");
    if (pendingWorldDraw) drawWorld.apply(null, pendingWorldDraw);
  })
  .catch(() => {
    $("#world-map").innerHTML =
      '<p style="padding:40px;color:#8C9A91;font-size:13px">World map could not load (offline, or opened straight from disk). ' +
      'Run <code>npx serve .</code> from the project root and open <code>/2026/impact-index.html</code>. ' +
      'The ranked list and drill panel beside it work regardless.</p>';
  });

/* ---------------- 02 · inside QF (entity tile grid) ---------------- */

const insideSection = makeLensSection({
  noun: "entities", one: "entity",
  lensesSel: "#inside-lenses", subchipsSel: "#inside-subchips", noteSel: "#inside-note",
  ranksSel: "#inside-ranks", drillSel: "#inside-drill", unitSel: "#inside-unit",
  claimSel: "#inside-claim", methodSel: "#inside-method",
  method: "Tiles are bands, not a league table — deliberately. Ranking QF entities against each other by story count would measure editorial coverage, not contribution, and would read as a scoreboard it has no right to be.",
  names: () => [...ALL.entities.keys()],
  subsetFor: n => storiesWhere("entities", n),
  claim: (rows) => {
    return "<strong>" + ALL.entities.size + " entities</strong> appear in the year's stories. This is the ecosystem explainer the brief keeps asking for — not an org chart, a record of who actually did things. <em>Click a tile.</em>";
  },
  draw: drawEntities
});

function drawEntities(rows, byName, state, select) {
  const box = $("#inside-grid");
  box.innerHTML = "";
  const grid = el("div", "tiles");
  rows.slice().sort((a, b) => b.v - a.v).forEach(r => {
    const t = el("div", "tile" + (r.name === state.selected ? " sel" : ""));
    t.style.background = r.color;
    t.style.color = readable(r.color);
    t.appendChild(el("div", "tn", r.name));
    t.appendChild(el("div", "tv", r.label));
    t.onmousemove = e => showTip(e, r.name, r.label + " · " + $("#inside-unit").textContent);
    t.onmouseleave = hideTip;
    t.onclick = () => { hideTip(); select(r.name); };
    grid.appendChild(t);
  });
  box.appendChild(grid);
}

/* ---------------- 03 · story explorer ---------------- */

(function storyExplorer() {
  const st = { theme: "all", sort: "axis" };

  const ramp = $("#axis-ramp");
  DIV.forEach(c => { const i = el("i"); i.style.background = c; ramp.appendChild(i); });

  const themeBox = $("#story-themes");
  [{ key: "all", label: "All themes" }].concat(THEMES).forEach(t => {
    const b = el("button", "subchip"); b.type = "button";
    if (t.color) { const d = el("span", "dot"); d.style.background = t.color; b.appendChild(d); }
    b.appendChild(el("span", null, t.label));
    b.setAttribute("aria-pressed", String(t.key === st.theme));
    b.onclick = () => { st.theme = t.key; sync(themeBox, t.key); draw(); };
    themeBox.appendChild(b);
  });

  const sortBox = $("#story-sort");
  [["axis", "Foundation → Frontier"], ["month", "Month"], ["theme", "Theme"]].forEach(([k, l]) => {
    const b = el("button", "subchip"); b.type = "button";
    b.appendChild(el("span", null, l));
    b.setAttribute("aria-pressed", String(k === st.sort));
    b.onclick = () => { st.sort = k; sync(sortBox, k, l); draw(); };
    sortBox.appendChild(b);
  });

  function sync(box, key, lbl) {
    [...box.children].forEach(c => c.setAttribute("aria-pressed",
      String(c.textContent.trim() === (lbl || "") || c.dataset.k === key ||
             c.textContent.trim() === labelOf(key))));
  }
  function labelOf(k) {
    const t = THEMES.find(x => x.key === k); if (t) return t.label;
    if (k === "all") return "All themes";
    return ({ axis: "Foundation → Frontier", month: "Month", theme: "Theme" })[k] || "";
  }

  const MONTHS = ["January","February","March","April","May","June","July & August","July","August","September","October","November","December"];

  function draw() {
    const box = $("#story-tiles");
    box.innerHTML = "";
    let list = STORIES.filter(s => st.theme === "all" || s.theme === st.theme);
    if (st.sort === "axis") list.sort((a, b) => a.axis - b.axis);
    if (st.sort === "month") list.sort((a, b) => MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month) || a.chapter - b.chapter);
    if (st.sort === "theme") list.sort((a, b) => THEMES.findIndex(t => t.key === a.theme) - THEMES.findIndex(t => t.key === b.theme));

    list.forEach(s => {
      const bg = divColor(s.axis);
      const t = el("div", "tile");
      t.style.background = bg;
      t.style.color = readable(bg);
      const n = el("div", "tn", s.title.length > 46 ? s.title.slice(0, 44) + "…" : s.title);
      t.appendChild(n);
      t.appendChild(el("div", "tv", s.month));
      t.onmousemove = e => showTip(e, s.title,
        THEME_BY[s.theme].label + " · " + (s.axis > 0 ? "frontier +" : "foundation ") + s.axis.toFixed(2));
      t.onmouseleave = hideTip;
      t.onclick = () => { hideTip(); window.open("../months/" + monthFile(s.month) + "#chapter-" + s.chapter, "_blank", "noopener"); };
      box.appendChild(t);
    });
  }
  draw();
})();

/* ---------------- 04 · explore the data ---------------- */

(function explorer() {
  const st = { dim: "keywords", measure: "stories", theme: "all", sortKey: "v", desc: true };

  const DIMS = [
    ["keywords", "Keyword"], ["entities", "QF entity"], ["partners", "Partner"],
    ["countries", "Country"], ["theme", "Theme"], ["priority", "National Priority"]
  ];
  const MEASURES = [["stories", "Stories"], ["share", "Share of year"], ["axis", "Foundation ↔ Frontier"]];

  build("#ex-dim", DIMS, "dim");
  build("#ex-measure", MEASURES, "measure");
  build("#ex-theme", [["all", "All"]].concat(THEMES.map(t => [t.key, t.label])), "theme");

  function build(sel, opts, key) {
    const box = $(sel);
    opts.forEach(([k, l]) => {
      const b = el("button", "subchip"); b.type = "button"; b.dataset.k = k;
      const th = THEME_BY[k];
      if (key === "theme" && th) { const d = el("span", "dot"); d.style.background = th.color; b.appendChild(d); }
      b.appendChild(el("span", null, l));
      b.setAttribute("aria-pressed", String(k === st[key]));
      b.onclick = () => {
        st[key] = k;
        [...box.children].forEach(c => c.setAttribute("aria-pressed", String(c.dataset.k === k)));
        draw();
      };
      box.appendChild(b);
    });
  }

  function rowsFor() {
    const pool = STORIES.filter(s => st.theme === "all" || s.theme === st.theme);
    let groups = new Map();
    const add = (k, s) => { if (!groups.has(k)) groups.set(k, []); groups.get(k).push(s); };

    if (st.dim === "theme") pool.forEach(s => add(THEME_BY[s.theme].label, s));
    else if (st.dim === "priority") pool.forEach(s => s.priorities.forEach(p => add(PRIORITIES.find(x => x.key === p).label, s)));
    else pool.forEach(s => (s[st.dim] || []).forEach(v => add(v, s)));

    return [...groups.entries()].map(([name, ss]) => ({
      name,
      stories: ss.length,
      share: ss.length / (pool.length || 1),
      axis: d3.mean(ss, s => s.axis),
      sample: ss.slice(0, 3).map(s => s.title)
    }));
  }

  function draw() {
    const table = $("#ex-table");
    table.innerHTML = "";
    const rows = rowsFor();
    const mLabel = MEASURES.find(m => m[0] === st.measure)[1];
    const dLabel = DIMS.find(d => d[0] === st.dim)[1];

    rows.sort((a, b) => {
      const va = st.sortKey === "name" ? a.name : a[st.measure];
      const vb = st.sortKey === "name" ? b.name : b[st.measure];
      const c = typeof va === "string" ? va.localeCompare(vb) : (va - vb);
      return st.desc ? -c : c;
    });

    const thead = el("thead"), tr = el("tr");
    const cols = st.measure === "stories"
      ? [[dLabel, "name"], ["Stories", "v"], ["Example", null]]
      : [[dLabel, "name"], [mLabel, "v"], ["Stories", "stories"], ["Example", null]];
    cols.forEach(([l, k]) => {
      const th = el("th", k === "name" ? "" : "num", l);
      if (l === "Example") th.className = "";
      if (k) th.onclick = () => { st.sortKey = k === "v" ? "v" : k; st.desc = !st.desc; draw(); };
      tr.appendChild(th);
    });
    thead.appendChild(tr); table.appendChild(thead);

    const tb = el("tbody");
    rows.slice(0, 60).forEach(r => {
      const t = el("tr");
      t.appendChild(el("td", null, r.name));
      const v = st.measure === "stories" ? String(r.stories)
              : st.measure === "share" ? pct(r.share)
              : (r.axis > 0 ? "+" : "") + r.axis.toFixed(2);
      t.appendChild(el("td", "num", v));
      if (st.measure !== "stories") t.appendChild(el("td", "num", String(r.stories)));
      t.appendChild(el("td", null, r.sample[0] || "—"));
      tb.appendChild(t);
    });
    table.appendChild(tb);
    if (!rows.length) table.appendChild(el("caption", null, "Nothing tagged under this combination."));
  }

  draw();
})();

/* ---------------- scroll spy ---------------- */

(function spy() {
  const links = [...document.querySelectorAll(".secnav a[data-sec]")];
  const secs = links.map(a => document.getElementById(a.dataset.sec)).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.toggle("on", a.dataset.sec === en.target.id));
    });
  }, { rootMargin: "-70px 0px -65% 0px", threshold: 0 });
  secs.forEach(s => io.observe(s));
})();

/* ---------------- boot ---------------- */
worldSection.render();
insideSection.render();

})();
