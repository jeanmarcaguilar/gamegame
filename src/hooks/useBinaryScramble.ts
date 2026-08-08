import { useEffect, useState } from 'react';

interface UseBinaryScrambleOptions {
  /** Ms per scramble frame while a letter is still decoding. */
  scrambleSpeed?: number;
  /** Ms the final, decoded text holds before the next cycle begins. */
  hold?: number;
  /** Ms to wait before the first cycle starts. */
  startDelay?: number;
}

/**
 * Decodes `text` letter-by-letter with a binary scramble: each unresolved
 * position flickers through random 0/1 digits, then settles on the real
 * character. Once fully decoded it holds, scrubs back through binary, and
 * repeats.
 *
 * Mirrors `useScrambleText` but uses only binary digits so the effect
 * reads like a data stream / terminal handshake.
 */
export function useBinaryScramble(
  text: string,
  { scrambleSpeed = 45, hold = 1800, startDelay = 400 }: UseBinaryScrambleOptions = {},
) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (!text) return;
    let cancelled = false;
    let frameId: number | undefined;

  // Per-letter frame counts — each position stops scrambling after a
  // small random number of frames so the decode feels uneven (and
  // therefore alive) instead of all-letters-reveal-at-once.
  const thresholds: number[] = [];

    const pickBit = () => (Math.random() < 0.5 ? '0' : '1');

    const computeThresholds = () => {
      thresholds.length = 0;
      for (let i = 0; i < text.length; i += 1) {
        // Whitespace resolves immediately; later letters need a few more
        // frames than earlier ones for a staggered cascade.
        thresholds.push(text[i] === ' ' ? 0 : 5 + i * 2 + Math.floor(Math.random() * 4));
      }
    };

    const startCycle = () => {
      computeThresholds();
      let frame = 0;

      const step = () => {
        if (cancelled) return;
        frame += 1;

        let next = '';
        let allResolved = true;
        for (let i = 0; i < text.length; i += 1) {
          if (frame >= thresholds[i]) {
            next += text[i];
          } else {
            allResolved = false;
            next += pickBit();
          }
        }

        setDisplay(next);

        if (allResolved) {
          frameId = window.setTimeout(() => {
            if (cancelled) return;
            // Scrub back: flip resolved letters back to binary from the
            // end inward, then restart.
            let scrubFrame = 0;
            const scrubStep = () => {
              if (cancelled) return;
              scrubFrame += 1;
              let out = '';
              for (let i = 0; i < text.length; i += 1) {
                if (i < text.length - scrubFrame) {
                  out += text[i];
                } else {
                  out += pickBit();
                }
              }
              setDisplay(out);
              if (scrubFrame < text.length) {
                frameId = window.setTimeout(scrubStep, scrambleSpeed);
              } else {
                frameId = window.setTimeout(startCycle, 250);
              }
            };
            frameId = window.setTimeout(scrubStep, scrambleSpeed);
          }, hold);
          return;
        }

        frameId = window.setTimeout(step, scrambleSpeed);
      };

      step();
    };

    const kickoff = window.setTimeout(startCycle, startDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(kickoff);
      if (frameId) window.clearTimeout(frameId);
    };
  }, [text, scrambleSpeed, hold, startDelay]);

  return display;
}