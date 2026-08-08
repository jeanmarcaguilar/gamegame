import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaGithub, FaLinkedinIn, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';
import { personalInfo, navLinks } from '@/constants/personal';

export function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 600);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 border-t border-[var(--color-border)] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <a href="#home" className="inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-primary-accent ring-1 ring-inset ring-primary/20">
                <span className="font-display text-sm font-bold">JM</span>
              </span>
              <span className="font-display text-sm font-semibold tracking-tight text-text">
                {personalInfo.shortName}
                <span className="text-primary-accent">.</span>
              </span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">
              {personalInfo.tagline}
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-primary-accent">Navigate</div>
            <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-text-muted transition-colors duration-300 hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-primary-accent">Connect</div>
            <div className="mt-3 flex items-center gap-2">
              <SocialLink href={personalInfo.github} icon={FaGithub} label="GitHub" />
              <SocialLink href={personalInfo.linkedin} icon={FaLinkedinIn} label="LinkedIn" />
              <SocialLink href={personalInfo.twitter} icon={FaTwitter} label="Twitter" />
              <SocialLink href={`mailto:${personalInfo.email}`} icon={FaEnvelope} label="Email" />
            </div>
            <a
              href={`mailto:${personalInfo.email}`}
              className="mt-4 inline-block text-sm text-text-muted transition-colors duration-300 hover:text-text"
            >
              {personalInfo.email}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-text-muted sm:flex-row">
          <span>
            © {year} {personalInfo.name}. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-1.5">
            Built with
            <FaHeart className="h-3 w-3 text-primary" />
            using React, TypeScript & Tailwind CSS.
          </span>
        </div>
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={scrollTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)]/80 text-text-muted shadow-card backdrop-blur transition-all duration-300 hover:border-primary/40 hover:text-text"
          >
            <FaArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof FaGithub;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] text-text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary-accent"
    >
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}