import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

// Tiny rAF delay between the two opacity writes. Forces the browser to
// commit a 0-frame before flipping to 1 so the CSS transition always
// has a starting value to interpolate from.
const FRAME_DELAY_MS = 30;

interface AvatarProps {
  /** What to render inside the circle. Defaults to a looping video. */
  kind?: 'video' | 'image';
  /** Video shown in dark mode (default `/animated 1.mp4`). */
  darkVideoSrc?: string;
  /** Video shown in light mode (default `/animated 2.mp4`). */
  lightVideoSrc?: string;
  /** Image shown in dark mode (default `/avatar-dark.jpg`). */
  darkImageSrc?: string;
  /** Image shown in light mode (default `/avatar-light.jpg`). */
  lightImageSrc?: string;
  /** Optional fallback video for browsers without MP4 support. */
  fallbackSrc?: string;
  className?: string;
}

/**
 * Circular profile avatar that crossfades between a dark-mode and a
 * light-mode source whenever the theme changes.
 *
 * - `kind="video"` (default) — loops an MP4 inside the circle. Only the
 *   active video plays, so swapping themes never interrupts playback.
 * - `kind="image"` — renders a still image (used by the About flip card).
 */
export function Avatar({
  kind = 'video',
  darkVideoSrc = '/animated 1.mp4',
  lightVideoSrc = '/animated 2.mp4',
  darkImageSrc = '/avatar-dark.jpg',
  lightImageSrc = '/avatar-light.jpg',
  fallbackSrc,
  className,
}: AvatarProps) {
  const [theme] = useTheme();
  const isDark = theme === 'dark';

  const [mounted, setMounted] = useState(false);
  const [darkReady, setDarkReady] = useState(false);
  const [lightReady, setLightReady] = useState(false);
  // Committed opacity values that drive the inline style on the media.
  // Updated in two phases from `useEffect` so that React's batched
  // updates can't collapse a 0→1 swap into a single paint (which would
  // skip the CSS transition). See the `applyOpacities` effect below.
  const [darkOpacity, setDarkOpacity] = useState(0);
  const [lightOpacity, setLightOpacity] = useState(0);
  const darkVideoRef = useRef<HTMLVideoElement | null>(null);
  const lightVideoRef = useRef<HTMLVideoElement | null>(null);
  const darkImageRef = useRef<HTMLImageElement | null>(null);
  const lightImageRef = useRef<HTMLImageElement | null>(null);
  // Refs mirror the committed opacity state so the crossfade effect can
  // read the "current" value without re-running every time it writes
  // one (which used to cause the effect to revert the active media
  // back to 0 in an infinite flicker).
  const darkOpacityRef = useRef(0);
  const lightOpacityRef = useRef(0);

  // Mount immediately to show media right away
  useEffect(() => {
    setMounted(true);
  }, []);

  // Video-only: autoplay safety — try play() once mounted in case
  // autoplay was blocked. Images don't need any of this.
  useEffect(() => {
    if (kind !== 'video' || !mounted) return;
    [darkVideoRef.current, lightVideoRef.current].forEach((v) => {
      if (!v) return;
      const tryPlay = () => {
        const p = v.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            /* user gesture not required since the video is muted */
          });
        }
      };
      if (v.readyState >= 2) tryPlay();
      else v.addEventListener('loadeddata', tryPlay, { once: true });
    });
  }, [kind, mounted]);

  // Video-only: only the active video plays; pause the inactive one
  // (and seek it back to 0 so the next reveal starts from the start).
  useEffect(() => {
    if (kind !== 'video' || !mounted) return;
    const pairs: Array<[React.RefObject<HTMLVideoElement | null>, boolean]> = [
      [darkVideoRef, isDark],
      [lightVideoRef, !isDark],
    ];
    pairs.forEach(([ref, active]) => {
      const v = ref.current;
      if (!v) return;
      if (active) {
        const tryPlay = () => {
          const p = v.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        };
        if (v.readyState >= 2) tryPlay();
        else v.addEventListener('loadeddata', tryPlay, { once: true });
      } else {
        v.pause();
        try {
          v.currentTime = 0;
        } catch {
          /* seeking before metadata can throw — ignore */
        }
      }
    });
  }, [kind, isDark, mounted]);

  // Two-phase opacity commit so CSS transitions reliably animate.
  //
  // React 18 batches `setDarkOpacity(0) + setLightOpacity(1)` into a
  // single render, and the browser then sees the active media jump
  // from 0 → 1 in one paint with no intermediate frame — which makes
  // `transition: opacity` skip the animation entirely. We avoid that
  // by first committing the "starting" opacities (active → 0), then
  // flipping them on a delayed tick so the browser has a real frame to
  // transition from.
  useEffect(() => {
    if (!mounted) return;
    const wantDark = isDark && darkReady ? 1 : 0;
    const wantLight = !isDark && lightReady ? 1 : 0;

    const curDark = darkOpacityRef.current;
    const curLight = lightOpacityRef.current;

    // If we're already at the target opacities, nothing to do.
    if (curDark === wantDark && curLight === wantLight) return;

    // Phase 1: paint 0 for whichever side should end up visible, so the
    // browser commits a real starting value before the transition.
    const nextDark = wantDark === 1 ? 0 : wantDark;
    const nextLight = wantLight === 1 ? 0 : wantLight;
    if (nextDark !== curDark) {
      darkOpacityRef.current = nextDark;
      setDarkOpacity(nextDark);
    }
    if (nextLight !== curLight) {
      lightOpacityRef.current = nextLight;
      setLightOpacity(nextLight);
    }

    // Phase 2: flip to the desired opacities on a delayed tick so the
    // browser registers a style change with a real transition source.
    const t = window.setTimeout(() => {
      darkOpacityRef.current = wantDark;
      lightOpacityRef.current = wantLight;
      setDarkOpacity(wantDark);
      setLightOpacity(wantLight);
    }, FRAME_DELAY_MS);

    return () => window.clearTimeout(t);
    // Only re-run when the *inputs* change; the opacities themselves
    // are read from refs to avoid an effect-feedback loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, darkReady, lightReady, mounted]);

  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      {/* Ambient radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 30%, rgba(96,165,250,0.22), transparent 60%), ' +
            'radial-gradient(80% 60% at 50% 100%, rgba(59,130,246,0.18), transparent 60%)',
        }}
      />

      {/* Outer rotating accent ring (subtle, slow) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2 rounded-full border border-dashed border-[var(--color-border-strong)] opacity-60"
      />

      {/* Profile circle — hosts the crossfaded media. Sits above the
          page-wide ThemeTransition overlay (z-[100]) so the dark↔light
          crossfade remains visible during the swap. */}
      <div
        className="absolute inset-4 overflow-hidden rounded-full glass shadow-card"
        style={{ zIndex: 110 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-accent/15" />

        {/* Crossfaded media — videos or images depending on `kind` */}
        {mounted ? (
          kind === 'video' ? (
            <>
              <video
                ref={darkVideoRef}
                aria-hidden={!isDark}
                className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-[center_15%]"
                src={darkVideoSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Animated avatar (dark)"
                onLoadedData={() => setDarkReady(true)}
                style={{
                  opacity: darkOpacity,
                  transition: 'opacity 700ms ease-in-out',
                }}
              >
                <source src={darkVideoSrc} type="video/mp4" />
                {fallbackSrc ? (
                  <source src={fallbackSrc} type="video/mp4" />
                ) : null}
              </video>
              <video
                ref={lightVideoRef}
                aria-hidden={isDark}
                className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-[center_15%]"
                src={lightVideoSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Animated avatar (light)"
                onLoadedData={() => setLightReady(true)}
                style={{
                  opacity: lightOpacity,
                  transition: 'opacity 700ms ease-in-out',
                }}
              >
                <source src={lightVideoSrc} type="video/mp4" />
                {fallbackSrc ? (
                  <source src={fallbackSrc} type="video/mp4" />
                ) : null}
              </video>
            </>
          ) : (
            <>
              <img
                ref={darkImageRef}
                alt="Avatar (dark)"
                aria-hidden={!isDark}
                draggable={false}
                src={darkImageSrc}
                onLoad={() => setDarkReady(true)}
                className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-[center_15%]"
                style={{
                  opacity: darkOpacity,
                  transition: 'opacity 700ms ease-in-out',
                }}
              />
              <img
                ref={lightImageRef}
                alt="Avatar (light)"
                aria-hidden={isDark}
                draggable={false}
                src={lightImageSrc}
                onLoad={() => setLightReady(true)}
                className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-[center_15%]"
                style={{
                  opacity: lightOpacity,
                  transition: 'opacity 700ms ease-in-out',
                }}
              />
            </>
          )
        ) : (
          <FaceFallback />
        )}

        {/* Status dot */}
        <span className="absolute right-4 top-4 z-10 inline-flex h-3 w-3 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-success ring-2 ring-bg-card" />
        </span>
      </div>
    </div>
  );
}

/**
 * SVG portrait shown while the component is mounting (no media painted yet).
 */
function FaceFallback() {
  return <FallbackPortrait />;
}

/**
 * Stylized SVG portrait fallback.
 */
function FallbackPortrait() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Profile portrait of Jean Marc Aguilar"
    >
      <defs>
        <radialGradient id="face-bg" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="var(--color-art-bg-from)" />
          <stop offset="60%" stopColor="var(--color-bg-secondary, #EEF2F7)" />
          <stop offset="100%" stopColor="var(--color-art-bg-to)" />
        </radialGradient>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD9B6" />
          <stop offset="100%" stopColor="#E8B58A" />
        </linearGradient>
        <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-art-text)" />
          <stop offset="100%" stopColor="var(--color-art-bg-to)" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill="url(#face-bg)" />

      {/* Shoulders / shirt */}
      <path
        d="M 40 400 Q 40 290 130 270 L 270 270 Q 360 290 360 400 Z"
        fill="url(#shirt)"
      />
      <path
        d="M 165 280 Q 200 305 235 280 L 235 300 Q 200 320 165 300 Z"
        fill="rgba(0,0,0,0.35)"
      />

      {/* Neck */}
      <rect x="180" y="225" width="40" height="50" rx="14" fill="url(#skin)" />

      {/* Hair back */}
      <path
        d="M 110 200 Q 100 110 200 90 Q 300 110 290 200 Q 295 175 280 165 L 120 165 Q 105 175 110 200 Z"
        fill="url(#hair)"
      />

      {/* Face */}
      <ellipse cx="200" cy="200" rx="78" ry="92" fill="url(#skin)" />

      {/* Hair front */}
      <path
        d="M 122 175 Q 145 110 200 108 Q 255 110 278 175 Q 270 145 240 138 Q 200 158 160 138 Q 130 145 122 175 Z"
        fill="url(#hair)"
      />

      {/* Eyebrows */}
      <path
        d="M 158 188 Q 172 180 188 184"
        stroke="#1F2937"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 212 184 Q 228 180 242 188"
        stroke="#1F2937"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Eyes */}
      <ellipse cx="173" cy="206" rx="6.5" ry="4" fill="#1F2937" />
      <ellipse cx="227" cy="206" rx="6.5" ry="4" fill="#1F2937" />
      <circle cx="174.5" cy="204.5" r="1.6" fill="#FFFFFF" />
      <circle cx="228.5" cy="204.5" r="1.6" fill="#FFFFFF" />

      {/* Nose */}
      <path
        d="M 200 215 Q 196 232 192 240 Q 198 244 204 244 Q 210 244 212 240"
        stroke="rgba(120,80,50,0.35)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mouth — soft smile */}
      <path
        d="M 182 258 Q 200 270 218 258"
        stroke="#7B3F2E"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cheek glow */}
      <ellipse cx="160" cy="230" rx="14" ry="8" fill="rgba(255,150,150,0.18)" />
      <ellipse cx="240" cy="230" rx="14" ry="8" fill="rgba(255,150,150,0.18)" />
    </svg>
  );
}
