'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import FinalIntroduction from './FinalIntroduction';
import KolkataBackground from './KolkataBackground';
import useHeroScroll from './useHeroScroll';
import { OpeningScenes, SceneProgress } from './OpeningScenes';

export default function PortfolioHero({ resume }: { resume: string | null }) {
  const hero = useRef<HTMLElement>(null);
  useHeroScroll(hero);

  useLayoutEffect(() => {
    const root = hero.current;
    if (!root) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const intro = root.querySelector<HTMLElement>('[data-introduction]')!;

    const showIntroduction = () => {
      intro.inert = false;
      root.dataset.phase = 'complete';
    };

    let timeline: gsap.core.Timeline;
    const context = gsap.context(() => {
      timeline = gsap.timeline({ paused: true, onComplete: showIntroduction });
      const summaryLetters = root.querySelectorAll('[data-summary-letter]');
      const compact = window.matchMedia('(max-width: 760px)').matches;
      const flightDistance = (index: number) => .38 + ((index * 17) % 23) / 35;
      const roles = ['student', 'developer', 'explorer'];
      const exit = (role: string, at: number) => {
        timeline.to(`[data-role="${role}"]`, { y: -10, autoAlpha: 0, duration: .32, ease: 'power2.in' }, at);
      };
      const enter = (role: string, label: string, fromSide = false) => {
        const scene = `[data-role="${role}"]`;
        const from = fromSide ? { clipPath: 'inset(0 0 0 100%)', x: 14, autoAlpha: 0 } :
          { yPercent: 80, autoAlpha: 0 };
        const to = fromSide ? { clipPath: 'inset(0 0 0 0%)', x: 0 } : { yPercent: 0 };

        timeline.set(scene, { y: 0, autoAlpha: 1 }, label)
          .fromTo(`${scene} [data-word]`, from, { ...to, autoAlpha: 1, duration: .62, ease: 'power3.out', immediateRender: false }, label)
          .fromTo(`${scene} [data-role-stroke]`, { scaleX: 0 }, { scaleX: 1, duration: .55, ease: 'power2.out', immediateRender: false }, `${label}+=.24`)
          .set('[data-progress]', { opacity: .3 }, label)
          .set(`[data-progress="${role}"]`, { opacity: 1 }, label);
      };

      timeline.addLabel('student', .51)
        .addLabel('developer', 1.91)
        .addLabel('explorer', 3.32)
        .addLabel('introduction', 4.87)
        .set('[data-role]', { autoAlpha: 0, y: 0 }, 0)
        .set('[data-role-stroke]', { scaleX: 0 }, 0)
        .set('[data-introduction]', { autoAlpha: 0 }, 0)
        .set('[data-heading-line]', { yPercent: 105, autoAlpha: 0 }, 0)
        .set('[data-name-stroke]', { scaleX: 0 }, 0)
        .set(summaryLetters, { opacity: 0 }, 0)
        .set('[data-action]', { y: 12, autoAlpha: 0 }, 0)
        .set('[data-kolkata]', { opacity: 1 }, 0)
        .set('[data-portrait]', { autoAlpha: 0, x: -18 }, 0);

      enter('student', 'student');
      exit('student', 1.59);
      enter('developer', 'developer');
      exit('developer', 3);
      enter('explorer', 'explorer');
      exit('explorer', 4.55);

      timeline.to('[data-portrait]', { autoAlpha: 1, x: 0, duration: .72, ease: 'power2.out' }, 'introduction')
        .to('[data-kolkata]', { opacity: .58, duration: 1, ease: 'sine.inOut' }, 'introduction')
        .set('[data-introduction]', { autoAlpha: 1 }, 'introduction')
        .to('[data-heading-line]', { autoAlpha: 1, yPercent: 0, duration: .63, stagger: .12, ease: 'power3.out' }, 'introduction')
        .to('[data-name-stroke]', { scaleX: 1, duration: .54, ease: 'power2.out' }, 'introduction+=.42')
        .fromTo(summaryLetters, {
          x: (index: number) => Math.cos(index * 2.4) * flightDistance(index) * (compact ? 65 : 155),
          y: (index: number) => Math.sin(index * 2.4) * flightDistance(index) * (compact ? 54 : 100),
          rotation: (index: number) => ((index * 13) % 31) - 15,
          opacity: 0,
        }, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.52,
          stagger: .018,
          ease: 'back.out(1.05)',
          immediateRender: false,
          clearProps: 'transform,opacity',
        }, 'introduction+=.98')
        .to('[data-action]', { autoAlpha: 1, y: 0, duration: .45, stagger: .1, ease: 'power2.out' }, '>+.08');
    }, root);

    const finish = () => {
      timeline.progress(1, true).pause();
      showIntroduction();
    };
    const start = () => {
      try {
        sessionStorage.setItem('portfolio-home-intro-seen', '1');
      } catch {
        // The intro can still run if browser storage is unavailable.
      }
      intro.inert = true;
      timeline.pause(0, true);
      root.dataset.phase = 'opening';
      timeline.play();
    };

    const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    let seen = false;
    try {
      seen = sessionStorage.getItem('portfolio-home-intro-seen') === '1';
    } catch {
      // Treat a fresh load as unseen if browser storage is unavailable.
    }
    const opensHome = !location.hash || location.hash === '#home';
    const shouldPlay = opensHome && (!seen || navigation?.type === 'reload')
      && !motion.matches && !root.contains(document.activeElement);
    const updateMotion = () => { if (motion.matches) finish(); };
    motion.addEventListener('change', updateMotion);

    if (shouldPlay) start();
    else finish();

    return () => {
      context.revert();
      intro.inert = false;
      delete root.dataset.phase;
      motion.removeEventListener('change', updateMotion);
    };
  }, []);

  return (
    <section id="home" ref={hero} className="portfolio-hero" aria-label="Introduction">
      <KolkataBackground />
      <OpeningScenes />
      <FinalIntroduction resume={resume} />
      <SceneProgress />
    </section>
  );
}
