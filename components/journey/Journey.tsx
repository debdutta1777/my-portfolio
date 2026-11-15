'use client';

import { useLayoutEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { milestones } from './milestone-data';
import styles from './journey.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Journey({ embedded = false }: { embedded?: boolean }) {
  const Heading = embedded ? 'h2' : 'h1';
  const root = useRef<HTMLElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const guide = useRef<SVGPathElement>(null);
  const ink = useRef<SVGPathElement>(null);
  const traveler = useRef<SVGGElement>(null);
  const routeSvg = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const sheet = paper.current;
    const guidePath = guide.current;
    const inkPath = ink.current;
    const travelingMark = traveler.current;
    const svg = routeSvg.current;
    if (!sheet || !guidePath || !inkPath || !travelingMark || !svg) return;

    const rows = Array.from(sheet.querySelectorAll<HTMLElement>('[data-milestone]'));
    const stamps = rows.map((row) => row.querySelector<HTMLElement>('[data-stamp]')!);
    const records = rows.map((row) => row.querySelector<HTMLElement>('[data-record]')!);
    const years = rows.map((row) => row.querySelector<HTMLElement>('[data-year]')!);
    const media = gsap.matchMedia();

    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      mobile: '(max-width: 700px)',
    }, ({ conditions }) => {
      const motion = !!conditions?.motion;
      const mobile = !!conditions?.mobile;
      const position = { value: 0 };
      let length = 1;
      let fractions: number[] = [];
      let width = 1;
      let height = 1;
      let frame = 0;

      // The SVG geometry follows the real stamp positions, including expanded cards and mobile reflow.
      const measure = () => {
        const bounds = sheet.getBoundingClientRect();
        width = bounds.width;
        height = bounds.height;
        const points = stamps.map((stamp) => {
          const rect = stamp.getBoundingClientRect();
          return { x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
        });
        if (!points.length) return;
        const anchors = [{ x: points[0].x, y: 14 }, ...points, { x: points[points.length - 1].x, y: height - 14 }];
        const bend = mobile ? 0 : Math.min(46, width * .035);
        const d = anchors.slice(1).reduce((value, point, index) => {
          const previous = anchors[index];
          const middle = (previous.y + point.y) / 2;
          const sway = index > 0 && index < anchors.length - 2 ? (index % 2 ? bend : -bend) : 0;
          return `${value} C ${previous.x + sway} ${middle}, ${point.x + sway} ${middle}, ${point.x} ${point.y}`;
        }, `M ${anchors[0].x} ${anchors[0].y}`);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        guidePath.setAttribute('d', d);
        inkPath.setAttribute('d', d);
        length = inkPath.getTotalLength();
        inkPath.style.strokeDasharray = `${length}`;
        fractions = points.map((point) => {
          let low = 0;
          let high = length;
          for (let i = 0; i < 14; i++) {
            const middle = (low + high) / 2;
            if (inkPath.getPointAtLength(middle).y < point.y) low = middle;
            else high = middle;
          }
          return (low + high) / (2 * length);
        });
        draw();
      };

      const draw = () => {
        const value = motion ? position.value : 1;
        const distance = value * length;
        inkPath.style.strokeDashoffset = motion ? `${length - distance}` : '0';
        const point = inkPath.getPointAtLength(distance);
        const nearest = fractions.reduce((best, at, index) =>
          Math.abs(at - value) < Math.abs(fractions[best] - value) ? index : best, 0);
        const pulse = fractions.some((at) => Math.abs(value - at) < .018) ? 1.13 : 1;
        travelingMark.setAttribute('transform', `translate(${point.x} ${point.y}) scale(${pulse})`);
        rows.forEach((row, index) => {
          const at = fractions[index];
          const reveal = motion ? gsap.utils.clamp(0, 1, (value - at + .06) / .09) : 1;
          const active = motion && index === nearest;
          row.dataset.active = active ? 'true' : 'false';
          gsap.set(records[index], { y: motion ? (mobile ? 6 : 12) * (1 - reveal) : 0, opacity: motion ? .72 + .28 * reveal : 1 });
          gsap.set(years[index], { scale: active ? 1.035 : 1, opacity: motion ? (active ? 1 : .62) : 1 });
          gsap.set(stamps[index], { scale: active ? 1.1 : 1 });
        });
      };

      measure();
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          measure();
          if (motion) ScrollTrigger.refresh();
        });
      });
      observer.observe(sheet);
      const onRefresh = () => measure();
      ScrollTrigger.addEventListener('refreshInit', onRefresh);

      if (motion) {
        // One scrubbed controller owns the route, traveler, year emphasis and card reveals.
        gsap.to(position, {
          value: 1,
          ease: 'none',
          onUpdate: draw,
          scrollTrigger: {
            trigger: sheet,
            start: 'top 72%',
            end: 'bottom 32%',
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
        });
      }
      return () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        ScrollTrigger.removeEventListener('refreshInit', onRefresh);
        gsap.set([...records, ...years, ...stamps], { clearProps: 'all' });
      };
    }, root);

    return () => media.revert();
  }, []);

  return (
    <section id="journey" ref={root} className={styles.section} aria-labelledby="journey-heading">
      <div className={`${styles.inner} ${embedded ? '' : styles.standalone}`}>
        <header className={styles.header}>
          <Heading id="journey-heading">The Journey So Far.</Heading>
        </header>
        <div ref={paper} className={styles.paper}>
          <svg ref={routeSvg} className={styles.route} viewBox="0 0 100 1500" preserveAspectRatio="none" aria-hidden="true">
            <path ref={guide} className={styles.guide} />
            <path ref={ink} className={styles.ink} />
            <g ref={traveler} className={styles.traveler}>
              <path d="M0 -8 Q1.7 -1.7 8 0 Q1.7 1.7 0 8 Q-1.7 1.7 -8 0 Q-1.7 -1.7 0 -8Z" />
              <circle r="1.55" fill="#f4ebd9" />
            </g>
          </svg>
          <ol className={styles.milestones}>
            {milestones.map((milestone) => (
              <li key={milestone.id} data-milestone className={styles.milestone}>
                <span aria-hidden="true" data-year className={styles.year}>{milestone.year}</span>
                <span aria-hidden="true" data-stamp className={styles.stamp}><span>{milestone.year.slice(2)}</span></span>
                <div data-record className={styles.record}>
                  <span className={styles.label}>{milestone.date} / {milestone.category}</span>
                  <details>
                    <summary><span>{milestone.title}</span><Plus size={16} aria-hidden="true" /></summary>
                    <div className={styles.detail}>
                      <p>{milestone.detail}</p>
                      {milestone.facts?.map((fact) => <p key={fact}>{fact}</p>)}
                    </div>
                  </details>
                  <p className={styles.summary}>{milestone.summary}</p>
                  {milestone.image && (
                    <figure className={styles.photo}>
                      <img
                        src={milestone.image.src}
                        alt={milestone.image.alt}
                        width={milestone.image.width}
                        height={milestone.image.height}
                        loading="lazy"
                        style={{ objectPosition: milestone.image.position ?? 'center' }}
                      />
                      <figcaption>{milestone.image.caption}</figcaption>
                    </figure>
                  )}
                  {milestone.links && <div className={styles.links}>
                    {milestone.links.map(({ label, href }) => (
                      <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                        {label}<ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    ))}
                  </div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.closing}>
          <p>Still learning. Still building. <em>Still exploring.</em></p>
          <a href="/contact/">Contact <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
