'use client';

import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './contact.module.css';

gsap.registerPlugin(ScrollTrigger);

const contactLinks = [
  { label: 'Email', value: 'debdutta1777@gmail.com', href: 'mailto:debdutta1777@gmail.com', external: false },
  { label: 'GitHub', value: '@debdutta1777', href: 'https://github.com/debdutta1777', external: true },
  { label: 'LinkedIn', value: 'Debdutta Ghosh', href: 'https://www.linkedin.com/in/debdutta-ghosh-644ab628a/', external: true },
] as const;

export default function ContactPanel({ embedded = false }: { embedded?: boolean }) {
  const panel = useRef<HTMLElement>(null);
  const Heading = embedded ? 'h2' : 'h1';

  useLayoutEffect(() => {
    const root = panel.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 76%',
            toggleActions: 'play none none reverse',
          },
        });
        timeline
          .fromTo('[data-postcard]',
            { y: 42, rotation: 2.5, opacity: 0 },
            { y: 0, rotation: -2.2, opacity: 1, duration: .72, ease: 'power3.out' })
          .fromTo('[data-stamp]',
            { y: -35, rotation: 10, scale: 1.2, opacity: 0 },
            { y: 0, rotation: -4, scale: 1, opacity: 1, duration: .34, ease: 'back.out(1.5)' }, .48)
          .fromTo('[data-contact-link]',
            { y: 11, opacity: 0 },
            { y: 0, opacity: 1, duration: .33, stagger: .08, ease: 'power2.out' }, .7);
      }, root);
      return () => context.revert();
    }, root);
    return () => media.revert();
  }, []);

  return (
    <section id="contact" ref={panel} className={`${styles.section} ${embedded ? styles.embedded : styles.standalone}`} aria-labelledby="contact-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>A note before you go</span>
          <Heading id="contact-heading">Say <em>hello.</em></Heading>
          <p>Got an idea, a question, or just want to say hi? My inbox is open.</p>
          <span className={styles.squiggle} aria-hidden="true" />
        </div>

        <div className={styles.postcard} data-postcard>
          <div className={styles.postmark} aria-hidden="true"><span>DG.</span><span>FROM KOLKATA</span></div>
          <div className={styles.stamp} data-stamp aria-hidden="true"><span>DG.</span><small>POST • 2026</small></div>
          <div className={styles.cardContent}>
            <div className={styles.message}>
              <span className={styles.cardLabel}>A little correspondence</span>
              <p>Good things often begin<br />with a conversation.</p>
              <span className={styles.signature}>— Debdutta</span>
            </div>
            <div className={styles.address} aria-label="Ways to get in touch">
              <span className={styles.cardLabel}>Find me here</span>
              {contactLinks.map(({ label, value, href, external }) => (
                <a key={label} data-contact-link className={styles.contactLink} href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span className={styles.linkLabel}>{label}</span>
                  <span className={styles.linkValue}>{value}<ArrowUpRight size={16} aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </div>
          <span className={styles.cardFoot} aria-hidden="true">NOTES FROM A CURIOUS MIND · 01—03</span>
        </div>
      </div>
    </section>
  );
}
