import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpotify } from 'react-icons/fa';
import { isSpotifyConfigured, getNowPlaying, type SpotifyTrack } from '@/services/spotify';

type Status = 'loading' | 'playing' | 'idle' | 'unconfigured' | 'error';

/** How often to re-fetch the now-playing track. 30s is a good balance. */
const POLL_MS = 30_000;

function Equalizer({ active }: { active: boolean }) {
  // Three staggered bars, each animating height when active. Pure CSS so it
  // costs nothing to render and respects prefers-reduced-motion naturally
  // (we turn it off when inactive, and rely on a static frame there).
  return (
    <span
      aria-hidden
      className="inline-flex h-3 w-4 items-end gap-[2px]"
      title={active ? 'Now playing' : 'Paused'}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`block w-[2px] rounded-full bg-success ${
            active ? 'origin-bottom animate-eq' : ''
          }`}
          style={{
            height: active ? undefined : '4px',
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </span>
  );
}

function StatusDot({ status }: { status: Status }) {
  const color =
    status === 'playing'
      ? 'bg-success'
      : status === 'idle'
        ? 'bg-text-muted/60'
        : status === 'error'
          ? 'bg-error'
          : 'bg-text-muted/40';
  return (
    <span className="relative inline-flex h-2 w-2">
      {status === 'playing' && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${color}`} />
      )}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

interface State {
  status: Status;
  track: SpotifyTrack | null;
  isPlaying: boolean;
}

const INITIAL: State = { status: 'loading', track: null, isPlaying: false };

export function SpotifyNowPlaying() {
  const [state, setState] = useState<State>(INITIAL);

  useEffect(() => {
    if (!isSpotifyConfigured) {
      setState({ status: 'unconfigured', track: null, isPlaying: false });
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const tick = async () => {
      try {
        const { isPlaying, track } = await getNowPlaying();
        if (cancelled) return;
        if (track) {
          setState({ status: isPlaying ? 'playing' : 'idle', track, isPlaying });
        } else {
          setState({ status: 'idle', track: null, isPlaying: false });
        }
      } catch {
        if (!cancelled) setState({ status: 'error', track: null, isPlaying: false });
      }
    };

    // Run immediately, then on a timer. No setTimeout chain — interval is fine.
    tick();
    timer = setInterval(tick, POLL_MS);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, []);

  // ----- Render helpers -----
  const label =
    state.status === 'loading'
      ? 'Checking Spotify…'
      : state.status === 'unconfigured'
        ? 'Spotify not connected'
        : state.status === 'error'
          ? 'Spotify unavailable'
          : state.isPlaying
            ? 'Now playing'
            : 'Last played';

  return (
    <motion.div
      // Match the Hero "Open for opportunities" chip styling.
      className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] py-2 pl-2 pr-4 backdrop-blur"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Album art OR Spotify logo fallback */}
      <AnimatePresence mode="wait" initial={false}>
        {state.track?.albumArt ? (
          <motion.img
            key={state.track.id}
            src={state.track.albumArt}
            alt=""
            className={`h-7 w-7 rounded-full object-cover ${
              state.isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
            }`}
            // Subtle ring in the success color when playing
            style={{
              boxShadow: state.isPlaying
                ? '0 0 0 2px var(--color-success, #22c55e)'
                : undefined,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : (
          <motion.span
            key="logo"
            className="grid h-7 w-7 place-items-center rounded-full bg-[#1db954]/15 text-[#1db954]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FaSpotify className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Status + track info */}
      <div className="flex min-w-0 items-center gap-2">
        <StatusDot status={state.status} />
        <Equalizer active={state.isPlaying} />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">
            {label}
          </span>
          {state.track ? (
            <a
              href={state.track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 items-baseline gap-1.5 text-xs font-medium text-text"
            >
              <span className="truncate">{state.track.title}</span>
              <span className="truncate text-text-muted">— {state.track.artists}</span>
            </a>
          ) : state.status === 'unconfigured' ? (
            <a
              href="/spotify-auth.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted underline-offset-2 hover:underline"
            >
              Connect Spotify
            </a>
          ) : (
            <span className="text-xs text-text-muted">—</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
