import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import type { Project } from '@/constants/projects';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handler);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div className="absolute inset-0 bg-[var(--color-bg)]/80 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-card)] shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative shrink-0">
              <div className="aspect-[16/7] w-full overflow-hidden">
                <ModalArtwork id={project.id} />
              </div>
              <button
                onClick={onClose}
                aria-label="Close project details"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/70 text-text-muted backdrop-blur transition-all duration-300 hover:border-[var(--color-border-strong)] hover:text-text"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center gap-2">
                {project.badge && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-2.5 py-1 text-xs font-medium text-text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {project.badge}
                  </span>
                )}
              </div>
              <h3
                id="project-modal-title"
                className="mt-3 font-display text-2xl font-bold tracking-tight text-text sm:text-3xl"
              >
                {project.title}
              </h3>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Detail label="Overview" body={project.overview} />
                <Detail label="Problem" body={project.problem} />
                <Detail label="Solution" body={project.solution} />
                <div>
                  <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary-accent">
                    Features
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary-accent">
                  Technology Stack
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-2.5 py-1 text-xs text-text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-4 py-2.5 text-sm text-text-muted transition-all duration-300 hover:border-primary/40 hover:text-text"
                  >
                    <FaGithub className="h-4 w-4" />
                    View on GitHub
                  </a>
                )}
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm text-primary-accent transition-all duration-300 hover:bg-primary/20"
                  >
                    <FaExternalLinkAlt className="h-3.5 w-3.5" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Detail({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary-accent">
        {label}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{body}</p>
    </div>
  );
}

function ModalArtwork({ id }: { id: string }) {
  const palettes: Record<string, [string, string, string]> = {
    'smart-campus-attendance': ['#FFFFFF', '#E2E8F0', '#94A3B8'],
    'blockchain-ecommerce': ['#FFFFFF', '#CBD5E1', '#64748B'],
    'parking-management': ['#FFFFFF', '#E2E8F0', '#94A3B8'],
    'loan-management': ['#FFFFFF', '#CBD5E1', '#64748B'],
    'portfolio-website': ['#FFFFFF', '#E2E8F0', '#94A3B8'],
  };
  const [a, b] = palettes[id] ?? ['#FFFFFF', '#E2E8F0', '#94A3B8'];

  return (
    <svg viewBox="0 0 1000 430" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`m-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-art-bg-from)" />
          <stop offset="100%" stopColor="var(--color-art-bg-to)" />
        </linearGradient>
        <linearGradient id={`m1-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
        <pattern id={`mg-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="var(--color-art-grid)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="1000" height="430" fill={`url(#m-${id})`} />
      <rect width="1000" height="430" fill={`url(#mg-${id})`} />
      <circle cx="200" cy="150" r="120" fill={`url(#m1-${id})`} opacity="0.7" />
      <circle cx="820" cy="280" r="160" fill={`url(#m1-${id})`} opacity="0.4" />
      <rect
        x="440"
        y="80"
        width="280"
        height="200"
        rx="20"
        fill="var(--color-art-fg)"
        stroke="var(--color-art-stroke)"
        transform="rotate(-6 580 180)"
      />
    </svg>
  );
}