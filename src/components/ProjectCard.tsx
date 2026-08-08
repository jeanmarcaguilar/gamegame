import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import type { Project } from '@/constants/projects';
import { cn } from '@/utils/cn';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  index?: number;
}

export function ProjectCard({ project, onOpen, index = 0 }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: Math.min(index * 0.1, 0.35),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title} details`}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-3xl glass text-left',
        'transition-shadow duration-500 hover:shadow-card glow-on-hover',
      )}
    >
      {/* Image / Preview */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-secondary">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
        />
        <ProjectArtwork id={project.id} />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-card)] to-transparent" />
        {project.badge && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]/70 px-2.5 py-1 text-xs font-medium text-text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {project.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7">
        <h3 className="font-display text-xl font-semibold tracking-tight text-text sm:text-2xl">
          {project.title}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-text-muted text-pretty">
          {project.shortDescription}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-2.5 py-1 text-xs text-text-muted"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-2.5 py-1 text-xs text-text-muted">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-3.5 py-2 text-sm text-text-muted transition-all duration-300 hover:border-primary/40 hover:text-text"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </a>
          )}
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-2 text-sm text-primary-accent transition-all duration-300 hover:bg-primary/20"
            >
              <FaExternalLinkAlt className="h-3.5 w-3.5" />
              Live Demo
            </a>
          )}
          <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors duration-300 group-hover:text-primary-accent">
            View details
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * SVG-based abstract artwork used in lieu of project screenshots.
 * Each project gets a unique geometric composition matching its theme.
 *
 * Theme-aware: background, grid, and neutral fills come from CSS variables
 * so the artwork looks correct in both light and dark mode without
 * duplicating the SVG.
 */
function ProjectArtwork({ id }: { id: string }) {
  const palettes: Record<string, [string, string, string]> = {
    'smart-campus-attendance': ['#3B82F6', '#60A5FA', '#93C5FD'],
    'blockchain-ecommerce': ['#8B5CF6', '#60A5FA', '#A78BFA'],
    'parking-management': ['#10B981', '#34D399', '#60A5FA'],
    'loan-management': ['#F59E0B', '#FBBF24', '#60A5FA'],
    'portfolio-website': ['#60A5FA', '#3B82F6', '#2563EB'],
  };
  const [a, b, c] = palettes[id] ?? ['#3B82F6', '#60A5FA', '#93C5FD'];

  return (
    <svg
      viewBox="0 0 800 450"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${id} artwork`}
    >
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-art-bg-from)" />
          <stop offset="100%" stopColor="var(--color-art-bg-to)" />
        </linearGradient>
        <linearGradient id={`g1-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} stopOpacity="0.9" />
          <stop offset="100%" stopColor={b} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`g2-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.55" />
          <stop offset="100%" stopColor={b} stopOpacity="0" />
        </linearGradient>
        <pattern id={`grid-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="var(--color-art-grid)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="800" height="450" fill={`url(#bg-${id})`} />
      <rect width="800" height="450" fill={`url(#grid-${id})`} />

      {/* Floating geometry */}
      <circle cx="160" cy="120" r="80" fill={`url(#g1-${id})`} opacity="0.7" />
      <circle cx="640" cy="320" r="120" fill={`url(#g2-${id})`} opacity="0.6" />
      <rect
        x="380"
        y="80"
        width="220"
        height="160"
        rx="20"
        fill="var(--color-art-fg)"
        stroke="var(--color-art-stroke)"
        strokeWidth="1"
        transform="rotate(-6 490 160)"
      />
      <rect
        x="120"
        y="280"
        width="180"
        height="120"
        rx="16"
        fill="var(--color-art-fg-strong)"
        stroke="var(--color-art-stroke)"
        strokeWidth="1"
        transform="rotate(4 210 340)"
      />
      {/* Code-line accents */}
      <g opacity="0.55">
        <rect x="420" y="110" width="120" height="6" rx="3" fill={a} />
        <rect x="420" y="130" width="80" height="6" rx="3" fill={c} />
        <rect x="420" y="150" width="140" height="6" rx="3" fill={b} />
        <rect x="420" y="170" width="60" height="6" rx="3" fill={a} />
        <rect x="420" y="190" width="100" height="6" rx="3" fill={c} />
      </g>
    </svg>
  );
}