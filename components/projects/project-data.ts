export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: { src: string; alt: string; width: number; height: number };
  stack: readonly string[];
  demo?: string;
  repository?: string;
  references?: readonly { label: string; href: string }[];
};

export const projects: readonly Project[] = [
  {
    id: 'auditease', name: 'AuditEase', category: 'Contract analysis / Applied AI',
    description: 'An AI-assisted contract analysis tool that helps identify compliance risks and problematic clauses and suggests clearer alternatives.',
    image: { src: '/images/journey/auditease.webp', alt: 'AuditEase contract analysis application homepage', width: 1400, height: 673 },
    stack: ['Python', 'Natural language processing'], demo: 'https://audit-ease-eco.vercel.app/',
  },
  {
    id: 'ferry-optimisation', name: 'Ferry Optimisation System', category: 'Jal Netra / Research',
    description: 'A research-driven system exploring improvements to Kolkata’s ferry network using a Hybrid Dueling Deep Q-Network.',
    image: { src: '/images/journey/jal-netra.webp', alt: 'Jal Netra ferry optimisation system illustration', width: 1400, height: 781 },
    stack: ['Python', 'SimPy', 'Hybrid Dueling Deep Q-Network'],
    references: [{ label: 'Research post', href: 'https://lnkd.in/p/dRkX7rHi' }],
  },
  {
    id: 'smart-geyser', name: 'Smart Geyser', category: 'Sensor system / Published patent application',
    description: 'An environment-triggered smart geyser concept using sensor information for adaptive temperature control and energy optimization. Its related patent application has been published.',
    image: { src: '/images/journey/smart-geyser.webp', alt: 'Smart geyser prototype with sensors, electronics, and wiring', width: 765, height: 666 },
    stack: ['Arduino IDE', 'IoT', 'Sensor fusion'],
    references: [{ label: 'Patent post', href: 'https://lnkd.in/p/dTt667Yh' }],
  },
];
