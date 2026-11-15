'use client';

import { Children, useLayoutEffect, useRef, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './journal.module.css';

gsap.registerPlugin(ScrollTrigger);

const readingPositions = [1.87, 2.88, 3.9];
const chapterIds = ['identity', 'toolkit', 'beyond-code'];
const bookDuration = 4.48;
const firstTurn = 2.04;
const secondTurn = 3.07;

function animateNote(intro: HTMLElement) {
  const note = intro.querySelector<HTMLElement>('[data-journal-note]')!;
  const tape = intro.querySelector<HTMLElement>('[data-journal-tape]')!;
  let inView = false;
  let flight = false;
  let last = 0;
  const spring = { angle: 0, angularVelocity: 0, lift: 0, liftVelocity: 0, elapsed: 0, next: 4.45 };
  const tick = (time: number) => {
    if (!inView || document.hidden || flight) { last = time; return; }
    const dt = Math.min(.05, last ? time - last : 1 / 60);
    last = time;
    const steps = Math.max(1, Math.ceil(dt * 240));
    for (let i = 0; i < steps; i++) {
      const h = dt / steps;
      spring.elapsed += h;
      if (spring.elapsed >= spring.next) {
        spring.angularVelocity += .34 + Math.random() * .12;
        spring.liftVelocity += 6.5;
        spring.next += 4.15 + Math.random() * .75;
      }
      // The taped top edge is the pivot; gravity and damping settle the note.
      spring.angularVelocity += (-44 * Math.sin(spring.angle) - 4.1 * spring.angularVelocity) * h;
      spring.angle += spring.angularVelocity * h;
      spring.liftVelocity += (-95 * spring.lift - 13 * spring.liftVelocity) * h;
      spring.lift += spring.liftVelocity * h;
    }
    note.style.transform = `perspective(780px) translateY(${(-Math.max(0, spring.lift) * 10).toFixed(2)}px) rotateZ(${(spring.angle * 180 / Math.PI).toFixed(2)}deg) rotateX(${(Math.max(0, spring.lift) * 8).toFixed(2)}deg)`;
    note.style.setProperty('--note-lift', Math.max(0, spring.lift).toFixed(3));
  };
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
  });
  observer.observe(note.parentElement!);
  gsap.ticker.add(tick);

  return {
    setFlight(value: boolean) {
      if (value === flight) return;
      flight = value;
      if (!flight) {
        gsap.set(note, { clearProps: 'all' });
        gsap.set(tape, { clearProps: 'all' });
        spring.angle = spring.angularVelocity = spring.lift = spring.liftVelocity = 0;
      }
    },
    dispose() {
      observer.disconnect();
      gsap.ticker.remove(tick);
    },
  };
}

export default function JournalMotion({ intro, children, leftPages }: { intro: ReactNode; children: ReactNode; leftPages: ReactNode[] }) {
  const journal = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = journal.current;
    if (!root) return;
    const scene = root.querySelector<HTMLElement>('[data-journal-scene]')!;
    const introduction = root.querySelector<HTMLElement>('[data-journal-sheet]')!;
    const noteElement = introduction.querySelector<HTMLElement>('[data-journal-note]')!;
    const introCopy = introduction.querySelector<HTMLElement>('[data-journal-intro-copy]')!;
    const tape = introduction.querySelector<HTMLElement>('[data-journal-tape]')!;
    const notebook = root.querySelector<HTMLElement>('[data-notebook]')!;
    const binding = root.querySelector<HTMLElement>('[data-notebook-binding]')!;
    const cover = root.querySelector<HTMLElement>('[data-notebook-cover]')!;
    const bookNavigation = root.querySelector<HTMLElement>('[data-notebook-navigation]')!;
    const leaves = [...root.querySelectorAll<HTMLElement>('[data-notebook-leaf]')];
    const panels = leaves.map((leaf) => leaf.querySelector<HTMLElement>('[data-page-panel]')!);
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-notebook-step]')];
    const counter = root.querySelector<HTMLElement>('[data-notebook-count]')!;
    const openLink = root.querySelector<HTMLAnchorElement>('[data-journal-open]')!;

    const media = gsap.matchMedia();
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      reduced: '(prefers-reduced-motion: reduce)',
      spread: '(min-width: 760px)',
    }, ({ conditions }) => {
      const motion = Boolean(conditions?.motion);
      const spread = Boolean(conditions?.spread);
      let active = -2;
      let focusPage: number | undefined;
      const magnifiers = [...root.querySelectorAll<SVGElement>(`.${styles.magnifier}`)];
      const inspection = motion && spread ? gsap.timeline({ paused: true, repeat: -1, repeatDelay: .8 })
        .to(magnifiers, { x: 17, y: -12, rotation: 9, duration: 2.1, ease: 'sine.inOut' })
        .to(magnifiers, { x: 19, y: -13, duration: .65 })
        .to(magnifiers, { x: -16, y: 21, rotation: -7, duration: 2.4, ease: 'sine.inOut' })
        .to(magnifiers, { x: -16, y: 21, duration: .75 })
        .to(magnifiers, { x: 0, y: 0, rotation: 0, duration: 2.2, ease: 'sine.inOut' }) : undefined;
      let inView = false;
      const updateInspection = () => {
        if (inView && active === 0 && !document.hidden) inspection?.play();
        else inspection?.pause();
      };
      const visibility = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        updateInspection();
      });
      visibility.observe(scene);
      document.addEventListener('visibilitychange', updateInspection);

      notebook.dataset.notebookReady = motion ? 'motion' : 'reduced';
      const showPage = (page: number) => {
        if (page === active) return;
        active = page;
        updateInspection();
        notebook.dataset.notebookPage = String(page + 1);
        const previousFocus = document.activeElement;
        const moveFocus = panels.some((panel, index) => index !== page && panel.contains(previousFocus));
        panels.forEach((panel, index) => {
          panel.inert = index !== page;
          panel.setAttribute('aria-hidden', String(index !== page));
        });
        buttons[0].disabled = page <= 0;
        buttons[1].disabled = page < 0 || page >= leaves.length - 1;
        counter.textContent = `Page ${Math.max(1, page + 1)} of ${leaves.length}`;
        if (page >= 0 && (moveFocus || focusPage === page)) {
          focusPage = undefined;
          panels[page].querySelector<HTMLElement>('[tabindex="-1"]')?.focus({ preventScroll: true });
        } else if (moveFocus) {
          openLink.focus({ preventScroll: true });
        }
      };

      const note = motion ? animateNote(introduction) : undefined;
      const film = gsap.timeline({ paused: true, onUpdate: () => {
        const time = film.time();
        note?.setFlight(time > .01);
        showPage(time >= 3.76 ? 2 : time >= 2.73 ? 1 : time >= (motion ? 1.73 : .16) ? 0 : -1);
        introduction.style.pointerEvents = time < .75 ? 'auto' : 'none';
        notebook.style.pointerEvents = time >= (motion ? 1.73 : .16) ? 'auto' : 'none';
        bookNavigation.style.pointerEvents = time >= (motion ? 1.73 : .16) ? 'auto' : 'none';
        notebook.setAttribute('aria-hidden', String(time < (motion ? 1.73 : .16)));
      } });
      film.to({}, { duration: bookDuration }, 0);
      if (motion) {
        film.to(tape, { x: 27, y: -19, rotationY: 40, rotationX: -76, rotation: '+=30', opacity: 0, duration: .25, ease: 'power2.inOut' }, .02)
          .to(noteElement, { y: -16, rotationX: 8, '--note-lift': 1.2, duration: .23, ease: 'power2.out' }, .12)
          .to(noteElement, { x: () => scene.clientWidth * .43, y: () => -scene.clientHeight * .36, rotation: '+=48', rotationY: 24, rotationX: 19, scale: .85, duration: .33, ease: 'sine.inOut' }, .33)
          .to(noteElement, { x: () => scene.clientWidth * 1.14, y: () => -scene.clientHeight * .9, rotation: '+=82', rotationY: -25, rotationX: -12, scale: .68, opacity: 0, duration: .37, ease: 'power2.in' }, .66)
          .to(introCopy, { opacity: 0, duration: .22, ease: 'sine.inOut' }, .52)
          .to(introduction, { opacity: 0, duration: .29, ease: 'sine.inOut' }, .73)
          .fromTo(notebook, { opacity: 0, y: 23 }, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' }, .69)
          .fromTo(cover, { rotationY: 0 }, { rotationY: -179.4, duration: .72, ease: 'power2.inOut' }, .99)
          .to(cover, { '--cover-shadow': .5, duration: .36, yoyo: true, repeat: 1, ease: 'sine.inOut' }, .99)
          .fromTo(bookNavigation, { opacity: 0 }, { opacity: 1, duration: .18, ease: 'sine.out' }, 1.66);
        if (spread) film.fromTo(binding, { xPercent: -25 }, { xPercent: 0, duration: .72, ease: 'power2.inOut' }, .99);
        [firstTurn, secondTurn].forEach((start, index) => {
          const leaf = leaves[index];
          film.to(leaf, { rotationY: -179.2, z: index * 2, duration: .69, ease: 'power2.inOut' }, start)
            .to(leaf, { '--turn-shade': spread ? .42 : .26, '--paper-bend': '18%', '--curl-lift': '11px', '--curl-angle': '14deg', z: 16 + index, duration: .345, ease: 'sine.inOut' }, start)
            .set(leaf, { zIndex: 8 + index }, start + .35)
            .to(leaf, { '--turn-shade': 0, '--paper-bend': '55%', '--curl-lift': '0px', '--curl-angle': '0deg', z: index * 2, duration: .345, ease: 'sine.inOut' }, start + .345);
        });
      } else {
        film.to(introduction, { opacity: 0, duration: .15 }, .02)
          .fromTo(notebook, { opacity: 0 }, { opacity: 1, duration: .15 }, .02)
          .fromTo(bookNavigation, { opacity: 0 }, { opacity: 1, duration: .15 }, .02);
        [firstTurn, secondTurn].forEach((start, index) => {
          film.set(leaves[index], { rotationY: -179.2, z: index * 2, zIndex: 8 + index }, start + .69);
        });
      }
      showPage(-1);
      notebook.setAttribute('aria-hidden', 'true');

      const trigger = ScrollTrigger.create({
        trigger: scene,
        animation: film,
        start: () => `top top+=${(document.querySelector<HTMLElement>('.navbar')?.offsetHeight ?? 0) + 8}`,
        end: () => `+=${Math.round(window.innerHeight * (motion ? (spread ? .82 : .68) * bookDuration : 1.5))}`,
        pin: true,
        scrub: motion ? .36 : true,
        invalidateOnRefresh: true,
      });
      void document.fonts.ready.then(() => { if (scene.isConnected) ScrollTrigger.refresh(); });

      let clickScroll: gsap.core.Tween | undefined;
      let commandedPage: number | undefined;
      const goTo = (page: number, instant = false) => {
        commandedPage = page;
        const progress = readingPositions[page] / bookDuration;
        const destination = Math.round(trigger.start + (trigger.end - trigger.start) * progress);
        clickScroll?.kill();
        if (!motion || instant) { window.scrollTo({ top: destination, behavior: 'instant' }); commandedPage = undefined; }
        else {
          const scroll = { y: window.scrollY };
          clickScroll = gsap.to(scroll, { y: destination, duration: Math.min(2.5, Math.max(1.5, Math.abs(destination - scroll.y) / 640)), ease: 'power1.inOut', onUpdate: () => window.scrollTo(0, scroll.y), onComplete: () => { commandedPage = undefined; clickScroll = undefined; } });
        }
      };
      const cancelClickScroll = () => { clickScroll?.kill(); clickScroll = undefined; commandedPage = undefined; };
      const enter = (page: number, hash: string) => {
        if (location.hash !== hash) history.pushState(null, '', hash);
        focusPage = page;
        goTo(page);
        if (active === page) {
          focusPage = undefined;
          panels[page].querySelector<HTMLElement>('[tabindex="-1"]')?.focus({ preventScroll: true });
        }
      };

      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const target = event.target as Element;
        const step = target.closest<HTMLButtonElement>('[data-notebook-step]');
        if (step) {
          if (step.disabled) return;
          goTo(Math.max(0, Math.min(leaves.length - 1, (commandedPage ?? active) + Number(step.dataset.notebookStep))));
          return;
        }

        const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
        if (!link || !introduction.contains(link)) return;
        const page = chapterIds.indexOf(link.hash.slice(1));
        if (page < 0) return;
        event.preventDefault();
        enter(page, link.hash);
      };
      const followHash = () => {
        const page = chapterIds.indexOf(location.hash.slice(1));
        if (page >= 0) goTo(page, true);
      };
      const startingHash = location.hash;
      let initialFrame = 0;
      let disposed = false;
      const restoreChapter = () => {
        if (!chapterIds.includes(startingHash.slice(1))) return;
        void document.fonts.ready.then(() => {
          if (disposed) return;
          initialFrame = requestAnimationFrame(() => {
            initialFrame = requestAnimationFrame(() => {
              if (location.hash === startingHash) followHash();
            });
          });
        });
      };
      if (document.readyState === 'complete') restoreChapter();
      else window.addEventListener('load', restoreChapter, { once: true });
      root.addEventListener('click', onClick);
      window.addEventListener('hashchange', followHash);
      window.addEventListener('wheel', cancelClickScroll, { passive: true });
      window.addEventListener('touchstart', cancelClickScroll, { passive: true });

      return () => {
        visibility.disconnect();
        document.removeEventListener('visibilitychange', updateInspection);
        inspection?.kill();
        note?.dispose();
        clickScroll?.kill();
        disposed = true;
        cancelAnimationFrame(initialFrame);
        window.removeEventListener('load', restoreChapter);
        root.removeEventListener('click', onClick);
        window.removeEventListener('hashchange', followHash);
        window.removeEventListener('wheel', cancelClickScroll);
        window.removeEventListener('touchstart', cancelClickScroll);
        delete notebook.dataset.notebookReady;
        delete notebook.dataset.notebookPage;
        notebook.removeAttribute('aria-hidden');
        panels.forEach((panel) => {
          panel.inert = false;
          panel.removeAttribute('aria-hidden');
        });
      };
    }, root);

    return () => {
      media.revert();
    };
  }, []);

  return (
    <div className={styles.journal} ref={journal}>
      <div className={styles.experience} data-journal-scene>
        {intro}
        <div className={styles.book} data-notebook role="region" aria-label="About notebook">
        <div className={styles.binding} data-notebook-binding>
          <div className={styles.spread}>
            <div className={styles.leftPaper} data-notebook-left aria-hidden="true"><div className={styles.leftPageContent}>{leftPages[0]}</div></div>
            {Children.map(children, (chapter, index) => (
              <div className={styles.leaf} style={{ zIndex: 4 - index }} data-notebook-leaf>
                <div className={styles.leafFront}>
                  <div className={styles.pagePanel} data-page-panel>{chapter}</div>
                </div>
                <div className={styles.leafBack} aria-hidden="true">
                  {leftPages[index + 1] && <div className={styles.leftPageContent}>{leftPages[index + 1]}</div>}
                  {Array.from({ length: 5 }, (_, segment) => <span className={styles.curveStrip} key={segment} style={{ left: `${segment * 20}%` }} />)}
                </div>
              </div>
            ))}
            <div className={styles.lid} data-notebook-cover aria-hidden="true">
              <div className={styles.lidFront}>
                <div className={styles.coverBorder}>
                  <span className={styles.coverMonogram}>DG.</span>
                  <span className={styles.coverRule} />
                  <span className={styles.coverTitle}>ABOUT ME</span>
                  <span className={styles.coverEdition}>01—03</span>
                </div>
              </div>
              <div className={styles.lidBack}><div className={styles.leftPageContent}>{leftPages[0]}</div></div>
            </div>
          </div>
        </div>
        <nav className={styles.bookNavigation} data-notebook-navigation aria-label="Notebook pages">
          <button type="button" data-notebook-step="-1" disabled><ArrowLeft size={16} aria-hidden="true" /> Previous Page</button>
          <span aria-live="polite" data-notebook-count>Page 1 of 3</span>
          <button type="button" data-notebook-step="1">Next Page <ArrowRight size={16} aria-hidden="true" /></button>
        </nav>
        </div>
      </div>
    </div>
  );
}
