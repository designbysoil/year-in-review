/* ============================================================================
   AUTHORED CONTENT LAYER — v3
   Everything in this file is DRAFT, written to specify the fields the concept
   needs. Nothing here is approved QF copy. Numbers marked `source:"record"`
   are lifted verbatim from QF's own 2025 pages; everything else is marked.
   The UI renders draft status visibly. See CONTENT-SPEC.md for owners.
   ========================================================================== */
window.YIRC = {

  /* Fields every theme and priority must carry before this ships. */
  required: ["claim", "headline.value", "headline.label", "headline.baseline", "contents"],

  themes: {
    ai: {
      claim: "Qatar Foundation is building artificial intelligence in Arabic, and building the people who will govern it. The point is not that we adopted AI early — it is that the language, the ethics and the researchers are ours.",
      standfirst: "Leading responsibly in a new era",
      headline: { value: "400bn", label: "words of Arabic behind Fanar, Qatar's own large language model", source: "record" },
      baseline: { year: 2015, value: null, note: "No Arabic-language model existed in Qatar", status: "required" },
      human: { storyId: "january-6", why: "A researcher who chose to build the model here rather than abroad." }
    },
    education: {
      claim: "Education at QF is not a pipeline to a certificate. It is the deliberate construction of a country's capacity to teach itself — in Arabic, at every level, for people the system used to leave out.",
      standfirst: "The long work of building a system",
      headline: { value: "946", label: "graduates from 77 nations crossed the stage in 2026", source: "draft" },
      baseline: { year: 2015, value: null, note: "Graduating cohort across Education City", status: "required" },
      human: { storyId: "may-1", why: "A graduate whose family had no prior university generation." }
    },
    social: {
      claim: "Social progress is measured by who is included, not by how many attended. QF's test is whether a child with a disability, a volunteer, and an Arabic speaker all find the door open.",
      standfirst: "Who gets through the door",
      headline: { value: "1,500+", label: "submissions to the BilAraby competition to revive Arabic in daily life", source: "record" },
      baseline: { year: 2015, value: null, note: "Comparable participation figure", status: "required" },
      human: { storyId: "april-6", why: "The clinician behind Qatar's national autism roadmap." }
    },
    health: {
      claim: "Precision health means a diagnosis that fits the person in front of you. QF's contribution is a genomic record of this population, so that treatment designed elsewhere stops being a guess here.",
      standfirst: "Medicine that fits the patient",
      headline: { value: "45+", label: "children have received gene therapies at Sidra Medicine since 2022", source: "record" },
      baseline: { year: 2015, value: "0", note: "No gene therapy programme existed in Qatar", status: "draft" },
      human: { storyId: "january-8", why: "A clinician who returned to Qatar to run the programme." }
    },
    sustainability: {
      claim: "Sustainability in a desert state is not a pledge, it is a restoration project. QF's work is to put back the coastline and the knowledge that manages it.",
      standfirst: "Putting the coast back",
      headline: { value: "125,000+", label: "mangrove seedlings collected to restore 40 hectares of coastline", source: "record" },
      baseline: { year: 2015, value: null, note: "Hectares under restoration", status: "required" },
      human: { storyId: "april-1", why: "A researcher on the mangrove restoration team." }
    }
  },

  /* The evidence register. Priorities lead with the claim, then commitments. */
  priorities: {
    human: {
      claim: "QF's contribution to Human Development is the capacity to educate and treat people in Qatar without sending them elsewhere to be educated or treated.",
      commitments: [
        { text: "Graduates entering the national workforce from Education City", metric: "946", status: "draft" },
        { text: "Children receiving gene therapy in Qatar rather than abroad", metric: "45+", status: "record" },
        { text: "Medical trainees graduated from paediatric programmes", metric: "400+", status: "record" }
      ],
      baseline: { year: 2015, status: "required" }
    },
    social: {
      claim: "QF's contribution to Social Development is measured in access: who can participate in Qatari public life who previously could not.",
      commitments: [
        { text: "Submissions to the BilAraby campaign to return Arabic to daily use", metric: "1,500+", status: "record" },
        { text: "Teams competing in the Jr. NBA/Jr. WNBA Qatar League", metric: "68", status: "record" },
        { text: "Days of paid volunteering leave for every QF employee", metric: "3", status: "record" }
      ],
      baseline: { year: 2015, status: "required" }
    },
    economic: {
      claim: "QF's contribution to Economic Development is a research base that produces companies, not just papers — and a technology stack Qatar owns.",
      commitments: [
        { text: "Startups enabled by QSTP to reach Web Summit Qatar", metric: "20", status: "record" },
        { text: "Innovators from 27 countries applying to the Shell.ai Futures Pitch", metric: "86", status: "record" },
        { text: "Experts convened at the Quantum.Tech conference", metric: "200+", status: "record" }
      ],
      baseline: { year: 2015, status: "required" }
    },
    environment: {
      claim: "QF's contribution to Environmental Development is restoration at a measurable scale, and the convening authority to hold others to the same standard.",
      commitments: [
        { text: "Mangrove seedlings collected for coastline cultivation", metric: "125,000+", status: "record" },
        { text: "Hectares of coastline to be restored", metric: "40", status: "record" },
        { text: "Countries represented at the Earthna Summit", metric: "100+", status: "record" }
      ],
      baseline: { year: 2015, status: "required" }
    }
  },

  /* ---- story-level IA: the same four questions, one level down ----
     The structure is fractal. A card answers the same questions the theme does.
     `whyItMatters` is the only field that must be written; the rest is in the record. */
  stories: {
    "january-6": { whyItMatters: "Arabic was a low-resource language for AI. After Fanar it is not, and the model is Qatari-owned." },
    "january-8": { whyItMatters: "Before this programme, a Qatari child needing gene therapy was treated abroad or not at all." },
    "may-1":     { whyItMatters: "A graduating cohort is the only honest measure of whether an education system is working." },
    "april-6":   { whyItMatters: "A national autism roadmap turns goodwill into an obligation with dates attached." },
    "april-1":   { whyItMatters: "Restoration at 40 hectares is large enough to change a coastline, not just a photograph." }
  }
};
