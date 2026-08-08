import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Top-level error boundary. Catches any render-time throw from the
 * children and surfaces a recoverable error UI with a "Reset theme"
 * button — so a theme-toggle crash can no longer leave the user
 * staring at a blank page and reaching for the browser refresh.
 *
 * The "reset" clears localStorage and re-applies the OS preference
 * (which the boot script will read on next paint). It also forces a
 * full reload — that's a deliberate trade-off: a single F5 is better
 * than a perpetually broken page, and this is exactly the failure
 * mode that previously looked like "I have to refresh to see the
 * content", so the boundary is doing the same job the user was
 * doing manually, but with the actual error message visible.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log so the actual error is visible in the browser console — the
    // recovery UI alone would hide the real cause.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught a render-time throw:', error, info);
  }

  reset = () => {
    try {
      window.localStorage.removeItem('jm-theme');
    } catch {
      /* ignore */
    }
    // Force a fresh boot — clears any stale module-level state (e.g.
    // the module-scoped `pendingClickRef` in ThemeTransition) that
    // might have contributed to the crash.
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback onReset={this.reset} error={this.state.error} />;
    }
    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const [theme] = useTheme();
  const isDark = theme === 'dark';
  return (
    <div
      role="alert"
      className={cn(
        'flex min-h-screen flex-col items-center justify-center px-6 text-center',
        'bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-500',
      )}
    >
      <div className="max-w-md space-y-4">
        <span
          className={cn(
            'inline-flex h-12 w-12 items-center justify-center rounded-2xl',
            'border border-[var(--color-border)] bg-[var(--color-card)]',
          )}
          aria-hidden
        >
          <span
            className={cn(
              'h-3 w-3 rounded-full transition-colors duration-300',
              isDark ? 'bg-status-warn' : 'bg-status-err',
            )}
          />
        </span>
        <h1 className="font-display text-2xl font-semibold">
          Something interrupted the page.
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          A theme toggle or background update threw an error. Your work
          isn&apos;t lost — click below to reset the theme and reload.
        </p>
        <pre
          className={cn(
            'max-h-40 overflow-auto rounded-xl border border-[var(--color-border)]',
            'bg-[var(--color-card)] p-3 text-left text-xs',
            'text-[var(--color-muted)]',
          )}
        >
          {error.message}
        </pre>
        <button
          type="button"
          onClick={onReset}
          className={cn(
            'inline-flex h-10 items-center rounded-full px-5 text-sm font-medium',
            'bg-[var(--color-primary)] text-primary-fg',
            'transition-opacity duration-300 hover:opacity-90',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
            'focus-visible:ring-offset-[var(--color-bg)]',
          )}
        >
          Reset theme &amp; reload
        </button>
      </div>
    </div>
  );
}
