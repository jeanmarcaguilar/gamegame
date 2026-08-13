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
      if (window.innerWidth >= 1024) setOpen(false); // lg breakpoint for menu
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
      className="sticky inset-x-0 top-6 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none"
    >
      <nav 
        className={cn(
          "mx-auto flex h-[60px] max-w-5xl items-center justify-between rounded-2xl border border-white/5 bg-[#0a0f1c]/90 px-4 sm:px-6 backdrop-blur-xl shadow-2xl shadow-black/50 pointer-events-auto transition-all duration-300",
          scrolled && "bg-[#0a0f1c]/95 border-white/10"
        )}
      >
        <a
          href="#home"
          className="group inline-flex items-center gap-3"
          aria-label="Go to top"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
            <span className="font-display text-sm font-bold tracking-wider">JM</span>
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white hidden sm:block">
            Jim.
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex h-full">
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeId === id;
            return (
              <li key={link.href} className="h-full flex items-center relative">
                <a
                  href={link.href}
                  className={cn(
                    'relative inline-flex items-center h-full px-4 text-[13px] font-semibold transition-colors duration-300',
                    isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 h-[3px] bg-blue-500 rounded-t-full shadow-[0_-2px_10px_rgba(59,130,246,0.8)]" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          <a
            href="#contact"
            className="group inline-flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-5 text-[13px] font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-500/40"
          >
            Hire me
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 lg:hidden pointer-events-auto"
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
            className="lg:hidden absolute top-[80px] inset-x-4 sm:inset-x-6 z-30 pointer-events-auto"
          >
            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1c]/95 backdrop-blur-xl shadow-2xl">
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
                          'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200',
                          isActive
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white',
                        )}
                      >
                        {link.label}
                        <span aria-hidden className="text-blue-500/50">→</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 p-4">
                <ThemeToggle />
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="block flex-1 rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
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