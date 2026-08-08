import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <span className="font-display text-3xl font-bold gradient-text">JM</span>
        <span className="inline-block h-1 w-32 overflow-hidden rounded-full bg-[var(--color-glass-soft)]">
          <motion.span
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-full w-1/2 bg-primary"
          />
        </span>
      </motion.div>
    </div>
  );
}
