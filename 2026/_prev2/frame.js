/* 2026 Year in Review — index.
   Three columns: section nav | facet cards | stage.
   Themes and Priorities lead with the recap. Partners and Across QF are tag fields,
   showing only the tags that carry weight, with the long tail folded. */
(function () {
"use strict";

const { S, THEMES, PRIORITIES, ALL, TYPE_ORDER, rank, where, pc, mean, profile, partnerType,
        whatWeDo, whyItMatters } = window.QF;

const $  = s => document.querySelector(s);
const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };

const SECTIONS = [
  ["themes","Themes", () => THEMES.length],
  ["priorities","National Priorities", () => PRIORITIES.length],
  ["partners","With partners", () => ALL.partners.size],
  ["entities","Across QF", () => ALL.entities.size]
];

/* QF's own bodies group differently from external partners. Derived from the name. */
function entityType(n){
  const s = n.toLowerCase();
  if (/universit|college|hec paris|carnegie|georgetown|northwestern|texas a&m|weill cornell|virginia commonwealth|nu-q|wcm-q/.test(s)) return "Universities";
  if (/research institute|institute|qcri|qbri|qeeri|laborator|press/.test(s)) return "Research institutes";
  if (/academy|school|juthoor|awsaj|renad|warif|academyati|pre-university|education city stadium/.test(s)) return "Schools and education";
  if (/wish|wise|summit|debates?|forum|library|museum|garden|mosque|stadium|shaqab/.test(s)) return "Convenings, culture and campus";
  return "Centres, programmes and initiatives";
}
const ENTITY_ORDER = ["Universities","Schools and education","Research institutes",
  "Convenings, culture and campus","Centres, programmes and initiatives"];

/* ---------- nav ---------- */
(function nav(){
  const box = $("#nav-links");
  SECTIONS.forEach(([id, label, count]) => {
    const a = el("a"); a.href = "#" + id; a.dataset.sec = id;
    a.appendChild(el("span", null, label));
    a.appendChild(el("span","n", String(count())));
    box.appendChild(a);
  });
  const links = [...box.children];
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting)
    links.forEach(a => a.classList.toggle("on", a.dataset.sec === e.target.id)); }),
    { rootMargin:"-10% 0px -60% 0px" });
  SECTIONS.forEach(([id]) => io.observe(document.getElementById(id)));

  const f = $("#facts");
  [[S.length,"stories"],[ALL.keywords.size,"keywords"]].forEach(([n,l]) => {
    const d = el("span"); d.appendChild(el("b", null, String(n)));
    d.appendChild(document.createTextNode(" " + l)); f.appendChild(d);
  });
})();

/* ---------- summary strip ---------- */
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

/* ---------- sections 1 & 2: facet cards + recap ---------- */

/* The numbers the summary strip used to carry, now inside the selected card. */
function detail(stories){
  const wrap = el("div","fx");
  const ents = rank("entities", stories), parts = rank("partners", stories);
  const m = mean(stories.map(s => s.axis));

  const grid = el("div","fx-stats");
  [[pc(stories.length / S.length), "of the year"],
   [String(ents.length), "QF entities"],
   [String(parts.length), "partners"],
   [String(new Set(stories.flatMap(s => s.keywords)).size), "keywords"]
  ].forEach(([v,l]) => { const s = el("div","s");
    s.appendChild(el("div","v", v)); s.appendChild(el("div","l", l)); grid.appendChild(s); });
  wrap.appendChild(grid);

  const ax = el("div","fx-axis");
  const bar = el("div","bar"); const pin = el("i");
  pin.style.left = ((m + 1) / 2 * 100).toFixed(1) + "%";
  bar.appendChild(pin); ax.appendChild(bar);
  const lb = el("div","l");
  lb.appendChild(el("span", null, "Foundation"));
  lb.appendChild(el("span", null, (m > 0 ? "+" : "") + m.toFixed(2)));
  lb.appendChild(el("span", null, "Frontier"));
  ax.appendChild(lb); wrap.appendChild(ax);

  const kw = el("div","fx-kw");
  profile(stories, 4).distinctive.forEach(k => kw.appendChild(el("span", null, k.k)));
  wrap.appendChild(kw);
  return wrap;
}

function recapSection(cfg){
  let sel = cfg.items[0].key, recap = null;
  const box = $(cfg.facetsSel);

  cfg.items.forEach(it => {
    const b = el("button","fcard"); b.type = "button"; b.dataset.k = it.key;
    if (it.color) b.style.setProperty("--accent", it.color);
    const stories = cfg.storiesFor(it.key);
    const t = el("div","ft");
    t.appendChild(el("span", null, it.label));
    t.appendChild(el("span","fn", stories.length + " stories"));
    b.appendChild(t);
    b.appendChild(el("p","fd", cfg.describe(it, stories)));
    b.appendChild(detail(stories));
    b.onclick = () => { sel = it.key; draw(); };
    box.appendChild(b);
  });

  function draw(){
    const it = cfg.items.find(x => x.key === sel);
    const stories = cfg.storiesFor(sel);
    [...box.children].forEach(b => b.setAttribute("aria-pressed", String(b.dataset.k === sel)));

    $(cfg.noteSel).textContent = "Auto-paging placeholder — stands in for the video overview";
    if (recap) recap.destroy();              /* else the old timers keep firing on this root */
    recap = window.QFRecap.mount($(cfg.recapSel), it.label, stories, cfg.kicker(it, stories));

    blocks($(cfg.blocksSel), stories, cfg);

    const more = $(cfg.moreSel);
    more.href = `page.html?type=${cfg.pageType}&key=${it.key}`;
    $(cfg.lblSel).textContent = `All ${stories.length} ${it.label} stories`;
  }
  draw();
}

/* The two standing blocks, above the recap. */
function blocks(root, stories, cfg){
  root.innerHTML = "";
  const b1 = el("div","blk");
  b1.appendChild(el("h4", null, "What we do"));
  b1.appendChild(el("p", null, whatWeDo(stories)));
  root.appendChild(b1);

  const b2 = el("div","blk todo");
  b2.appendChild(el("h4", null, "Why it matters"));
  b2.appendChild(el("p", null, whyItMatters(cfg.pageType)));
  b2.appendChild(el("span","flag", "Editorial \u2014 to be written"));
  root.appendChild(b2);
}

recapSection({
  items: THEMES, pageType:"theme",
  storiesFor: k => S.filter(s => s.theme === k),
  describe: (it, ss) => {
    const ent = rank("entities", ss)[0];
    const kw  = profile(ss, 2).distinctive.map(k => k.k);
    return pc(ss.length / S.length) + " of the year"
      + (ent ? ". Mostly " + ent.name : "")
      + (kw.length ? ". Distinctive for " + kw.join(" and ") : "") + ".";
  },
  kicker: (it, ss) => { const kw = profile(ss, 2).distinctive.map(k => k.k);
    return kw.length ? "Most distinctive of it: " + kw.join(", ") + "." : ""; },
  facetsSel:"#f-themes", recapSel:"#r-themes", noteSel:"#r-themes-note",
  blocksSel:"#b-themes", moreSel:"#c-themes-more", lblSel:"#c-themes-lbl"
});

recapSection({
  items: PRIORITIES.map(p => ({ ...p, color:"#11362A" })), pageType:"priority",
  storiesFor: k => S.filter(s => s.priorities.includes(k)),
  describe: (it, ss) => pc(ss.length / S.length)
    + " of the year maps to this pillar. Provisional — derived from theme while the real list is decided.",
  kicker: (it, ss) => "Provisional QNV 2030 pillar · " + ss.length + " stories.",
  facetsSel:"#f-priorities", recapSel:"#r-priorities", noteSel:"#r-priorities-note",
  blocksSel:"#b-priorities", moreSel:"#c-priorities-more", lblSel:"#c-priorities-lbl"
});

/* ---------- sections 3 & 4: tag fields ---------- */
/* Only the tags that carry weight are shown. The singletons are real and are counted,
   but listing 120 of them buries the ten that matter — so they fold. */

function tagSection(cfg){
  const st = { q:"", sel:null, group:null, open:false };
  const input = $(cfg.searchSel);
  input.placeholder = "Search " + cfg.total + " " + cfg.noun + "…";
  input.oninput = () => { st.q = input.value; draw(); };

  const box = $(cfg.facetsSel);
  const all = rank(cfg.field).map(r => ({ ...r, type: cfg.typeOf(r.name) }));

  [{ key:null, label:"Everything", desc:"All " + cfg.total + " " + cfg.noun + " named across the year." }]
    .concat(cfg.groups.map(g => {
      const rows = all.filter(r => r.type === g);
      return { key:g, label:g, n:rows.length,
        desc: rows.filter(r => r.count > 1).length + " appear more than once; "
            + rows.filter(r => r.count === 1).length + " appear once." };
    }))
    .forEach(g => {
      const b = el("button","fcard"); b.type = "button"; b.dataset.k = g.key || "__all";
      const t = el("div","ft");
      t.appendChild(el("span", null, g.label));
      t.appendChild(el("span","fn", String(g.n != null ? g.n : cfg.total)));
      b.appendChild(t);
      b.appendChild(el("p","fd", g.desc));
      b.onclick = () => { st.group = g.key; st.open = false; draw(); };
      box.appendChild(b);
    });

  function draw(){
    const needle = st.q.trim().toLowerCase();
    let rows = all.filter(r => !needle || r.name.toLowerCase().includes(needle));
    if (st.group) rows = rows.filter(r => r.type === st.group);
    [...box.children].forEach(b => b.setAttribute("aria-pressed", String((st.group || "__all") === b.dataset.k)));

    const strong = rows.filter(r => r.count >= cfg.floor);
    const tail   = rows.filter(r => r.count <  cfg.floor);
    const shown  = (needle || st.open) ? rows : strong;

    const selRows = st.sel ? where(cfg.field, st.sel) : [];
    summary($(cfg.summarySel), [
      { v:String(rows.length), k:cfg.noun, sub:(needle || st.group) ? "matching" : "named this year" },
      { v:String(strong.length), k:"carry weight", sub:cfg.floor + "+ stories each" },
      { v:String(tail.length), k:"appear once", sub:rows.length ? pc(tail.length / rows.length) + " of the list" : "—" },
      { v: st.sel || "—", k:"selected", sub: st.sel ? selRows.length + " stories · " + cfg.typeOf(st.sel) : "pick a tag", small:true }
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
        const b = el("button","tag " + (r.count >= 5 ? "w3" : r.count >= 2 ? "w2" : "w1")); b.type = "button";
        b.appendChild(el("span", null, r.name));
        b.appendChild(el("span","c", String(r.count)));
        b.setAttribute("aria-pressed", String(r.name === st.sel));
        b.onclick = () => { st.sel = st.sel === r.name ? null : r.name; draw(); };
        tags.appendChild(b);
      });
      sec.appendChild(tags); field.appendChild(sec);
    });

    if (!needle && tail.length){
      const f = el("button","tag fold"); f.type = "button";
      f.textContent = st.open
        ? "−  hide the " + tail.length + " that appear once"
        : "+  " + tail.length + " more, appearing once each";
      f.onclick = () => { st.open = !st.open; draw(); };
      field.appendChild(f);
    }
    if (!shown.length) field.appendChild(el("p","stage-foot","Nothing matches."));
  }
  draw();
  return { select(n){ st.sel = n; st.open = true; draw(); } };
}

const partnersSection = tagSection({
  field:"partners", noun:"partners", total: ALL.partners.size, floor:2,
  groups: TYPE_ORDER, typeOf: partnerType,
  facetsSel:"#p-types", searchSel:"#p-q", summarySel:"#p-summary", tagsSel:"#p-tags"
});

const entitiesSection = tagSection({
  field:"entities", noun:"entities", total: ALL.entities.size, floor:2,
  groups: ENTITY_ORDER, typeOf: entityType,
  facetsSel:"#e-sorts", searchSel:"#e-q", summarySel:"#e-summary", tagsSel:"#e-tags"
});

/* deep link from a theme / priority page: #entities:Sidra%20Medicine */
(function fromHash(){
  const m = decodeURIComponent(location.hash.slice(1)).split(":");
  if (m.length !== 2) return;
  if (m[0] === "entities"){ entitiesSection.select(m[1]); document.getElementById("entities").scrollIntoView(); }
  if (m[0] === "partners"){ partnersSection.select(m[1]); document.getElementById("partners").scrollIntoView(); }
})();

})();
