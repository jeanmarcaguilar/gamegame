import { useEffect, useState } from 'react';

/**
 * A slow typing effect that types, pauses, deletes, then types the name
 * again — and loops. Mirrors the structure of `useTypingEffect` but with
 * much slower character cadence so the user's name feels intentional
 * and prominent.
 */
export function useNameTyping(
  name: string,
  typeSpeed = 180,
  eraseSpeed = 100,
  pauseAfterType = 1600,
  pauseAfterErase = 400,
  startDelay = 400,
) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    const tick = () => {
      if (cancelled) return;

      setText((current) => {
        if (!isDeleting) {
          // Typing forward.
          const next = name.slice(0, current.length + 1);
          if (next === name) {
            // Finished typing — pause, then start deleting.
            timeoutId = window.setTimeout(() => {
              if (!cancelled) setIsDeleting(true);
            }, pauseAfterType);
            return next;
          }
          // Per-character jitter so it feels human, not metronomic.
          const jitter = Math.round((Math.random() - 0.5) * 40);
          timeoutId = window.setTimeout(tick, typeSpeed + jitter);
          return next;
        }

        // Deleting backward.
        const next = name.slice(0, current.length - 1);
        if (next === '') {
          // Finished deleting — short pause, then type again.
          timeoutId = window.setTimeout(() => {
            if (!cancelled) setIsDeleting(false);
          }, pauseAfterErase);
          return next;
        }
        timeoutId = window.setTimeout(tick, eraseSpeed);
        return next;
      });
    };

    const kickoff = window.setTimeout(tick, startDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(kickoff);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [name, typeSpeed, eraseSpeed, pauseAfterType, pauseAfterErase, startDelay]);

  return text;
}