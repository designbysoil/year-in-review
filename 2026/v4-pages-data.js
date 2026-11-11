/* 2026 Year in Review — shared data for the theme pages (v4-theme.html),
   opened from the long page's Themes section and its National Priority cards.

   Each theme page follows its SID source document (v4-sid-data.js): why QF
   focuses on the theme, how it contributes to the national priorities, QF's
   achievements and the difference they make. National priorities have no
   pages of their own; they live inside the themes. The monthly stories are
   data.js. Loads after data.js and v4-sid-data.js. */
window.YIRP = (() => {
  'use strict';

  const SID = window.YIR_SID;

  /* order, slugs and key lines follow the long page */
  const THEMES = [
    { slug: 'artificial-intelligence', key: 'ai', name: 'Artificial Intelligence', img: 'theme-1.jpg',
      key_line: 'Building artificial intelligence in Arabic, and the people who will govern it.' },
    { slug: 'precision-health', key: 'health', name: 'Precision Health', img: 'theme-2.jpg',
      key_line: 'Medicine that fits the patient, built on a genomic record of this population.' },
    { slug: 'progressive-education', key: 'education', name: 'Progressive Education', img: 'theme-3.jpg',
      key_line: 'The long work of building a system that teaches itself, in Arabic, at every level.' },
    { slug: 'sustainability', key: 'sustainability', name: 'Sustainability', img: 'theme-4.jpg',
      key_line: 'Putting the coast back, and the knowledge that manages it.' },
    { slug: 'social-progress', key: 'social', name: 'Social Progress', img: 'theme-5.jpg',
      key_line: 'Social progress is measured by who is included, not by how many attended.' }
  ].map(t => ({ ...t, ...SID.themes[t.slug] }))
    // achievements lead with their SID headline only, no figures
    .map(t => ({ ...t, achievements: t.achievements.map(a => ({ ...a, stat: null, heroStat: a.stat })) }));

  /* The seven outcomes of the Third National Development Strategy, in its order. */
  const PRIORITIES = [
    { key: 'growth', name: 'Sustainable Economic Growth' },
    { key: 'fiscal', name: 'Fiscal Sustainability' },
    { key: 'workforce', name: 'Future-Ready Workforce' },
    { key: 'cohesion', name: 'Cohesive Society' },
    { key: 'life', name: 'Quality of Life' },
    { key: 'environment', name: 'Environmental Sustainability' },
    { key: 'government', name: 'Government Excellence' }
  ].map(p => ({ ...p, icon: SID.icons[p.key] }));

  /* Story photos in the repo (resized from gradient-generator/themes). Other
     stories try their 2025 media path, which only exists on the deployed site. */
  const PHOTOS = {
    'january-6': 'ai-01-quantum-computing', 'february-4': 'ai-02-web-summit', 'september-4': 'ai-03-ai-ethics',
    'october-9': 'ai-04-wcmq-ai-conference', 'july-august-5': 'ai-05-cmu-q', 'march-9': 'ai-06-menaml-winter-school',
    'january-1': 'education-01-international-day-of-education', 'may-1': 'education-02-convocation-ceremony',
    'may-3': 'education-03-pue-graduation', 'march-4': 'education-04-qf-reyada', 'october-4': 'education-05-pue-forum',
    'june-7': 'education-06-chess-tournament',
    'january-7': 'precision-health-01-sidra-medicine', 'march-7': 'precision-health-02-wcmq-students',
    'september-8': 'precision-health-03-wish-utokyo', 'june-8': 'precision-health-04-precision-medicine-conference',
    'january-8': 'precision-health-05-qbri-researcher', 'may-9': 'precision-health-06-wish-osaka-expo',
    'january-2': 'social-progress-01-jadal-summit', 'january-10': 'social-progress-02-ability-friendly',
    'april-3': 'social-progress-03-bilaraby', 'june-10': 'social-progress-04-herfah', 'october-7': 'social-progress-05-lawh-wa-qalam',
    'february-10': 'social-progress-06-volunteering',
    'april-1': 'sustainability-01-earthna-summit', 'april-2': 'sustainability-02-earthna-idris-elba',
    'july-august-6': 'sustainability-03-earthna-mangroves', 'march-3': 'sustainability-04-garangao',
    'october-3': 'sustainability-05-earthna-qatari-diar', 'january-3': 'sustainability-06-king-charles-sustainability'
  };

  const stories = ((window.YIR && window.YIR.stories) || []).map(s => {
    const month = s.month.toLowerCase().replace(/\s*&\s*/, '-');
    return {
      ...s,
      photo: PHOTOS[s.id] ? `v4/img/stories/${PHOTOS[s.id]}.jpg` : (s.hero ? encodeURI(s.hero) : null),
      href: `../months/${month}-option-a-modal.html#chapter-${s.chapter}`
    };
  });

  const themeHref = (t, story) => `v4-theme.html?t=${t.slug}${story ? '#' + story : ''}`;

  return { THEMES, PRIORITIES, stories, themeHref };
})();
