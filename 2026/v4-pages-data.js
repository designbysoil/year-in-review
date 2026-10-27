/* 2026 Year in Review — content for the theme and national priority pages
   (v4-theme.html, v4-priority.html), opened from the long page's Themes and
   National Priorities sections.

   Copy is DRAFT. Theme chapters and figures are from the five 2025 Impact
   Templates; priority evidence is from 05_national_impact_mapping.md; the
   theme × priority strengths are its matrix (3.2). Story-to-priority tagging
   is derived below from each story's keywords and summary, pending the
   editorial field CONTENT-SPEC.md asks for. Loads after data.js. */
window.YIRP = (() => {
  'use strict';

  /* order and slugs follow the long page */
  const THEMES = [
    { slug: 'artificial-intelligence', key: 'ai', name: 'Artificial Intelligence', img: 'theme-1.jpg', pool: 'ai',
      key_line: 'Building artificial intelligence in Arabic, and the people who will govern it.',
      intro: 'Qatar Foundation’s focus on artificial intelligence is designed to drive innovation and positive transformation: enhancing teaching and learning, improving prevention, diagnosis and treatment, supporting city planning and economic development, and promoting the Arabic language and ethics.',
      achieved: 'In 2025, our key areas of achievement in Artificial Intelligence included <strong>modelling how AI can be human-centred and used responsibly</strong>, guided by values and ethics; <strong>developing breakthrough practical applications of AI</strong> that are improving healthcare, enhancing learning, building environmental resilience and powering social and economic development; and <strong>shaping Qatar’s trajectory to become a world leader in AI and quantum computing</strong>.',
      stats: [['400bn', 'words of Arabic behind Fanar, Qatar’s own language model'], ['11', 'tech products and solutions developed by QSTP companies and startups'], ['40', 'AI research projects conducted by HBKU with partners in Qatar and abroad'], ['800+', 'people engaged in QSTP entrepreneurial programmes']],
      chapters: [
        { title: 'Strategic leadership in AI', body: [
          'QF is demonstrating how AI can be used in innovative, responsible and transformative ways across education, the environment, healthcare and society, while safeguarding the wellbeing of the children growing up with it. At the WISE 12 Summit, a unified national task force on child and adolescent digital addiction was launched, chaired by Her Excellency Sheikha Hind bint Hamad Al Thani, Vice Chairperson of Qatar Foundation.',
          'Hamad Bin Khalifa University hosted ‘AI Ethics: The Convergence of Technology and Diverse Moral Traditions’, and was awarded a UNESCO Chair on Digital Technologies and Human Behavior for 2025 to 2029. HBKU’s Qatar Center for Quantum Computing inaugurated Qatar’s first quantum computing laboratory, and convened more than 200 international experts at Quantum.Tech Doha.'] },
        { title: 'Education and capacity-building', body: [
          'WISE published five research reports and a policy brief on AI in education, from pre-school to university. Carnegie Mellon University in Qatar launched the country’s first Bachelor of Science in Artificial Intelligence, and Northwestern University in Qatar added a minor in AI and media.',
          'For professionals, HEC Paris, Doha and Mastercard launched the Mastercard Fellowship Program in Artificial Intelligence, equipping executives and public-sector leaders with practical AI skills.'] },
        { title: 'AI in health and society', body: [
          'Sidra Medicine helped develop an AI tool that predicts the risk of Type 1 Diabetes from microRNA signals in blood, published in Nature Medicine using data from more than 2,800 people. Weill Cornell Medicine-Qatar introduced an AI platform that personalises treatment plans inside a secure, closed-data system.',
          'QCRI released Fanar 2.0, Qatar’s sovereign Arabic large language model. It runs in a fully closed system, so government agencies can use AI without their data ever circulating. NUMUe, built on Fanar with Arabic-language teachers, brings AI-assisted Modern Standard Arabic into the classroom.'] }
      ] },
    { slug: 'precision-health', key: 'health', name: 'Precision Health', img: 'theme-2.jpg', pool: 'precision-health',
      key_line: 'Medicine that fits the patient, built on a genomic record of this population.',
      intro: 'Qatar Foundation’s focus on precision health gives Qatar and its people access to advanced prevention, diagnosis and treatment that is personalised and effective, built on genomic data that answers Qatar’s own healthcare needs.',
      achieved: 'In 2025, our key areas of achievement in precision health included <strong>the development of genome maps of the Middle East and North Africa</strong>; advances in <strong>health screening</strong> from newborns to adults, <strong>prevention</strong> and <strong>clinical treatment</strong>; and <strong>embedding genomics as a core competency in education</strong>.',
      stats: [['35,000', 'genomic data records released from Qatar to date'], ['900+', 'cardiovascular patients given pharmacogenomics-guided care'], ['90%', 'of prediabetic patients kept from progressing to diabetes'], ['5,600+', 'school students in genomic education programmes']],
      chapters: [
        { title: 'Leadership in genomics research', body: [
          'A study published in Nature Genetics built complete genetic sequences for five underrepresented Middle East and North Africa populations, the first accurate genome maps from the region. Supported by Sidra Medicine, the Qatar Precision Health Institute and the Qatar Research, Development and Innovation Council, it puts the region’s genomic diversity into international databases.',
          'QPHI contributed to a landmark study of genomic programmes in seven countries, published in The American Journal of Human Genetics. Weill Cornell Medicine-Qatar and WISH published Qatar’s model of cancer care in Lancet Oncology as an example of global excellence.'] },
        { title: 'Innovation in healthcare delivery', body: [
          'Sidra Medicine and Arbor Biotechnologies launched the first gene-editing therapy platform to treat rare diseases unique to Qatar and the region. Sidra also completed Qatar’s first paediatric stem cell transplantation, so children with complex conditions can be treated at home, and opened a dedicated Clinical Trial Unit.',
          'With Hamad Medical Corporation, QPHI is running two newborn-screening programmes on custom genotyping arrays, and completed a pilot of point-of-care pharmacogenetic testing for cardiac patients that reduced adverse drug reactions and hospitalisations.'] },
        { title: 'Integrating genomics into national education', body: [
          'For the third consecutive year, QPHI and the Ministry of Education and Higher Education expanded genomics education across Qatar’s elementary schools, supporting the decision to make genomics a core competency in the National Strategic Knowledge Skills framework.',
          'Genome Heroes, QPHI’s bilingual educational game, won the GCC’s 2025 Digital Government Award for Best Purposeful Digital Game.'] }
      ] },
    { slug: 'progressive-education', key: 'education', name: 'Progressive Education', img: 'theme-3.jpg', pool: 'education',
      key_line: 'The long work of building a system that teaches itself, in Arabic, at every level.',
      intro: 'Qatar Foundation provides education that is culturally relevant, locally rooted and globally connected, from early childhood through higher education and lifelong learning, balancing global best practice with Qatari heritage and values.',
      achieved: 'In 2025, our key areas of achievement in progressive education included <strong>expanding learning pathways</strong> for children of all abilities; <strong>strengthening national and international partnerships</strong>; nurturing <strong>student leadership</strong> and <strong>academic and professional development</strong>; and <strong>aligning evidence and policy</strong> to reinforce education systems in Qatar and beyond.',
      stats: [['8,600+', 'students enrolled in K-12 education across 12 QF schools'], ['1,000+', 'graduates from 70+ university programmes'], ['1,100+', 'students awarded scholarships or financial aid'], ['500+', 'alumni placed in jobs or internships']],
      chapters: [
        { title: 'Holistic and inclusive education pathways', body: [
          'Pre-University Education’s 2040 strategy introduced an Islamic Civilization curriculum, expanded Qatar Academy Sidra and Renad Academy, and integrated the Military Secondary School with Qatar Leadership Academy with the Ministry of Defence. Early childhood services were unified under Juthoor.',
          'Warif Academy opened with the Ministry of Education and Higher Education and the Ministry of Public Health as a model for students with complex disabilities. Awsaj Academy’s Prime Program graduated its fifth cohort, and Renad Academy was recognised by the UK’s National Autistic Society.'] },
        { title: 'Higher education that drives transformation', body: [
          'Seven international partner universities and Hamad Bin Khalifa University added programmes the market is asking for: HBKU undergraduate engineering, Qatar’s first Bachelor of Science in AI at CMU-Q, a BFA in Kinetic Imaging at VCUarts Qatar, and new executive tracks at HEC Paris, Doha.',
          'With the International Labour Organization, QF is connecting higher-education outcomes to workforce policy, building on its Alumni Impact Study. New alumni chapters and forums in London, Doha and New York widened the network.'] },
        { title: 'Thought leadership for education systems', body: [
          'The WISE 12 Summit brought more than 4,000 participants from 100 countries together under ‘Humanity.io: Human Values at the Heart of Education’, and awarded the WISE Prize for Education to six solutions from Qatar, Chile, the USA, Nigeria, Jordan and Armenia.',
          'The new WISE Education Index measures education systems beyond access and literacy, including early development, wellbeing, workforce readiness and lifelong learning, to inform better policy.'] }
      ] },
    { slug: 'sustainability', key: 'sustainability', name: 'Sustainability', img: 'theme-4.jpg', pool: 'sustainability',
      key_line: 'Putting the coast back, and the knowledge that manages it.',
      intro: 'Qatar Foundation promotes sustainability in Qatar and beyond through programmes that protect and restore the environment while balancing economic development and public wellbeing: clean energy, resource security, climate monitoring and a circular economy.',
      achieved: 'In 2025, our key areas of achievement in sustainability included <strong>integrating traditional practices with modern innovation</strong>; <strong>building global networks</strong> that unite regions facing shared environmental challenges; and <strong>positioning Qatar as a regional hub for climate innovation</strong> in energy, water and agriculture.',
      stats: [['5.3M', 'kWh of renewable energy generated at QF'], ['80%+', 'of total waste recycled at QF'], ['20,000+', 'students in Eco-Schools across 22 Green Flag schools'], ['$1.8M', 'Gates Foundation grant to HBKU for dryland food security']],
      chapters: [
        { title: 'Advancing sustainable practices', body: [
          'The Earthna Summit 2025 explored ‘Building Our Legacy: Sustainability, Innovation and Traditional Knowledge’, and the inaugural Earthna Prize went to four projects, from water conservation in Cameroon to fisheries restoration across several regions.',
          'Earthna launched the Arid Cities Network for arid and semi-arid cities, and partnered with Qatari Diar and UN-Habitat on urban green space and a mangrove restoration guide that other arid cities can follow.'] },
        { title: 'Local implementation to boost resilience', body: [
          'HBKU leads the SMART Distribution Project with bNovate Technologies and Kahramaa, giving real-time data on water quality across Qatar’s supply. QEERI and Switzerland’s Swiss Technology Innovation Center are developing solar modules built for extreme heat and dust.',
          'QEERI is also building monitoring tools for hydroponic and aquaponic farms and a Farm Sustainability Index, in support of the National Food Security Strategy 2030.'] },
        { title: 'Leadership for a green economy', body: [
          'Earthna announced the Blue Economies for Coastal Resilience programme, the first of its kind in the region, and signed a Joint Declaration with UNIDO alongside the publication ‘Industrial Policies for Diversification in Qatar’.',
          'At the Qatar National Dialogue on Climate Change, QSTP startups QKONS, Werover and AlgaQ showed climate technology built here, from circular waste platforms to AI-powered wind turbines and carbon-capturing microalgae.'] }
      ] },
    { slug: 'social-progress', key: 'social', name: 'Social Progress', img: 'theme-5.jpg', pool: 'social-progress',
      key_line: 'Social progress is measured by who is included, not by how many attended.',
      intro: 'A nation’s progress is measured by its cultural and social development as well as its economy. Social progress at Qatar Foundation reinforces a values-based society, rooted in heritage and identity, while advancing inclusion, ethics and social cohesion.',
      achieved: 'In 2025, our key areas of achievement in social progress included <strong>cultural and linguistic preservation</strong>, safeguarding Arabic as a pillar of identity and an engine of creativity; <strong>nurturing children and youth into active, values-driven citizens</strong> while shaping policies that <strong>strengthen family wellbeing</strong>; and <strong>inclusivity and global leadership</strong> for people of all needs and abilities.',
      stats: [['27,500+', 'students worldwide in QFI Arabic-language programmes'], ['29,000', 'students taking part in QatarDebate programmes'], ['5', 'DIFI family-policy recommendations implemented nationally'], ['3M+', 'visitors across Education City activations']],
      chapters: [
        { title: 'Cultural heritage and the Arabic language', body: [
          'QF positions Arabic as a language of creativity and innovation. BilAraby held its first summit and won Gold for Best Use of the Arabic Language at the MEPRA Awards 2025. With the University of Granada, QF named the first winners of the Radwa Ashour Award for Arabic Literature.',
          'The Al-Mujadilah Center and Mosque for Women won Fast Company’s 2025 Innovation by Design Award, and a new Academic Chair of Arab Studies with Spain’s Reina Sofía School of Music brought Arabic music into academic exchange.'] },
        { title: 'Child, youth and family development', body: [
          'More than 1,000 students attended the inaugural QIYADA assembly on Islamic identity and ethical leadership. QatarDebate, with the Ministry of Sports and Youth and the Ministry of Foreign Affairs, supported Qatari youth at the UN ECOSOC Youth Forum.',
          'Five policy recommendations by the Doha International Family Institute were implemented by national stakeholders, including the Roblox ban, a Digital Safety Committee for children, a family curriculum piloted in public schools, and new marriage and maternity provisions in the Civil Human Resources Law.'] },
        { title: 'Inclusivity: a society for all', body: [
          'QF launched its ten-year Autism Strategy and, at the 80th UN General Assembly, the Global Autism Advocacy Coalition with the State of Qatar, the World Health Organization, UNICEF and Autism Speaks.',
          'Through Circle In, with Education Above All and the International Olympic Committee, QF is supporting sport-for-good projects in seven countries for women and girls, people with disabilities and people from marginalised backgrounds.'] }
      ] }
  ];

  const PRIORITIES = [
    { slug: 'sustainable-economic-growth', key: 'growth', name: 'Sustainable Economic Growth', img: 'priority-1.jpg',
      key_line: 'We turn research into companies, and train the people who run them.',
      via: 'through research, the companies that come out of that research, and the people trained to run them',
      what: 'We turn research into companies. Qatar Science and Technology Park incubates startups and takes them to market, Hamad Bin Khalifa University supplies much of the research behind them, and our industry partnerships give both somewhere to land. This year that work ran from Fanar, Qatar’s own Arabic language model, to the Qatar Center for Quantum Computing and the ventures that reached Web Summit Qatar.',
      why: 'Qatar’s economy is diversifying, and that depends on companies being founded here rather than attracted from elsewhere. It depends equally on research the country owns and on people trained to commercialise it. Most of this work shows its result years after the year in which it was done, which is why it is recorded here as well as counted.',
      stats: [['40%', 'of Qatar’s published research is QF-affiliated'], ['50%+', 'of the country’s patented technology'], ['11', 'tech products shipped from QSTP']],
      evidence: ['2,700+ publications and 19 patents, with collaborations across 120+ countries.', 'QSTP: 11 tech products shipped, 800+ people in entrepreneurship programmes, and climate-tech startups QKONS, Werover and AlgaQ.', 'Qatar’s first quantum computing laboratory, and 200+ international experts at Quantum.Tech Doha.', 'Sidra Medicine × Arbor Biotechnologies: private global capital entering Qatari biomedicine.', 'Earthna × UNIDO: ‘Industrial Policies for Diversification in Qatar’.'] },
    { slug: 'fiscal-sustainability', key: 'fiscal', name: 'Fiscal Sustainability', img: 'priority-2.jpg',
      key_line: 'Prevention is the most fiscally conservative policy a state can buy.',
      via: 'through prevention: disease caught early, treatment that works the first time, and resources the country no longer has to import',
      what: 'Our contribution here is cost avoided. Qatar Diabetes Association clinics keep prediabetic patients from progressing, pharmacogenetic testing puts cardiac patients on the right drug the first time, and newborn screening catches risk at birth. Alongside the clinics, research on water, food and energy reduces what Qatar has to buy from abroad.',
      why: 'Every condition prevented is decades of treatment the state does not pay for, and every resource produced at home is an exposure it no longer carries. This is the quietest of the seven outcomes, because what it saves never appears on a bill. It is recorded here so the saving is counted.',
      stats: [['90%', 'of prediabetic patients kept from progressing to diabetes'], ['900+', 'cardiac patients on personalised, lower-risk treatment'], ['250+', 'newborns screened for risk at birth']],
      evidence: ['90% of prediabetic patients prevented from progressing to diabetes; almost 50% of diabetic patients improved their control.', 'Pharmacogenetic testing in cardiac care reduced adverse drug reactions and hospitalisations across 900+ patients.', 'Newborn screening (QScan and the PanArab Array): risk caught at birth costs a fraction of disease managed for a lifetime.', 'Food, water and energy resilience work reduces import dependence and exposure.'] },
    { slug: 'future-ready-workforce', key: 'workforce', name: 'Future-Ready Workforce', img: 'priority-3.jpg',
      key_line: 'A graduate pipeline aligned to the sectors Qatar is building.',
      via: 'through its schools, its universities and the programmes that carry graduates into work',
      what: 'We educate the people Qatar’s economy will need, from early years to executive education. In 2025 our universities added degrees the market is asking for, including Qatar’s first Bachelor of Science in Artificial Intelligence, undergraduate engineering at HBKU and new executive tracks at HEC Paris, Doha, while the Alumni Office and the Mehnaty and Al Meydan programmes carried students into jobs.',
      why: 'A diversified economy needs a workforce that is ready before the jobs arrive. Our graduates now map onto the clusters Qatar is building, from ICT and AI to health and sustainability, and our partnership with the International Labour Organization turns alumni data into national labour-market policy.',
      stats: [['1,000+', 'graduates from 70+ programmes this year'], ['11,000+', 'university graduates over 30 years'], ['500+', 'alumni placed into jobs and internships']],
      evidence: ['1,000+ graduates from 70+ programmes; 600+ high-school graduates advancing.', 'About 100 ICT and AI graduates, about 100 in biology, health and medicine, 160+ in sustainability fields and 560+ in business, humanities and arts.', 'New programmes: Qatar’s first BS in AI (CMU-Q), HBKU undergraduate engineering, Kinetic Imaging (VCUarts Qatar), HEC Paris executive tracks.', '1,100+ scholarships; 350+ students in Mehnaty and Al Meydan work programmes.', 'Awsaj Prime’s fifth cohort graduated students once unable to finish school into work and higher education.'] },
    { slug: 'cohesive-society', key: 'cohesion', name: 'Cohesive Society', img: 'priority-4.jpg',
      key_line: 'Arabic, identity and family, carried into policy and the classroom.',
      via: 'through the Arabic language, programmes rooted in identity and faith, and research on the family that becomes policy',
      what: 'We treat Arabic as living infrastructure, from Fanar 2.0 and the NUMUe classroom platform to BilAraby and Qatar Foundation International’s programmes worldwide. Al-Mujadilah, QIYADA and the new Islamic Civilization curriculum carry identity and faith into modern form, and Doha International Family Institute research reached national policy.',
      why: 'A society holds together when its language, values and families are strong, and when everyone can take part. In 2025 five DIFI recommendations were implemented nationally, and the Autism Strategy and Global Autism Advocacy Coalition made inclusion a national value Qatar now exports.',
      stats: [['27,500+', 'students worldwide in QFI Arabic programmes'], ['29,000', 'students taking part in QatarDebate'], ['3M+', 'visitors to Education City']],
      evidence: ['Arabic as living infrastructure: Fanar 2.0, NUMUe in classrooms, BilAraby (Gold, MEPRA 2025), the Radwa Ashour Award, 28 original Arabic compositions by Qatar Philharmonic.', 'Identity and faith in modern form: Al-Mujadilah Center and Mosque for Women; the Islamic Civilization curriculum; QIYADA (1,000+ students).', 'Five DIFI recommendations implemented nationally, including the Digital Safety Committee, a piloted family curriculum and extended maternity leave.', '160+ Doha Debates ambassadors from 40+ countries.', 'A ten-year Autism Strategy, and the Global Autism Advocacy Coalition launched at UNGA80 with WHO and UNICEF.'] },
    { slug: 'quality-of-life', key: 'life', name: 'Quality of Life', img: 'priority-5.jpg',
      key_line: 'Children with complex conditions treated at home, not abroad.',
      via: 'through healthcare that reaches patients in Qatar first, and through sport, culture and inclusion in daily life',
      what: 'Sidra Medicine, the Qatar Precision Health Institute and Weill Cornell Medicine-Qatar bring treatments to Qatar that used to mean a flight abroad: gene therapy, paediatric stem cell transplantation and gene editing for rare diseases unique to the region. Beyond the clinic, Education City’s sport, culture and inclusion programmes reach millions of visitors a year.',
      why: 'Quality of life is measured by what a family no longer has to leave home for. Care designed for this population, from genome maps to newborn screening, means treatment fits the patient rather than being borrowed from somewhere else.',
      stats: [['45+', 'children treated with gene therapy since 2022'], ['35,000', 'genomic records released for research'], ['2,900+', 'patients receiving free diabetes supplies']],
      evidence: ['Qatar’s first paediatric stem cell transplantation at Sidra Medicine.', 'An AI tool predicting Type 1 Diabetes before symptoms, in Nature Medicine, from 2,800+ people’s data.', 'The first complete genome maps of five MENA populations, in Nature Genetics.', 'A gene-editing therapy platform (Sidra × Arbor) for rare diseases, and a new Clinical Trial Unit.', 'Qatar’s cancer-care model published in Lancet Oncology as a global exemplar.'] },
    { slug: 'environmental-sustainability', key: 'environment', name: 'Environmental Sustainability', img: 'priority-6.jpg',
      key_line: 'Solutions built for a hot, arid climate, proven on our own campus.',
      via: 'through Earthna’s policy and convening work, research built for a hot and arid climate, and a campus that tests both',
      what: 'Earthna speaks for hot and arid places: the Earthna Prize, the Arid Cities Network and the region’s first Blue Economies for Coastal Resilience programme. HBKU and QEERI build the hard technology, from solar modules for heat and dust to real-time water monitoring with Kahramaa, and Education City runs on what they prove.',
      why: 'Qatar’s climate is the climate much of the world is heading towards. Solutions designed and tested here protect water, food and energy at home, and give Qatar something to offer the arid regions that face the same pressures.',
      stats: [['125,000+', 'seedlings collected to restore forty hectares of coastline'], ['5.3M', 'kWh of renewable energy generated in Education City'], ['20,000+', 'students in Eco-Schools programmes']],
      evidence: ['Earthna Prize (four global projects), the Arid Cities Network, and Blue Economies for Coastal Resilience.', 'A $1.8M Gates Foundation grant to HBKU for dryland food security.', 'QEERI × Swiss Technology Innovation Center solar modules; SMART water-quality monitoring with Kahramaa; a Farm Sustainability Index.', 'QF as a living demonstration: 5.3M+ kWh renewable energy, 80%+ waste recycled, 80–90% of landscaping and cooling water recycled.', '22 Eco-School Green Flag schools, 2,900+ teachers, and 4,200+ students through Green Island.'] },
    { slug: 'government-excellence', key: 'government', name: 'Government Excellence', img: 'priority-7.jpg',
      key_line: 'Research that lands as national policy.',
      via: 'through evidence that becomes policy, and through digital infrastructure government can run on',
      what: 'We run an evidence-to-policy pipeline. Doha International Family Institute recommendations became national policy, genomics became a core competency in the national curriculum with the Ministry of Education and Higher Education, and WISE’s new Education Index is changing how systems are measured. Fanar’s closed system lets agencies use AI without their data leaving Qatar.',
      why: 'Institutions that decide on evidence decide better. QF is not adjacent to government but interleaved with it: Defence, Education, Public Health, Communications, Sports and Youth and Foreign Affairs all appear in this year’s stories, alongside Kahramaa, Qatari Diar and Hamad Medical Corporation.',
      stats: [['5', 'family-policy recommendations implemented nationally'], ['6+', 'ministries working inside QF’s stories this year'], ['7', 'countries in our genomics-policy study']],
      evidence: ['Five DIFI policies implemented, including the Digital Safety Committee for children and youth.', 'Genomics adopted as a core competency in the national curriculum, with the Ministry of Education and Higher Education.', 'A national task force on child digital addiction, chaired by Her Excellency Sheikha Hind bint Hamad Al Thani.', 'The WISE Education Index, and a seven-country genomics-policy study in The American Journal of Human Genetics.', 'Fanar 2.0: sovereign AI infrastructure agencies can run without sharing data.'] }
  ];

  /* 05_national_impact_mapping.md §3.2 — 0 none, 1 some, 2 strong, 3 core */
  const MATRIX = {
    education:      { growth: 1, fiscal: 0, workforce: 3, cohesion: 2, life: 1, environment: 1, government: 2 },
    health:         { growth: 2, fiscal: 3, workforce: 2, cohesion: 1, life: 3, environment: 0, government: 2 },
    ai:             { growth: 3, fiscal: 1, workforce: 2, cohesion: 2, life: 2, environment: 1, government: 3 },
    sustainability: { growth: 2, fiscal: 2, workforce: 1, cohesion: 1, life: 1, environment: 3, government: 2 },
    social:         { growth: 1, fiscal: 0, workforce: 1, cohesion: 3, life: 2, environment: 0, government: 2 }
  };
  const STRENGTH = ['', 'Contributes', 'Strong contribution', 'Core contribution'];

  /* Provisional story → priority tagging (see CONTENT-SPEC.md, ask 3). */
  const RULES = {
    growth:      { kw: ['innovation', 'entrepreneurship', 'startups', 'quantum computing', 'artificial intelligence', 'digital transformation', 'cybersecurity'], re: /startup|QSTP|industr|patent|commerciali|investor|Web Summit|drug discovery|Stars of Science/i },
    fiscal:      { kw: ['food security', 'water security'], re: /diabet|prevent|screening|cost/i },
    workforce:   { kw: ['higher education', 'scholarships', 'teacher training', 'entrepreneurship'], re: /graduat|degree|alumni|career|internship|teacher|executive|master's|bachelor|programs? (launched|in)|leadership development/i },
    cohesion:    { kw: ['arabic language', 'heritage', 'culture', 'debate', 'volunteerism', 'community development', "women's empowerment", 'philanthropy'], re: /identity|islam|faith|family|ramadan|eid|values|ethic/i },
    life:        { kw: ['healthcare access', 'precision medicine', 'genomics', 'clinical research', 'public health', 'mental health', 'disability inclusion', 'special needs education', 'sport'], re: /patient|therap|autism|transplant|surgery|wellbeing/i },
    environment: { kw: ['sustainability', 'climate adaptation', 'conservation', 'biodiversity', 'water security', 'food security'], re: /mangrove|climate|zero-waste|renewable|solar/i },
    government:  { kw: ['policy'], re: /policy|ministry|government|national strategy|task force|roadmap/i }
  };

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
    const text = `${s.title} ${s.summary} ${(s.partners || []).join(' ')}`;
    const kws = s.keywords || [];
    const priorities = Object.keys(RULES).filter(k => kws.some(x => RULES[k].kw.includes(x)) || RULES[k].re.test(text));
    const month = s.month.toLowerCase().replace(/\s*&\s*/, '-');
    return {
      ...s, priorities,
      photo: PHOTOS[s.id] ? `v4/img/stories/${PHOTOS[s.id]}.jpg` : (s.hero ? encodeURI(s.hero) : null),
      href: `../months/${month}-option-a-modal.html#chapter-${s.chapter}`
    };
  });

  const themeHref = t => `v4-theme.html?t=${t.slug}`;
  const priorityHref = p => `v4-priority.html?p=${p.slug}`;

  return { THEMES, PRIORITIES, MATRIX, STRENGTH, stories, themeHref, priorityHref };
})();
