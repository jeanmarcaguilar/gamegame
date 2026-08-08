import { motion } from 'framer-motion';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';

interface SkillCardProps {
  name: string;
  icon: string;
  description: string;
  index?: number;
}

export function SkillCard({ name, icon, description, index = 0 }: SkillCardProps) {
  const Icon = getIcon(icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.05, 0.32),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
      className={cn(
        'group relative overflow-hidden rounded-2xl glass p-5 sm:p-6 glow-on-hover',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, var(--color-glow-soft), transparent 60%)',
        }}
      />
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-primary-accent ring-1 ring-inset ring-primary/20 transition-all duration-300 group-hover:bg-primary/15 group-hover:text-text group-hover:shadow-glow">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold text-text">{name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
