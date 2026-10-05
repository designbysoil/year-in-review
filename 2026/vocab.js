/* Shared vocabulary and derivations for the Impact Index.
   One source of truth for both the Index frame and the theme / priority pages. */
window.QF = (function () {
"use strict";

const S = (window.YIR && window.YIR.stories) || [];

const THEMES = [
  { key:"ai",             label:"Artificial Intelligence", color:"#2a78d6" },
  { key:"education",      label:"Progressive Education",   color:"#c2306b" },
  { key:"social",         label:"Social Progress",         color:"#eb6834" },
  { key:"health",         label:"Precision Health",        color:"#4a3aa7" },
  { key:"sustainability", label:"Sustainability",          color:"#1f7a3d" }
];
const TH = Object.fromEntries(THEMES.map(t => [t.key, t]));

/* Provisional — QNV 2030 pillars. The real list is the IA's first open decision. */
const PRIORITIES = [
  { key:"human",       label:"Human Development" },
  { key:"social",      label:"Social Development" },
  { key:"economic",    label:"Economic Development" },
  { key:"environment", label:"Environmental Development" }
];
const T2P = { education:["human"], health:["human","social"], social:["social"],
              ai:["economic"], sustainability:["environment"] };
const PRI = Object.fromEntries(PRIORITIES.map(p => [p.key, p]));

const ENTITY_CANON = {
  "Al-Mujadilah Center & Mosque for Women":"Al-Mujadilah Center and Mosque for Women",
  "Earthna Center for a Sustainable Future":"Earthna", "Akhlaquna initiative":"Akhlaquna",
  "Rasekh initiative":"Rasekh", "Minaretein Center":"Minaretein",
  "Ability Friendly":"Ability Friendly Program", "QSTP":"Qatar Science & Technology Park",
  "Hamad Bin Khalifa University Press":"Hamad Bin Khalifa University",
  "NU-Q":"Northwestern University in Qatar", "WCM-Q":"Weill Cornell Medicine-Qatar",
  "HBKU":"Hamad Bin Khalifa University"
};

function partnerType(n){
  const s = n.toLowerCase();
  if (/ministry|authority|council|committee|government|municipal|qatar fund|embassy|state of/.test(s)) return "Government and national bodies";
  if (/united nations|unesco|unicef|who\b|world health|world bank|oecd|international |global /.test(s)) return "International organisations";
  if (/universit|college|institute|school|academy|research|laborator/.test(s)) return "Universities and research";
  if (/foundation|charity|trust|ngo|association|society|federation|red crescent/.test(s)) return "Foundations and NGOs";
  return "Companies and other partners";
}
const TYPE_ORDER = ["Government and national bodies","Universities and research",
  "International organisations","Foundations and NGOs","Companies and other partners"];

/* ---- Foundation <-> Frontier placeholder ---- */
const FRONT = ["artificial intelligence","quantum computing","genomics","precision medicine","research",
  "clinical research","innovation","startups","entrepreneurship","cybersecurity","digital transformation"];
const FOUND = ["sport","heritage","culture","arts","community development","volunteerism","scholarships",
  "literacy","arabic language","teacher training","early childhood education","inclusion","disability inclusion"];

S.forEach((s, i) => {
  s.id = s.id || (s.month || "x").toLowerCase() + "-" + (s.chapter || i);
  s.keywords = s.keywords || []; s.metrics = s.metrics || [];
  s.entities = [...new Set((s.entities || []).map(e => ENTITY_CANON[e] || e))];
  s.partners = [...new Set(s.partners || [])];
  s.priorities = (T2P[s.theme] || []).slice();
  let n = 0;
  s.keywords.forEach(k => { if (FRONT.includes(k)) n++; if (FOUND.includes(k)) n--; });
  if (s.theme === "ai") n += 1.5; if (s.theme === "health") n += .5;
  if (s.theme === "education") n -= .5; if (s.theme === "social") n -= 1;
  s.axisRaw = n;
});
(function spread(){
  const o = S.slice().sort((a,b) => a.axisRaw - b.axisRaw), n = o.length || 1;
  o.forEach((s,i) => s.axis = n === 1 ? 0 : (i/(n-1))*2 - 1);
})();

const tally = (f, pool) => { const m = new Map();
  (pool || S).forEach(s => (s[f] || []).forEach(v => m.set(v, (m.get(v) || 0) + 1))); return m; };
const ALL = { entities: tally("entities"), partners: tally("partners"), keywords: tally("keywords") };
const where = (f, v) => S.filter(s => (s[f] || []).includes(v));

/* ---- colour ---- */
const hex2rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const rgb2hex = c => "#" + c.map(v => Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,"0")).join("");
const mix  = (a,b,t) => rgb2hex(hex2rgb(a).map((v,i) => v + (hex2rgb(b)[i]-v)*t));
const seq  = t => mix("#E4EBE6","#11362A", Math.max(0,Math.min(1,t))*.92 + .08);
const dvg  = v => v < 0 ? mix("#E3DCD1","#12564A",Math.min(1,-v)) : mix("#E3DCD1","#93441F",Math.min(1,v));
const tint = (hex,t) => mix("#EDE8E0", hex, .2 + .8*Math.max(0,Math.min(1,t)));
const ink  = bg => { const [r,g,b] = hex2rgb(bg); return (.2126*r + .7152*g + .0722*b) > 150 ? "#11362A" : "#F0EDE6"; };

/* ---- stats ---- */
const pc   = v => (v*100).toFixed(0) + "%";
const mean = a => a.length ? a.reduce((x,y) => x+y, 0)/a.length : 0;

/* "most frequent" vs "most distinctive" — share here, versus share everywhere */
function profile(sub, n){
  n = n || 6;
  const loc = new Map();
  sub.forEach(s => s.keywords.forEach(k => loc.set(k, (loc.get(k)||0)+1)));
  const d = sub.length || 1, N = S.length || 1;
  const rows = [...loc.entries()].map(([k,c]) => ({ k, c, share:c/d, lift:(c/d)/((ALL.keywords.get(k)||1)/N) }));
  return { frequent: rows.slice().sort((a,b) => b.share - a.share).slice(0,n),
           distinctive: rows.slice().sort((a,b) => b.lift - a.lift || b.c - a.c).slice(0,n) };
}

function monthFile(m){
  const k = String(m||"").toLowerCase();
  return (k === "july & august" || k === "july" || k === "august")
    ? "july-august-option-a-modal.html" : k + "-option-a-modal.html";
}
const storyHref = s => "../months/" + monthFile(s.month) + "#chapter-" + s.chapter;

/* rank a tally restricted to a subset of stories */
function rank(field, pool){
  return [...tally(field, pool).entries()]
    .map(([name,count]) => ({ name, count }))
    .sort((a,b) => b.count - a.count || a.name.localeCompare(b.name));
}

/* The two standing blocks. "What we do" is assembled from the record; "Why it matters"
   is the contribution claim and cannot be derived, so it is marked rather than faked. */
function whatWeDo(stories){
  const kw = profile(stories, 4).frequent.map(k => k.k);
  const ents = rank("entities", stories);
  return "Across " + stories.length + " stories, the work concentrated on "
    + kw.slice(0,3).join(", ") + (kw[3] ? " and " + kw[3] : "") + ". "
    + (ents.length ? ents[0].name + " appears in " + ents[0].count
        + (ents[1] ? ", " + ents[1].name + " in " + ents[1].count : "") + "." : "");
}
function whyItMatters(type){
  return type === "priority"
    ? "The contribution claim: what QF asserts it added to this national pillar this year. The sentence a government reader came for, and the one thing on the page that cannot be derived from the record."
    : "Why this theme earns a place among the five, and what it changed. One paragraph, editorial, signed off once a year.";
}

return { S, THEMES, TH, PRIORITIES, PRI, T2P, ENTITY_CANON, partnerType, TYPE_ORDER, whatWeDo, whyItMatters,
         ALL, tally, where, rank, mix, seq, dvg, tint, ink, pc, mean, profile, monthFile, storyHref };
})();
