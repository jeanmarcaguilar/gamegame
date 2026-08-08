import { useEffect, useState } from 'react';

/**
 * IT/code themed glyphs used to scramble letters while they decode.
 * Mixes binary, hex, common code punctuation, and a few tech symbols so
 * the scramble feels like a terminal/IDE booting up.
 */
const IT_GLYPHS = '01<>/\\{}[]()$#@!*&%+=-_|;:.,~';

function pickGlyph(): string {
  return IT_GLYPHS[Math.floor(Math.random() * IT_GLYPHS.length)];
}

interface UseScrambleTextOptions {
  /** Ms per scramble frame while a letter is still decoding. */
  scrambleSpeed?: number;
  /** Ms the final, decoded text holds before the next cycle begins. */
  hold?: number;
  /** Ms to wait before the first cycle starts. */
  startDelay?: number;
}

/**
 * Decodes `text` letter-by-letter with a scramble effect: each unresolved
 * position flickers through random IT-themed glyphs, then settles on the
 * real character. When the whole string is decoded, it holds for `hold`
 * ms, then scrubs back to empty and starts over.
 */
export function useScrambleText(
  text: string,
  { scrambleSpeed = 55, hold = 1800, startDelay = 400 }: UseScrambleTextOptions = {},
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

    const computeThresholds = () => {
      thresholds.length = 0;
      for (let i = 0; i < text.length; i += 1) {
        // Earlier letters resolve first; later letters take a few more
        // frames. Whitespace resolves immediately.
        thresholds.push(text[i] === ' ' ? 0 : 4 + i + Math.floor(Math.random() * 4));
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
            next += pickGlyph();
          }
        }

        setDisplay(next);

        if (allResolved) {
          frameId = window.setTimeout(() => {
            if (cancelled) return;
            // Scrub back: roll through glyphs while shrinking, then
            // restart from empty.
            let scrubFrame = 0;
            const scrubStep = () => {
              if (cancelled) return;
              scrubFrame += 1;
              let out = '';
              for (let i = 0; i < text.length; i += 1) {
                // Letters fall away from the end as the scrub runs.
                if (i < text.length - scrubFrame) {
                  out += text[i];
                } else {
                  out += pickGlyph();
                }
              }
              setDisplay(out);
              if (scrubFrame < text.length) {
                frameId = window.setTimeout(scrubStep, scrambleSpeed);
              } else {
                // Brief blank pause, then next cycle.
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