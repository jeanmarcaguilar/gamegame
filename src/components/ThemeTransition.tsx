import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, type Theme } from '@/hooks/useTheme';

/**
 * Plays a circular reveal from the click point whenever the theme flips.
 *
 * Timeline (single coherent motion, ~0.8s total):
 *
 *   0.00s – 0.55s  Reveal:  clip-path circle grows from click point to
 *                   cover the viewport. Painted with the NEW theme's
 *                   background and ambient tint.
 *   0.05s – 0.50s  Leading edge: thin ring runs ~15% ahead of the
 *                   reveal circle, fading as it grows. Gives the eye
 *                   something to track.
 *   0.00s – 0.80s  Overlay opacity: stays at 1 while the reveal is
 *                   painting, then eases down to 0 in the last 0.30s so
 *                   the underlying page — which is already
 *                   cross-fading its colors via the universal `*`
 *                   transition — becomes visible smoothly. There is no
 *                   "hard cut" at the end.
 *   0.00s – 0.55s  Click pulse:  soft glow at the origin fades and
 *                   expands gently, then stops.
 *
 * `prefers-reduced-motion` short-circuits the whole animation: the
 * component mounts for one frame and unmounts, so the theme swap is
 * instant and the universal CSS transition in globals.css (which the
 * OS already neuters in reduced-motion mode anyway) is the only
 * motion the user sees.
 */
const REVEAL_MS = 550;     // clip-path expansion
const FADE_MS = 300;       // final overlay fade-out
const TOTAL_MS = REVEAL_MS + FADE_MS; // 850ms
const EASE = [0.22, 1, 0.36, 1] as const; // smooth out-quint

interface TransitionState {
  from: Theme;
  to: Theme;
  x: number;
  y: number;
  id: number;
}

// Module-level ref so the document-level mousedown listener can hand
// the click coordinates off to the theme-change effect without
// prop-drilling. Captured into a local const inside the effect so the
// React updater function never reads the module binding after it has
// been nulled (which previously caused a `Cannot read properties of
// null (reading 'x')` crash).
let pendingClickRef: { x: number; y: number } | null = null;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

export function ThemeTransition() {
  const [theme] = useTheme();
  const [transition, setTransition] = useState<TransitionState | null>(null);

  // Capture the click position from the toggle. Uses `mousedown` (not
  // `click`) so the position is recorded even when React re-renders
  // the toggle before the synthetic `click` fires.
  useEffect(() => {
    const capture = (clientX: number, clientY: number) => {
      const el = document.elementFromPoint(clientX, clientY);
      const btn = el?.closest<HTMLElement>('[data-theme-toggle]');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      pendingClickRef = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };
    const onDown = (e: MouseEvent) => capture(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) capture(t.clientX, t.clientY);
    };
    window.addEventListener('mousedown', onDown, true);
    window.addEventListener('touchstart', onTouch, true);
    return () => {
      window.removeEventListener('mousedown', onDown, true);
      window.removeEventListener('touchstart', onTouch, true);
    };
  }, []);

  // React to a theme change. Captures-then-nulls `pendingClickRef`
  // before scheduling the state update (see the file-top note).
  useEffect(() => {
    const click = pendingClickRef;
    pendingClickRef = null;

    // If we have no click coords (e.g. the theme was changed by
    // something other than the toggle — a future feature, a hotkey,
    // the OS preference flipping), fall back to the center of the
    // viewport so the reveal still looks intentional.
    const x = click?.x ?? window.innerWidth / 2;
    const y = click?.y ?? window.innerHeight / 2;

    setTransition((prev) => {
      const from: Theme = prev ? prev.to : theme === 'light' ? 'dark' : 'light';
      if (from === theme) return prev;
      return { from, to: theme, x, y, id: Date.now() };
    });
  }, [theme]);

  // Schedule unmount. In reduced-motion mode we skip straight to
  // unmount on the next frame so the user gets an instant swap.
  useEffect(() => {
    if (!transition) return;
    const lifetime = prefersReducedMotion() ? 0 : TOTAL_MS;
    const id = window.setTimeout(() => setTransition(null), lifetime);
    return () => window.clearTimeout(id);
  }, [transition]);

  if (!transition) return null;

  // Reduced-motion: mount for one paint, then unmount. The actual
  // color swap is handled by the universal `*` color transition in
  // globals.css, which the OS already neuters too — so the user sees
  // an instant theme change with zero animation.
  if (prefersReducedMotion()) {
    return null;
  }

  // Delay the reveal by DLEAY_MS so the underlying page's color
  // cross-fade has a head start. Without this, the reveal paints
  // the new theme's palette over a page that's still on the OLD
  // palette, so for the first ~150ms the user sees the new theme
  // on top of the old theme — a faint ghost that resolves when
  // the cross-fade catches up. Starting the cross-fade ~120ms
  // early means the eye reads reveal + cross-fade as one motion.
  const HEAD_START_MS = 120;

  // Radius large enough to cover the viewport from any click point.
  const radius =
    Math.hypot(
      Math.max(transition.x, window.innerWidth - transition.x),
      Math.max(transition.y, window.innerHeight - transition.y),
    ) + 120;

  // Normalize the two animations to a 0..1 timeline so the fade-out
  // always lines up with the end of the reveal — no more "reveal done
  // at 0.55s but overlay still visible at 1.0" hard cut.
  const totalSec = TOTAL_MS / 1000;
  const revealSec = REVEAL_MS / 1000;
  const fadeStart = revealSec / totalSec; // ~0.647

  return (
    <AnimatePresence>
      <motion.div
        key={transition.id}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{ contain: 'strict' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{
          duration: totalSec,
          // Hold opacity at 1 until the reveal finishes painting, then
          // ease down to 0 over the remaining FADE_MS. The two
          // keyframes use the same easing curve as the reveal so the
          // eye reads it as one motion, not two stacked animations.
          times: [0, fadeStart, 1],
          ease: EASE,
        }}
      >
        {/* Reveal — new-theme background clipped to an expanding
            circle that starts at the click point. Single timeline,
            single easing. The HEAD_START_MS delay matches the body
            CSS transition delay on the underlying page, so the two
            timed motions line up instead of fighting each other. */}
        <motion.div
          initial={{
            clipPath: `circle(0px at ${transition.x}px ${transition.y}px)`,
          }}
          animate={{
            clipPath: `circle(${radius}px at ${transition.x}px ${transition.y}px)`,
          }}
          transition={{
            duration: revealSec,
            delay: HEAD_START_MS / 1000,
            ease: EASE,
          }}
          data-theme={transition.to}
          className="absolute inset-0"
          style={{
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
          }}
        >
          {/* Mirror the body's ambient gradient so the reveal doesn't
              read as a flat block of color. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(60rem 40rem at 8% -10%, var(--color-tint-from), transparent 60%), ' +
                'radial-gradient(50rem 35rem at 100% 20%, var(--color-tint-via), transparent 55%), ' +
                'radial-gradient(60rem 45rem at 50% 110%, var(--color-tint-to), transparent 60%)',
              opacity: 0.9,
            }}
          />
        </motion.div>

        {/* Leading edge — thin ring that runs ~15% ahead of the
            reveal circle and fades as it grows. Drawn in the same
            coordinate system as the reveal so they read as one
            motion. */}
        <motion.span
          aria-hidden
          initial={{
            opacity: 0.6,
            scale: 0,
          }}
          animate={{
            opacity: [0.6, 0.35, 0],
            scale: [0, 1.1, 1.25],
          }}
          transition={{
            duration: revealSec / 1000,
            ease: EASE,
            times: [0, 0.6, 1],
          }}
          className="absolute rounded-full border"
          style={{
            left: transition.x,
            top: transition.y,
            width: 64,
            height: 64,
            marginLeft: -32,
            marginTop: -32,
            borderColor: 'var(--color-glow-soft)',
            boxShadow: '0 0 28px var(--color-glow-soft)',
          }}
        />

        {/* Click pulse — soft glow at the origin. Smaller, slower,
            and a touch softer than before so it reads as a tactile
            "tap" rather than a flash. */}
        <motion.div
          initial={{ opacity: 0.45, scale: 0.4 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: revealSec / 1000, ease: EASE }}
          className="absolute h-24 w-24 rounded-full"
          style={{
            left: transition.x - 48,
            top: transition.y - 48,
            background:
              'radial-gradient(circle, var(--color-glow-soft), transparent 70%)',
            filter: 'blur(12px)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
