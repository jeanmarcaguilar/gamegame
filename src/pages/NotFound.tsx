import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/sections/Footer';
import { ThemeTransition } from '@/components/ThemeTransition';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-[80vh] items-center justify-center px-6 relative overflow-hidden"
      >
        {/* Background grid pattern matching Home page */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)', 
          backgroundSize: '40px 40px' 
        }}></div>
        
        <div className="text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.15)] mb-6"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">Error</span>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display text-7xl font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]"
          >
            404
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-3 font-display text-2xl font-semibold text-white"
          >
            Page not found
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-2 max-w-sm text-gray-400"
          >
            The page you were looking for doesn&apos;t exist or has been moved.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to="/"
              className="mt-6 inline-flex h-[36px] items-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.65)]"
            >
              Go home
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      <Footer />
      <ThemeTransition />
    </div>
  );
}
