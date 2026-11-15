type MilestoneLink = { label: string; href: string };

export type Milestone = {
  id: string;
  sortDate: string;
  date: string;
  year: string;
  category: string;
  title: string;
  summary: string;
  detail: string;
  facts?: readonly string[];
  links?: readonly MilestoneLink[];
  image?: { src: string; alt: string; width: number; height: number; caption: string; position?: string };
};

export const milestones: readonly Milestone[] = [
  {
    id: 'education-2023', sortDate: '2023-01-01',
    date: '2023', year: '2023', category: 'Education',
    title: 'Started my B.Tech',
    summary: 'Institute of Engineering & Management, Kolkata.',
    detail: 'I began studying Computer Science and Engineering with a focus on IoT, Cyber Security, and Blockchain. My degree is in progress.',
  },
  {
    id: 'iem-internship-2025', sortDate: '2025-05-01',
    date: 'May–July 2025', year: '2025', category: 'Internship',
    title: 'Research Intern at IEM',
    summary: 'Worked on evaluating hallucinations in language models.',
    detail: 'I worked on evaluation pipelines and a hybrid verification approach for examining where language-model outputs were unsupported.',
  },
  {
    id: 'winter-pitchfest-2026', sortDate: '2026-01-17',
    date: 'Jan 17–18, 2026', year: '2026', category: 'Hackathon',
    title: '2nd Place — Winter Pitchfest',
    summary: 'Built AuditEase, an AI-powered contract analysis tool that identifies compliance risks, highlights problematic clauses, and suggests clearer, compliant alternatives.',
    detail: 'Placed second at Winter Pitchfest with AuditEase.',
    image: { src: '/images/journey/auditease.webp', alt: 'Screenshot of the AuditEase website showing its contract analysis landing page', width: 1400, height: 673, caption: 'AuditEase · interface' },
    links: [
      { label: 'Hackathon', href: 'https://winter-pitchfest.devpost.com/' },
      { label: 'AuditEase Live Demo', href: 'https://audit-ease-eco.vercel.app/' },
    ],
  },
  {
    id: 'smart-geyser-patent-2026', sortDate: '2026-05-08',
    date: 'May 8, 2026', year: '2026', category: 'Patent',
    title: 'Smart Geyser Patent Application Published',
    summary: 'Our patent application for an environment-triggered smart geyser system was published. It uses environmental and body-temperature sensor readings to adapt water heating and cooling while aiming to improve energy efficiency.',
    detail: 'Published patent application; this is not a granted patent.',
    facts: [
      'Environment Triggered Smart Geyser System with Adaptive Temperature Control and Energy Optimization',
      'Patent application no. 202631052229',
    ],
    image: { src: '/images/journey/smart-geyser.webp', alt: 'Photograph of the smart geyser prototype with sensors, wiring, control boards, and fans', width: 765, height: 666, caption: 'Smart geyser · prototype', position: 'center 42%' },
    links: [{ label: 'View Patent Post', href: 'https://lnkd.in/p/dTt667Yh' }],
  },
  {
    id: 'comsys-2026', sortDate: '2026-06-24',
    date: 'Jun 24–26, 2026', year: '2026', category: 'Research',
    title: 'Paper Presentation — COMSYS 2026',
    summary: "Presented our research on optimizing Kolkata's ferry network using a Hybrid Dueling Deep Q-Network, exploring how reinforcement learning can improve transportation efficiency.",
    detail: 'Jal Netra: Ferry Optimization System',
    facts: ['7th International Conference on Frontiers in Computing and Systems (COMSYS 2026).'],
    image: { src: '/images/journey/jal-netra.webp', alt: 'Illustration of a Kolkata ferry with the Jal Netra ferry optimization system title', width: 1400, height: 781, caption: 'Jal Netra · concept illustration', position: 'center 45%' },
    links: [{ label: 'View Research Post', href: 'https://lnkd.in/p/dRkX7rHi' }],
  },
].sort((a, b) => a.sortDate.localeCompare(b.sortDate));
