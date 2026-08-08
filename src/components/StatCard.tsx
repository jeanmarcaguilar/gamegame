import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
}

export function StatCard({ label, value, suffix = '+', delay = 0 }: StatCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: '0px 0px 0px 0px',
  });
  const animatedValue = useCountUp(value, inView, 1200 + delay * 200);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl glass p-4 sm:p-5 glow-on-hover',
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
        {animatedValue}
        <span className="ml-0.5 text-primary-accent">{suffix}</span>
      </div>
      <div className="mt-0.5 text-xs text-text-muted sm:text-sm">{label}</div>
    </motion.div>
  );
}
