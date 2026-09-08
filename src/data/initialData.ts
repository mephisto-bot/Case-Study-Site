import { CaseStudy, TopicModule, UpcomingSession, FAQItem, Testimonial } from '../types';
import { getUpcomingWednesdayFormatted, getPastWednesdayStr } from '../utils/dateHelpers';

export const initialUpcomingSession: UpcomingSession = {
  weekTitle: "WEEK 19 • UPCOMING SESSION",
  badgeText: "NEXT WEDNESDAY",
  topicTitle: "Mindset & Problem Framing",
  dateStr: getUpcomingWednesdayFormatted(),
  description: "Discover how to approach complex corporate challenges by re-framing the problem before jumping to solutions. A critical first step in any successful case study.",
  detailedOverview: "Most teams fail not because they solve problems poorly, but because they solve the wrong problem. In this session, participants will analyze a high-stakes scenario where an early-stage startup misdiagnosed user churn, resulting in wasted capital. We will practice the 5-Whys framework, Root Cause Analysis, and First-Principles thinking to dissect ambiguous business problems.",
  facilitator: "CIH Mentorship Board & Guest Industry Strategist",
  time: "10:00 AM – 4:00 PM WAT",
  location: "Community Innovation Hub (Plot 104, 5th Avenue Abesan Estate, Ipaja, Lagos, Nigeria) • Strictly On-Site"
};

export const initialCaseStudies: CaseStudy[] = [
  {
    id: "the-elevator-pitch",
    title: "Case Study: The Elevator Pitch",
    subtitle: "Internal projects showcase by Hub Interns & ITs, and the digital debut of the CIH Case Study platform",
    sector: "Communication & Media",
    tagColor: "bg-orange-50 text-brand-orange border-orange-200",
    date: getPastWednesdayStr(0),
    weekNumber: 18,
    imageUrl: "/images/elevator-pitch-presenter.jpg",
    galleryImages: [
      "/images/elevator-pitch-presenter.jpg",
      "/images/elevator-pitch-audience.jpg",
      "/images/the-elevator-pitch-notes.jpg"
    ],
    videoUrl: "/videos/the-elevator-pitch.mp4",
    videoTitle: "Session Highlights: The Elevator Pitch & Case Study Web Debut",
    excerpt: "Held live at Community Innovation Hub, this session challenged interns and ITs to pitch their live projects in under 3 minutes, followed by the official presentation of the new CIH Case Study website.",
    fullContent: "In this high-energy session at Community Innovation Hub, the floor was handed over to the Hub's Interns and Industrial Trainees (ITs) to deliver rapid elevator pitches on their internal projects. Participants had to hook an audience in seconds, defend their problem-solving approaches, and answer rapid-fire questions from peers and mentors.\n\nFollowing the trainee presentations, Bilal took the stage to officially premiere the CIH Case Study Website project—demonstrating how turning this weekly Wednesday tradition into a dedicated digital platform serves as the new 'front door' for the Hub, welcoming both tech enthusiasts and aspiring youth looking for real-life mentorship, ethical grounding, and decision science.",
    keyTakeaways: [
      "The 3-Minute Hook: Structuring an elevator pitch with a compelling problem hook, value proposition, and actionable closing ask.",
      "Digital Front Door: How the new Case Study website bridges physical hub mentorship with wider community accessibility.",
      "Real-time Peer Feedback: Learning to absorb constructive critique and iterate on presentation delivery under time constraints.",
      "Ikigai & Decision Science: Aligning technical skills with authentic purpose and community impact."
    ],
    discussionQuestions: [
      "How do you distill months of technical implementation into a brief pitch that resonates with both technical and non-technical listeners?",
      "What elements are critical to ensure an online platform faithfully reflects the energy and values of an offline mentorship community?"
    ],
    featured: true
  },
  {
    id: "the-beautiful-ones",
    title: "Case Study: The Beautiful Ones",
    subtitle: "Character, integrity, and authentic youth leadership in modern society",
    sector: "Ethics & Leadership",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    date: getPastWednesdayStr(1),
    weekNumber: 17,
    imageUrl: "/images/cih-photo-1.jpg",
    galleryImages: [
      "/images/cih-photo-1.jpg",
      "/images/cih-photo-7.jpg",
      "/images/cih-photo-8.jpg"
    ],
    excerpt: "Recorded live at the CIH Main Hub, this case study dissects moral fortitude, personal branding, and peer accountability among young African leaders.",
    fullContent: "Inspired by Ayi Kwei Armah's classic theme, 'The Beautiful Ones' evaluates how young leaders maintain personal integrity, resist corruption, and cultivate authentic personal branding amidst societal pressures. Participants in the CIH hall engaged in breakout pods to analyze ethical dilemmas and build action frameworks for principled leadership.",
    keyTakeaways: [
      "Character vs Reputation: Why internal integrity outlasts superficial brand positioning.",
      "Navigating systemic peer pressure and upholding ethical boundaries in high-stakes environments.",
      "The role of youth mentorship in creating the next generation of uncorruptible African leaders."
    ],
    discussionQuestions: [
      "How can young professionals maintain unshakeable ethical standards when surrounding organizational culture is compromised?",
      "What concrete habits protect personal integrity in everyday decision-making?"
    ],
    featured: true
  },
  {
    id: "can-machines-think-turing",
    title: "Can Machines Think? Alan Turing's Legacy & AI Ethics",
    subtitle: "Exploring machine intelligence, human consciousness, and algorithmic responsibility",
    sector: "Tech & Artificial Intelligence",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    date: getPastWednesdayStr(2),
    weekNumber: 16,
    imageUrl: "/images/cih-photo-2.jpg",
    excerpt: "Inspired by Alan Turing's landmark 1950 paper and biography, this study examines the boundary between human cognition and artificial intelligence.",
    fullContent: "Alan Turing famously proposed the 'Imitation Game' to test whether machines could exhibit intelligent behavior indistinguishable from a human. In this case study, participants trace Turing's cryptographic triumphs at Bletchley Park and his foundational theories of computation. We analyze modern generative AI models against Turing's predictions, questioning what true understanding means and how ethical guardrails must evolve alongside autonomous systems.",
    keyTakeaways: [
      "Understanding the difference between syntactic pattern matching and true semantic comprehension.",
      "The historical impact of Alan Turing on modern computer science and cryptography.",
      "Ethical frameworks for AI deployment, bias mitigation, and human oversight."
    ],
    discussionQuestions: [
      "If an AI can pass the Turing Test in conversational fluency, does that constitute genuine thinking?",
      "How do we preserve human agency and empathy as artificial intelligence assumes decision-making roles?"
    ],
    featured: true
  },
  {
    id: "iq-vs-eq-leadership",
    title: "IQ vs EQ: Emotional Intelligence in High-Stakes Leadership",
    subtitle: "Why self-awareness and empathy outperform technical intellect in long-term success",
    sector: "Personal Growth & EQ",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    date: getPastWednesdayStr(2),
    weekNumber: 15,
    imageUrl: "/images/cih-photo-3.jpg",
    excerpt: "Dissecting the contrast between intellectual quotient (IQ) and emotional quotient (EQ) through real-world corporate crisis scenarios.",
    fullContent: "While technical intellect (IQ) gets your foot in the door, emotional intelligence (EQ)—comprising self-awareness, self-regulation, motivation, empathy, and social skill—determines executive success. Participants analyzed two contrasting leaders managing an organizational restructuring: one relying purely on analytical metrics, the other leveraging high EQ to align team morale and trust.",
    keyTakeaways: [
      "The 5 pillars of Emotional Intelligence: Self-awareness, Self-regulation, Motivation, Empathy, and Social Skills.",
      "High EQ leaders cultivate psychological safety, reducing team turnover during high-stress periods.",
      "Practical exercises to audit your emotional triggers and practice active empathy."
    ],
    discussionQuestions: [
      "In a technical team, how do you handle a brilliant programmer (high IQ) who displays low emotional intelligence with peers?",
      "Can EQ be systematically developed, or is it an innate personality trait?"
    ],
    featured: true
  },
  {
    id: "leadership-capacity-building",
    title: "Adaptive Leadership & Institutional Capacity Building",
    subtitle: "Building resilient organizations and empowering the next generation of changemakers",
    sector: "Ethics & Leadership",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    date: getPastWednesdayStr(3),
    weekNumber: 14,
    imageUrl: "/images/cih-photo-4.jpg",
    excerpt: "An exploration of adaptive leadership strategies that strengthen community institutions and build sustainable internal capacity.",
    fullContent: "Capacity building is about empowering individuals and organizations with the tools, processes, and mindset required to solve complex problems independently. This case study evaluated a non-profit initiative that scaled across West Africa by decentralizing leadership responsibilities and investing heavily in youth mentorship frameworks.",
    keyTakeaways: [
      "Distinguishing authority from true adaptive leadership.",
      "Frameworks for scaling organizational capacity without diluting core mission values.",
      "Mentorship pipelines as the primary engine for sustainable community impact."
    ],
    discussionQuestions: [
      "How do leaders transition from micromanagement to empowering autonomous teams?",
      "What indicators show that an organization has built self-sustaining internal capacity?"
    ],
    featured: true
  },
  {
    id: "financial-literacy-youth",
    title: "Financial Literacy & Wealth Preservation for Young Adults",
    subtitle: "Navigating budgeting, inflation, investment risks, and long-term capital independence",
    sector: "Finance & Life Skills",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    date: getPastWednesdayStr(3),
    weekNumber: 14,
    imageUrl: "/images/cih-photo-5.jpg",
    excerpt: "Practical financial literacy for early-career professionals, covering risk management, asset allocation, and economic resilience.",
    fullContent: "Financial independence requires more than earning income—it demands strategic money management, risk assessment, and understanding compound growth. Participants dissect financial decisions made by young entrepreneurs dealing with volatile exchange rates, impulse expenditure, investment scams, and emergency reserve planning.",
    keyTakeaways: [
      "The 50/30/20 budgeting rule adapted for emerging market realities.",
      "Differentiating high-risk speculative schemes from sustainable wealth-building assets.",
      "Building debt management strategies and inflation-hedged savings pools."
    ],
    discussionQuestions: [
      "How can young professionals build investment discipline amidst high inflation and cost-of-living pressures?",
      "What steps shield personal finances from sudden economic market shifts?"
    ],
    featured: true
  },
  {
    id: "public-speaking-effective-comm",
    title: "Mastering Public Speaking & Effective Communication",
    subtitle: "Articulating ideas with clarity, persuasive rhetoric, and poise under scrutiny",
    sector: "Communication & Media",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    date: getPastWednesdayStr(4),
    weekNumber: 13,
    imageUrl: "/images/cih-photo-6.jpg",
    excerpt: "Dissecting iconic speeches and crisis briefings to master non-verbal cues, vocal projection, and persuasive presentation skills.",
    fullContent: "Clear communication is a superpower in leadership. Attendees analyzed historic speeches, pitch presentations, and town hall Q&A sessions. The study breaks down how to structure compelling stories, overcome stage fright, and tailor technical messages for diverse audience demographics.",
    keyTakeaways: [
      "The Aristotelian triad of persuasion: Ethos (credibility), Pathos (emotion), and Logos (logic).",
      "Techniques to eliminate filler words, project confidence, and read audience body language.",
      "Structuring presentation decks using the Problem-Solution-Impact narrative curve."
    ],
    discussionQuestions: [
      "How do you regain composure when interrupted during a high-stakes keynote or board presentation?",
      "What separates informative speaking from truly persuasive, action-inspiring rhetoric?"
    ],
    featured: false
  },
  {
    id: "personal-branding-opportunities",
    title: "Personal Branding & Accessing Global Opportunities",
    subtitle: "Positioning your expertise, networking intentionally, and unlocking career pathways",
    sector: "Career & Personal Growth",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
    date: getPastWednesdayStr(5),
    weekNumber: 12,
    imageUrl: "/images/cih-photo-7.jpg",
    excerpt: "How young leaders and innovators can curate a compelling professional identity to attract international fellowships, jobs, and grants.",
    fullContent: "Opportunity is not distributed equally, but visibility amplifies access. This case study examines how individuals leverage digital portfolios, LinkedIn positioning, open-source contributions, and strategic networking to access global scholarships, venture capital, and career mentorship.",
    keyTakeaways: [
      "Defining your unique value proposition (UVP) as a professional or innovator.",
      "Strategic networking: building genuine relationships rather than transactional contacts.",
      "Optimizing your digital footprint for international selection committees and recruiters."
    ],
    discussionQuestions: [
      "Where is the boundary between authentic self-promotion and bragging?",
      "How can talent in underrepresented regions gain access to global remote opportunities?"
    ],
    featured: false
  },
  {
    id: "sdg-youth-impact",
    title: "Sustainable Development Goals (SDGs) & Social Impact",
    subtitle: "Designing community solutions aligned with the UN 2030 Sustainable Development Agenda",
    sector: "Social Impact & SDGs",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200",
    date: getPastWednesdayStr(6),
    weekNumber: 11,
    imageUrl: "/images/cih-photo-8.jpg",
    excerpt: "Case analysis of grassroots initiatives addressing SDG 4 (Quality Education), SDG 8 (Decent Work), and SDG 13 (Climate Action).",
    fullContent: "The United Nations SDGs serve as a blueprint for peace and prosperity. Participants analyzed youth-led social enterprises in developing nations that created sustainable revenue models while solving targeted SDG indicators, measuring both financial viability and social return on investment (SROI).",
    keyTakeaways: [
      "Mapping local community problems directly to UN SDG targets.",
      "Designing measurable impact metrics (SROI) for non-profit and social enterprise grant reporting.",
      "Collaborating with municipal agencies to scale grassroots civic solutions."
    ],
    discussionQuestions: [
      "How can local grassroot projects balance immediate economic survival with long-term climate action (SDG 13)?",
      "What role does youth innovation play in achieving Quality Education (SDG 4) in rural areas?"
    ],
    featured: false
  },
  {
    id: "mental-health-anti-bullying",
    title: "Mental Health Resilience & Overcoming Bullying Dynamics",
    subtitle: "Fostering psychological wellbeing, handling peer harassment, and workplace inclusion",
    sector: "Mental Health & Wellbeing",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    date: getPastWednesdayStr(7),
    weekNumber: 10,
    imageUrl: "/images/cih-photo-9.jpg",
    excerpt: "Addressing mental health stigmas, workplace bullying, emotional burnout, and building supportive peer circles.",
    fullContent: "Bullying, toxicity, and unaddressed mental health challenges erode personal growth and productivity. This case study analyzed institutional policies against bullying in educational and professional settings, while exploring personal coping strategies, therapeutic resources, and peer support systems.",
    keyTakeaways: [
      "Identifying subtle forms of relational aggression, cyberbullying, and workplace micro-aggressions.",
      "Building psychological resilience, boundaries, and seeking professional mental health support.",
      "Creating zero-tolerance institutional frameworks against harassment."
    ],
    discussionQuestions: [
      "What measures should organizations take to transform a toxic work or school culture into an inclusive environment?",
      "How can individuals protect their mental wellbeing when subjected to peer pressure or harassment?"
    ],
    featured: false
  },
  {
    id: "time-management-ideation",
    title: "Time Management, Deep Work & Structured Ideation",
    subtitle: "From creative brainstorming to disciplined execution without burnout",
    sector: "Personal Growth & Productivity",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    date: getPastWednesdayStr(8),
    weekNumber: 9,
    imageUrl: "/images/cih-photo-10.jpg",
    excerpt: "Combining creative ideation techniques like SCAMPER with rigorous time-blocking and focus frameworks.",
    fullContent: "Ideas are easy; execution is everything. In this session, participants combined creative ideation frameworks (Mind Mapping, SCAMPER, Crazy Eights) with time management discipline (Eisenhower Matrix, Time Blocking, Cal Newport's Deep Work rules) to transform abstract concepts into actionable 30-day execution plans.",
    keyTakeaways: [
      "The Eisenhower Matrix: Distinguishing Urgent tasks from Important goals.",
      "Structured Ideation frameworks: How to generate 50+ innovative solutions rapidly.",
      "Eliminating digital distractions and scheduling non-negotiable Deep Work blocks."
    ],
    discussionQuestions: [
      "Why do most ambitious projects stall during the transition from ideation to execution?",
      "How do you balance creative spontaneity with rigid time management schedules?"
    ],
    featured: false
  },
  {
    id: "urban-mobility",
    title: "Redefining Urban Mobility",
    subtitle: "Sustainable transport integration in metropolitan centers",
    sector: "Urban Planning",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    date: getPastWednesdayStr(9),
    weekNumber: 8,
    imageUrl: "/images/cih-photo-26.jpg",
    excerpt: "An analysis of sustainable transport integration in metropolitan areas, focusing on efficiency and environmental impact.",
    fullContent: "Rapid urbanization puts extraordinary strain on civic transit infrastructure. In this case study, participants examined a mid-sized metropolitan city attempting to merge micro-mobility e-scooters, bus rapid transit (BRT), and municipal rail into a unified contactless ticketing system.",
    keyTakeaways: [
      "Public-private partnerships require rigorous KPI alignment early on.",
      "User adoption hinges on low friction in digital interfaces for non-tech-savvy citizens."
    ],
    discussionQuestions: [
      "How should municipal leadership prioritize funding when high-density and low-income zones have competing transit needs?"
    ],
    featured: false
  },
  {
    id: "success-achievement-mindset",
    title: "Defining True Success: Beyond Superficial Accolades",
    subtitle: "Intrinsic motivation, perseverance, and long-term community legacy building",
    sector: "Personal Growth & EQ",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    date: getPastWednesdayStr(10),
    weekNumber: 7,
    imageUrl: "/images/cih-photo-27.jpg",
    excerpt: "Dissecting the psychological traps of vanity metrics and redefining success through personal mastery and community impact.",
    fullContent: "Society often measures success by external status symbols and social media applause. In this case study, participants analyzed high-performing founders who achieved financial wealth but suffered internal burnout versus leaders who built quiet, deeply impactful institutions.",
    keyTakeaways: [
      "Distinguishing vanity metrics (followers, superficial praise) from true legacy and mastery.",
      "Cultivating intrinsic motivation that withstands external criticism or temporary failure.",
      "Designing personal benchmarks for long-term health, financial security, and peace of mind."
    ],
    discussionQuestions: [
      "How do you redefine success when societal expectations conflict with your personal values?",
      "What daily habits safeguard your inner purpose from being hijacked by peer comparison?"
    ],
    featured: false
  },
  {
    id: "choice-effect-decision-paradox",
    title: "The Choice Effect: Decision Architecture & Sound Judgment",
    subtitle: "Navigating decision fatigue, trade-offs, and critical life trajectories",
    sector: "Cognitive Agility & Mindset",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    date: getPastWednesdayStr(11),
    weekNumber: 6,
    imageUrl: "/images/cih-photo-28.jpg",
    excerpt: "How small daily choices compound into life-altering outcomes, analyzing decision frameworks under uncertainty.",
    fullContent: "Every outcome in career and life is the cumulative result of micro-choices. In this session, attendees evaluated real-world scenarios where early career professionals faced critical crossroads: choosing short-term salary gains vs long-term skill acquisition, or immediate gratification vs deferred compound growth.",
    keyTakeaways: [
      "The Choice Architecture Framework: Simplifying complex options to prevent paralysis.",
      "Overcoming decision fatigue through automated daily routines and non-negotiable standards.",
      "Evaluating second- and third-order consequences of strategic life choices."
    ],
    discussionQuestions: [
      "When faced with two equally attractive opportunities, what principles guide your final choice?",
      "How can young professionals eliminate option paralysis when starting their careers?"
    ],
    featured: false
  },
  {
    id: "etiquette-social-protocol",
    title: "Professional Etiquette, Social Grace & Workplace Conduct",
    subtitle: "Corporate decorum, digital etiquette, emotional tact, and relationship building",
    sector: "Career & Leadership",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    date: getPastWednesdayStr(12),
    weekNumber: 5,
    imageUrl: "/images/cih-photo-29.jpg",
    excerpt: "Mastering executive presence, interpersonal decorum, networking etiquette, and cross-cultural communication protocols.",
    fullContent: "Technical competence opens doors, but professional etiquette determines how far you advance inside them. This case study breaks down corporate diplomacy, executive presentation, email decorum, boundary management, and social poise during high-stakes networking events.",
    keyTakeaways: [
      "The unspoken rules of corporate decorum: punctuality, active listening, and digital communication hygiene.",
      "Building trust through emotional tact, respecting boundaries, and resolving workplace friction quietly.",
      "Mastering networking etiquette: adding value to senior mentors rather than demanding immediate favors."
    ],
    discussionQuestions: [
      "How do you address unprofessional conduct in a colleague without damaging working relationships?",
      "What etiquette adjustments are critical when communicating across virtual vs in-person environments?"
    ],
    featured: false
  }
];

export const topicModules: TopicModule[] = [
  {
    id: "mindset",
    title: "Mindset & Problem Framing",
    theme: "Cognitive Agility & Mindset",
    category: "Cognitive Agility & Critical Thinking",
    iconName: "lightbulb",
    shortDescription: "Cultivating the analytical and resilient approach required for high-level problem solving.",
    fullOverview: "A resilient problem-solver breaks down ambiguity rather than freezing. In this module, attendees learn mental models, cognitive bias mitigation, and how to stay calm and structured when facing multi-variable real-world crises.",
    learningOutcomes: [
      "Master First-Principles Reasoning and the 5-Whys methodology",
      "Identify cognitive biases like sunk cost fallacy and confirmation bias",
      "Develop high emotional regulation during complex team debates"
    ],
    sampleCase: "Dissecting a multi-million-dollar supply chain collapse due to executive overconfidence.",
    duration: "2-Week Deep Dive",
    imageUrl: "/images/cih-photo-18.jpg"
  },
  {
    id: "career-ikigai",
    title: "Career & IKIGAI",
    theme: "Personal Growth & Life Skills",
    category: "Purpose & Strategic Trajectory",
    iconName: "briefcase",
    shortDescription: "Aligning professional ambition with personal purpose to build a sustainable career path.",
    fullOverview: "IKIGAI is the Japanese concept of finding the sweet spot where what you love, what you are good at, what the world needs, and what you can get paid for converge. We guide participants through structured self-audits and actionable career mapping.",
    learningOutcomes: [
      "Construct a personalized 4-quadrant IKIGAI matrix",
      "Bridge technical skills with real market demand in Nigeria and globally",
      "Create a 3-year career milestone blueprint with mentorship accountability"
    ],
    sampleCase: "Transitioning from hobbyist developer to high-impact engineering leadership.",
    duration: "3-Week Intensive",
    imageUrl: "/images/cih-photo-19.jpg"
  },
  {
    id: "health-wellbeing",
    title: "Health & Wellbeing",
    theme: "Personal Growth & Life Skills",
    category: "Sustainable High Performance",
    iconName: "shield",
    shortDescription: "Maintaining peak performance through physical and mental wellness strategies.",
    fullOverview: "Burnout is the silent killer of promising young talent. This module equips developers, entrepreneurs, and young leaders with habits for sleep optimization, boundary-setting, stress resilience, and long-term mental stamina.",
    learningOutcomes: [
      "Establish non-negotiable boundaries between deep work and recuperation",
      "Implement science-backed daily routines for cognitive focus",
      "Recognize early symptoms of psychological burnout in self and peers"
    ],
    sampleCase: "Analyzing an ultra-intense hackathon team that crashed before finals vs a paced team.",
    duration: "2-Week Module",
    imageUrl: "/images/cih-photo-20.jpg"
  },
  {
    id: "collaboration",
    title: "Collaboration & Team Dynamics",
    theme: "Ethics & Leadership",
    category: "Team Dynamics & Communication",
    iconName: "handshake",
    shortDescription: "Mastering team dynamics, effective communication, and cross-functional leadership.",
    fullOverview: "Great achievements are never individual feats. This module teaches active listening, conflict resolution, peer accountability, and how to communicate complex technical concepts to non-technical stakeholders.",
    learningOutcomes: [
      "Practice Radical Candor and the Situation-Behavior-Impact feedback loop",
      "Lead cross-functional discussions with empathy and decisive clarity",
      "Resolve team bottlenecks without escalating personal animosity"
    ],
    sampleCase: "Resolving a stalemate between a perfectionist design team and an urgent engineering sprint.",
    duration: "3-Week Workshop Series",
    imageUrl: "/images/cih-photo-21.jpg"
  },
  {
    id: "marketing",
    title: "Tech & AI Ethics",
    theme: "Tech & Artificial Intelligence",
    category: "Positioning & Tech Innovation",
    iconName: "megaphone",
    shortDescription: "Exploring Alan Turing's AI legacy, machine learning ethics, and digital positioning.",
    fullOverview: "Even the most brilliant technical product fails without understanding ethical AI implementation and positioning. This module introduces Turing test theory, generative AI guardrails, and storytelling for tech innovators.",
    learningOutcomes: [
      "Analyze machine learning ethics and algorithmic bias",
      "Understand Alan Turing's foundational computing principles",
      "Build an authentic digital tech presence to attract global opportunities"
    ],
    sampleCase: "Positioning a local civic tech app to gain adoption across 5,000 community members.",
    duration: "2-Week Intensive",
    imageUrl: "/images/cih-photo-22.jpg"
  },
  {
    id: "success-mastery",
    title: "Success & High Achievement",
    theme: "Personal Growth & Life Skills",
    category: "Personal Growth & Purpose",
    iconName: "lightbulb",
    shortDescription: "Redefining success, building intrinsic discipline, and creating lasting community impact.",
    fullOverview: "True success extends beyond vanity metrics and temporary applause. This module trains participants to build internal standards of excellence, resilience under pressure, and sustainable achievement habits.",
    learningOutcomes: [
      "Develop intrinsic motivation and high personal standards",
      "Construct a long-term personal legacy roadmap",
      "Balance ambition with personal wellbeing and ethics"
    ],
    sampleCase: "Evaluating founders who built resilient long-term enterprises vs short-lived hype.",
    duration: "2-Week Module",
    imageUrl: "/images/cih-photo-23.jpg"
  },
  {
    id: "choice-effect",
    title: "The Choice Effect",
    theme: "Cognitive Agility & Mindset",
    category: "Decision Science & Strategy",
    iconName: "layers",
    shortDescription: "Understanding decision architecture, overcoming choice overload, and making sound life choices.",
    fullOverview: "Choices shape character and trajectory. In this module, attendees explore behavioral decision theory, how to mitigate decision fatigue, and frameworks for choosing wisely at critical career intersections.",
    learningOutcomes: [
      "Apply Decision Tree analysis to high-stakes career crossroads",
      "Mitigate cognitive fatigue through automated routines",
      "Understand second- and third-order consequences of choices"
    ],
    sampleCase: "Navigating major career offers under tight deadlines and competing personal priorities.",
    duration: "2-Week Workshop",
    imageUrl: "/images/cih-photo-24.jpg"
  },
  {
    id: "etiquette-protocol",
    title: "Etiquette & Professional Decorum",
    theme: "Ethics & Leadership",
    category: "Executive Presence & Conduct",
    iconName: "handshake",
    shortDescription: "Mastering professional etiquette, corporate decorum, digital communication, and social grace.",
    fullOverview: "Professionalism is the key to unlocking trust and opportunity. This module covers corporate protocol, communication hygiene, digital decorum, emotional tact, and executive presence in multi-cultural environments.",
    learningOutcomes: [
      "Master corporate meeting etiquette and executive communication",
      "Practice digital decorum across email, Slack, and virtual briefings",
      "Build authentic professional relationships with senior leaders"
    ],
    sampleCase: "Handling a high-stakes corporate client meeting and negotiating contract parameters with poise.",
    duration: "2-Week Intensive",
    imageUrl: "/images/cih-photo-25.jpg"
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: "faq-1",
    category: "What is Case Study?",
    question: "What exactly is the CIH Case Study environment?",
    answer: "CIH Case Study is an immersive, interactive weekly session held every Wednesday at Community Innovation Hub. Participants dissect real-world scenarios across ethics, technology, leadership, finance, and career dilemmas through structured debate, peer collaboration, and mentorship guidance."
  },
  {
    id: "faq-2",
    category: "What is Case Study?",
    question: "Who is this program designed for?",
    answer: "The program is designed for two distinct audiences: (1) CIH Hub Members looking for deep-dive mentorship and project feedback, and (2) Outside attendees, students, young professionals, and creatives who want practical life skills, decision-making frameworks, and networking without needing a software background."
  },
  {
    id: "faq-3",
    category: "Logistics",
    question: "When and where do sessions take place?",
    answer: "Sessions take place every Wednesday from 10:00 AM to 4:00 PM (West Africa Time). They are hosted strictly on-site at Community Innovation Hub (Plot 104, 5th Avenue Abesan Estate, Ipaja, Lagos, Nigeria)."
  },
  {
    id: "faq-4",
    category: "Logistics",
    question: "Is there a cost to attend?",
    answer: "No, attending CIH Case Study sessions is completely free as part of CIH's mission to empower youth, developers, and community innovators with vital life skills and leadership mentorship."
  },
  {
    id: "faq-5",
    category: "Registration",
    question: "How do I register for a session?",
    answer: "Simply visit the Register page (/register) on this website, enter your Full Name, Email Address, and indicate whether you are an existing Hub Member or New Attendee. You will receive an instant confirmation and calendar invite."
  },
  {
    id: "faq-6",
    category: "Registration",
    question: "What is the registration deadline?",
    answer: "Registration remains open continuously. To guarantee your seat for a specific Wednesday session, we recommend registering at least 2 hours before the 10:00 AM kickoff."
  },
  {
    id: "faq-7",
    category: "Outcomes",
    question: "Do I receive a certificate?",
    answer: "Yes! Active participants who attend at least 8 consecutive weekly case studies and present during the capstone review receive a verified CIH Leadership & Critical Problem Solving Certificate."
  },
  {
    id: "faq-8",
    category: "Outcomes",
    question: "Can this lead to full hub membership?",
    answer: "Absolutely. Consistent engagement in Wednesday Case Studies is one of the premier pathways for outside attendees to gain priority consideration for full CIH hub residency, incubation programs, and startup grants."
  },
  {
    id: "faq-9",
    category: "What to Expect",
    question: "Do I need to do homework or read anything in advance?",
    answer: "Prior reading is not required! At the start of each session, a brief briefing document outlining the scenario and core dilemma is shared. You will work in small breakout groups to analyze the case together before presenting findings."
  },
  {
    id: "faq-10",
    category: "What to Expect",
    question: "Do I have to speak or present in front of everyone?",
    answer: "Participation is encouraging and supportive. You can start by listening and contributing within a 4-person breakout pod. As your confidence grows, you will have opportunities to represent your group in plenary discussions."
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Favour Adebayo",
    role: "Associate Product Manager & Tech Fellow",
    attendeeType: "CIH Alumni",
    initials: "FA",
    avatarUrl: "/images/cih-photo-1.jpg",
    quote: "CIH Case Study completely shifted how I approach career decisions. Breaking down real corporate dilemmas every Wednesday gave me the analytical confidence to ace my product leadership interviews.",
    highlight: "Gave me the analytical confidence to ace product leadership interviews",
    rating: 5,
    sessionTopic: "Adaptive Leadership & Problem Framing",
    cohort: "Cohort 14 Native",
    createdAt: "2026-08-15T10:00:00.000Z",
    featured: true
  },
  {
    id: "test-2",
    name: "Tunde Oladipo",
    role: "Undergraduate & Aspiring Founder",
    attendeeType: "GUEST",
    initials: "TO",
    avatarUrl: "/images/cih-photo-2.jpg",
    quote: "I came in as a first-time guest expecting a regular lecture, but the peer pod debates and 1-on-1 mentor guidance blew me away. I haven't missed a single Wednesday session since!",
    highlight: "The peer pod debates and 1-on-1 mentor guidance blew me away",
    rating: 5,
    sessionTopic: "Can Machines Think? Turing's Legacy",
    cohort: "Guest Participant",
    createdAt: "2026-08-20T14:30:00.000Z",
    featured: true
  },
  {
    id: "test-3",
    name: "Chisom Eze",
    role: "Software Engineer & Community Mentor",
    attendeeType: "CIH Alumni",
    initials: "CE",
    avatarUrl: "/images/cih-photo-3.jpg",
    quote: "The session on IQ vs EQ in high-stakes environments helped me resolve actual conflicts within our engineering team. The mentors here genuinely invest in your long-term character and growth.",
    highlight: "Helped me resolve actual team conflicts with high EQ frameworks",
    rating: 5,
    sessionTopic: "IQ vs EQ in High-Stakes Leadership",
    cohort: "Cohort 12 Alumni (Volunteer Mentor)",
    createdAt: "2026-08-25T09:15:00.000Z",
    featured: true
  },
  {
    id: "test-4",
    name: "Blessing Johnson",
    role: "Financial Analyst Intern",
    attendeeType: "Youth Fellow",
    initials: "BJ",
    avatarUrl: "/images/cih-photo-4.jpg",
    quote: "From financial literacy to ethical leadership, CIH Case Study is the single highest-return investment in yourself. The atmosphere is warm, electrifying, and deeply inspiring.",
    highlight: "The single highest-return weekly investment in yourself",
    rating: 5,
    sessionTopic: "Financial Literacy & Wealth Preservation",
    cohort: "Hub Member",
    createdAt: "2026-08-28T16:00:00.000Z",
    featured: true
  },
  {
    id: "test-5",
    name: "Damilola Bakare",
    role: "Frontend Developer & UI Specialist",
    attendeeType: "CIH Alumni",
    initials: "DB",
    avatarUrl: "/images/cih-photo-5.jpg",
    quote: "As an alumnus, coming back to facilitate pods and volunteer as a mentor keeps my skills sharp. Seeing new guests gain clarity and purpose every Wednesday is incredibly rewarding.",
    highlight: "Volunteering as an alumni mentor keeps skills sharp & impactful",
    rating: 5,
    sessionTopic: "Personal Branding & Authentic Opportunities",
    cohort: "Cohort 11 Alumni",
    createdAt: "2026-09-01T11:00:00.000Z",
    featured: true
  }
];
