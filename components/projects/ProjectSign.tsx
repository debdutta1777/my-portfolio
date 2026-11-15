'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from './project-data';
import styles from './projects.module.css';

export default function ProjectSign({
  project, index, heading: Heading, onHold,
}: {
  project: Project;
  index: number;
  heading: 'h2' | 'h3';
  onHold: (index: number, hold: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const group = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const pointerInside = useRef(false);
  const drawerId = `project-drawer-${project.id}`;

  const changeDrawer = (next: boolean) => {
    setOpen(next);
    onHold(index, next || Boolean(group.current?.contains(document.activeElement)));
  };
  const enter = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(min-width: 1024px) and (hover: hover)').matches) return;
    pointerInside.current = true;
    changeDrawer(true);
  };
  const leave = () => {
    pointerInside.current = false;
    if (!group.current?.contains(document.activeElement)) changeDrawer(false);
  };
  const escape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !open) return;
    event.stopPropagation();
    button.current?.focus({ preventScroll: true });
    changeDrawer(false);
  };

  return (
    <li
      ref={group}
      className={styles.stop}
      id={`stop-${project.id}`}
      data-project-stop
      data-drawer-open={open ? '' : undefined}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={() => onHold(index, true)}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget) || pointerInside.current) return;
        setOpen(false);
        onHold(index, false);
      }}
      onKeyDown={escape}
    >
      <article className={styles.billboard}>
        <Heading className={styles.signHeading}>
          <button ref={button} type="button" aria-expanded={open} aria-controls={drawerId} onClick={() => changeDrawer(!open)}>
            <img src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} loading="lazy" decoding="async" />
            <span><span className={styles.stopNumber}>0{index + 1}.</span>{' '}{project.name}</span>
          </button>
        </Heading>
        <div className={styles.drawerClip} inert={!open} aria-hidden={!open}>
          <section className={styles.drawer} id={drawerId} aria-label={`About ${project.name}`}>
            <p>{project.description}</p>
            {project.stack.length > 0 && <ul className={styles.stack} aria-label="Technologies and methods">
              {project.stack.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>}
            {(project.repository || project.demo || project.references?.length) && <div className={styles.links}>
              {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer">Live demo <ArrowUpRight size={14} aria-hidden="true" /></a>}
              {project.repository && <a href={project.repository} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>}
              {project.references?.map(({ href, label }) => <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight size={14} aria-hidden="true" /></a>)}
            </div>}
          </section>
        </div>
      </article>
    </li>
  );
}
