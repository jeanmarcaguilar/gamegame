import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { fadeUp } from '@/animations/variants';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionTitleProps) {
  const isCenter = align === 'center';
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={cn(
        'max-w-2xl',
        isCenter ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary-accent',
            isCenter && 'justify-center',
          )}
        >
          <span className="h-px w-6 bg-primary/60" />
          {eyebrow}
          <span className="h-px w-6 bg-primary/60" />
        </div>
      )}
      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl md:text-5xl text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg text-pretty">
          {description}
        </p>
      )}
    </motion.div>
  );
}
