import { useEffect, useState } from 'react';

/**
 * Random-pick pools — each cycle picks one at random, so the scramble
 * looks different on every pass (pure binary one time, hex the next,
 * code punctuation the next, etc.).
 */
const POOLS = {
  binary: '01',
  hex: '0123456789ABCDEF',
  octal: '01234567',
  code: '01<>/\\{}[]()$#@!*&%+=-_|;:.,~',
  alnum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
} as const;

type PoolKey = keyof typeof POOLS;
const POOL_KEYS = Object.keys(POOLS) as PoolKey[];

function pickPool(): string {
  return POOLS[POOL_KEYS[Math.floor(Math.random() * POOL_KEYS.length)]];
}

function pickFrom(pool: string): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

interface UseFastScrambleOptions {
  /** Ms per scramble frame. */
  speed?: number;
  /** Ms the final, decoded text holds before the next cycle begins. */
  hold?: number;
  /** Ms to wait before the first cycle starts. */
  startDelay?: number;
}

/**
 * Fast scramble decoder with a randomized glyph pool per cycle.
 *
 * Each cycle picks one of five pools (binary, hex, octal, code symbols,
 * alphanumeric) at random, then decodes `text` letter-by-letter with
 * per-letter frame thresholds so the reveal cascades. Once decoded it
 * holds, scrubs back to the pool, and the next cycle starts — possibly
 * with a different pool.
 */
export function useFastScramble(
  text: string,
  { speed = 22, hold = 1400, startDelay = 400 }: UseFastScrambleOptions = {},
) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (!text) return;
    let cancelled = false;
    let frameId: number | undefined;

    const thresholds: number[] = [];

    const computeThresholds = () => {
      thresholds.length = 0;
      for (let i = 0; i < text.length; i += 1) {
        thresholds.push(text[i] === ' ' ? 0 : 3 + i + Math.floor(Math.random() * 4));
      }
    };

    const startCycle = () => {
      const pool = pickPool();
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
            next += pickFrom(pool);
          }
        }

        setDisplay(next);

        if (allResolved) {
          frameId = window.setTimeout(() => {
            if (cancelled) return;
            let scrubFrame = 0;
            const scrubStep = () => {
              if (cancelled) return;
              scrubFrame += 1;
              let out = '';
              for (let i = 0; i < text.length; i += 1) {
                if (i < text.length - scrubFrame) {
                  out += text[i];
                } else {
                  out += pickFrom(pool);
                }
              }
              setDisplay(out);
              if (scrubFrame < text.length) {
                frameId = window.setTimeout(scrubStep, speed);
              } else {
                frameId = window.setTimeout(startCycle, 200);
              }
            };
            frameId = window.setTimeout(scrubStep, speed);
          }, hold);
          return;
        }

        frameId = window.setTimeout(step, speed);
      };

      step();
    };

    const kickoff = window.setTimeout(startCycle, startDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(kickoff);
      if (frameId) window.clearTimeout(frameId);
    };
  }, [text, speed, hold, startDelay]);

  return display;
}