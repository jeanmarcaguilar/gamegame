import { motion } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
}

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
        'group relative flex h-9 w-[72px] shrink-0 items-center rounded-full',
        'border border-white/10 bg-[#0a0f1c] px-1',
        'transition-colors duration-500',
        className,
      )}
    >
      <div className="relative flex w-full items-center justify-between z-10 px-1">
        <FaSun className={cn("h-3.5 w-3.5 transition-colors duration-300", !isDark ? "text-white" : "text-gray-500")} />
        <FaMoon className={cn("h-3.5 w-3.5 transition-colors duration-300", isDark ? "text-white" : "text-gray-500")} />
      </div>

      {/* Sliding thumb */}
      <motion.span
        layout
        initial={false}
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute left-1 z-0 h-7 w-7 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
      />
    </button>
  );
}