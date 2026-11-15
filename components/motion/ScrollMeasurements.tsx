'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollMeasurements() {
  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;

    let frame = 0;
    let active = true;
    const schedule = () => {
      if (!active || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        ScrollTrigger.refresh();
      });
    };
    const layoutTransition = (event: TransitionEvent) => {
      if (['height', 'block-size', 'grid-template-rows'].includes(event.propertyName)) schedule();
    };

    main.addEventListener('load', schedule, true);
    main.addEventListener('toggle', schedule, true);
    main.addEventListener('transitionend', layoutTransition);
    void document.fonts.ready.then(schedule);
    schedule();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      main.removeEventListener('load', schedule, true);
      main.removeEventListener('toggle', schedule, true);
      main.removeEventListener('transitionend', layoutTransition);
    };
  }, []);
  return null;
}
