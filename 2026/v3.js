/* 2026 Year in Review — v3.
   Two registers: Themes read as a magazine opener, Priorities as evidence.
   The recap is a play card, not an embed. Tag fields come last. */
(function () {
"use strict";

const { S, THEMES, TH, PRIORITIES, ALL, TYPE_ORDER, rank, where, pc, mean, profile,
        partnerType, storyHref, whatWeDo } = window.QF;
const C = window.YIRC;
const MAX_CARDS = 5;

const $  = s => document.querySelector(s);
const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
const bg = u => 'url("' + String(u).replace(/"/g, "%22") + '")';
const byId = id => S.find(s => s.id === id);

function entityType(n){
  const s = n.toLowerCase();
  if (/universit|college|hec paris|carnegie|georgetown|northwestern|texas a&m|weill cornell|virginia commonwealth/.test(s)) return "Universities";
  if (/research institute|institute|qcri|qbri|qeeri|laborator/.test(s)) return "Research institutes";
  if (/academy|school|juthoor|awsaj|renad|warif|academyati|pre-university/.test(s)) return "Schools and education";
  if (/wish|wise|summit|debates?|forum|library|museum|garden|mosque|stadium|shaqab/.test(s)) return "Convenings, culture and campus";
  return "Centres, programmes and initiatives";
}
const ENTITY_ORDER = ["Universities","Schools and education","Research institutes",
  "Convenings, culture and campus","Centres, programmes and initiatives"];

/* ---------- header ---------- */
(function header(){
  const track = $("#marquee");
  /* the sequence is laid down twice so the -50% loop is seamless */
  const unit = ["2026 Year in Review", "\u2022", "90 stories", "\u2022", "Five themes", "\u2022",
                "Four national priorities", "\u2022"];
  for (let i = 0; i < 2; i++) unit.forEach(w => track.appendChild(el("span", null, w)));

  const f = $("#facts");
  [[S.length,"stories"],[ALL.entities.size,"QF entities"],[ALL.partners.size,"partners"],
   [ALL.keywords.size,"keywords"]].forEach(([n,l]) => {
    const d = el("span"); d.appendChild(el("b", null, String(n)));
    d.appendChild(document.createTextNode(" " + l)); f.appendChild(d);
  });
})();

/* ---------- recap overlay ---------- */
const ov = $("#ov"); let ovRecap = null;
function openRecap(label, stories, kicker){
  if (ovRecap) ovRecap.destroy();
  ovRecap = window.QFRecap.mount($("#ov-recap"), label, stories, kicker);
  ov.classList.add("on");
}
function closeRecap(){ ov.classList.remove("on"); if (ovRecap){ ovRecap.destroy(); ovRecap = null; } }
$("#ov-close").onclick = closeRecap;
ov.addEventListener("click", e => { if (e.target === ov) closeRecap(); });
addEventListener("keydown", e => { if (e.key === "Escape") closeRecap(); });

/* ---------- modules, built to the print component specs ---------- */
/* Square corners, cream ground, QF Regular numerals. Stacked flush; 24px inside a
   three-up row, 12px inside a two-up, per the "Typical page composition" frame. */

function modStat(value, label, opts){
  opts = opts || {};
  const d = el("div","mod" + (opts.dark ? " dark" : "") + (opts.wide ? " pad-wide" : ""));
  if (opts.img){ const im = el("div","im"); im.style.backgroundImage = bg(opts.img);
    d.appendChild(im); d.appendChild(el("div","sc")); d.classList.add("on-img"); d.classList.remove("dark"); }
  const inn = el("div","in");
  if (opts.kick) inn.appendChild(el("div","kick", opts.kick));
  inn.appendChild(el("div", opts.wide ? "n-wide" : "n-def", value));
  inn.appendChild(el("div", opts.wide ? "t-wide" : "t-def", label));
  d.appendChild(inn); return d;
}

function modPlay(label, stories, kicker, line, prefer){
  const b = el("button","mod play on-img"); b.type = "button";
  const hero = prefer || stories.find(s => s.hero);
  if (hero){ const im = el("div","im"); im.style.backgroundImage = bg(hero.hero); b.appendChild(im); }
  b.appendChild(el("div","sc"));
  const inn = el("div","in");
  const q = el("div","q"); q.style.fontFamily = "var(--qf-serif)"; q.style.fontWeight = "300";
  q.style.fontSize = "clamp(15px,1.5vw,20px)"; q.style.lineHeight = "1.25";
  q.textContent = line || ("A year in " + label + ".");
  inn.appendChild(q);
  const w = el("span","watch"); w.appendChild(el("i", null, "\u25B6"));
  w.appendChild(document.createTextNode("Watch the recap"));
  inn.appendChild(w);
  b.appendChild(inn);
  b.onclick = () => openRecap(label, stories, kicker);
  return b;
}

/* the cream card beside the photograph */
function modQuote(text, attr){
  const d = el("div","mod pad-wide quote");
  const inn = el("div","in"); inn.style.height = "100%";
  inn.appendChild(el("p","q", text));
  inn.appendChild(el("div","attr", attr));
  d.appendChild(inn); return d;
}

function modPerson(person, s){
  const a = el("a","mod on-img"); a.href = storyHref(s); a.target = "_blank"; a.rel = "noopener";
  if (s.hero){ const im = el("div","im"); im.style.backgroundImage = bg(s.hero); a.appendChild(im); }
  a.appendChild(el("div","sc"));
  const inn = el("div","in");
  inn.appendChild(el("div","kick","Who was involved"));
  const w = el("div");
  w.appendChild(el("div","n-sm", person.name));
  if (person.role) w.appendChild(el("div","t-def", person.role));
  inn.appendChild(w); a.appendChild(inn); return a;
}

function modContents(stories){
  const d = el("div","mod");
  const inn = el("div","in"); inn.style.minHeight = "0";
  inn.appendChild(el("div","kick","In this theme"));
  const list = el("div","scrolly");
  stories.slice(0, 5).forEach((s, i) => {
    const a = el("a","toc"); a.href = storyHref(s); a.target = "_blank"; a.rel = "noopener";
    a.appendChild(el("span","no", String(i + 1).padStart(2,"0")));
    a.appendChild(el("span","ti", s.title));
    const m = (s.metrics || [])[0];
    a.appendChild(el("span","mt", m ? m.value + " \u00b7 " + m.label : s.month));
    list.appendChild(a);
  });
  inn.appendChild(list); d.appendChild(inn); return d;
}

function modCommitments(commitments, dark){
  const d = el("div","mod pad-wide" + (dark ? " dark" : ""));
  const inn = el("div","in"); inn.style.minHeight = "0";
  inn.appendChild(el("div","kick","What QF contributed"));
  const list = el("div","scrolly");
  commitments.forEach(x => {
    const r = el("div","commit");
    r.appendChild(el("span","tick","\u2713"));
    r.appendChild(el("span","tx", x.text));
    r.appendChild(el("span","mv", x.metric));
    list.appendChild(r);
  });
  inn.appendChild(list); d.appendChild(inn); return d;
}

function modBaseline(commitments){
  const d = el("div","mod pad-wide");
  const inn = el("div","in"); inn.style.minHeight = "0";
  inn.appendChild(el("div","kick","Measured against 2015"));
  const list = el("div","scrolly");
  commitments.slice(0,3).forEach(x => {
    const r = el("div","bl-row");
    r.appendChild(el("span","yr","2015"));
    r.appendChild(el("span","req","figure required"));
    r.appendChild(el("span","vl", x.metric));
    list.appendChild(r);
  });
  inn.appendChild(list);
  d.appendChild(el("p","bl-note","Without a 2015 figure the word \u201cIndex\u201d is unearned \u2014 these nine numbers are the standing ask."));
  d.insertBefore(inn, d.firstChild);
  return d;
}

/* ---------- facet cards ---------- */
function facetCards(box, items, storiesFor, describe, onPick){
  items.forEach(it => {
    const b = el("button","fcard"); b.type = "button"; b.dataset.k = it.key;
    if (it.color) b.style.setProperty("--accent", it.color);
    const ss = storiesFor(it.key);
    const t = el("div","ft");
    t.appendChild(el("span", null, it.label));
    t.appendChild(el("span","fn", ss.length + " stories"));
    b.appendChild(t);
    b.appendChild(el("p","fd", describe(it, ss)));
    const fx = el("div","fx");
    [["Share of the year", pc(ss.length / S.length)],
     ["QF entities", String(rank("entities", ss).length)],
     ["Partners", String(rank("partners", ss).length)]
    ].forEach(([k,v]) => { const r = el("div","fx-line");
      r.appendChild(el("span", null, k)); r.appendChild(el("b", null, v)); fx.appendChild(r); });
    b.appendChild(fx);
    b.onclick = () => onPick(it.key);
    box.appendChild(b);
  });
}

/* ---------- layout selection ----------
   The grid is chosen by what the theme actually contains, so a theme carried by
   photographs does not look like one carried by numbers. Deterministic, not random. */

function shapeOf(ss){
  return { n: ss.length,
           heroes: ss.filter(s => s.hero).length,
           metrics: ss.flatMap(s => s.metrics || []).length,
           people: ss.filter(s => (s.people || []).length).length };
}
function themeLayout(sh){
  if (sh.n <= 5)                       return "sparse";     // too little to fill a grid
  if (sh.people / sh.n >= 0.7)         return "portrait";   // the people are the story
  if (sh.metrics >= 14)                return "numbers";    // lead with the quantities
  return "photo";                                           // default: picture-led
}
function priorityLayout(sh){
  if (sh.n <= 5)        return "sparse";
  if (sh.n >= 45)       return "ledger";      // the big pillar: number, commitments, baseline
  if (sh.metrics >= 10) return "comparison";  // lead with 2015 vs now
  return "checklist";
}

function wireCarousel(rail){
  const nav = rail.previousElementSibling.querySelector(".cnav");
  const step = () => { const c = rail.firstElementChild; return c ? c.offsetWidth + 24 : 260; };
  const sync = () => {
    const btns = nav.querySelectorAll("button");
    btns[0].disabled = rail.scrollLeft < 4;
    btns[1].disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  };
  nav.querySelectorAll("button").forEach(b =>
    b.onclick = () => rail.scrollBy({ left: step() * Number(b.dataset.dir) }));
  rail.onscroll = sync;
  rail.scrollLeft = 0;
  requestAnimationFrame(sync);
}

const wrapRow = (cls, ...mods) => { const d = el("div", cls); mods.filter(Boolean).forEach(m => d.appendChild(m)); return d; };

/* ---------- 01 · THEMES ---------- */
(function themes(){
  let sel = "ai";
  const box = $("#f-themes");
  const storiesFor = k => S.filter(s => s.theme === k);

  facetCards(box, THEMES, storiesFor,
    (it, ss) => { const kw = profile(ss, 2).distinctive.map(k => k.k);
      return pc(ss.length / S.length) + " of the year" + (kw.length ? ". Distinctive for " + kw.join(" and ") : "") + "."; },
    k => { sel = k; draw(); });

  function draw(){
    const it = TH[sel], c = C.themes[sel], ss = storiesFor(sel);
    [...box.children].forEach(b => b.setAttribute("aria-pressed", String(b.dataset.k === sel)));
    $("#t-standfirst").textContent = c.standfirst;
    $("#t-claim").textContent = whatWeDo(ss);   /* the record; the cream card carries the claim */

    const sh = shapeOf(ss), lay = themeLayout(sh);
    /* a configured story must belong to this theme and carry a photograph, or we fall back */
    const cfg = byId(c.human.storyId);
    const hero = (cfg && ss.includes(cfg) && cfg.hero) ? cfg : (ss.find(s => s.hero) || ss[0]);
    const peep = ss.find(s => (s.people || []).length);
    const mets = ss.flatMap(s => s.metrics || []);

    const feature = modFeature(hero, it.label, c.headline);
    const play    = modPlay(it.label, ss, c.standfirst);
    const toc     = modContents(ss);
    const person  = peep ? modPerson(peep.people[0], peep) : null;

    /* two-up: the photograph, then the claim on cream — the report's Product opener */
    const fp = $("#t-feature"); fp.innerHTML = "";
    fp.appendChild(lay === "numbers"
      ? modStat(c.headline.value, c.headline.label, { wide:true, dark:true, kick: it.label })
      : feature);
    fp.appendChild(modQuote(c.claim, "Why it matters \u00b7 draft, not signed off"));

    /* carousel. The recap is always the first card. */
    $("#t-carousel-lbl").textContent = lay + " \u00b7 " + sh.n + " stories, " + sh.heroes
      + " with photographs, " + sh.metrics + " figures, " + sh.people + " with a named person";
    const rail = $("#t-carousel"); rail.innerHTML = "";
    const spare0 = ss.filter(s => s.hero && s.id !== hero.id);
    const cards = [modPlay(it.label, ss, c.standfirst, c.standfirst, spare0[spare0.length - 1])];

    /* photographs the feature has not already used, so the row does not repeat itself */
    const spare = spare0;
    mets.slice(0, 2).forEach((m, i) =>
      cards.push(modStat(m.value, m.label, { img: spare[i] && spare[i].hero, dark: !spare[i] })));
    if (peep) cards.push(modPerson(peep.people[0], peep));
    spare.slice(2, 6).forEach(s => cards.push(modStory(s, it.label)));

    cards.slice(0, MAX_CARDS).forEach(m => rail.appendChild(m));   /* five, recap always first */
    wireCarousel(rail);
  }
  draw();
})();

function modStory(s, label){
  const a = el("a","mod on-img"); a.href = storyHref(s); a.target = "_blank"; a.rel = "noopener";
  if (s.hero){ const im = el("div","im"); im.style.backgroundImage = bg(s.hero); a.appendChild(im); }
  a.appendChild(el("div","sc"));
  const inn = el("div","in");
  inn.appendChild(el("div","kick", s.month));
  inn.appendChild(el("div","t-def", s.title));
  const c = C.stories[s.id];
  if (c) inn.appendChild(el("div","t-def", c.whyItMatters));
  a.appendChild(inn); return a;
}

function modFeature(s, label, headline){
  const a = el("a","mod pad-wide on-img"); a.href = storyHref(s); a.target = "_blank"; a.rel = "noopener";
  if (s.hero){ const im = el("div","im"); im.style.backgroundImage = bg(s.hero); a.appendChild(im); }
  a.appendChild(el("div","sc"));
  const inn = el("div","in");
  inn.appendChild(el("div","kick", label + " \u00b7 " + s.month));
  inn.appendChild(el("div","n-wide", headline.value));
  inn.appendChild(el("div","t-wide", headline.label));
  a.appendChild(inn); return a;
}

/* ---------- 02 · PRIORITIES ---------- */
(function priorities(){
  let sel = "human";
  const box = $("#f-priorities");
  const storiesFor = k => S.filter(s => s.priorities.includes(k));
  const items = PRIORITIES.map(p => ({ ...p, color:"#11362A" }));

  facetCards(box, items, storiesFor,
    () => "Provisional \u2014 derived from theme while the real list is decided.",
    k => { sel = k; draw(); });

  function draw(){
    const it = PRIORITIES.find(p => p.key === sel), c = C.priorities[sel], ss = storiesFor(sel);
    [...box.children].forEach(b => b.setAttribute("aria-pressed", String(b.dataset.k === sel)));
    $("#p-standfirst").textContent = it.label;
    $("#p-claim").textContent = whatWeDo(ss);

    const sh = shapeOf(ss), lay = priorityLayout(sh);
    const head = modStat(c.commitments[0].metric, c.commitments[0].text,
                         { wide:true, dark:true, kick: it.label });
    const commits  = modCommitments(c.commitments);
    const baseline = modBaseline(c.commitments);
    const play     = modPlay(it.label, ss, "Provisional QNV 2030 pillar");

    const fp = $("#p-feature"); fp.innerHTML = "";
    fp.appendChild(lay === "checklist" ? commits : head);
    fp.appendChild(modQuote(c.claim, "Why it matters \u00b7 draft, provisional pillar"));

    $("#p-carousel-lbl").textContent = lay + " \u00b7 " + sh.n + " stories, "
      + c.commitments.length + " commitments, " + sh.metrics + " figures";
    const rail = $("#p-carousel"); rail.innerHTML = "";
    const cards = [modPlay(it.label, ss, "Provisional QNV 2030 pillar", c.claim.split(".")[0] + ".")];
    c.commitments.forEach((x, i) => cards.push(modStat(x.metric, x.text, { dark: i % 2 === 0 })));
    cards.push(baseline);
    if (lay !== "checklist") cards.push(commits);
    ss.filter(s => s.hero).slice(0, 3).forEach(s => cards.push(modStory(s, it.label)));

    cards.slice(0, MAX_CARDS).forEach(m => rail.appendChild(m));
    wireCarousel(rail);
  }
  draw();
})();

/* ---------- 03 & 04 · tag fields ---------- */
function summary(root, rows){
  root.innerHTML = "";
  rows.forEach(r => {
    const d = el("div","sum");
    const v = el("div","v", r.v); if (r.small) v.style.fontSize = "14px";
    d.appendChild(v);
    const k = el("div","k"); k.appendChild(document.createTextNode(r.k));
    if (r.sub) k.appendChild(el("b", null, r.sub));
    d.appendChild(k); root.appendChild(d);
  });
}

function tagSection(cfg){
  const st = { q:"", sel:null, group:null, open:false };
  const input = $(cfg.searchSel);
  input.placeholder = "Search " + cfg.total + " " + cfg.noun + "…";
  input.oninput = () => { st.q = input.value; draw(); };
  const box = $(cfg.facetsSel);
  const all = rank(cfg.field).map(r => ({ ...r, type: cfg.typeOf(r.name) }));

  [{ key:null, label:"Everything", n:cfg.total, desc:"All " + cfg.total + " " + cfg.noun + " named across the year." }]
    .concat(cfg.groups.map(g => { const rows = all.filter(r => r.type === g);
      return { key:g, label:g, n:rows.length,
        desc: rows.filter(r => r.count > 1).length + " appear more than once; " + rows.filter(r => r.count === 1).length + " appear once." }; }))
    .forEach(g => {
      const b = el("button","fcard"); b.type = "button"; b.dataset.k = g.key || "__all";
      const t = el("div","ft");
      t.appendChild(el("span", null, g.label)); t.appendChild(el("span","fn", String(g.n)));
      b.appendChild(t); b.appendChild(el("p","fd", g.desc));
      b.onclick = () => { st.group = g.key; st.open = false; draw(); };
      box.appendChild(b);
    });

  function draw(){
    const needle = st.q.trim().toLowerCase();
    let rows = all.filter(r => !needle || r.name.toLowerCase().includes(needle));
    if (st.group) rows = rows.filter(r => r.type === st.group);
    [...box.children].forEach(b => b.setAttribute("aria-pressed", String((st.group || "__all") === b.dataset.k)));

    const strong = rows.filter(r => r.count >= 2), tail = rows.filter(r => r.count < 2);
    const shown = (needle || st.open) ? rows : strong;
    const selRows = st.sel ? where(cfg.field, st.sel) : [];
    summary($(cfg.summarySel), [
      { v:String(rows.length), k:cfg.noun, sub:(needle||st.group)?"matching":"named this year" },
      { v:String(strong.length), k:"carry weight", sub:"2+ stories each" },
      { v:String(tail.length), k:"appear once", sub:rows.length?pc(tail.length/rows.length)+" of the list":"—" },
      { v: st.sel || "—", k:"selected", sub: st.sel ? selRows.length + " stories" : "pick a tag", small:true }
    ]);

    const field = $(cfg.tagsSel); field.innerHTML = "";
    const groups = st.group ? [[null, shown]]
      : cfg.groups.filter(g => shown.some(r => r.type === g)).map(g => [g, shown.filter(r => r.type === g)]);
    groups.forEach(([name, list]) => {
      if (!list.length) return;
      const sec = el("div","tg");
      if (name){ const h = el("h3"); h.appendChild(document.createTextNode(name));
        h.appendChild(el("b", null, String(list.length))); sec.appendChild(h); }
      const tags = el("div","tags");
      list.forEach(r => {
        const b = el("button","tag " + (r.count >= 2 ? "w2" : "w1")); b.type = "button";
        b.appendChild(el("span", null, r.name));
        b.appendChild(el("span","c2", String(r.count)));
        b.setAttribute("aria-pressed", String(r.name === st.sel));
        b.onclick = () => { st.sel = st.sel === r.name ? null : r.name; draw(); };
        tags.appendChild(b);
      });
      sec.appendChild(tags); field.appendChild(sec);
    });
    if (!needle && tail.length){
      const f = el("button","tag fold"); f.type = "button";
      f.textContent = st.open ? "−  hide the " + tail.length + " that appear once"
                              : "+  " + tail.length + " more, appearing once each";
      f.onclick = () => { st.open = !st.open; draw(); };
      field.appendChild(f);
    }
  }
  draw();
}

tagSection({ field:"entities", noun:"entities", total:ALL.entities.size, groups:ENTITY_ORDER, typeOf:entityType,
  facetsSel:"#e-sorts", searchSel:"#e-q", summarySel:"#e-summary", tagsSel:"#e-tags" });
tagSection({ field:"partners", noun:"partners", total:ALL.partners.size, groups:TYPE_ORDER, typeOf:partnerType,
  facetsSel:"#p-types", searchSel:"#p-q", summarySel:"#p-summary", tagsSel:"#p-tags" });

})();
