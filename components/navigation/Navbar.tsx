'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { sections, type NavLabel } from './sections';

const scrollSections = ['home', 'about', 'projects', 'journey'] as const;

const links = [
  { slug: 'home', href: '/', label: 'Home' },
  ...Object.entries(sections).map(([slug, label]) => ({ slug, href: `/${slug}/`, label })),
];

export default function Navbar({ active, continuous = false }: { active: NavLabel; continuous?: boolean }) {
  const [current, setCurrent] = useState<string>('home');
  const header = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!continuous) return;
    const panels = [...scrollSections, 'contact'].map((id) => document.getElementById(id));
    const updateCurrent = () => {
      const readingLine = (header.current?.offsetHeight ?? 0) + window.innerHeight * .24;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const visible = panels.findLast((panel) => panel && panel.getBoundingClientRect().top <= readingLine);
      setCurrent(atBottom ? (panels.at(-1)?.id ?? 'journey') : visible?.id ?? 'home');
    };
    updateCurrent();
    window.addEventListener('scroll', updateCurrent, { passive: true });
    window.addEventListener('resize', updateCurrent);
    return () => {
      window.removeEventListener('scroll', updateCurrent);
      window.removeEventListener('resize', updateCurrent);
    };
  }, [continuous]);

  return (
    <header ref={header} className="navbar" data-scrolled={continuous && current !== 'home'} onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    }}>
      <a className="brand" href={continuous ? "#home" : "/"} aria-label="Debdutta Ghosh home">DG<span>.</span></a>
      <button
        ref={menuButton}
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        {open ? 'Close' : 'Menu'}
      </button>
      <nav id="site-navigation" className="site-nav" data-open={open} aria-label="Main navigation">
        {links.map(({ slug, href, label }) => {
          const isScrollSection = scrollSections.some((section) => section === slug);
          const local = continuous && isScrollSection;
          const destination = isScrollSection ? `${continuous ? '' : '/'}#${slug}` : href;
          const selected = continuous ? current === slug : label === active;
          return (
            <a key={slug} href={destination} aria-current={selected ? (local ? 'location' : 'page') : undefined} onClick={() => setOpen(false)}>
              {label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
