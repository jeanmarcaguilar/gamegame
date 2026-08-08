import { motion } from 'framer-motion';
import { FaBriefcase, FaLaptopCode, FaGraduationCap, FaTrophy } from 'react-icons/fa';
import type { ExperienceEntry } from '@/constants/experience';
import { cn } from '@/utils/cn';

const iconMap = {
  Internship: FaBriefcase,
  Freelance: FaLaptopCode,
  Academic: FaGraduationCap,
  Achievement: FaTrophy,
};

interface TimelineItemProps {
  entry: ExperienceEntry;
  index: number;
}

export function TimelineItem({ entry, index }: TimelineItemProps) {
  const Icon = iconMap[entry.type] ?? FaBriefcase;
  const isLeft = index % 2 === 0;

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12',
      )}
    >
      {/* Period — left on desktop */}
      <div className={cn('md:order-1 md:text-right', isLeft ? 'md:pr-10' : 'md:order-2 md:pl-10 md:text-left')}>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-glass-soft)] px-3 py-1 text-xs font-medium text-text-muted">
          {entry.period}
        </span>
      </div>

      {/* Content */}
      <div className={cn('md:order-2', isLeft ? 'md:pl-10' : 'md:order-1 md:pr-10 md:text-right')}>
        <div className="gradient-border relative rounded-2xl p-6 sm:p-7">
          <div className={cn('flex items-center gap-3', !isLeft && 'md:flex-row-reverse')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-primary-accent ring-1 ring-inset ring-primary/20">
              <Icon className="h-4 w-4" />
            </div>
            <div className={cn('min-w-0', !isLeft && 'md:text-right')}>
              <span className="text-xs uppercase tracking-[0.16em] text-primary-accent">{entry.type}</span>
              <h3 className="font-display text-lg font-semibold leading-tight text-text">
                {entry.title}
              </h3>
              <p className="text-sm text-text-muted">{entry.organization}</p>
            </div>
          </div>

          <p className={cn('mt-4 text-sm leading-relaxed text-text-muted', !isLeft && 'md:text-left')}>
            {entry.description}
          </p>

          {entry.highlights && entry.highlights.length > 0 && (
            <ul
              className={cn(
                'mt-4 space-y-2 text-sm text-text-muted',
                !isLeft && 'md:text-left',
              )}
            >
              {entry.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.li>
  );
}
