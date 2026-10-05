/* QF Impact Index 2026 — v2.
   Four entry points, one screen each. Controls and results never separated by a scroll. */
(function () {
"use strict";

/* vocabulary, derivations and colour all live in vocab.js — one source of truth */
const { S, THEMES, TH, PRIORITIES, TYPE_ORDER, ALL, where, partnerType,
        seq, dvg, tint, pc, mean, profile, storyHref } = window.QF;

/* ---------- framings — the four entry points, named as the IA names them ---------- */

const FRAMINGS = [
  {
    key:"themes", label:"Themes", kind:"cards", one:"theme",
    items: () => THEMES.map(t => ({ name:t.label, key:t.key, color:t.color, stories:S.filter(s => s.theme === t.key) })),
    claim: it => { const a = it.slice().sort((x,y) => y.stories.length - x.stories.length);
      return `Five editorial spines, and they are nowhere near equal. <b>${a[0].name}</b> carries ${pc(a[0].stories.length/S.length)} of the year; <b>${a[a.length-1].name}</b> carries ${pc(a[a.length-1].stories.length/S.length)}. <em>That is a commissioning decision, not a coverage statistic.</em>`; },
    method:"One theme per story, editorial-owned. Counts are stories, so this measures what was covered — not what was spent or achieved."
  },
  {
    key:"priorities", label:"National Priorities", kind:"cards", one:"priority",
    items: () => PRIORITIES.map(p => ({ name:p.label, key:p.key, color:"#11362A", stories:S.filter(s => s.priorities.includes(p.key)) })),
    claim: it => `Every story maps to at least one national pillar, so this is the view a government reader starts from. <b>${it.slice().sort((a,b)=>b.stories.length-a.stories.length)[0].name}</b> leads. <em>Provisional QNV 2030 pillars — the real list is still open.</em>`,
    method:"Provisional: priorities are currently derived from theme. In production this is an editorial field with strategy sign-off, one or two per story, and it is the first decision the IA draft is waiting on."
  },
  {
    key:"entities", label:"Across QF", kind:"bars", one:"entity", floor:5,
    items: () => [...ALL.entities.keys()].map(n => ({ name:n, color:"#11362A", stories:where("entities", n) }))
                   .sort((a,b) => b.stories.length - a.stories.length),
    claim: it => { const n = it.length, big = it.filter(x => x.stories.length >= 5).length;
      return `<b>${n} entities</b> did the year's work. ${big} appear five times or more; the other ${n-big} appear fewer. <em>This is the ecosystem explainer, as a record of who actually did things.</em>`; },
    method:"Entity names are reconciled here from the variants QF's own 2025 pages use — NU-Q and Northwestern, HBKU and Hamad Bin Khalifa. Deliberately bands, not a league table: story count measures coverage, not contribution."
  },
  {
    key:"partners", label:"With partners", kind:"lookup", one:"partner",
    items: () => [...ALL.partners.keys()].map(n => ({ name:n, type:partnerType(n), color:"#11362A", stories:where("partners", n) }))
                   .sort((a,b) => b.stories.length - a.stories.length || a.name.localeCompare(b.name)),
    claim: it => { const once = it.filter(x => x.stories.length === 1).length;
      return `<b>${it.length} organisations</b> outside QF, and <b>${once}</b> of them appear exactly once. <em>A tail this long is something you look something up in, not something you browse — so this one is a search, not a grid.</em>`; },
    method:"Partner type is derived from the organisation's name, not from a register. Named partners have not been cleared for publication — in year one this view stays internal."
  }
];

/* ---------- state ---------- */

const st = { f:"themes", sel:null, mode:"distinctive", colour:"activity", view:"cards", q:"" };

/* ---------- helpers ---------- */

const $ = s => document.querySelector(s);
const el = (t, c, x) => { const n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
const framing = () => FRAMINGS.find(f => f.key === st.f);

const tip = $("#tip");
function showTip(e, txt){ tip.textContent = txt; tip.classList.add("on");
  let x = e.clientX + 13, y = e.clientY + 13; const r = tip.getBoundingClientRect();
  if (x + r.width  > innerWidth  - 8) x = e.clientX - r.width  - 13;
  if (y + r.height > innerHeight - 8) y = e.clientY - r.height - 13;
  tip.style.left = x + "px"; tip.style.top = y + "px"; }
const hideTip = () => tip.classList.remove("on");

/* ---------- masthead ---------- */
(function facts(){
  const box = $("#facts");
  [[S.length,"stories"],[ALL.entities.size,"entities"],[ALL.partners.size,"partners"],[ALL.keywords.size,"keywords"]]
    .forEach(([n,l]) => { const d = el("span"); d.appendChild(el("b", null, String(n)));
      d.appendChild(document.createTextNode(" " + l)); box.appendChild(d); });
})();

/* ---------- switch ---------- */
(function sw(){
  const box = $("#switch");
  FRAMINGS.forEach(f => {
    const b = el("button", null, f.label); b.type = "button";
    b.onclick = () => { st.f = f.key; st.sel = null; st.q = ""; render(); };
    box.appendChild(b);
  });
})();

/* ---------- render ---------- */

function render(){
  const F = framing();
  [...$("#switch").children].forEach((b,i) => b.setAttribute("aria-pressed", String(FRAMINGS[i].key === st.f)));

  const items = F.items();
  if (!st.sel || !items.some(i => i.name === st.sel)) st.sel = items[0] ? items[0].name : null;

  $("#claim").innerHTML = F.claim(items);
  $("#method").textContent = F.method;

  const max = Math.max(1, ...items.map(i => i.stories.length));
  const colourOf = it => st.colour === "axis" ? dvg(mean(it.stories.map(s => s.axis)))
    : (F.key === "themes" ? tint(it.color, it.stories.length / max) : seq(it.stories.length / max));

  const set = $("#set"); set.innerHTML = "";
  if (st.view === "table") drawTable(set, items, F);
  else if (F.kind === "cards")  drawCards(set, items, colourOf, max);
  else if (F.kind === "bars")   drawBars(set, items, colourOf, max, F);
  else                          drawLookup(set, items, colourOf);

  drawDetail(items.find(i => i.name === st.sel), F, items);
  drawControls();
}

/* cards — small closed sets */
function drawCards(root, items, colourOf, max){
  const g = el("div","cards");
  items.forEach(it => {
    const b = el("button","card"); b.type = "button";
    b.setAttribute("aria-pressed", String(it.name === st.sel));
    b.appendChild(el("div","nm", it.name));
    b.appendChild(el("div","num", String(it.stories.length)));
    b.appendChild(el("div","sub", pc(it.stories.length / S.length) + " of the year"));
    const tr = el("div","track"), fl = el("div","fill");
    fl.style.width = (it.stories.length / max * 100) + "%";
    fl.style.background = colourOf(it); tr.appendChild(fl); b.appendChild(tr);
    b.onclick = () => { st.sel = it.name; render(); };
    g.appendChild(b);
  });
  root.appendChild(g);
}

/* bars — medium set with a folded tail */
function drawBars(root, items, colourOf, max, F){
  const head = items.filter(i => i.stories.length >= F.floor);
  const tail = items.filter(i => i.stories.length <  F.floor);
  const list = el("div","bars");
  const row = it => {
    const b = el("button","bar"); b.type = "button";
    b.setAttribute("aria-pressed", String(it.name === st.sel));
    const fl = el("span","fill");
    fl.style.width = (it.stories.length / max * 100) + "%"; fl.style.background = colourOf(it);
    b.appendChild(fl);
    b.appendChild(el("span","nm", it.name));
    b.appendChild(el("span","v", String(it.stories.length)));
    b.onclick = () => { st.sel = it.name; render(); };
    return b;
  };
  head.forEach(it => list.appendChild(row(it)));
  root.appendChild(list);
  if (tail.length){
    const f = el("button","fold", (st.showTail ? "−  hide " : "+  ") + tail.length + " entities appearing fewer than five times");
    f.type = "button";
    f.onclick = () => { st.showTail = !st.showTail; render(); };
    root.appendChild(f);
    if (st.showTail){ const l2 = el("div","bars"); tail.forEach(it => l2.appendChild(row(it))); root.appendChild(l2); }
  }
}

/* lookup — the long tail */
function drawLookup(root, items, colourOf){
  const bar = el("div","lookup-bar");
  const inp = document.createElement("input");
  inp.type = "search"; inp.placeholder = "Search " + items.length + " partners…"; inp.value = st.q;
  inp.setAttribute("aria-label","Search partners");
  inp.oninput = () => { st.q = inp.value; const a = document.activeElement === inp; render();
    if (a) { const n = document.querySelector(".lookup-bar input"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); } };
  bar.appendChild(inp); root.appendChild(bar);

  const q = st.q.trim().toLowerCase();
  const shown = q ? items.filter(i => i.name.toLowerCase().includes(q)) : items;
  if (!shown.length){ root.appendChild(el("p","method","Nothing matches “" + st.q + "”.")); return; }

  TYPE_ORDER.forEach(type => {
    const g = shown.filter(i => i.type === type);
    if (!g.length) return;
    const sec = el("div","grp");
    const h = el("h3"); h.appendChild(document.createTextNode(type + " "));
    h.appendChild(el("span","n","(" + g.length + ")")); sec.appendChild(h);
    const c = el("div","chips");
    g.forEach(it => {
      const b = el("button","chip"); b.type = "button";
      b.setAttribute("aria-pressed", String(it.name === st.sel));
      b.appendChild(el("span", null, it.name));
      if (it.stories.length > 1) b.appendChild(el("span","c", String(it.stories.length)));
      b.onclick = () => { st.sel = it.name; render(); };
      b.onmousemove = e => showTip(e, it.stories.length + (it.stories.length === 1 ? " story" : " stories"));
      b.onmouseleave = hideTip;
      c.appendChild(b);
    });
    sec.appendChild(c); root.appendChild(sec);
  });
}

/* table — the relief view, same data */
function drawTable(root, items, F){
  const t = el("table","data");
  const th = el("thead"), tr = el("tr");
  [[F.one.replace(/^./, c => c.toUpperCase()), ""], ["Stories","num"], ["Share","num"], ["Found ↔ Front","num"], ["Example",""]]
    .forEach(([l,c]) => tr.appendChild(el("th", c, l)));
  th.appendChild(tr); t.appendChild(th);
  const tb = el("tbody");
  items.forEach(it => {
    const r = el("tr");
    r.appendChild(el("td", null, it.name));
    r.appendChild(el("td","num", String(it.stories.length)));
    r.appendChild(el("td","num", pc(it.stories.length / S.length)));
    const m = mean(it.stories.map(s => s.axis));
    r.appendChild(el("td","num", (m > 0 ? "+" : "") + m.toFixed(2)));
    r.appendChild(el("td", null, it.stories[0] ? it.stories[0].title : "—"));
    r.onclick = () => { st.sel = it.name; render(); };
    tb.appendChild(r);
  });
  t.appendChild(tb); root.appendChild(t);
}

/* detail panel */
function drawDetail(it, F, items){
  const d = $("#detail"); d.innerHTML = "";
  if (!it){ d.appendChild(el("p","method","Nothing selected.")); return; }
  const rank = items.slice().sort((a,b) => b.stories.length - a.stories.length).findIndex(x => x.name === it.name) + 1;

  d.appendChild(el("div","dn", it.name));
  const m = el("div","dmeta");
  m.appendChild(el("b", null, String(it.stories.length)));
  m.appendChild(document.createTextNode(" stories · " + pc(it.stories.length / S.length) + " of the year · rank " + rank + " of " + items.length));
  d.appendChild(m);

  const seg = el("div","seg");
  [["distinctive","Most distinctive"],["frequent","Most frequent"]].forEach(([k,l]) => {
    const b = el("button", null, l); b.type = "button";
    b.setAttribute("aria-pressed", String(st.mode === k));
    b.onclick = () => { st.mode = k; render(); };
    seg.appendChild(b);
  });
  d.appendChild(seg);

  const rows = profile(it.stories)[st.mode];
  const ul = el("ul","kw");
  rows.forEach(r => { const li = el("li");
    li.appendChild(el("span", null, r.k));
    li.appendChild(el("span","m", st.mode === "frequent" ? pc(r.share) : "×" + r.lift.toFixed(1)));
    ul.appendChild(li); });
  if (!rows.length) ul.appendChild(el("li", null, "No keywords."));
  d.appendChild(ul);

  if (F.key === "themes" || F.key === "priorities"){
    const a = el("a","openpage");
    a.href = "page.html?type=" + (F.key === "themes" ? "theme" : "priority") + "&key=" + it.key;
    a.textContent = "Open the " + (F.key === "themes" ? "theme" : "priority") + " page \u2192";
    d.appendChild(a);
  }

  const th = el("div","thumbs");
  it.stories.slice(0,3).forEach(s => {
    const a = el("a","thumb");
    a.href = storyHref(s);
    a.target = "_blank"; a.rel = "noopener";
    const im = el("div","im");
    if (s.hero) im.style.backgroundImage = 'url("' + s.hero.replace(/"/g,"%22") + '")';
    else im.style.background = "linear-gradient(140deg," + TH[s.theme].color + "33," + TH[s.theme].color + "cc)";
    const cp = el("div","cp");
    cp.appendChild(el("span", null, s.month));
    cp.appendChild(document.createTextNode(s.title));
    a.appendChild(im); a.appendChild(cp); th.appendChild(a);
  });
  d.appendChild(th);
}

/* footer controls */
function drawControls(){
  const c = $("#controls"); c.innerHTML = "";
  const ramp = el("span","ramp");
  (st.colour === "axis" ? ["#12564A","#8FB2A7","#E3DCD1","#D8A98C","#93441F"] : ["#E4EBE6","#9CBFAD","#48866C","#11362A"])
    .forEach(h => { const i = el("i"); i.style.background = h; ramp.appendChild(i); });
  c.appendChild(ramp);

  const seg1 = el("div","seg"); seg1.style.margin = "0";
  [["activity","Activity"],["axis","Foundation ↔ Frontier"]].forEach(([k,l]) => {
    const b = el("button", null, l); b.type = "button";
    b.setAttribute("aria-pressed", String(st.colour === k));
    b.onclick = () => { st.colour = k; render(); }; seg1.appendChild(b);
  });
  c.appendChild(seg1);

  const seg2 = el("div","seg"); seg2.style.margin = "0";
  [["cards","Visual"],["table","Table"]].forEach(([k,l]) => {
    const b = el("button", null, l); b.type = "button";
    b.setAttribute("aria-pressed", String(st.view === k));
    b.onclick = () => { st.view = k; render(); }; seg2.appendChild(b);
  });
  c.appendChild(seg2);
}

/* keyboard: 1-4 switch entry point */
addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") return;
  const i = "1234".indexOf(e.key);
  if (i > -1){ st.f = FRAMINGS[i].key; st.sel = null; st.q = ""; render(); }
});

/* deep link from a theme / priority page: #entities:Sidra%20Medicine */
(function fromHash(){
  const m = decodeURIComponent(location.hash.slice(1)).split(":");
  if (m.length === 2 && FRAMINGS.some(f => f.key === m[0])) { st.f = m[0]; st.sel = m[1]; }
})();

render();
})();
