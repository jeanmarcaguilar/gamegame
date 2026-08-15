import { motion } from 'framer-motion';

interface FloatingShapesProps {
  className?: string;
}

export function FloatingShapes({ className }: FloatingShapesProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="absolute -left-10 top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
        animate={{ y: [0, -16, 0] }} // Removed scale animation for better performance
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="absolute right-0 top-1/3 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
        animate={{ y: [0, 20, 0] }} // Removed scale animation for better performance
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-primary/15 blur-3xl"
        animate={{ y: [0, -12, 0] }} // Removed scale animation for better performance
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
