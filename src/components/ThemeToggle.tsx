import { motion } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
}

/**
 * A pill-shaped toggle with a sliding thumb. The thumb carries a sun in
 * light mode and a moon in dark mode, with a soft gradient track behind it.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, , toggle] = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      data-theme-toggle
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'group relative inline-flex h-9 w-[68px] shrink-0 items-center rounded-full',
        'border border-[var(--color-border)] bg-[var(--color-glass-soft)]',
        'backdrop-blur-md transition-colors duration-500',
        'hover:border-[var(--color-border-strong)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        className,
      )}
    >
      {/* Track gradient — flips with theme */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 rounded-full opacity-90 transition-opacity duration-500',
          'bg-gradient-to-r',
          isDark
            ? 'from-indigo-500/20 via-blue-500/15 to-sky-400/20'
            : 'from-amber-300/40 via-orange-300/30 to-sky-400/25',
        )}
      />

      {/* Twinkly stars — only meaningful in dark mode but harmless in light */}
      <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
        <span
          className={cn(
            'absolute left-2 top-1.5 h-0.5 w-0.5 rounded-full bg-white transition-opacity duration-500',
            isDark ? 'opacity-90' : 'opacity-0',
          )}
        />
        <span
          className={cn(
            'absolute left-5 top-3 h-[2px] w-[2px] rounded-full bg-white transition-opacity duration-500',
            isDark ? 'opacity-70' : 'opacity-0',
          )}
        />
        <span
          className={cn(
            'absolute left-3.5 bottom-2 h-[2px] w-[2px] rounded-full bg-white transition-opacity duration-500',
            isDark ? 'opacity-60' : 'opacity-0',
          )}
        />
      </span>

      {/* Sliding thumb */}
      <motion.span
        layout
        aria-hidden
        initial={false}
        animate={{
          x: isDark ? 34 : 2,
        }}
        transition={{ type: 'spring', stiffness: 520, damping: 32 }}
        className={cn(
          'relative z-10 flex h-7 w-7 items-center justify-center rounded-full',
          'shadow-[0_4px_14px_-4px_rgba(15,23,42,0.25)]',
          'ring-1 ring-inset',
          isDark
            ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white ring-white/20'
            : 'bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900 ring-amber-300/60',
        )}
      >
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
          transition={{ duration: 0.35 }}
          className="inline-flex"
        >
          {isDark ? <FaMoon className="h-3.5 w-3.5" /> : <FaSun className="h-3.5 w-3.5" />}
        </motion.span>
      </motion.span>
    </button>
  );
}