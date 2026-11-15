export const sections = {
  about: 'About',
  projects: 'Projects',
  journey: 'Journey',
  contact: 'Contact',
} as const;

export type Section = keyof typeof sections;
export type NavLabel = 'Home' | (typeof sections)[Section];
