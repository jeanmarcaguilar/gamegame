import { useEffect } from 'react';

/**
 * Enables native smooth scrolling for hash-link clicks and adjusts
 * for the sticky navbar offset.
 *
 * For the About section we deliberately land on the stats grid
 * (data-about-stats marker) instead of the section top — on short
 * viewports the stats sit below the fold and the user never sees them.
 */
export function useSmoothScroll(offset = 80) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;

      // Special handling for #home - scroll to absolute top
      if (id === 'home') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '#home');
        return;
      }

      const el = document.getElementById(id);
      if (!el) return;

      event.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Update URL without triggering default jump
      window.history.pushState(null, '', `#${id}`);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [offset]);
}
