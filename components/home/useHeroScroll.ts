'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useHeroScroll(hero: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = hero.current;
    if (!root) return;

    const media = gsap.matchMedia();
    media.add('(min-width: 800px) and (prefers-reduced-motion: no-preference)', () => {
      let timeline: gsap.core.Timeline | undefined;
      const start = () => {
        if (root.dataset.phase !== 'complete' || timeline) return;
        timeline = gsap.timeline({
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: .85 },
        })
          .fromTo('.kolkata img', { yPercent: 0, scale: 1 }, { yPercent: 8, scale: 1.12, ease: 'none' }, 0)
          .to('.introduction', { y: -22, ease: 'none' }, 0)
          .to('.portrait img', { y: -11, ease: 'none' }, 0);
      };
      const context = gsap.context(start, root);
      const observer = new MutationObserver(() => context.add(start));
      observer.observe(root, { attributes: true, attributeFilter: ['data-phase'] });
      return () => {
        observer.disconnect();
        context.revert();
      };
    });
    return () => media.revert();
  }, [hero]);
}
