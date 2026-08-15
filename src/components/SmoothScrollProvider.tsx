'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wrap your app (or just the pages that use GSAP ScrollTrigger) with this
 * provider to get smooth, interpolated scrolling instead of raw native scroll.
 *
 * Usage (e.g. in app/layout.tsx or pages/_app.tsx):
 *
 *   <SmoothScrollProvider>
 *     {children}
 *   </SmoothScrollProvider>
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      infinite: false,
    });

    // Keep ScrollTrigger in lockstep with Lenis's interpolated scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis directly from GSAP's ticker for 60/120fps sync
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
