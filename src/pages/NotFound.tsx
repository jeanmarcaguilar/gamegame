import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[80vh] items-center justify-center px-6"
    >
      <div className="text-center">
        <p className="font-display text-7xl font-bold gradient-text">404</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-text">Page not found</h1>
        <p className="mt-2 max-w-sm text-text-muted">
          The page you were looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-fg transition-all duration-300 hover:bg-primary-accent"
        >
          Go home
        </Link>
      </div>
    </motion.section>
  );
}
