'use client';

import { useLayoutEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPerspectiveRoad } from './perspective-road';
import { projects } from './project-data';
import ProjectSign from './ProjectSign';
import styles from './projects.module.css';

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  { world: 78, departure: 0, park: 2.02, reveal: .22, leave: 3.34 },
  { world: 174, departure: 2.9, park: 5.2, reveal: 3.35, leave: 6.63 },
  { world: 270, departure: 6.12, park: 8.6, reveal: 6.64, leave: 11 },
];
const roadsideDepth = 14;
const finish = 10;

export default function SelectedProjects({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? 'h2' : 'h1';
  const ProjectHeading = embedded ? 'h3' : 'h2';
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const held = useRef<number | null>(null);
  const release = useRef(0);
  const repaint = useRef<(() => void) | null>(null);

  const holdSign = (index: number, hold: boolean) => {
    if (!hold && held.current !== index) return;
    window.clearTimeout(release.current);
    if (hold) held.current = index;
    else {
      release.current = window.setTimeout(() => {
        held.current = null;
        repaint.current?.();
      }, 360);
    }
  };

  useLayoutEffect(() => {
    const pin = stage.current;
    if (!pin) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)', () => {
      const canvas = pin.querySelector<HTMLCanvasElement>('canvas')!;
      const road = createPerspectiveRoad(canvas);
      if (!road) return;

      const bridge = pin.querySelector<HTMLElement>('[data-route-bridge]')!;
      const boards = [...pin.querySelectorAll<HTMLElement>('[data-project-stop]')];
      const controls = [...pin.querySelectorAll<HTMLButtonElement>('[data-destination-control]')];
      const arrival = pin.querySelector<HTMLElement>('[data-arrival-text]')!;
      const rule = pin.querySelector<HTMLElement>('[data-arrival-rule]')!;
      const ride = { distance: 0 };
      let active = -2;
      let width = 0;
      let signWidth = 0;

      pin.dataset.ride = 'true';
      gsap.set(arrival, { autoAlpha: 0, yPercent: 90 });
      gsap.set(rule, { scaleX: 0 });

      const syncBoards = (index: number) => {
        if (active === index) return;
        active = index;
        pin.dataset.activeStop = String(index + 1);
        boards.forEach((board, i) => {
          board.inert = i !== index;
          board.toggleAttribute('data-visible', i === index);
          if (i === index) controls[i].setAttribute('aria-current', 'step');
          else controls[i].removeAttribute('aria-current');
        });
      };

      const film = gsap.timeline({ paused: true });
      const render = () => {
        road.draw(ride.distance);
        // Hold the sign in place so the reader can move from its face into the drawer.
        if (held.current !== null && held.current === active) return;

        const time = film.time();
        const index = destinations.findIndex(({ reveal, leave }) => time >= reveal && time < leave);
        syncBoards(index);
        if (index < 0) return;

        const { world, reveal, leave } = destinations[index];
        const { x, y, perspective } = road.project(Math.max(7, world - ride.distance), .58);
        const scale = Math.min(1.03, .12 + perspective * 1.91);
        const fadeIn = gsap.utils.clamp(0, 1, (time - reveal) / .48);
        const fadeOut = gsap.utils.clamp(0, 1, (leave - time) / .32);
        const screenX = gsap.utils.clamp(width * .55, width - signWidth * scale / 2 - 22, x);
        const board = boards[index];
        board.style.transform = `translate3d(${screenX}px,${y - 52 * scale}px,0) translate(-50%,-100%) scale(${scale})`;
        const opacity = Math.min(fadeIn, fadeOut);
        board.style.opacity = String(opacity);
        board.inert = scale < .82 || opacity < .66;
      };
      const measure = () => {
        road.measure();
        width = pin.clientWidth;
        signWidth = boards[0].offsetWidth;
        render();
      };

      destinations.forEach(({ world, departure, park }) => {
        film.to(ride, { distance: world - roadsideDepth, duration: park - departure, ease: 'sine.inOut' }, departure);
      });
      film.to(bridge, { xPercent: -3, yPercent: 2, duration: finish, ease: 'none' }, 0)
        .to(rule, { scaleX: 1, duration: .65, ease: 'sine.inOut' }, 8.68)
        .to(arrival, { autoAlpha: 1, yPercent: 0, duration: .65, ease: 'power2.out' }, 8.9)
        .eventCallback('onUpdate', render);
      measure();
      repaint.current = render;

      const trigger = ScrollTrigger.create({
        trigger: pin,
        animation: film,
        pin: true,
        start: () => `top top+=${document.querySelector('.navbar')?.getBoundingClientRect().height ?? 0}`,
        end: () => `+=${Math.round(Math.max(3100, window.innerHeight * 4.25))}`,
        scrub: .8,
        onRefresh: measure,
        onToggle: (self) => pin.toggleAttribute('data-travelling', self.isActive),
      });
      const chooseStop = (event: MouseEvent) => {
        const index = controls.indexOf(event.currentTarget as HTMLButtonElement);
        const progress = (destinations[index].park + .11) / finish;
        window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'smooth' });
      };
      controls.forEach((control) => control.addEventListener('click', chooseStop));
      return () => {
        repaint.current = null;
        held.current = null;
        window.clearTimeout(release.current);
        controls.forEach((control) => {
          control.removeEventListener('click', chooseStop);
          control.removeAttribute('aria-current');
        });
        boards.forEach((board) => {
          board.inert = false;
          board.removeAttribute('data-visible');
          board.style.removeProperty('transform');
          board.style.removeProperty('opacity');
        });
        delete pin.dataset.ride;
        delete pin.dataset.activeStop;
        delete pin.dataset.travelling;
      };
    }, root);

    // Direct links can land before pinned sections reserve their space.
    const entryHash = location.hash;
    const entryAnchor = entryHash === '#projects' || entryHash === '#journey'
      ? document.getElementById(entryHash.slice(1)) : null;
    let frame = 0;
    let disposed = false;
    const restoreEntry = () => {
      if (!entryAnchor) return;
      void document.fonts.ready.then(() => {
        if (disposed) return;
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            if (location.hash === entryHash) entryAnchor.scrollIntoView({ behavior: 'instant' });
          });
        });
      });
    };
    if (document.readyState === 'complete') restoreEntry();
    else window.addEventListener('load', restoreEntry, { once: true });

    return () => {
      disposed = true;
      window.clearTimeout(release.current);
      cancelAnimationFrame(frame);
      window.removeEventListener('load', restoreEntry);
      media.revert();
    };
  }, []);

  return (
    <section ref={root} id="projects" aria-labelledby="projects-heading" className={styles.section}>
      <div ref={stage} className={`${styles.stage} ${embedded ? '' : styles.standalone}`} data-project-ride>
        <div className={styles.sky} aria-hidden="true">
          <img className={styles.bridge} data-route-bridge src="/images/projects/howrah-ink.webp" alt="" width={1440} height={480} loading="lazy" decoding="async" />
          <div className={styles.flock}><i /><i /><i /></div>
        </div>
        <canvas className={styles.road} aria-hidden="true" />
        <header className={styles.header}>
          <div>
            <Heading id="projects-heading">Project Exhibition</Heading>
            <p>Ideas, experiments, and things I&apos;ve built.</p>
          </div>
          <span className={styles.scrollNote} aria-hidden="true">Scroll to drive <ArrowDown size={15} /></span>
        </header>
        <nav className={styles.stationNav} aria-label="Project destinations">
          {projects.map((project, index) => (
            <button key={project.id} type="button" data-destination-control aria-controls={`stop-${project.id}`}>
              <span className={styles.stopNumber}>0{index + 1}</span> {project.name}
            </button>
          ))}
        </nav>
        <ol className={styles.stops} aria-label="Featured projects">
          {projects.map((project, index) => (
            <ProjectSign key={project.id} project={project} index={index} heading={ProjectHeading} onHold={holdSign} />
          ))}
        </ol>
        <div className={styles.arrival}>
          <span className={styles.arrivalRule} data-arrival-rule aria-hidden="true" />
          <span className={styles.arrivalMask}><span data-arrival-text>You have arrived.</span></span>
        </div>
      </div>
    </section>
  );
}
