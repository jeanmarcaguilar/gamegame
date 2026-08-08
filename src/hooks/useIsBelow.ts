import { useEffect, useState } from 'react';

/**
 * Detects whether the viewport is at or below a given Tailwind breakpoint.
 * Breakpoints mirror Tailwind: 'sm' = 640, 'md' = 768, 'lg' = 1024, 'xl' = 1280.
 */
export function useIsBelow(breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'md') {
  const map = { sm: 640, md: 768, lg: 1024, xl: 1280 };
  const [isBelow, setIsBelow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${map[breakpoint] - 0.02}px)`);
    const handler = (event: MediaQueryListEvent | MediaQueryList) =>
      setIsBelow(event.matches);
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isBelow;
}
