/* Theme / Priority page.
   ?type=theme&key=ai   |   ?type=priority&key=human
   Skeleton follows the structure sketch: title + peers, four blocks,
   key-stories carousel, narration, then a filterable index. */
(function () {
"use strict";

const { S, THEMES, TH, PRIORITIES, PRI, ALL, rank, tint, pc, profile, storyHref } = window.QF;

const $  = s => document.querySelector(s);
const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
const qs = new URLSearchParams(location.search);

/* ---------- what are we looking at ---------- */

const type = qs.get("type") === "priority" ? "priority" : "theme";
const set  = type === "theme" ? THEMES : PRIORITIES;
const key  = set.some(x => x.key === qs.get("key")) ? qs.get("key") : set[0].key;
const me   = set.find(x => x.key === key);

const stories = type === "theme"
  ? S.filter(s => s.theme === key)
  : S.filter(s => s.priorities.includes(key));

const colour = type === "theme" ? TH[key].color : "#11362A";
document.title = me.label + " — QF Impact Index 2026";

/* ---------- masthead ---------- */

$("#kicker").textContent = type === "theme" ? "Theme" : "National Priority";

const h1 = $("#title"); h1.textContent = "";
if (type === "theme") { const sw = el("span","swatch"); sw.style.background = colour; h1.appendChild(sw); }
h1.appendChild(document.createTextNode(me.label));

const topEnt = rank("entities", stories).slice(0, 3);
const topKw  = profile(stories, 3).distinctive;
$("#intro").textContent =
  `${stories.length} of the year's ${S.length} stories — ${pc(stories.length / S.length)} of everything Qatar Foundation published in 2026. ` +
  (topEnt.length ? `Carried mostly by ${topEnt.slice(0,2).map(e => e.name).join(" and ")}. ` : "") +
  (topKw.length ? `Most distinctive of it: ${topKw.map(k => k.k).join(", ")}.` : "");

/* Two rows. The sketch labels the first one "Pillars:" on a theme page — that is the
   cross-link to the other dimension, not sibling navigation. Both are useful, so both are here. */
(function peers(){
  const box = $("#peers");

  const crossLabel = type === "theme" ? "Pillars:" : "Themes:";
  const cross = type === "theme"
    ? PRIORITIES.filter(p => stories.some(s => s.priorities.includes(p.key)))
        .map(p => ({ ...p, n: stories.filter(s => s.priorities.includes(p.key)).length,
                     href:`page.html?type=priority&key=${p.key}` }))
    : THEMES.filter(t => stories.some(s => s.theme === t.key))
        .map(t => ({ ...t, n: stories.filter(s => s.theme === t.key).length,
                     href:`page.html?type=theme&key=${t.key}` }));

  const r1 = el("div","peer-row");
  r1.appendChild(el("span","lbl", crossLabel));
  cross.forEach(x => {
    const a = el("a", null, x.label + " (" + x.n + ")");
    a.href = x.href; r1.appendChild(a);
  });
  if (!cross.length) r1.appendChild(el("span","lbl","none recorded"));
  box.appendChild(r1);

  const r2 = el("div","peer-row sib");
  r2.appendChild(el("span","lbl", type === "theme" ? "Other themes:" : "Other pillars:"));
  set.filter(x => x.key !== key).forEach(x => {
    const a = el("a", null, x.label);
    a.href = `page.html?type=${type}&key=${x.key}`;
    r2.appendChild(a);
  });
  box.appendChild(r2);
})();

/* ---------- the four blocks ---------- */

(function blocks(){
  const root = $("#blocks");

  /* ① What we do — assembled from the record, not written */
  const b1 = el("div","block");
  b1.appendChild(el("h2","","What we do"));
  const kw = profile(stories, 4).frequent.map(k => k.k);
  b1.appendChild(el("p", null,
    `Across ${stories.length} stories, the work concentrated on ${kw.slice(0,3).join(", ")}` +
    (kw[3] ? ` and ${kw[3]}` : "") + `. ` +
    (topEnt.length ? `${topEnt[0].name} appears in ${topEnt[0].count} of them` +
      (topEnt[1] ? `, ${topEnt[1].name} in ${topEnt[1].count}` : "") + "." : "")));
  const t = el("p","todo");
  t.appendChild(el("b", null, "Derived, not written"));
  t.appendChild(document.createTextNode("This paragraph is assembled from the tagged record. In production it is editorial copy — the record is what keeps it honest."));
  b1.appendChild(t);
  root.appendChild(b1);

  /* ② Why it matters — genuinely editorial, so it is marked as missing rather than faked */
  const b2 = el("div","block");
  b2.appendChild(el("h2","","Why it matters"));
  const t2 = el("p","todo");
  t2.appendChild(el("b", null, "Editorial — to be written"));
  t2.appendChild(document.createTextNode(
    type === "priority"
      ? "The contribution claim: what QF asserts it added to this national pillar this year. This is the sentence a government reader came for, and it is the one thing on the page that cannot be derived from the data."
      : "Why this theme earns a place among the five. One paragraph, editorial, signed off once a year."));
  b2.appendChild(t2);
  root.appendChild(b2);

  /* ③ + ④ — both straight from the record */
  const b3 = el("div","block stack");

  const who = el("div");
  who.appendChild(el("h2","","Who we did it with"));
  const partners = rank("partners", stories);
  who.appendChild(el("span","n", partners.length + " PARTNERS"));
  who.appendChild(namelist(partners.slice(0, 10), "partners"));
  b3.appendChild(who);

  const which = el("div");
  which.appendChild(el("h2","","Which part of us did it"));
  const ents = rank("entities", stories);
  which.appendChild(el("span","n", ents.length + " ENTITIES"));
  which.appendChild(namelist(ents.slice(0, 10), "entities"));
  b3.appendChild(which);

  root.appendChild(b3);

  function namelist(rows, framing){
    const ul = el("ul","namelist");
    rows.forEach(r => {
      const li = el("li"), a = el("a");
      a.href = `index.html#${framing}:${encodeURIComponent(r.name)}`;
      a.appendChild(el("span", null, r.name));
      if (r.count > 1) a.appendChild(el("span","c", String(r.count)));
      li.appendChild(a); ul.appendChild(li);
    });
    if (!rows.length) ul.appendChild(el("li","todo","None recorded."));
    return ul;
  }
})();

/* ---------- key stories carousel ---------- */

const KEY = stories.slice(0, 7);

(function carousel(){
  const rail = $("#rail");
  $("#stories-sub").textContent = `${KEY.length} of ${stories.length} — the recap, in order`;

  KEY.forEach(s => {
    const a = el("a","story"); a.href = storyHref(s); a.target = "_blank"; a.rel = "noopener";
    const im = el("div","im");
    if (s.hero) im.style.backgroundImage = `url("${s.hero.replace(/"/g,"%22")}")`;
    else im.style.background = `linear-gradient(140deg,${colour}33,${colour}cc)`;
    const bd = el("div","bd");
    bd.appendChild(el("div","mo", s.month));
    bd.appendChild(el("h3","", s.title));
    bd.appendChild(el("p","", s.summary || ""));
    const pt = el("div","pt");
    (s.keywords || []).slice(0,3).forEach(k => pt.appendChild(el("span", null, k)));
    bd.appendChild(pt);
    a.appendChild(im); a.appendChild(bd); rail.appendChild(a);
  });

  const prev = $("#prev"), next = $("#next"), counter = $("#counter");
  const step = () => { const c = rail.querySelector(".story"); return c ? c.offsetWidth + 16 : 320; };
  const index = () => Math.min(KEY.length, Math.round(rail.scrollLeft / step()) + 1);
  function sync(){
    counter.textContent = index() + " of " + KEY.length;
    prev.disabled = rail.scrollLeft < 4;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  }
  prev.onclick = () => rail.scrollBy({ left: -step() });
  next.onclick = () => rail.scrollBy({ left:  step() });
  rail.addEventListener("scroll", sync, { passive:true });
  addEventListener("resize", sync);
  sync();
})();

/* ---------- narration ---------- */
$("#audio-lbl").textContent = `Listen to ${me.label} — about ${Math.max(1, Math.round(stories.length * 0.6))} min`;
$("#play").onclick = function(){ this.textContent = "■"; this.disabled = true;
  $("#audio-lbl").textContent = "No audio recorded yet."; };

/* ---------- index ---------- */

(function index(){
  const st = { kind:"keywords", value:null, q:"" };
  const KINDS = [["keywords","Keyword"],["entities","QF entity"],["partners","Partner"]];

  const kindBox = $("#lens-kind");
  KINDS.forEach(([k,l]) => {
    const b = el("button","opt", l); b.type = "button";
    b.onclick = () => { st.kind = k; st.value = null; draw(); };
    kindBox.appendChild(b);
  });

  $("#q").oninput = e => { st.q = e.target.value; draw(); };

  function draw(){
    [...kindBox.children].forEach((b,i) => b.setAttribute("aria-pressed", String(KINDS[i][0] === st.kind)));
    $("#lens-label").textContent = KINDS.find(k => k[0] === st.kind)[1];

    const opts = rank(st.kind, stories).slice(0, 18);
    const ob = $("#lens-opts"); ob.innerHTML = "";
    const all = el("button","opt","All"); all.type = "button";
    all.setAttribute("aria-pressed", String(st.value === null));
    all.onclick = () => { st.value = null; draw(); };
    ob.appendChild(all);
    opts.forEach(o => {
      const b = el("button","opt"); b.type = "button";
      b.appendChild(el("span", null, o.name));
      b.appendChild(el("span","c"," " + o.count));
      b.setAttribute("aria-pressed", String(st.value === o.name));
      b.onclick = () => { st.value = st.value === o.name ? null : o.name; draw(); };
      ob.appendChild(b);
    });

    const q = st.q.trim().toLowerCase();
    const rows = stories.filter(s =>
      (st.value === null || (s[st.kind] || []).includes(st.value)) &&
      (!q || (s.title + " " + (s.summary||"") + " " + (s.keywords||[]).join(" ")).toLowerCase().includes(q)));

    $("#count").textContent = rows.length + (rows.length === 1 ? " story" : " stories")
      + (st.value ? ` tagged ${st.value}` : "") + (q ? ` matching “${st.q}”` : "");

    const cards = $("#cards"); cards.innerHTML = "";
    rows.forEach(s => {
      const a = el("a","story"); a.href = storyHref(s); a.target = "_blank"; a.rel = "noopener";
      const im = el("div","im");
      if (s.hero) im.style.backgroundImage = `url("${s.hero.replace(/"/g,"%22")}")`;
      else im.style.background = `linear-gradient(140deg,${colour}33,${colour}cc)`;
      const bd = el("div","bd");
      bd.appendChild(el("div","mo", s.month));
      bd.appendChild(el("h3","", s.title));
      const pt = el("div","pt");
      (s.keywords||[]).slice(0,3).forEach(k => pt.appendChild(el("span", null, k)));
      bd.appendChild(pt);
      a.appendChild(im); a.appendChild(bd); cards.appendChild(a);
    });
    if (!rows.length) cards.appendChild(el("p","todo","Nothing matches."));
  }
  draw();
})();

})();
