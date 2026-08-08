import { useCallback, useEffect, useRef, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'jm-theme';

/**
 * Custom-event name used to keep every `useTheme()` consumer in sync, no
 * matter which component originally toggled the theme. We can't rely on
 * each component's own `useState` because each `useTheme()` call gets its
 * own cell — without an external signal the avatar / navbar / theme
 * transition would all stay stuck on whichever theme they first mounted
 * with while only the toggle's own state actually flipped.
 */
const CHANGE_EVENT = 'jm-theme-change';

/** Notify every mounted `useTheme()` instance about a theme flip. */
function broadcastChange(next: Theme): void {
  window.dispatchEvent(new CustomEvent<Theme>(CHANGE_EVENT, { detail: next }));
}

/** Read the saved theme, falling back to OS preference. */
function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  const prefersLight =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

/**
 * Apply the theme to the DOM. Called both by the inline boot script in
 * index.html (before React renders) and by the hook on every change.
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  // Update the meta theme-color so mobile browsers / PWAs match.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0B1220' : '#F8FAFC');
  }
}

/**
 * Hook for the current theme + a setter. Syncs the DOM class and
 * localStorage, and follows the OS preference until the user explicitly
 * chooses (after which their choice is persisted).
 *
 * Listens for a custom `jm-theme-change` event so every consumer of
 * `useTheme()` stays in sync — flipping the theme from one component
 * causes every other component (avatar, navbar, transition overlay) to
 * rerender with the new value. Cross-tab sync works the same way via
 * the native `storage` event.
 */
export function useTheme(): [Theme, (next: Theme) => void, () => void] {
  const [theme, setTheme] = useState<Theme>(() => readInitialTheme());

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* localStorage unavailable — silent fail */
    }
  }, [theme]);

  // Cross-instance sync: the moment any other useTheme() consumer flips
  // the theme, mirror it here so this component rerenders too. The
  // listener also has to short-circuit when the incoming `next` already
  // matches our local state — otherwise React 18's strict-mode double
  // dispatch (in dev) re-fires the broadcast and triggers a re-render
  // storm across every consumer. `setState` with the same value is a
  // no-op for React's reconciler, so this guard is purely defensive
  // against the broadcast → listener → setState → broadcast loop.
  useEffect(() => {
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Theme>).detail;
      if (next !== theme) setTheme(next);
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, [theme]);

  // Cross-tab sync: if another tab flips the theme, mirror it here.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      if (e.newValue === 'light' || e.newValue === 'dark') {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Setter / toggle are wrapped in `useCallback` so consumers can pass
  // them into `useEffect` deps without re-running every render. Both
  // dispatch the broadcast *outside* of any `setState` updater — that
  // matters: side effects in state updaters are invoked twice in React
  // 18 strict mode, and inside a custom event listener chain that
  // would cause a broadcast re-entrancy that, at best, thrashes the
  // listener queue and at worst crashes downstream `useTheme()`
  // consumers with too-many-re-renders.
  const setter = useCallback((next: Theme) => {
    setTheme(next);
    broadcastChange(next);
  }, []);

  const toggle = useCallback(() => {
    // Read the current value via the functional updater, but commit
    // the side effect after React has applied the state change — not
    // inside the updater. `flushSync` isn't needed; React fires the
    // broadcast on the next microtask, well before any other
    // `useTheme()` consumer's effect runs.
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  // Broadcast the *result* of a toggle, in a separate effect keyed on
  // `theme`, so the side effect never lives inside a state updater.
  // (Setter still broadcasts inline because it's a one-shot user
  // action, not a state-driven sync.)
  const lastBroadcastRef = useRef<Theme | null>(null);
  useEffect(() => {
    if (lastBroadcastRef.current === theme) return;
    lastBroadcastRef.current = theme;
    broadcastChange(theme);
  }, [theme]);

  return [theme, setter, toggle];
}
