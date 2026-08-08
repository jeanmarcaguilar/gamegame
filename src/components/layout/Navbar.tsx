import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { navLinks, personalInfo } from '@/constants';
import { useScrolled } from '@/hooks/useScrolled';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useTheme } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/utils/cn';

const sectionIds = navLinks.map((l) => l.href.slice(1));

export function Navbar() {
  const scrolled = useScrolled(16);
  const [open, setOpen] = useState(false);
  const activeId = useScrollSpy(sectionIds);
  const [theme] = useTheme();

  // Close menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-500',
        scrolled
          ? 'bg-[var(--color-bg)]/70 backdrop-blur-xl backdrop-saturate-150 border-b border-[var(--color-border)]'
          : 'bg-transparent',
      )}
      style={{ willChange: 'background-color, backdrop-filter, border-color' }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#home"
          className="group inline-flex items-center gap-2"
          aria-label="Go to top"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-primary-accent ring-1 ring-inset ring-primary/20 transition-all duration-300 group-hover:bg-primary/20">
            <span className="font-display text-sm font-bold">JM</span>
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-text">
            {personalInfo.shortName}
            <span className="text-primary-accent">.</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeId === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    'relative inline-block px-3 py-2 text-sm font-medium animated-underline transition-colors duration-300',
                    isActive ? 'text-text active' : 'text-text-muted hover:text-text',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a
            href="#contact"
            className="inline-flex h-9 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-4 text-sm font-medium text-text transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-text"
          >
            Hire me
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-glass-soft)] text-text md:hidden"
          onClick={() => setOpen((s) => !s)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden"
          >
            <div className="mx-4 mb-4 mt-2 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-xl">
              <ul className="px-2 py-3">
                {navLinks.map((link) => {
                  const id = link.href.slice(1);
                  const isActive = activeId === id;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200',
                          isActive
                            ? 'bg-primary/10 text-text'
                            : 'text-text-muted hover:bg-primary/5 hover:text-text',
                        )}
                      >
                        {link.label}
                        <span aria-hidden className="text-primary-accent">→</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] p-3">
                <ThemeToggle />
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="block flex-1 rounded-xl bg-primary py-3 text-center text-sm font-medium text-primary-fg"
                >
                  Hire me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No-op reference to keep `theme` reactive for SSR/edge cases */}
      <span hidden data-theme={theme} />
    </header>
  );
}